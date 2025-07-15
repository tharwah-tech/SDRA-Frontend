export interface CreateInteviewEntity {
    candidate_info: CreateInteviewCandidateInfo;
    job_info:       CreateInterviewJobInfo;
}

export interface CreateInteviewCandidateInfo {
    full_name: string;
    email:     string;
    phone:     string;
    gender:    string;
}

export interface CreateInterviewJobInfo {
    title:            string;
    contract_type:    string;
    job_description:  string;
    job_requirements: string;
    questions:        CreateInterviewQuestion[];
}

export interface CreateInterviewQuestion {
    question_number: number;
    question:        string;
}
