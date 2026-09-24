import type { Ticket, EmailNotification } from '../types/ticket';
import { INITIAL_TICKETS, INITIAL_EMAILS } from '../data/mockData';

const STORAGE_KEY_TICKETS = 'cm_repair_tickets_v1';
const STORAGE_KEY_EMAILS = 'cm_repair_emails_v1';

export class TicketService {
  private static getStoredTickets(): Ticket[] {
    const data = localStorage.getItem(STORAGE_KEY_TICKETS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_TICKETS;
    }
  }

  private static saveTickets(tickets: Ticket[]): void {
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
  }

  public static getStoredEmails(): EmailNotification[] {
    const data = localStorage.getItem(STORAGE_KEY_EMAILS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(INITIAL_EMAILS));
      return INITIAL_EMAILS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_EMAILS;
    }
  }

  private static saveEmails(emails: EmailNotification[]): void {
    localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(emails));
  }

  public static getAllTickets(): Ticket[] {
    return this.getStoredTickets();
  }

  public static getTicketById(id: string): Ticket | undefined {
    return this.getStoredTickets().find(t => t.id === id);
  }

  public static resetToDefault(): void {
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(INITIAL_TICKETS));
    localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(INITIAL_EMAILS));
  }

  /**
   * Flow Step 1: กทม แจ้งในระบบ -> ส่งอีเมลแจ้งเตือนหา Forth
   */
  public static createTicket(data: {
    title: string;
    category: string;
    location: string;
    coordinates?: string;
    assetId: string;
    urgency: Ticket['urgency'];
    description: string;
    reportedByName: string;
    department: string;
    phone: string;
    email: string;
    photos: string[];
  }): Ticket {
    const tickets = this.getStoredTickets();
    const nextNum = tickets.length + 1;
    const ticketId = `CM-2026-${String(nextNum).padStart(3, '0')}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newTicket: Ticket = {
      id: ticketId,
      title: data.title,
      category: data.category,
      location: data.location,
      coordinates: data.coordinates,
      assetId: data.assetId,
      urgency: data.urgency,
      description: data.description,
      reportedBy: {
        name: data.reportedByName,
        department: data.department,
        phone: data.phone,
        email: data.email,
      },
      reportedAt: nowStr,
      photos: data.photos.length > 0 ? data.photos : [
        'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80'
      ],
      status: 'REPORTED',
      workLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: nowStr,
          author: `${data.reportedByName} (กทม.)`,
          role: 'BMA',
          status: 'REPORTED',
          note: 'เปิดแจ้งซ่อม CM ในระบบเรียบร้อย และระบบส่งอีเมลแจ้งเตือนไปยังทีมช่าง Forth ทันที',
        },
      ],
    };

    // Auto Dispatch Notification Email to Forth
    const urgencyLabel = data.urgency === 'EMERGENCY' ? 'ฉุกเฉินด่วนมาก' : data.urgency === 'HIGH' ? 'ด่วนสูง' : 'ปกติ';
    const emailToForth: EmailNotification = {
      id: `em-${Date.now()}`,
      ticketId: newTicket.id,
      ticketTitle: newTicket.title,
      sentAt: nowStr,
      type: 'TO_FORTH_NEW_TICKET',
      to: 'service.cm@forth.co.th',
      toName: 'Forth Service & Maintenance Team',
      subject: `[แจ้งเตือนงานด่วน] กทม. เปิดแจ้งซ่อม CM ใหม่: ${newTicket.id} (${urgencyLabel})`,
      previewText: `กทม. ได้เปิดใบแจ้งซ่อม ${newTicket.id} ที่ ${newTicket.location} กรุณาเข้าระบบเพื่อกดรับงาน...`,
      htmlContent: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background: #1e3a8a; color: white; padding: 18px 24px;">
            <h2 style="margin: 0; font-size: 18px;">ระบบแจ้งซ่อม CM กทม. - Forth Corporation</h2>
            <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.85;">อีเมลแจ้งเตือนงานแจ้งซ่อมใหม่ (Notification to Contractor)</p>
          </div>
          <div style="padding: 24px;">
            <p>เรียน <strong>ทีมงานบำรุงรักษา บริษัท ฟอร์ท คอร์ปอเรชั่น จำกัด (มหาชน)</strong>,</p>
            <p>ทาง <strong>กรุงเทพมหานคร (กทม.)</strong> ได้บันทึกเปิดแจ้งซ่อมบำรุง (Corrective Maintenance) รายการใหม่ในระบบ โดยมีรายละเอียดดังนี้:</p>
            <div style="background: #f8fafc; border-left: 4px solid #ef4444; padding: 14px 16px; margin: 16px 0; border-radius: 4px;">
              <p style="margin: 0 0 6px;"><strong>เลขที่เคส:</strong> ${newTicket.id}</p>
              <p style="margin: 0 0 6px;"><strong>ความเร่งด่วน:</strong> <span style="background: #fee2e2; color: #b91c1c; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${urgencyLabel}</span></p>
              <p style="margin: 0 0 6px;"><strong>หัวข้อ:</strong> ${newTicket.title}</p>
              <p style="margin: 0 0 6px;"><strong>สถานที่:</strong> ${newTicket.location}</p>
              <p style="margin: 0;"><strong>ผู้แจ้ง:</strong> ${data.reportedByName} (${data.department}) โทร. ${data.phone}</p>
            </div>
            <p>โปรดเข้าสู่ระบบเพื่อดำเนินการ <strong>"Forth รับงาน"</strong> และมอบหมายทีมช่างเข้าตรวจสอบตามขั้นตอนในสัญญาสัมปทานต่อไป</p>
          </div>
          <div style="background: #f1f5f9; padding: 12px 24px; font-size: 12px; color: #64748b; text-align: center;">
            ระบบแจ้งเตือนอัตโนมัติ กรุงเทพมหานคร & บริษัท ฟอร์ท คอร์ปอเรชั่น จำกัด (มหาชน)
          </div>
        </div>
      `,
      isRead: false,
    };

    const emails = this.getStoredEmails();
    emails.unshift(emailToForth);
    this.saveEmails(emails);

    tickets.unshift(newTicket);
    this.saveTickets(tickets);
    return newTicket;
  }

  /**
   * Flow Step 2: Forth รับงาน
   */
  public static forthAcceptTicket(ticketId: string, assignee: { name: string; phone: string; team: string; estimatedHours?: number }): Ticket {
    const tickets = this.getStoredTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index === -1) throw new Error('Ticket not found');

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const estDate = new Date();
    estDate.setHours(estDate.getHours() + (assignee.estimatedHours || 24));
    const estDateStr = estDate.toISOString().replace('T', ' ').substring(0, 19);

    const ticket = tickets[index];
    ticket.status = 'ACCEPTED';
    ticket.acceptedAt = nowStr;
    ticket.forthAssignee = {
      name: assignee.name,
      phone: assignee.phone,
      team: assignee.team,
    };
    ticket.estimatedFinish = estDateStr;

    ticket.workLogs.push({
      id: `log-${Date.now()}`,
      timestamp: nowStr,
      author: `${assignee.name} (Forth)`,
      role: 'FORTH',
      status: 'ACCEPTED',
      note: `Forth รับงานเรียบร้อย มอบหมาย ${assignee.name} (${assignee.team}) ดำเนินการ กำหนดเสร็จประมาณ ${estDateStr}`,
    });

    tickets[index] = ticket;
    this.saveTickets(tickets);
    return ticket;
  }

  /**
   * Flow Step 3: Forth อัพเดทสถานะ
   */
  public static forthUpdateStatus(ticketId: string, note: string, authorName: string, photoUrl?: string): Ticket {
    const tickets = this.getStoredTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index === -1) throw new Error('Ticket not found');

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const ticket = tickets[index];
    ticket.status = 'IN_PROGRESS';

    ticket.workLogs.push({
      id: `log-${Date.now()}`,
      timestamp: nowStr,
      author: `${authorName} (Forth)`,
      role: 'FORTH',
      status: 'IN_PROGRESS',
      note: `Forth อัพเดทสถานะ: ${note}`,
      photoUrl: photoUrl || undefined,
    });

    tickets[index] = ticket;
    this.saveTickets(tickets);
    return ticket;
  }

  /**
   * Flow Step 4: Forth ยืนยันการแก้ไขเสร็จ -> อีเมลส่งไปยัง กทม
   */
  public static forthConfirmResolution(
    ticketId: string,
    details: {
      summary: string;
      rootCause: string;
      actionTaken: string;
      resolvedBy: string;
      partsReplaced: Array<{ name: string; code: string; quantity: number; unit: string }>;
      beforePhoto?: string;
      afterPhoto?: string;
      technicianSignature?: string;
    }
  ): Ticket {
    const tickets = this.getStoredTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index === -1) throw new Error('Ticket not found');

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const ticket = tickets[index];

    ticket.status = 'RESOLVED';
    ticket.resolutionDetails = {
      summary: details.summary,
      rootCause: details.rootCause,
      actionTaken: details.actionTaken,
      resolvedAt: nowStr,
      resolvedBy: details.resolvedBy,
      partsReplaced: details.partsReplaced.map((p, i) => ({ ...p, id: `part-${i}-${Date.now()}` })),
      beforePhoto: details.beforePhoto,
      afterPhoto: details.afterPhoto,
      technicianSignature: details.technicianSignature || details.resolvedBy,
    };

    ticket.workLogs.push({
      id: `log-${Date.now()}`,
      timestamp: nowStr,
      author: `${details.resolvedBy} (Forth)`,
      role: 'FORTH',
      status: 'RESOLVED',
      note: `Forth ยืนยันการแก้ไขเสร็จ: ${details.summary} (ส่งอีเมลแจ้ง กทม เรียบร้อย)`,
      photoUrl: details.afterPhoto,
    });

    // Auto Dispatch Notification Email to กทม
    const emailToBMA: EmailNotification = {
      id: `em-${Date.now()}`,
      ticketId: ticket.id,
      ticketTitle: ticket.title,
      sentAt: nowStr,
      type: 'TO_BMA_TICKET_RESOLVED',
      to: ticket.reportedBy.email || 'traffic-inspect@bangkok.go.th',
      toName: ticket.reportedBy.name,
      subject: `[แจ้งผลการซ่อมเสร็จ] Forth ดำเนินการแก้ไขเคส ${ticket.id} เรียบร้อยแล้ว - โปรดตรวจรับงาน`,
      previewText: `ทีมช่าง Forth ได้แก้ไขเคส ${ticket.id} (${ticket.title}) สำเร็จแล้ว กรุณาเข้าตรวจรับและปิดงาน...`,
      htmlContent: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background: #047857; color: white; padding: 18px 24px;">
            <h2 style="margin: 0; font-size: 18px;">ระบบแจ้งซ่อม CM กทม. - Forth Corporation</h2>
            <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.85;">อีเมลแจ้งยืนยันการแก้ไขเสร็จสิ้น (Notification to BMA Inspector)</p>
          </div>
          <div style="padding: 24px;">
            <p>เรียน <strong>คุณ ${ticket.reportedBy.name} (${ticket.reportedBy.department})</strong>,</p>
            <p>ทางทีมงาน บริษัท ฟอร์ท คอร์ปอเรชั่น จำกัด (มหาชน) ขอเรียนแจ้งว่า เคสแจ้งซ่อม <strong>${ticket.id}</strong> ได้รับการดำเนินการซ่อมแซมและทดสอบการใช้งานเรียบร้อยแล้ว โดยมีรายละเอียดการแก้ไขดังนี้:</p>
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 14px 16px; margin: 16px 0; border-radius: 4px;">
              <p style="margin: 0 0 6px;"><strong>เลขที่เคส:</strong> ${ticket.id}</p>
              <p style="margin: 0 0 6px;"><strong>สถานที่:</strong> ${ticket.location}</p>
              <p style="margin: 0 0 6px;"><strong>การแก้ไข:</strong> ${details.summary}</p>
              <p style="margin: 0 0 6px;"><strong>สาเหตุ:</strong> ${details.rootCause}</p>
              <p style="margin: 0;"><strong>ช่างผู้แก้ไข:</strong> ${details.resolvedBy}</p>
            </div>
            <p>ขอความกรุณาเจ้าหน้าที่ กทม. เข้าสู่ระบบเพื่อตรวจสอบความเรียบร้อย และกด <strong>"กทม ปิดงาน"</strong> เพื่อยืนยันการตรวจรับงาน</p>
          </div>
          <div style="background: #f1f5f9; padding: 12px 24px; font-size: 12px; color: #64748b; text-align: center;">
            ระบบแจ้งเตือนอัตโนมัติ กรุงเทพมหานคร & บริษัท ฟอร์ท คอร์ปอเรชั่น จำกัด (มหาชน)
          </div>
        </div>
      `,
      isRead: false,
    };

    const emails = this.getStoredEmails();
    emails.unshift(emailToBMA);
    this.saveEmails(emails);

    tickets[index] = ticket;
    this.saveTickets(tickets);
    return ticket;
  }

  /**
   * Flow Step 5: กทม ปิดงาน
   */
  public static bmaCloseTicket(
    ticketId: string,
    details: {
      closedBy: string;
      rating: number;
      comment: string;
      inspectorSignature?: string;
    }
  ): Ticket {
    const tickets = this.getStoredTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index === -1) throw new Error('Ticket not found');

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const ticket = tickets[index];

    ticket.status = 'CLOSED';
    ticket.bmaCloseDetails = {
      closedAt: nowStr,
      closedBy: details.closedBy,
      rating: details.rating,
      comment: details.comment,
      inspectorSignature: details.inspectorSignature || details.closedBy,
    };

    ticket.workLogs.push({
      id: `log-${Date.now()}`,
      timestamp: nowStr,
      author: `${details.closedBy} (กทม.)`,
      role: 'BMA',
      status: 'CLOSED',
      note: `กทม ตรวจรับงานและกดปิดงานเรียบร้อย: ประเมินความพึงพอใจ ${details.rating} คะแนน ("${details.comment}")`,
    });

    tickets[index] = ticket;
    this.saveTickets(tickets);
    return ticket;
  }

  /**
   * Flow Step 6: Forth ส่ง report
   */
  public static forthSendReport(
    ticketId: string,
    details: {
      sentBy: string;
      notes: string;
    }
  ): Ticket {
    const tickets = this.getStoredTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index === -1) throw new Error('Ticket not found');

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const ticket = tickets[index];

    ticket.status = 'REPORT_SENT';
    const reportNumber = `FORTH-CM-${nowStr.substring(0, 7).replace('-', '')}-${ticket.id.replace('CM-', '')}`;
    
    ticket.reportSentDetails = {
      sentAt: nowStr,
      reportNumber,
      sentBy: details.sentBy,
      notes: details.notes || 'ส่งมอบรายงานผลการปฏิบัติงานซ่อมบำรุง CM ให้ กทม. เรียบร้อย',
    };

    ticket.workLogs.push({
      id: `log-${Date.now()}`,
      timestamp: nowStr,
      author: `${details.sentBy} (Forth)`,
      role: 'FORTH',
      status: 'REPORT_SENT',
      note: `Forth ส่ง report: ออกใบรับรองและส่งรายงานผลการซ่อมแซม CM Service Report เลขที่ ${reportNumber} สมบูรณ์`,
    });

    tickets[index] = ticket;
    this.saveTickets(tickets);
    return ticket;
  }

  public static markEmailAsRead(id: string): void {
    const emails = this.getStoredEmails();
    const em = emails.find(e => e.id === id);
    if (em) {
      em.isRead = true;
      this.saveEmails(emails);
    }
  }
}
