export enum PhysicalActivityLevelEnum {
  sedentary = 'sedentary',
  light = 'light',
  moderate = 'moderate',
  very = 'very',
  extra = 'extra',
}

export function physicalActivityLevelValueForEnum(
  value: PhysicalActivityLevelEnum,
): number {
  switch (value) {
    case PhysicalActivityLevelEnum.sedentary:
      return 1.4;
    case PhysicalActivityLevelEnum.light:
      return 1.6;
    case PhysicalActivityLevelEnum.moderate:
      return 1.75;
    case PhysicalActivityLevelEnum.very:
      return 2.0;
    case PhysicalActivityLevelEnum.extra:
      return 2.5;
    default:
      return 1.0;
  }
}

export function enumForPhysicalActivityLevelValue(
  value: number,
): PhysicalActivityLevelEnum {
  switch (value) {
    case 1.4:
      return PhysicalActivityLevelEnum.sedentary;
    case 1.6:
      return PhysicalActivityLevelEnum.light;
    case 1.75:
      return PhysicalActivityLevelEnum.moderate;
    case 2.0:
      return PhysicalActivityLevelEnum.very;
    case 2.5:
      return PhysicalActivityLevelEnum.extra;
    default:
      return PhysicalActivityLevelEnum.sedentary;
  }
}
