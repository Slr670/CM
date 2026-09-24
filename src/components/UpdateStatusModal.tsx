import React, { useState } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';
import type { Ticket } from '../types/ticket';

interface UpdateStatusModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string, authorName: string, photoUrl?: string) => void;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [note, setNote] = useState('');
  const [authorName, setAuthorName] = useState(ticket?.forthAssignee?.name || 'นายเกียรติศักดิ์ ช่างทอง');
  const [photoUrl, setPhotoUrl] = useState('');

  if (!isOpen || !ticket) return null;

  const quickPresets = [
    'ทีมช่างเดินทางถึงจุดติดตั้งหน้างานแล้ว กำลังเริ่มตรวจสอบระบบ',
    'ตรวจสอบเบื้องต้นพบสายสัญญาณหลุดหลวม และฟิวส์ในตู้ควบคุมขาด กำลังดำเนินการแก้ไข',
    'กำลังทดสอบแรงดันไฟและโมดูลควบคุม พบค่าสัญญาณผิดปกติ กำลังปรับแต่ง',
    'จำเป็นต้องใช้รถกระเช้าเข้าถึงจุดติดตั้ง เจ้าหน้าที่ได้ประสานงานรถกระเช้าเรียบร้อย',
    'อยู่ระหว่างทดสอบระบบการทำงานร่วมกับศูนย์ควบคุมระบบ',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      alert('กรุณาระบุรายละเอียดการอัพเดทสถานะ');
      return;
    }
    onConfirm(note, authorName, photoUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-blue-700 p-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/30 border border-indigo-400/40 text-indigo-100">
                ขั้นตอนที่ 3 : Forth
              </span>
              <span className="text-xs text-indigo-200">ระบบรับแจ้งซ่อม CM</span>
            </div>
            <h3 className="text-lg font-bold mt-1">Forth อัพเดทสถานะ (Update Status & Log)</h3>
            <p className="text-xs text-indigo-100 mt-0.5">
              เคส: {ticket.id} — {ticket.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-indigo-600/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ผู้บันทึกความคืบหน้า (Forth)
            </label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                รายละเอียดการปฏิบัติงานหน้างาน <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">ระบุการดำเนินการล่าสุด</span>
            </div>
            
            {/* Quick Presets */}
            <div className="mb-2 space-y-1">
              <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" /> ข้อความด่วน:
              </span>
              <div className="flex flex-wrap gap-1">
                {quickPresets.map((text, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNote(text)}
                    className="text-[11px] text-left px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded border border-slate-200 text-slate-700 transition"
                  >
                    {text.slice(0, 36)}...
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={4}
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ระบุสิ่งที่ทีมช่างได้ลงมือทำ ปัญหาที่พบ หรือขั้นตอนที่กำลังทำอยู่..."
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              รูปภาพการทำงานหน้างาน (URL)
            </label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="เช่น https://images.unsplash.com/..."
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
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
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-500/20 transition"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              บันทึกอัพเดทสถานะ
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
