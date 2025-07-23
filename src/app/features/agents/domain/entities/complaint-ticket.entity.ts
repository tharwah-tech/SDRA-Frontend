export enum ComplaintTicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

export enum ComplaintTicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface ComplaintTicketEntity {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  categoryName: string;
  status: ComplaintTicketStatus;
  priority: ComplaintTicketPriority | null;
  assignedTo: string | null;
  assignedToName: string | null;
  assignedToEmail: string | null;
  assignedToPhone: string | null;
}

export interface ComplaintTicketSummaryEntity {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
  status: ComplaintTicketStatus;
}
