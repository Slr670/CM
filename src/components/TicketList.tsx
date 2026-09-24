import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  ShieldCheck, 
  PlusCircle,
  FileText
} from 'lucide-react';
import type { Ticket, UserRole, TicketStatus } from '../types/ticket';
import { TicketCard } from './TicketCard';

interface TicketListProps {
  tickets: Ticket[];
  currentRole: UserRole;
  activeStatusFilter: TicketStatus | 'ALL';
  onSelectStatusFilter: (status: TicketStatus | 'ALL') => void;
  onOpenDetail: (ticket: Ticket) => void;
  onOpenAccept: (ticket: Ticket) => void;
  onOpenUpdateStatus: (ticket: Ticket) => void;
  onOpenResolve: (ticket: Ticket) => void;
  onOpenBmaClose: (ticket: Ticket) => void;
  onOpenSendReport: (ticket: Ticket) => void;
  onOpenServiceReport: (ticket: Ticket) => void;
  onOpenNewTicket: () => void;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  currentRole,
  activeStatusFilter,
  onSelectStatusFilter,
  onOpenDetail,
  onOpenAccept,
  onOpenUpdateStatus,
  onOpenResolve,
  onOpenBmaClose,
  onOpenSendReport,
  onOpenServiceReport,
  onOpenNewTicket,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');

  // Stats Counters
  const stats = useMemo(() => {
    return {
      total: tickets.length,
      reported: tickets.filter(t => t.status === 'REPORTED').length,
      accepted: tickets.filter(t => t.status === 'ACCEPTED').length,
      inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      resolved: tickets.filter(t => t.status === 'RESOLVED').length,
      closed: tickets.filter(t => t.status === 'CLOSED').length,
      reportSent: tickets.filter(t => t.status === 'REPORT_SENT').length,
    };
  }, [tickets]);

  // Filtering
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        searchTerm === '' ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.assetId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = activeStatusFilter === 'ALL' || t.status === activeStatusFilter;
      const matchCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
      const matchUrgency = selectedUrgency === 'ALL' || t.urgency === selectedUrgency;

      return matchSearch && matchStatus && matchCategory && matchUrgency;
    });
  }, [tickets, searchTerm, activeStatusFilter, selectedCategory, selectedUrgency]);

  return (
    <div className="space-y-6">
      
      {/* Stats KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => onSelectStatusFilter('ALL')}
          className={`p-3.5 rounded-xl border text-left transition ${
            activeStatusFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-400'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold opacity-70">เคสทั้งหมด</span>
            <Layers className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-bold mt-1">{stats.total}</p>
        </button>

        <button
          onClick={() => onSelectStatusFilter('REPORTED')}
          className={`p-3.5 rounded-xl border text-left transition ${
            activeStatusFilter === 'REPORTED'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
              : 'bg-white text-blue-900 border-slate-200 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold opacity-70">1. รอ Forth รับงาน</span>
            <Clock className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className="text-xl font-bold mt-1">{stats.reported}</p>
        </button>

        <button
          onClick={() => onSelectStatusFilter('ACCEPTED')}
          className={`p-3.5 rounded-xl border text-left transition ${
            activeStatusFilter === 'ACCEPTED'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-300'
              : 'bg-white text-purple-900 border-slate-200 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold opacity-70">2. Forth รับงาน</span>
            <Wrench className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <p className="text-xl font-bold mt-1">{stats.accepted}</p>
        </button>

        <button
          onClick={() => onSelectStatusFilter('IN_PROGRESS')}
          className={`p-3.5 rounded-xl border text-left transition ${
            activeStatusFilter === 'IN_PROGRESS'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
              : 'bg-white text-indigo-900 border-slate-200 hover:border-indigo-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold opacity-70">3. กำลังซ่อมแซม</span>
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <p className="text-xl font-bold mt-1">{stats.inProgress}</p>
        </button>

        <button
          onClick={() => onSelectStatusFilter('RESOLVED')}
          className={`p-3.5 rounded-xl border text-left transition ${
            activeStatusFilter === 'RESOLVED'
              ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-300'
              : 'bg-white text-teal-900 border-slate-200 hover:border-teal-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold opacity-70">4. รอ กทม. ตรวจรับ</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <p className="text-xl font-bold mt-1">{stats.resolved}</p>
        </button>

        <button
          onClick={() => onSelectStatusFilter('CLOSED')}
          className={`p-3.5 rounded-xl border text-left transition ${
            activeStatusFilter === 'CLOSED'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
              : 'bg-white text-emerald-900 border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold opacity-70">5. กทม ปิดงานแล้ว</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-xl font-bold mt-1">{stats.closed}</p>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ค้นหาตามเลขที่เคส, หัวข้อ, สถานที่, Asset ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-700 font-medium"
          >
            <option value="ALL">หมวดหมู่ทั้งหมด</option>
            <option value="CCTV / กล้องวงจรปิด">CCTV / กล้องวงจรปิด</option>
            <option value="Traffic Light / สัญญาณไฟจราจร">Traffic Light / สัญญาณไฟ</option>
            <option value="Smart Pole / เสาไฟอัจฉริยะ">Smart Pole / เสาไฟ</option>
            <option value="VMS / ป้ายจราจรอัจฉริยะ">VMS / ป้ายจราจร</option>
            <option value="Network / ระบบโครงข่ายสื่อสาร">Network / ไฟเบอร์</option>
          </select>

          {/* Urgency */}
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-700 font-medium"
          >
            <option value="ALL">ความเร่งด่วนทั้งหมด</option>
            <option value="EMERGENCY">EMERGENCY (ฉุกเฉิน)</option>
            <option value="HIGH">HIGH (ด่วนสูง)</option>
            <option value="NORMAL">NORMAL (ปกติ)</option>
          </select>

          {/* Clear Filter */}
          {(searchTerm || selectedCategory !== 'ALL' || selectedUrgency !== 'ALL' || activeStatusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setSelectedUrgency('ALL');
                onSelectStatusFilter('ALL');
              }}
              className="px-2.5 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>

      </div>

      {/* Ticket Grid */}
      {filteredTickets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">ไม่พบรายการแจ้งซ่อมที่ตรงกับเงื่อนไข</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            ลองปรับเปลี่ยนคำค้นหา หรือเลือกตัวกรองสถานะเป็น "แสดงทั้งหมด"
          </p>
          <button
            onClick={onOpenNewTicket}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow transition"
          >
            <PlusCircle className="w-4 h-4" />
            เปิดแจ้งซ่อมใหม่ (กทม)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              currentRole={currentRole}
              onOpenDetail={onOpenDetail}
              onOpenAccept={onOpenAccept}
              onOpenUpdateStatus={onOpenUpdateStatus}
              onOpenResolve={onOpenResolve}
              onOpenBmaClose={onOpenBmaClose}
              onOpenSendReport={onOpenSendReport}
              onOpenServiceReport={onOpenServiceReport}
            />
          ))}
        </div>
      )}

    </div>
  );
};
