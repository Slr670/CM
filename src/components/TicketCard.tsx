import React from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  FileSpreadsheet, 
  ArrowRight
} from 'lucide-react';
import type { Ticket, UserRole, TicketStatus } from '../types/ticket';

interface TicketCardProps {
  ticket: Ticket;
  currentRole: UserRole;
  onOpenDetail: (ticket: Ticket) => void;
  onOpenAccept: (ticket: Ticket) => void;
  onOpenUpdateStatus: (ticket: Ticket) => void;
  onOpenResolve: (ticket: Ticket) => void;
  onOpenBmaClose: (ticket: Ticket) => void;
  onOpenSendReport: (ticket: Ticket) => void;
  onOpenServiceReport: (ticket: Ticket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  currentRole,
  onOpenDetail,
  onOpenAccept,
  onOpenUpdateStatus,
  onOpenResolve,
  onOpenBmaClose,
  onOpenSendReport,
  onOpenServiceReport,
}) => {
  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'REPORTED':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          label: '1. แจ้งในระบบ',
          roleTag: 'รอ Forth รับงาน',
        };
      case 'ACCEPTED':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          label: '2. Forth รับงานแล้ว',
          roleTag: 'ช่างกำลังเตรียมการ',
        };
      case 'IN_PROGRESS':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          label: '3. กำลังซ่อมแซม',
          roleTag: 'ปฏิบัติงานหน้างาน',
        };
      case 'RESOLVED':
        return {
          bg: 'bg-teal-50 text-teal-700 border-teal-200',
          label: '4. แก้ไขเสร็จสิ้น',
          roleTag: 'รอ กทม. ตรวจรับ',
        };
      case 'CLOSED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          label: '5. กทม ปิดงานแล้ว',
          roleTag: 'รอ Forth ส่ง Report',
        };
      case 'REPORT_SENT':
        return {
          bg: 'bg-slate-900 text-white border-slate-700',
          label: '6. ส่ง Report แล้ว',
          roleTag: 'เสร็จสมบูรณ์',
        };
    }
  };

  const statusInfo = getStatusBadge(ticket.status);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden group">
      
      {/* Card Header */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {ticket.id}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusInfo.bg}`}>
              {statusInfo.label}
            </span>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            ticket.urgency === 'EMERGENCY'
              ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse'
              : ticket.urgency === 'HIGH'
              ? 'bg-amber-100 text-amber-700 border border-amber-200'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {ticket.urgency}
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenDetail(ticket)}
          className="font-bold text-sm text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer transition mb-2"
        >
          {ticket.title}
        </h3>

        {/* Location & Asset */}
        <div className="space-y-1 text-xs text-slate-600 mb-3">
          <div className="flex items-start gap-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span title={ticket.location}>{ticket.location}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span>Asset: <strong className="font-mono text-slate-700">{ticket.assetId}</strong></span>
            <span>•</span>
            <span>{ticket.category}</span>
          </div>
        </div>

        {/* Progress Bar / Flow Tag */}
        <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">{statusInfo.roleTag}</span>
          <span className="text-slate-400 text-[10px]">{ticket.reportedAt.slice(5, 16)}</span>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenDetail(ticket)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
        >
          รายละเอียด <ArrowRight className="w-3 h-3" />
        </button>

        {/* Context-Aware Quick Action Buttons */}
        <div className="flex items-center gap-1.5">
          
          {/* Forth Accept Action */}
          {ticket.status === 'REPORTED' && (currentRole === 'FORTH' || currentRole === 'ADMIN') && (
            <button
              onClick={() => onOpenAccept(ticket)}
              className="px-2.5 py-1 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow-xs transition"
            >
              รับงาน
            </button>
          )}

          {/* Forth Update & Resolve Actions */}
          {(ticket.status === 'ACCEPTED' || ticket.status === 'IN_PROGRESS') && (currentRole === 'FORTH' || currentRole === 'ADMIN') && (
            <>
              <button
                onClick={() => onOpenUpdateStatus(ticket)}
                className="px-2 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition"
              >
                อัพเดท
              </button>
              <button
                onClick={() => onOpenResolve(ticket)}
                className="px-2.5 py-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-xs transition"
              >
                ซ่อมเสร็จ
              </button>
            </>
          )}

          {/* BMA Close Action */}
          {ticket.status === 'RESOLVED' && (currentRole === 'BMA' || currentRole === 'ADMIN') && (
            <button
              onClick={() => onOpenBmaClose(ticket)}
              className="px-3 py-1 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-xs transition flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              กทม ปิดงาน
            </button>
          )}

          {/* Forth Send Report Action */}
          {ticket.status === 'CLOSED' && (currentRole === 'FORTH' || currentRole === 'ADMIN') && (
            <button
              onClick={() => onOpenSendReport(ticket)}
              className="px-2.5 py-1 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-md shadow-xs transition flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3 h-3" />
              ส่ง Report
            </button>
          )}

          {/* View Service Report */}
          {ticket.status === 'REPORT_SENT' && (
            <button
              onClick={() => onOpenServiceReport(ticket)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-md shadow-2xs transition"
            >
              ดู Report
            </button>
          )}

        </div>
      </div>

    </div>
  );
};
