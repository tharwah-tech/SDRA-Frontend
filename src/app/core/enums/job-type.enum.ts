export enum JobType {
  FullTime = 'full_time',
  PartTime = 'part_time',
  Contract = 'contract',
  Internship = 'internship',
}
export function mapJobTypeIntoString(type: JobType): string {
  switch (type) {
    case JobType.FullTime:
      return 'Full-Time';
    case JobType.PartTime:
      return 'Part-Time';
    case JobType.Contract:
      return 'Contract';
    case JobType.Internship:
      return 'Internship';
  }
}
