import { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { WorkflowDiagramBanner } from './components/WorkflowDiagramBanner';
import { TicketList } from './components/TicketList';
import { NewTicketModal } from './components/NewTicketModal';
import { AcceptTicketModal } from './components/AcceptTicketModal';
import { UpdateStatusModal } from './components/UpdateStatusModal';
import { ResolveTicketModal } from './components/ResolveTicketModal';
import { BmaCloseModal } from './components/BmaCloseModal';
import { SendReportModal } from './components/SendReportModal';
import { TicketDetailModal } from './components/TicketDetailModal';
import { ServiceReportView } from './components/ServiceReportView';
import { CaseReportExportModal } from './components/CaseReportExportModal';
import { EmailSimulatorDrawer } from './components/EmailSimulatorDrawer';
import { TicketService } from './services/ticketService';
import { Ticket, UserRole, TicketStatus, EmailNotification } from './types/ticket';
import { APP_VERSION, APP_NAME, APP_BUILD_DATE } from './version';
import { CheckCircle2, Info, Building2, Wrench } from 'lucide-react';

export function App() {
  const [tickets, setTickets] = useState<Ticket[]>(() => TicketService.getAllTickets());
  const [emails, setEmails] = useState<EmailNotification[]>(() => TicketService.getStoredEmails());
  const [currentRole, setCurrentRole] = useState<UserRole>('BMA');
  const [activeStatusFilter, setActiveStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');

  // Modal States
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicketForDetail, setSelectedTicketForDetail] = useState<Ticket | null>(null);
  const [selectedTicketForAccept, setSelectedTicketForAccept] = useState<Ticket | null>(null);
  const [selectedTicketForUpdateStatus, setSelectedTicketForUpdateStatus] = useState<Ticket | null>(null);
  const [selectedTicketForResolve, setSelectedTicketForResolve] = useState<Ticket | null>(null);
  const [selectedTicketForBmaClose, setSelectedTicketForBmaClose] = useState<Ticket | null>(null);
  const [selectedTicketForSendReport, setSelectedTicketForSendReport] = useState<Ticket | null>(null);
  const [selectedTicketForServiceReport, setSelectedTicketForServiceReport] = useState<Ticket | null>(null);
  const [isReportExportOpen, setIsReportExportOpen] = useState(false);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; submessage?: string; type: 'success' | 'info' } | null>(null);

  const showToast = useCallback((message: string, submessage?: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, submessage, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  const refreshData = useCallback(() => {
    const loadedTickets = TicketService.getAllTickets();
    const loadedEmails = TicketService.getStoredEmails();
    setTickets([...loadedTickets]);
    setEmails([...loadedEmails]);

    // Keep active selected detail ticket in sync if open
    setSelectedTicketForDetail((prev) => {
      if (!prev) return null;
      return loadedTickets.find(t => t.id === prev.id) || null;
    });
  }, []);

  const unreadEmailCount = emails.filter(e => !e.isRead).length;

  // Flow Step 1: กทม แจ้งในระบบ -> auto email to Forth
  const handleCreateTicket = (data: Parameters<typeof TicketService.createTicket>[0]) => {
    const created = TicketService.createTicket(data);
    refreshData();
    showToast(
      `บันทึกเคส ${created.id} เรียบร้อยแล้ว`,
      'ระบบได้ส่งอีเมลแจ้งเตือนงานด่วนไปยังทีมช่าง Forth เรียบร้อยแล้ว'
    );
  };

  // Flow Step 2: Forth รับงาน
  const handleAcceptTicket = (assignee: { name: string; phone: string; team: string; estimatedHours: number }) => {
    if (!selectedTicketForAccept) return;
    TicketService.forthAcceptTicket(selectedTicketForAccept.id, assignee);
    refreshData();
    showToast(
      `Forth รับงานเคส ${selectedTicketForAccept.id} แล้ว`,
      `มอบหมาย ${assignee.name} เข้าดำเนินการตาม SLA`
    );
    setSelectedTicketForAccept(null);
  };

  // Flow Step 3: Forth อัพเดทสถานะ
  const handleUpdateStatus = (note: string, authorName: string, photoUrl?: string) => {
    if (!selectedTicketForUpdateStatus) return;
    TicketService.forthUpdateStatus(selectedTicketForUpdateStatus.id, note, authorName, photoUrl);
    refreshData();
    showToast(
      `อัพเดทสถานะเคส ${selectedTicketForUpdateStatus.id} สำเร็จ`,
      'บันทึกข้อมูลความคืบหน้าหน้างานเรียบร้อย'
    );
    setSelectedTicketForUpdateStatus(null);
  };

  // Flow Step 4: Forth ยืนยันการแก้ไขเสร็จ -> auto email to กทม
  const handleConfirmResolution = (details: Parameters<typeof TicketService.forthConfirmResolution>[1]) => {
    if (!selectedTicketForResolve) return;
    TicketService.forthConfirmResolution(selectedTicketForResolve.id, details);
    refreshData();
    showToast(
      `Forth ยืนยันการแก้ไขเคส ${selectedTicketForResolve.id} เสร็จสิ้น`,
      'ระบบได้ส่งอีเมลแจ้งเตือนไปยังเจ้าหน้าที่ กทม. เพื่อเข้าตรวจรับงานแล้ว'
    );
    setSelectedTicketForResolve(null);
  };

  // Flow Step 5: กทม ปิดงาน
  const handleBmaClose = (details: Parameters<typeof TicketService.bmaCloseTicket>[1]) => {
    if (!selectedTicketForBmaClose) return;
    TicketService.bmaCloseTicket(selectedTicketForBmaClose.id, details);
    refreshData();
    showToast(
      `กทม. ตรวจรับและปิดงานเคส ${selectedTicketForBmaClose.id} สำเร็จ`,
      `ให้คะแนนประเมิน ${details.rating}/5 ดาว พร้อมบันทึกลายมือชื่อตรวจรับ`
    );
    setSelectedTicketForBmaClose(null);
  };

  // Flow Step 6: Forth ส่ง report
  const handleSendReport = (details: Parameters<typeof TicketService.forthSendReport>[1]) => {
    if (!selectedTicketForSendReport) return;
    const updated = TicketService.forthSendReport(selectedTicketForSendReport.id, details);
    refreshData();
    showToast(
      `Forth ส่ง Report เคส ${selectedTicketForSendReport.id} เรียบร้อย`,
      `ออกใบรับรองเลขที่ ${updated.reportSentDetails?.reportNumber} สมบูรณ์`
    );
    setSelectedTicketForSendReport(null);
  };

  const handleResetData = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลตัวอย่างกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      TicketService.resetToDefault();
      refreshData();
      showToast('รีเซ็ตข้อมูลตัวอย่างสำเร็จ', 'ข้อมูลระบบถูกรีเซ็ตกลับสู่สถานะเริ่มต้นเรียบร้อย');
    }
  };

  const handleSelectTicketById = (ticketId: string) => {
    const t = tickets.find(item => item.id === ticketId);
    if (t) {
      setSelectedTicketForDetail(t);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Toast Notification Popup */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">{toast.message}</p>
            {toast.submessage && (
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.submessage}</p>
            )}
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentRole={currentRole}
        onChangeRole={(role) => {
          setCurrentRole(role);
          showToast(`สลับบทบาทเป็น: ${role === 'BMA' ? 'กทม. (ผู้แจ้ง/ตรวจรับ)' : role === 'FORTH' ? 'Forth (ผู้รับเหมา)' : 'Admin (ควบคุมทั้งหมด)'}`, undefined, 'info');
        }}
        unreadEmailCount={unreadEmailCount}
        onOpenEmails={() => setIsEmailDrawerOpen(true)}
        onOpenNewTicket={() => setIsNewTicketOpen(true)}
        onOpenReportExport={() => setIsReportExportOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        
        {/* Banner with Visual Flowchart (from user diagram) */}
        <WorkflowDiagramBanner
          activeStatusFilter={activeStatusFilter}
          onSelectStatusFilter={(status) => setActiveStatusFilter(status)}
          onOpenReportExport={() => setIsReportExportOpen(true)}
          onOpenNewTicket={() => setIsNewTicketOpen(true)}
        />

        {/* Current Active Role Notice */}
        <div className="mb-4 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">คุณกำลังใช้งานในฐานะ:</span>
            <span className="font-bold flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
              {currentRole === 'BMA' && <><Building2 className="w-3.5 h-3.5 text-blue-600" /> กรุงเทพมหานคร (กทม.) — ผู้แจ้ง / ผู้ตรวจรับ / ดึง Report</>}
              {currentRole === 'FORTH' && <><Wrench className="w-3.5 h-3.5 text-purple-600" /> บริษัท ฟอร์ท คอร์ปอเรชั่น จำกัด (มหาชน) — ผู้รับงาน / ซ่อมแซม / ส่ง Report</>}
              {currentRole === 'ADMIN' && <><Info className="w-3.5 h-3.5 text-emerald-600" /> ผู้ดูแลระบบ (Admin) — สามารถทดสอบทำได้ทุกขั้นตอน</>}
            </span>
          </div>
          <span className="text-slate-400 hidden sm:inline text-[11px]">
            * สามารถกดสลับบทบาทได้ที่แถบด้านบน เพื่อทดสอบ Flow ของทั้งสองฝ่าย
          </span>
        </div>

        {/* Ticket List Section */}
        <TicketList
          tickets={tickets}
          currentRole={currentRole}
          activeStatusFilter={activeStatusFilter}
          onSelectStatusFilter={(status) => setActiveStatusFilter(status)}
          onOpenDetail={(ticket) => setSelectedTicketForDetail(ticket)}
          onOpenAccept={(ticket) => setSelectedTicketForAccept(ticket)}
          onOpenUpdateStatus={(ticket) => setSelectedTicketForUpdateStatus(ticket)}
          onOpenResolve={(ticket) => setSelectedTicketForResolve(ticket)}
          onOpenBmaClose={(ticket) => setSelectedTicketForBmaClose(ticket)}
          onOpenSendReport={(ticket) => setSelectedTicketForSendReport(ticket)}
          onOpenServiceReport={(ticket) => setSelectedTicketForServiceReport(ticket)}
          onOpenNewTicket={() => setIsNewTicketOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-700">
              {APP_NAME} — เวอร์ชัน <strong className="font-mono text-slate-900">v{APP_VERSION}</strong>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              ระบบรับแจ้งซ่อม CM รองรับขั้นตอน กทม แจ้งในระบบ → อีเมลแจ้งเตือน → Forth รับงาน → อัพเดทสถานะ → ยืนยันแก้ไขเสร็จ → อีเมลส่งไปยัง กทม → กทม ปิดงาน → Forth ส่ง report
            </p>
          </div>
          <div className="text-[11px] text-slate-400">
            สร้างและอัปเดตเมื่อ {APP_BUILD_DATE} • กรุงเทพมหานคร & Forth Corporation
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. กทม แจ้งในระบบ */}
      <NewTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onSubmit={handleCreateTicket}
      />

      {/* 2. Forth รับงาน */}
      <AcceptTicketModal
        ticket={selectedTicketForAccept}
        isOpen={!!selectedTicketForAccept}
        onClose={() => setSelectedTicketForAccept(null)}
        onConfirm={handleAcceptTicket}
      />

      {/* 3. Forth อัพเดทสถานะ */}
      <UpdateStatusModal
        ticket={selectedTicketForUpdateStatus}
        isOpen={!!selectedTicketForUpdateStatus}
        onClose={() => setSelectedTicketForUpdateStatus(null)}
        onConfirm={handleUpdateStatus}
      />

      {/* 4. Forth ยืนยันการแก้ไขเสร็จ */}
      <ResolveTicketModal
        ticket={selectedTicketForResolve}
        isOpen={!!selectedTicketForResolve}
        onClose={() => setSelectedTicketForResolve(null)}
        onConfirm={handleConfirmResolution}
      />

      {/* 5. กทม ปิดงาน */}
      <BmaCloseModal
        ticket={selectedTicketForBmaClose}
        isOpen={!!selectedTicketForBmaClose}
        onClose={() => setSelectedTicketForBmaClose(null)}
        onConfirm={handleBmaClose}
      />

      {/* 6. Forth ส่ง report */}
      <SendReportModal
        ticket={selectedTicketForSendReport}
        isOpen={!!selectedTicketForSendReport}
        onClose={() => setSelectedTicketForSendReport(null)}
        onConfirm={handleSendReport}
      />

      {/* Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicketForDetail}
        isOpen={!!selectedTicketForDetail}
        onClose={() => setSelectedTicketForDetail(null)}
        currentRole={currentRole}
        onOpenAccept={() => {
          setSelectedTicketForAccept(selectedTicketForDetail);
        }}
        onOpenUpdateStatus={() => {
          setSelectedTicketForUpdateStatus(selectedTicketForDetail);
        }}
        onOpenResolve={() => {
          setSelectedTicketForResolve(selectedTicketForDetail);
        }}
        onOpenBmaClose={() => {
          setSelectedTicketForBmaClose(selectedTicketForDetail);
        }}
        onOpenSendReport={() => {
          setSelectedTicketForSendReport(selectedTicketForDetail);
        }}
        onOpenServiceReport={() => {
          setSelectedTicketForServiceReport(selectedTicketForDetail);
        }}
      />

      {/* Service Report View (PDF/Print) */}
      <ServiceReportView
        ticket={selectedTicketForServiceReport}
        isOpen={!!selectedTicketForServiceReport}
        onClose={() => setSelectedTicketForServiceReport(null)}
      />

      {/* Case Report Export (ดึง report เคสได้) */}
      <CaseReportExportModal
        tickets={tickets}
        isOpen={isReportExportOpen}
        onClose={() => setIsReportExportOpen(false)}
        onSelectTicket={(ticket) => setSelectedTicketForDetail(ticket)}
      />

      {/* Email Simulator Drawer */}
      <EmailSimulatorDrawer
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
        emails={emails}
        onMarkAsRead={(id) => {
          TicketService.markEmailAsRead(id);
          refreshData();
        }}
        onSelectTicketById={handleSelectTicketById}
      />

    </div>
  );
}

export default App;
