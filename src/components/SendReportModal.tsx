import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import type { Ticket } from '../types/ticket';

interface SendReportModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: { sentBy: string; notes: string }) => void;
}

export const SendReportModal: React.FC<SendReportModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [sentBy, setSentBy] = useState('ฝ่ายวิศวกรรมบริการและซ่อมบำรุง บริษัท ฟอร์ท คอร์ปอเรชั่น จำกัด (มหาชน)');
  const [notes, setNotes] = useState('ส่งมอบรายงานผลการปฏิบัติงานซ่อมบำรุง CM พร้อมภาพถ่ายหลักฐานและบันทึกการตรวจรับตามสัญญา');

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentBy.trim()) {
      alert('กรุณากรอกผู้ส่งรายงาน');
      return;
    }
    onConfirm({ sentBy, notes });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-700 border border-slate-600 text-slate-200">
                ขั้นตอนที่ 6 (สิ้นสุด Flow) : Forth
              </span>
              <span className="text-xs text-slate-300">ระบบรับแจ้งซ่อม CM</span>
            </div>
            <h3 className="text-lg font-bold mt-1">Forth ส่ง Report (Submit Service Report)</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              เคส: {ticket.id} — ออกใบรายงานผลการซ่อมและส่งมอบให้ กทม.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs space-y-1">
            <p className="font-semibold text-slate-800">สถานะเคสปัจจุบัน:</p>
            <p className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> กทม. ตรวจรับและปิดงานเรียบร้อยแล้ว
            </p>
            <p className="text-slate-600">
              ผู้ตรวจรับ: {ticket.bmaCloseDetails?.closedBy || 'เจ้าหน้าที่ กทม.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ผู้ออกและส่งมอบเอกสาร (Forth Corporation) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={sentBy}
              onChange={(e) => setSentBy(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              หมายเหตุประกอบการส่งรายงาน
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-700 outline-none"
            />
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
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              ยืนยัน Forth ส่ง Report
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
