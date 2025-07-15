export interface InterviewModel {
  id: string;
  candidate_name: string;
  job_title: string;
  creation_date: string;
  status: string;
}
export interface ShareTokenResponse {
  token: string;
}

export interface InterviewLinkResponse {
  interview_url: string;
}

export interface InterviewShareResult {
  interviewUrl: string;
  token: string;
}
