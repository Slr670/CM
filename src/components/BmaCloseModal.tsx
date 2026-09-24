import React, { useState } from 'react';
import { X, ShieldCheck, Star, UserCheck } from 'lucide-react';
import type { Ticket } from '../types/ticket';
import { SignaturePad } from './SignaturePad';

interface BmaCloseModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: {
    closedBy: string;
    rating: number;
    comment: string;
    inspectorSignature?: string;
  }) => void;
}

export const BmaCloseModal: React.FC<BmaCloseModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [closedBy, setClosedBy] = useState('นายสมชาย เจริญสุข (ผู้ตรวจรับ กทม.)');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('ตรวจสอบการทำงานแล้ว อุปกรณ์กลับมาใช้งานได้สมบูรณ์เป็นปกติตามมาตรฐาน');
  const [signature, setSignature] = useState('');

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closedBy.trim()) {
      alert('กรุณากรอกชื่อผู้ตรวจรับ กทม.');
      return;
    }

    onConfirm({
      closedBy,
      rating,
      comment,
      inspectorSignature: signature || closedBy,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-600/40 border border-emerald-400/40 text-emerald-100">
                ขั้นตอนที่ 5 : กทม.
              </span>
              <span className="text-xs text-emerald-200">ระบบรับแจ้งซ่อม CM</span>
            </div>
            <h3 className="text-lg font-bold mt-1">กทม ปิดงาน (Inspection & Ticket Close)</h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              เคส: {ticket.id} — ตรวจรับงานและอนุมัติปิดเคส
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Resolution Review Summary */}
          {ticket.resolutionDetails && (
            <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl text-xs space-y-1 text-emerald-950">
              <p className="font-semibold text-emerald-900">สรุปผลงานที่ Forth ส่งตรวจรับ:</p>
              <p><span className="text-slate-500">ผลการแก้ไข:</span> {ticket.resolutionDetails.summary}</p>
              <p><span className="text-slate-500">ช่างผู้ซ่อม:</span> {ticket.resolutionDetails.resolvedBy}</p>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              การประเมินความพึงพอใจการปฏิบัติงาน (Rating)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-700 ml-2">
                {rating === 5 ? 'ดีเยี่ยม (5/5)' : rating === 4 ? 'ดีมาก (4/5)' : rating === 3 ? 'ปานกลาง (3/5)' : 'ต้องปรับปรุง'}
              </span>
            </div>
          </div>

          {/* Inspector Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ชื่อเจ้าหน้าที่ผู้ตรวจรับ กทม. <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={closedBy}
                onChange={(e) => setClosedBy(e.target.value)}
                className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Inspector Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ความเห็น / บันทึกการตรวจรับ
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Digital Signature */}
          <div>
            <SignaturePad
              label="ลงลายมือชื่อผู้ตรวจรับ (กทม.)"
              onSave={(sigUrl) => setSignature(sigUrl)}
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
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-md shadow-emerald-700/20 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              ยืนยัน กทม ปิดงาน
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
