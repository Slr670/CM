import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Building2, 
  MapPin
} from 'lucide-react';
import { TicketService } from '../services/ticketService';
import type { Ticket, TicketStatus } from '../types/ticket';

interface StatusCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTicket: (ticket: Ticket) => void;
  defaultPhone?: string;
}

const STATUS_LABELS: Record<TicketStatus, { label: string; bg: string; text: string; step: number }> = {
  REPORTED: { label: '1. แจ้งในระบบ (รอรับงาน)', bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', step: 1 },
  ACCEPTED: { label: '2. Forth รับงานแล้ว', bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-400', step: 2 },
  IN_PROGRESS: { label: '3. กำลังดำเนินการซ่อม', bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400', step: 3 },
  RESOLVED: { label: '4. Forth ซ่อมเสร็จแล้ว (รอกทม.ตรวจรับ)', bg: 'bg-teal-500/10 border-teal-500/30', text: 'text-teal-400', step: 4 },
  CLOSED: { label: '5. กทม. ตรวจรับและปิดงานสำเร็จ', bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', step: 5 },
  REPORT_SENT: { label: '6. Forth ส่งรายงาน CM แล้ว', bg: 'bg-indigo-500/10 border-indigo-500/30', text: 'text-indigo-400', step: 6 },
};

export const StatusCheckModal: React.FC<StatusCheckModalProps> = ({
  isOpen,
  onClose,
  onSelectTicket,
  defaultPhone = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(defaultPhone);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Ticket[]>([]);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!query) return;

    const allTickets = TicketService.getAllTickets();
    const filtered = allTickets.filter((t) => {
      const matchId = t.id.toLowerCase().includes(query);
      const cleanReporterPhone = t.reportedBy.phone.replace(/[^0-9]/g, '');
      const cleanQuery = query.replace(/[^0-9]/g, '');
      const matchPhone = cleanQuery.length >= 4 && cleanReporterPhone.includes(cleanQuery);
      const matchName = t.reportedBy.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchId || matchPhone || matchName;
    });

    setResults(filtered);
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c1427] text-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-800 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-slate-900/90 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ตรวจสอบสถานะการแจ้งซ่อม</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ค้นหาด้วยเลขเคส (เช่น CM-2026-001) หรือเบอร์โทรศัพท์ผู้แจ้ง
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/40">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ระบุเลขเคส เช่น CM-2026-001 หรือเบอร์โทรศัพท์..."
                autoFocus
                className="w-full h-11 bg-[#070d1d] border border-slate-700 text-white placeholder-slate-500 text-sm rounded-lg px-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 transition shrink-0 shadow-lg shadow-blue-600/30"
            >
              <Search className="w-4 h-4" />
              <span>ค้นหา</span>
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
            <span>ตัวอย่าง:</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('081-234-5678');
                setTimeout(() => {
                  const all = TicketService.getAllTickets();
                  setResults(all.filter(t => t.reportedBy.phone.includes('081') || t.reportedBy.name.includes('สมชาย')));
                  setHasSearched(true);
                }, 50);
              }}
              className="text-cyan-400 hover:underline"
            >
              081-234-5678
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('CM-2026-001');
                setTimeout(() => {
                  const all = TicketService.getAllTickets();
                  setResults(all.filter(t => t.id === 'CM-2026-001'));
                  setHasSearched(true);
                }, 50);
              }}
              className="text-cyan-400 hover:underline"
            >
              CM-2026-001
            </button>
          </div>
        </div>

        {/* Results List Area */}
        <div className="p-5 max-h-[460px] overflow-y-auto space-y-3">
          {!hasSearched ? (
            <div className="py-12 text-center text-slate-500">
              <Clock className="w-10 h-10 mx-auto text-slate-600 mb-2 stroke-1" />
              <p className="text-sm font-medium">กรอกเบอร์โทรหรือเลขเคสเพื่อค้นหาสถานะงานซ่อม</p>
              <p className="text-xs text-slate-500 mt-1">ระบบจะแสดงความคืบหน้าแบบ Real-time</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <AlertTriangle className="w-10 h-10 mx-auto text-amber-500/80 mb-2 stroke-1" />
              <p className="text-sm font-semibold text-white">ไม่พบรายการแจ้งซ่อมที่ตรงกับคำค้นหา</p>
              <p className="text-xs text-slate-500 mt-1">โปรดตรวจสอบเลขเคสหรือเบอร์โทรศัพท์อีกครั้ง</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-medium">
                พบ {results.length} รายการ:
              </p>
              {results.map((ticket) => {
                const statusMeta = STATUS_LABELS[ticket.status];
                return (
                  <div
                    key={ticket.id}
                    onClick={() => {
                      onSelectTicket(ticket);
                      onClose();
                    }}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700 transition cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                            {ticket.id}
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${statusMeta.bg} ${statusMeta.text}`}>
                            {statusMeta.label}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                          {ticket.title}
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition shrink-0 mt-1" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{ticket.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>แจ้งเมื่อ {ticket.reportedAt}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>ผู้แจ้ง: {ticket.reportedBy.name}</span>
                      </div>
                      {ticket.forthAssignee && (
                        <div className="flex items-center gap-1.5 text-purple-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>ช่าง Forth: {ticket.forthAssignee.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
