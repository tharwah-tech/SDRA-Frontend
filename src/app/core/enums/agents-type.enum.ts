export enum AgentType {
  Interviewer = 'interviewer',
  Summarizer = 'summarizer',
  RAG_Agent = 'rag_agent',
  Responder = 'responder',
}
export function mapAgentType(type: AgentType): string {
  switch (type) {
    case AgentType.Interviewer:
      return 'Interviewer';
    case AgentType.Summarizer:
      return 'Summarizer';
    case AgentType.RAG_Agent:
      return 'RAG Agent';
    case AgentType.Responder:
      return 'Responder';
  }
}
