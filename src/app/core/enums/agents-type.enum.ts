export enum AgentType {
  Interviewer = 'interviewer',
  Summarizer = 'summarizer',
  RAG_Agent = 'rag',
  Responder = 'responder',
  Complaints = 'complaints'
}
export function mapAgentType(type: AgentType): string {
  switch (type) {
    case AgentType.Interviewer:
      return 'Interviewer';
    case AgentType.Summarizer:
      return 'Summarizer';
    case AgentType.RAG_Agent:
      return 'RAG';
    case AgentType.Responder:
      return 'Responder';
    case AgentType.Complaints:
      return 'Complaints';
  }
}
