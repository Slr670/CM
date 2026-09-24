import React, { useState } from 'react';
import { X, CheckCircle2, Plus, Trash2, Mail } from 'lucide-react';
import type { Ticket } from '../types/ticket';
import { SignaturePad } from './SignaturePad';

interface ResolveTicketModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: {
    summary: string;
    rootCause: string;
    actionTaken: string;
    resolvedBy: string;
    partsReplaced: Array<{ name: string; code: string; quantity: number; unit: string }>;
    beforePhoto?: string;
    afterPhoto?: string;
    technicianSignature?: string;
  }) => void;
}

export const ResolveTicketModal: React.FC<ResolveTicketModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [summary, setSummary] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [resolvedBy, setResolvedBy] = useState(ticket?.forthAssignee?.name || 'นายเกียรติศักดิ์ ช่างทอง (Forth)');
  const [parts, setParts] = useState<Array<{ name: string; code: string; quantity: number; unit: string }>>([
    { name: '', code: '', quantity: 1, unit: 'ชิ้น' }
  ]);
  const [afterPhoto, setAfterPhoto] = useState('https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80');
  const [signature, setSignature] = useState('');

  if (!isOpen || !ticket) return null;

  const handleAddPart = () => {
    setParts([...parts, { name: '', code: '', quantity: 1, unit: 'ชิ้น' }]);
  };

  const handleRemovePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const handleUpdatePart = (index: number, field: string, value: string | number) => {
    const updated = [...parts];
    updated[index] = { ...updated[index], [field]: value };
    setParts(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim() || !rootCause.trim() || !actionTaken.trim()) {
      alert('กรุณากรอกข้อมูลสรุปผลการซ่อม สาเหตุ และการแก้ไข');
      return;
    }

    const validParts = parts.filter(p => p.name.trim() !== '');

    onConfirm({
      summary,
      rootCause,
      actionTaken,
      resolvedBy,
      partsReplaced: validParts,
      beforePhoto: ticket.photos?.[0],
      afterPhoto,
      technicianSignature: signature || resolvedBy,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-700 p-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-500/30 border border-teal-400/40 text-teal-100">
                ขั้นตอนที่ 4 : Forth
              </span>
              <span className="text-xs text-teal-200">ระบบรับแจ้งซ่อม CM</span>
            </div>
            <h3 className="text-lg font-bold mt-1">Forth ยืนยันการแก้ไขเสร็จ (Confirm Resolution)</h3>
            <p className="text-xs text-teal-100 mt-0.5">
              เมื่อกดยืนยัน ระบบจะส่งอีเมลแจ้งผลการซ่อมไปยัง กทม. อัตโนมัติเพื่อตรวจรับงาน
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-600/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Ticket Reference */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700">เคสที่แก้ไข: </span>
            <span className="text-slate-900 font-mono font-semibold">{ticket.id}</span> — {ticket.title}
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              สรุปภาพรวมการแก้ไขเสร็จสิ้น <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="เช่น เปลี่ยนโมดูลเพาเวอร์ซัพพลายและตั้งค่าระบบเครือข่ายใหม่ สัญญาณภาพกลับมาปกติ"
              className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Root Cause */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                สาเหตุที่แท้จริง (Root Cause) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="เช่น ไฟกระชากจากพายุฝนฟ้าคะนอง ทำให้วงจรป้องกัน Overvoltage ขาด"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* Action Taken */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                วิธีการและขั้นตอนการแก้ไข (Action Taken) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                placeholder="เช่น ทำการตัดต่อสายไฟ เปลี่ยนอะไหล่แท้ตรงรุ่น Forth ทดสอบระบบรัน 30 นาที ค่าปกติ"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Spare Parts Section */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">
                รายการอะไหล่ / วัสดุอุปกรณ์ที่เปลี่ยน (Spare Parts)
              </span>
              <button
                type="button"
                onClick={handleAddPart}
                className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded transition"
              >
                <Plus className="w-3 h-3" />
                เพิ่มรายการอะไหล่
              </button>
            </div>

            <div className="space-y-2">
              {parts.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                  <input
                    type="text"
                    placeholder="ชื่ออะไหล่"
                    value={p.name}
                    onChange={(e) => handleUpdatePart(idx, 'name', e.target.value)}
                    className="flex-2 text-xs px-2 py-1.5 border border-slate-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="รหัส/Part No."
                    value={p.code}
                    onChange={(e) => handleUpdatePart(idx, 'code', e.target.value)}
                    className="flex-1 text-xs px-2 py-1.5 border border-slate-300 rounded font-mono"
                  />
                  <input
                    type="number"
                    min={1}
                    value={p.quantity}
                    onChange={(e) => handleUpdatePart(idx, 'quantity', Number(e.target.value))}
                    className="w-16 text-xs px-2 py-1.5 border border-slate-300 rounded text-center"
                  />
                  <input
                    type="text"
                    placeholder="หน่วย"
                    value={p.unit}
                    onChange={(e) => handleUpdatePart(idx, 'unit', e.target.value)}
                    className="w-16 text-xs px-2 py-1.5 border border-slate-300 rounded text-center"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePart(idx)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* After Photo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              รูปภาพผลงานหลังการแก้ไขเสร็จสิ้น (After Photo URL)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={afterPhoto}
                onChange={(e) => setAfterPhoto(e.target.value)}
                placeholder="วาง URL ภาพผลงานหลังซ่อม"
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 outline-none"
              />
            </div>
            {afterPhoto && (
              <div className="mt-2 w-32 h-24 rounded-lg overflow-hidden border border-slate-200">
                <img src={afterPhoto} alt="After Repair" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Technician Name & Signature */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อช่างผู้ยืนยันการแก้ไข (Forth Technician)
              </label>
              <input
                type="text"
                required
                value={resolvedBy}
                onChange={(e) => setResolvedBy(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 outline-none"
              />
            </div>
            <div>
              <SignaturePad
                label="ลงลายมือชื่อช่างผู้ซ่อม (Forth)"
                onSave={(sigUrl) => setSignature(sigUrl)}
              />
            </div>
          </div>

          {/* Email notice callout */}
          <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs">
            <Mail className="w-4 h-4 shrink-0 text-teal-600" />
            <span>เมื่อกดปุ่มด้านล่าง ระบบจะส่ง <strong>อีเมลแจ้งเตือน กทม.</strong> ({ticket.reportedBy.name}) โดยอัตโนมัติ</span>
          </div>

          {/* Form Actions */}
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
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-md shadow-teal-500/20 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              ยืนยันการแก้ไขเสร็จ & ส่งอีเมลหา กทม
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
