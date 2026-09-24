import React from 'react';
import { 
  X, 
  MapPin, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  FileSpreadsheet, 
  Printer
} from 'lucide-react';
import type { Ticket, UserRole, TicketStatus } from '../types/ticket';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onOpenAccept: () => void;
  onOpenUpdateStatus: () => void;
  onOpenResolve: () => void;
  onOpenBmaClose: () => void;
  onOpenSendReport: () => void;
  onOpenServiceReport: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  isOpen,
  onClose,
  currentRole,
  onOpenAccept,
  onOpenUpdateStatus,
  onOpenResolve,
  onOpenBmaClose,
  onOpenSendReport,
  onOpenServiceReport,
}) => {
  if (!isOpen || !ticket) return null;

  const flowSteps: { key: TicketStatus; label: string; role: string }[] = [
    { key: 'REPORTED', label: '1. แจ้งในระบบ', role: 'กทม.' },
    { key: 'ACCEPTED', label: '2. Forth รับงาน', role: 'Forth' },
    { key: 'IN_PROGRESS', label: '3. อัพเดทสถานะ', role: 'Forth' },
    { key: 'RESOLVED', label: '4. ยืนยันแก้ไขเสร็จ', role: 'Forth' },
    { key: 'CLOSED', label: '5. กทม ปิดงาน', role: 'กทม.' },
    { key: 'REPORT_SENT', label: '6. ส่ง Report', role: 'Forth' },
  ];

  const getStepIndex = (status: TicketStatus) => {
    switch (status) {
      case 'REPORTED': return 0;
      case 'ACCEPTED': return 1;
      case 'IN_PROGRESS': return 2;
      case 'RESOLVED': return 3;
      case 'CLOSED': return 4;
      case 'REPORT_SENT': return 5;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(ticket.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-bold text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-800/60">
              {ticket.id}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  ticket.urgency === 'EMERGENCY'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : ticket.urgency === 'HIGH'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {ticket.urgency}
                </span>
                <span className="text-xs text-slate-400">{ticket.category}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1 line-clamp-1">
                {ticket.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' || ticket.status === 'REPORT_SENT') && (
              <button
                onClick={onOpenServiceReport}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ดูใบรายงานผลซ่อม (CM Report)</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workflow Pipeline Stepper */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[650px] relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            
            {flowSteps.map((step, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.key} className="flex flex-col items-center relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition shadow-sm ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : isPast
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-[11px] font-semibold mt-1 ${
                    isCurrent ? 'text-blue-700 font-bold' : isPast ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] text-slate-400">({step.role})</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left Box: Location & Reporter */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 pb-1 border-b border-slate-200">
                <MapPin className="w-4 h-4 text-blue-600" /> สถานที่เกิดเหตุและข้อมูลผู้แจ้ง
              </h4>
              <p><span className="text-slate-500">สถานที่:</span> <strong className="text-slate-900">{ticket.location}</strong></p>
              {ticket.coordinates && <p><span className="text-slate-500">พิกัด GPS:</span> {ticket.coordinates}</p>}
              <p><span className="text-slate-500">รหัสทรัพย์สิน:</span> <span className="font-mono font-semibold text-slate-900">{ticket.assetId}</span></p>
              <p><span className="text-slate-500">ผู้แจ้ง:</span> {ticket.reportedBy.name} ({ticket.reportedBy.department})</p>
              <p><span className="text-slate-500">เบอร์โทร:</span> {ticket.reportedBy.phone}</p>
              <p><span className="text-slate-500">วันเวลาที่แจ้ง:</span> {ticket.reportedAt}</p>
            </div>

            {/* Right Box: Forth Assignee & Status */}
            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200/80 space-y-2">
              <h4 className="font-bold text-purple-900 text-xs flex items-center gap-1.5 pb-1 border-b border-purple-200">
                <Wrench className="w-4 h-4 text-purple-600" /> ข้อมูลการดำเนินงานทีมช่าง (Forth)
              </h4>
              <p>
                <span className="text-slate-500">ช่างผู้รับผิดชอบ:</span>{' '}
                <strong className="text-purple-950">{ticket.forthAssignee?.name || 'ยังไม่ได้มอบหมาย'}</strong>
              </p>
              <p><span className="text-slate-500">ทีมงาน:</span> {ticket.forthAssignee?.team || '-'}</p>
              <p><span className="text-slate-500">เบอร์ติดต่อช่าง:</span> {ticket.forthAssignee?.phone || '-'}</p>
              <p><span className="text-slate-500">เวลารับงาน:</span> {ticket.acceptedAt || '-'}</p>
              <p><span className="text-slate-500">กำหนดเวลาแล้วเสร็จตาม SLA:</span> {ticket.estimatedFinish || '-'}</p>
            </div>

          </div>

          {/* Description & Initial Photos */}
          <div>
            <h4 className="font-bold text-slate-800 mb-1 text-xs">รายละเอียดอาการเสียที่แจ้ง:</h4>
            <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed text-slate-800">
              {ticket.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
            </p>

            {ticket.photos.length > 0 && (
              <div className="mt-3">
                <span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">ภาพถ่ายจุดเกิดเหตุ (ตอนแจ้ง):</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {ticket.photos.map((url, i) => (
                    <div key={i} className="w-28 h-24 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <img src={url} alt={`Issue ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resolution Details Card (if resolved) */}
          {ticket.resolutionDetails && (
            <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-200 space-y-3">
              <h4 className="font-bold text-teal-950 text-xs flex items-center gap-1.5 pb-1 border-b border-teal-200">
                <CheckCircle2 className="w-4 h-4 text-teal-600" /> ผลการซ่อมแซมและแก้ไขเสร็จสิ้น (Forth Resolution)
              </h4>
              <p><span className="text-slate-600">สรุปการซ่อม:</span> <strong className="text-teal-900">{ticket.resolutionDetails.summary}</strong></p>
              <p><span className="text-slate-600">สาเหตุ (Root Cause):</span> {ticket.resolutionDetails.rootCause}</p>
              <p><span className="text-slate-600">วิธีแก้ไข (Action Taken):</span> {ticket.resolutionDetails.actionTaken}</p>
              <p><span className="text-slate-600">ช่างผู้แก้ไข:</span> {ticket.resolutionDetails.resolvedBy} (วันที่ {ticket.resolutionDetails.resolvedAt})</p>

              {/* Spare Parts */}
              {ticket.resolutionDetails.partsReplaced && ticket.resolutionDetails.partsReplaced.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">อะไหล่ที่เปลี่ยน:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ticket.resolutionDetails.partsReplaced.map((part, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-white border border-teal-200 text-teal-900 text-[11px]">
                        {part.name} ({part.quantity} {part.unit})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* After Photo */}
              {ticket.resolutionDetails.afterPhoto && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 mb-1 block">ภาพหลังการแก้ไขเสร็จ:</span>
                  <div className="w-36 h-28 rounded-lg overflow-hidden border border-teal-200">
                    <img src={ticket.resolutionDetails.afterPhoto} alt="After Fix" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BMA Close Details Card (if closed) */}
          {ticket.bmaCloseDetails && (
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2">
              <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5 pb-1 border-b border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> ผลการตรวจรับและปิดงานโดย กทม.
              </h4>
              <p><span className="text-slate-600">ผู้ตรวจรับ:</span> <strong className="text-emerald-900">{ticket.bmaCloseDetails.closedBy}</strong></p>
              <p><span className="text-slate-600">คะแนนประเมิน:</span> {ticket.bmaCloseDetails.rating} / 5 คะแนน</p>
              <p><span className="text-slate-600">ความเห็น:</span> "{ticket.bmaCloseDetails.comment}"</p>
              <p><span className="text-slate-600">วันเวลาตรวจรับ:</span> {ticket.bmaCloseDetails.closedAt}</p>
            </div>
          )}

          {/* Final Report Details Card (if report sent) */}
          {ticket.reportSentDetails && (
            <div className="bg-slate-100 p-4 rounded-xl border border-slate-300 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 pb-1 border-b border-slate-300">
                <FileSpreadsheet className="w-4 h-4 text-slate-700" /> Forth ส่ง Report เรียบร้อยแล้ว
              </h4>
              <p><span className="text-slate-600">เลขที่รายงาน:</span> <strong className="font-mono text-blue-800">{ticket.reportSentDetails.reportNumber}</strong></p>
              <p><span className="text-slate-600">ส่งมอบโดย:</span> {ticket.reportSentDetails.sentBy}</p>
              <p><span className="text-slate-600">วันเวลาที่ส่งมอบ:</span> {ticket.reportSentDetails.sentAt}</p>
            </div>
          )}

          {/* Activity / Work Log Timeline */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3 text-xs flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" /> บันทึกประวัติการทำงาน (Work Log & Audit Trail)
            </h4>
            <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 ml-2">
              {ticket.workLogs.map((log) => (
                <div key={log.id} className="relative group">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 absolute -left-[21px] top-1.5 ring-4 ring-white" />
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900">{log.author}</span>
                      <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-700 text-xs">{log.note}</p>
                    {log.photoUrl && (
                      <div className="mt-2 w-28 h-20 rounded border border-slate-200 overflow-hidden">
                        <img src={log.photoUrl} alt="Log Attachment" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Action Bottom Bar based on Role and Status */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>บทบาทปัจจุบัน: </span>
            <strong className="text-slate-800 font-semibold">
              {currentRole === 'BMA' ? 'กทม. (ผู้แจ้ง/ตรวจรับ)' : currentRole === 'FORTH' ? 'Forth (ผู้รับเหมา)' : 'Admin (ควบคุมทั้งหมด)'}
            </strong>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Step 2 Action: Forth รับงาน */}
            {ticket.status === 'REPORTED' && (currentRole === 'FORTH' || currentRole === 'ADMIN') && (
              <button
                onClick={onOpenAccept}
                className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow transition"
              >
                <Wrench className="w-3.5 h-3.5" />
                Forth รับงาน
              </button>
            )}

            {/* Step 3 Action: Forth อัพเดทสถานะ */}
            {(ticket.status === 'ACCEPTED' || ticket.status === 'IN_PROGRESS') && (currentRole === 'FORTH' || currentRole === 'ADMIN') && (
              <button
                onClick={onOpenUpdateStatus}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold rounded-lg transition"
              >
                <Clock className="w-3.5 h-3.5" />
                Forth อัพเดทสถานะ
              </button>
            )}

            {/* Step 4 Action: Forth ยืนยันการแก้ไขเสร็จ */}
            {(ticket.status === 'ACCEPTED' || ticket.status === 'IN_PROGRESS') && (currentRole === 'FORTH' || currentRole === 'ADMIN') && (
              <button
                onClick={onOpenResolve}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Forth ยืนยันการแก้ไขเสร็จ
              </button>
            )}

            {/* Step 5 Action: กทม ปิดงาน */}
            {ticket.status === 'RESOLVED' && (currentRole === 'BMA' || currentRole === 'ADMIN') && (
              <button
                onClick={onOpenBmaClose}
                className="flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-md transition"
              >
                <ShieldCheck className="w-4 h-4" />
                กทม ปิดงาน (ตรวจรับ)
              </button>
            )}

            {/* Step 6 Action: Forth ส่ง report */}
            {ticket.status === 'CLOSED' && (currentRole === 'FORTH' || currentRole === 'ADMIN') && (
              <button
                onClick={onOpenSendReport}
                className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Forth ส่ง report
              </button>
            )}

            {/* Completed */}
            {ticket.status === 'REPORT_SENT' && (
              <button
                onClick={onOpenServiceReport}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow transition"
              >
                <Printer className="w-3.5 h-3.5" />
                พิมพ์ CM Service Report
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-lg transition"
            >
              ปิด
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
