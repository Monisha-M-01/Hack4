export const SCHEMES = [
  {
    id: 'pm_kisan',
    nameKey: 'pmKisanTitle',
    benefitKey: 'pmKisanBenefit',
    descKey: 'pmKisanDesc',
    categoryKey: 'catAgriculture',
    icon: '🌾',
    docs: ['docAadhaar', 'docLandRecords', 'docBankPassbook'],
  },
  {
    id: 'ayushman_bharat',
    nameKey: 'ayushmanTitle',
    benefitKey: 'ayushmanBenefit',
    descKey: 'ayushmanDesc',
    categoryKey: 'catHealth',
    icon: '🏥',
    docs: ['docAadhaar', 'docRationCard', 'docIncomeCert'],
  },
  {
    id: 'old_age_pension',
    nameKey: 'pensionTitle',
    benefitKey: 'pensionBenefit',
    descKey: 'pensionDesc',
    categoryKey: 'catPension',
    icon: '👵',
    docs: ['docAadhaar', 'docAgeProof', 'docBankPassbook'],
  },
  {
    id: 'gruha_lakshmi',
    nameKey: 'gruhaLakshmiTitle',
    benefitKey: 'gruhaLakshmiBenefit',
    descKey: 'gruhaLakshmiDesc',
    categoryKey: 'catWomen',
    icon: '👩',
    docs: ['docAadhaar', 'docRationCard', 'docBankPassbook'],
  },
];

export const QUESTIONS = [
  {
    id: 'ageGroup',
    titleKey: 'qAgeTitle',
    descKey: 'qAgeDesc',
    options: [
      { id: '18_35', labelKey: 'optAge18_35', descKey: 'optAge18_35Desc' },
      { id: '36_59', labelKey: 'optAge36_59', descKey: 'optAge36_59Desc' },
      { id: '60_plus', labelKey: 'optAge60Plus', descKey: 'optAge60PlusDesc' },
    ],
  },
  {
    id: 'income',
    titleKey: 'qIncomeTitle',
    descKey: 'qIncomeDesc',
    options: [
      { id: 'under_1l', labelKey: 'optIncomeUnder1L', descKey: 'optIncomeUnder1LDesc' },
      { id: '1l_2.5l', labelKey: 'optIncome1L2_5L', descKey: 'optIncome1L2_5LDesc' },
      { id: '2.5l_5l', labelKey: 'optIncome2_5L5L', descKey: 'optIncome2_5L5LDesc' },
      { id: 'above_5l', labelKey: 'optIncomeAbove5L', descKey: 'optIncomeAbove5LDesc' },
    ],
  },
  {
    id: 'occupation',
    titleKey: 'qOccupationTitle',
    descKey: 'qOccupationDesc',
    options: [
      { id: 'farmer', labelKey: 'optOccFarmer', descKey: 'optOccFarmerDesc' },
      { id: 'daily_wage', labelKey: 'optOccDailyWage', descKey: 'optOccDailyWageDesc' },
      { id: 'student', labelKey: 'optOccStudent', descKey: 'optOccStudentDesc' },
      { id: 'homemaker', labelKey: 'optOccHomemaker', descKey: 'optOccHomemakerDesc' },
      { id: 'senior_retired', labelKey: 'optOccSenior', descKey: 'optOccSeniorDesc' },
    ],
  },
  {
    id: 'rationCard',
    titleKey: 'qRationTitle',
    descKey: 'qRationDesc',
    options: [
      { id: 'bpl', labelKey: 'optRationBpl', descKey: 'optRationBplDesc' },
      { id: 'apl', labelKey: 'optRationApl', descKey: 'optRationAplDesc' },
      { id: 'none', labelKey: 'optRationNone', descKey: 'optRationNoneDesc' },
    ],
  },
];

/**
 * Pure evaluation function.
 * Evaluates user answers against all schemes.
 * Returns array of { scheme, eligible: boolean, reasonKey: string }
 */
export function evaluateEligibility(answers = {}) {
  const { ageGroup, income, occupation, rationCard } = answers;

  return SCHEMES.map((scheme) => {
    switch (scheme.id) {
      case 'pm_kisan': {
        const isFarmer = occupation === 'farmer';
        const isNotAbove5L = income && income !== 'above_5l';
        const eligible = isFarmer && isNotAbove5L;

        let reasonKey = 'pmKisanEligibleReason';
        if (!eligible) {
          if (!isFarmer) {
            reasonKey = 'pmKisanIneligibleOccupation';
          } else {
            reasonKey = 'pmKisanIneligibleIncome';
          }
        }
        return { scheme, eligible, reasonKey };
      }

      case 'ayushman_bharat': {
        const hasBPL = rationCard === 'bpl';
        const isLowIncome = income === 'under_1l' || income === '1l_2.5l';
        const isSenior = ageGroup === '60_plus';
        const eligible = hasBPL || isLowIncome || isSenior;

        const reasonKey = eligible
          ? 'ayushmanEligibleReason'
          : 'ayushmanIneligibleReason';

        return { scheme, eligible, reasonKey };
      }

      case 'old_age_pension': {
        const isSenior = ageGroup === '60_plus';
        const isLowIncomeOrBPL = income === 'under_1l' || rationCard === 'bpl';
        const eligible = isSenior && isLowIncomeOrBPL;

        let reasonKey = 'pensionEligibleReason';
        if (!eligible) {
          if (!isSenior) {
            reasonKey = 'pensionIneligibleAge';
          } else {
            reasonKey = 'pensionIneligibleIncome';
          }
        }
        return { scheme, eligible, reasonKey };
      }

      case 'gruha_lakshmi': {
        const isHomemaker = occupation === 'homemaker';
        const isLowIncome = income === 'under_1l' || income === '1l_2.5l';
        const eligible = isHomemaker && isLowIncome;

        let reasonKey = 'gruhaLakshmiEligibleReason';
        if (!eligible) {
          if (!isHomemaker) {
            reasonKey = 'gruhaLakshmiIneligibleOccupation';
          } else {
            reasonKey = 'gruhaLakshmiIneligibleIncome';
          }
        }
        return { scheme, eligible, reasonKey };
      }

      default:
        return { scheme, eligible: false, reasonKey: 'unknownScheme' };
    }
  });
}
