export type TicketStatus = 
  | 'REPORTED'       // 1. แจ้งในระบบ (ส่งอีเมลแจ้งเตือนหา Forth)
  | 'ACCEPTED'       // 2. Forth รับงาน
  | 'IN_PROGRESS'    // 3. Forth อัพเดทสถานะ
  | 'RESOLVED'       // 4. Forth ยืนยันการแก้ไขเสร็จ (ส่งอีเมลแจ้ง กทม)
  | 'CLOSED'         // 5. กทม ปิดงาน
  | 'REPORT_SENT';   // 6. Forth ส่ง report เรียบร้อย

export type UserRole = 'BMA' | 'FORTH' | 'ADMIN';

export type UrgencyLevel = 'EMERGENCY' | 'HIGH' | 'NORMAL';

export interface WorkLogEntry {
  id: string;
  timestamp: string;
  author: string;
  role: 'BMA' | 'FORTH' | 'SYSTEM';
  status: TicketStatus;
  note: string;
  photoUrl?: string;
}

export interface SparePartItem {
  id: string;
  name: string;
  code: string;
  quantity: number;
  unit: string;
}

export interface ResolutionDetails {
  summary: string;
  rootCause: string;
  actionTaken: string;
  resolvedAt: string;
  resolvedBy: string;
  partsReplaced: SparePartItem[];
  beforePhoto?: string;
  afterPhoto?: string;
  technicianSignature?: string;
}

export interface BmaCloseDetails {
  closedAt: string;
  closedBy: string;
  rating: number; // 1-5
  comment: string;
  inspectorSignature?: string;
}

export interface ReportSentDetails {
  sentAt: string;
  reportNumber: string;
  sentBy: string;
  notes: string;
}

export interface EmailNotification {
  id: string;
  ticketId: string;
  ticketTitle: string;
  sentAt: string;
  type: 'TO_FORTH_NEW_TICKET' | 'TO_BMA_TICKET_RESOLVED';
  to: string;
  toName: string;
  subject: string;
  previewText: string;
  htmlContent: string;
  isRead: boolean;
}

export interface Ticket {
  id: string; // e.g. CM-2026-001
  title: string;
  category: string;
  location: string;
  coordinates?: string;
  assetId: string;
  urgency: UrgencyLevel;
  description: string;
  reportedBy: {
    name: string;
    department: string;
    phone: string;
    email: string;
  };
  reportedAt: string;
  photos: string[];
  status: TicketStatus;
  
  // Forth Acceptance
  forthAssignee?: {
    name: string;
    phone: string;
    team: string;
  };
  acceptedAt?: string;
  estimatedFinish?: string;

  // Work Logs
  workLogs: WorkLogEntry[];

  // Forth Resolution
  resolutionDetails?: ResolutionDetails;

  // BMA Close
  bmaCloseDetails?: BmaCloseDetails;

  // Forth Final Report
  reportSentDetails?: ReportSentDetails;
}
