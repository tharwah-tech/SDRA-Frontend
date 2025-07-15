export enum GenderType {
  Male = 'male',
  Female = 'female',
}
export function mapGanderType(type: GenderType): string {
  switch (type) {
    case GenderType.Male:
      return 'Male';
    case GenderType.Female:
      return 'Female';
    default:
      return 'Other';
  }
}
