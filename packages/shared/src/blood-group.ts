/**
 * Enum representing all common blood groups.
 */
export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

/**
 * Compatibility matrix defining which donor blood groups can donate to which recipient blood groups.
 * Based on standard medical guidelines for red blood cell compatibility.
 */
export const compatibilityMatrix: Record<BloodGroup, BloodGroup[]> = {
  [BloodGroup.O_NEGATIVE]: [
    BloodGroup.O_NEGATIVE,
    BloodGroup.O_POSITIVE,
    BloodGroup.A_NEGATIVE,
    BloodGroup.A_POSITIVE,
    BloodGroup.B_NEGATIVE,
    BloodGroup.B_POSITIVE,
    BloodGroup.AB_NEGATIVE,
    BloodGroup.AB_POSITIVE,
  ],
  [BloodGroup.O_POSITIVE]: [
    BloodGroup.O_POSITIVE,
    BloodGroup.A_POSITIVE,
    BloodGroup.B_POSITIVE,
    BloodGroup.AB_POSITIVE,
  ],
  [BloodGroup.B_NEGATIVE]: [
    BloodGroup.B_NEGATIVE,
    BloodGroup.B_POSITIVE,
    BloodGroup.AB_NEGATIVE,
    BloodGroup.AB_POSITIVE,
  ],
  [BloodGroup.B_POSITIVE]: [BloodGroup.B_POSITIVE, BloodGroup.AB_POSITIVE],
  [BloodGroup.A_NEGATIVE]: [
    BloodGroup.A_NEGATIVE,
    BloodGroup.A_POSITIVE,
    BloodGroup.AB_NEGATIVE,
    BloodGroup.AB_POSITIVE,
  ],
  [BloodGroup.A_POSITIVE]: [BloodGroup.A_POSITIVE, BloodGroup.AB_POSITIVE],
  [BloodGroup.AB_NEGATIVE]: [BloodGroup.AB_NEGATIVE, BloodGroup.AB_POSITIVE],
  [BloodGroup.AB_POSITIVE]: [BloodGroup.AB_POSITIVE],
};

/**
 * Utility function to check if a donor blood group is compatible with a recipient blood group.
 */
export function isCompatible(donor: BloodGroup, recipient: BloodGroup): boolean {
  return compatibilityMatrix[donor].includes(recipient);
}
