import { GenderType } from "../../../../core/enums/gender-type.enum";
import { JobType } from "../../../../core/enums/job-type.enum";
import { InterviewStatus } from "./interview.entity";

export interface InterviewDetailsEntity {
    id: string;
    creation_date: Date;
    status: InterviewStatus;
    candidate_info: CandidateInfo;
    job_info:       JobInfo;
    questions:      Question[];
}

export interface CandidateInfo {
    full_name: string;
    email:     string;
    phone:     string;
    gender:    GenderType;
}

export interface JobInfo {
    title:            string;
    contract_type:    JobType;
    job_description:  string;
    job_requirements: string;
}

export interface Question {
    question_number: number;
    question:        string;
}
