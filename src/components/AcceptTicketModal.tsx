import React, { useState } from 'react';
import { X, Clock, UserCheck, Phone, Users, CheckCircle2 } from 'lucide-react';
import type { Ticket } from '../types/ticket';

interface AcceptTicketModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (assignee: { name: string; phone: string; team: string; estimatedHours: number }) => void;
}

export const AcceptTicketModal: React.FC<AcceptTicketModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [name, setName] = useState('นายเกียรติศักดิ์ ช่างทอง');
  const [phone, setPhone] = useState('081-456-7890');
  const [team, setTeam] = useState('Forth Mobile Maintenance Unit 3');
  const [estimatedHours, setEstimatedHours] = useState(ticket?.urgency === 'EMERGENCY' ? 2 : ticket?.urgency === 'HIGH' ? 6 : 24);

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('กรุณากรอกชื่อช่างและเบอร์โทรศัพท์');
      return;
    }
    onConfirm({ name, phone, team, estimatedHours: Number(estimatedHours) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/30 border border-purple-400/40 text-purple-100">
                ขั้นตอนที่ 2 : Forth
              </span>
              <span className="text-xs text-purple-200">ระบบรับแจ้งซ่อม CM</span>
            </div>
            <h3 className="text-lg font-bold mt-1">Forth รับงาน (Acknowledge & Assign)</h3>
            <p className="text-xs text-purple-100 mt-0.5">
              เคส: {ticket.id} — {ticket.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-purple-600/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-purple-50/70 border border-purple-200 p-3.5 rounded-xl text-xs space-y-1 text-purple-950">
            <p className="font-semibold text-purple-900">รายละเอียดเคสที่รับงาน:</p>
            <p><span className="text-slate-500">สถานที่:</span> {ticket.location}</p>
            <p><span className="text-slate-500">ความเร่งด่วน:</span> <span className="font-bold text-red-600">{ticket.urgency}</span></p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ชื่อช่าง / หัวหน้าทีมผู้รับผิดชอบ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น นายเกียรติศักดิ์ ช่างทอง"
                className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              เบอร์โทรศัพท์ติดต่อช่างหน้างาน <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="เช่น 081-456-7890"
                className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ทีมงาน / หน่วยซ่อมบำรุง Forth
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="เช่น Forth Mobile Maintenance Unit 3"
                className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              เป้าหมายเวลาแล้วเสร็จตาม SLA (ชั่วโมง)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="number"
                min={1}
                max={168}
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              เป้าหมาย SLA เคส {ticket.urgency}: ปกติประมาณ {ticket.urgency === 'EMERGENCY' ? '2 ชม.' : ticket.urgency === 'HIGH' ? '6 ชม.' : '24 ชม.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md shadow-purple-500/20 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              ยืนยัน Forth รับงาน
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
