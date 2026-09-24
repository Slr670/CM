import React from 'react';
import { X, Printer, ShieldCheck, Building2, Wrench } from 'lucide-react';
import type { Ticket } from '../types/ticket';
import { APP_VERSION } from '../version';

interface ServiceReportViewProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceReportView: React.FC<ServiceReportViewProps> = ({ ticket, isOpen, onClose }) => {
  if (!isOpen || !ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  const reportNumber = ticket.reportSentDetails?.reportNumber || `FORTH-CM-${ticket.id.replace('CM-', '')}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar (hidden on print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ใบรายงานผลการซ่อม CM ทางการ
            </span>
            <span className="text-xs text-slate-400">เลขที่: {reportNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition"
            >
              <Printer className="w-3.5 h-3.5" />
              พิมพ์ / บันทึกเป็น PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Content */}
        <div className="p-8 sm:p-10 overflow-y-auto print:p-0 print:overflow-visible text-slate-800 text-sm space-y-6">
          
          {/* Document Header */}
          <div className="border-b-2 border-slate-800 pb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-extrabold text-xl text-blue-900 tracking-tight">FORTH</span>
                  <span className="text-xs text-slate-500 font-semibold border-l border-slate-300 pl-2">
                    บริษัท ฟอร์ท คอร์ปอเรชั่น จำกัด (มหาชน)
                  </span>
                </div>
                <h1 className="text-lg font-bold text-slate-900">
                  ใบรายงานผลการปฏิบัติงานซ่อมบำรุงตามแจ้ง (CM Service Report)
                </h1>
                <p className="text-xs text-slate-600">
                  โครงการบำรุงรักษาและซ่อมแซมระบบโครงสร้างพื้นฐานดิจิทัลและจราจร กรุงเทพมหานคร
                </p>
              </div>

              <div className="text-right sm:text-right bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-xs font-bold text-slate-900">เลขที่รายงาน: {reportNumber}</p>
                <p className="text-[11px] text-slate-600">เลขที่ใบแจ้งซ่อม: <strong className="text-blue-700">{ticket.id}</strong></p>
                <p className="text-[11px] text-slate-600">วันที่ออกรายงาน: {ticket.reportSentDetails?.sentAt || ticket.reportedAt}</p>
              </div>
            </div>
          </div>

          {/* Section 1: Ticket Info & Reporter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div className="space-y-1.5">
              <p className="font-bold text-slate-800 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" /> ข้อมูลผู้แจ้งและสถานที่ (กทม.)
              </p>
              <p><span className="text-slate-500">หน่วยงานผู้แจ้ง:</span> {ticket.reportedBy.department}</p>
              <p><span className="text-slate-500">ผู้แจ้ง:</span> {ticket.reportedBy.name} (โทร. {ticket.reportedBy.phone})</p>
              <p><span className="text-slate-500">วันเวลาที่แจ้งในระบบ:</span> {ticket.reportedAt}</p>
              <p><span className="text-slate-500">สถานที่เกิดเหตุ:</span> {ticket.location}</p>
              {ticket.coordinates && <p><span className="text-slate-500">พิกัด GPS:</span> {ticket.coordinates}</p>}
            </div>

            <div className="space-y-1.5">
              <p className="font-bold text-slate-800 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-purple-600" /> ข้อมูลทรัพย์สินและผู้รับผิดชอบ (Forth)
              </p>
              <p><span className="text-slate-500">รหัสทรัพย์สิน:</span> <strong className="font-mono">{ticket.assetId}</strong></p>
              <p><span className="text-slate-500">หมวดหมู่อุปกรณ์:</span> {ticket.category}</p>
              <p><span className="text-slate-500">ระดับความเร่งด่วน:</span> <strong className="text-red-600">{ticket.urgency}</strong></p>
              <p><span className="text-slate-500">ช่าง Forth ผู้รับผิดชอบ:</span> {ticket.forthAssignee?.name || '-'}</p>
              <p><span className="text-slate-500">ทีมงาน:</span> {ticket.forthAssignee?.team || '-'}</p>
            </div>
          </div>

          {/* Section 2: Problem Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 mb-1">1. รายละเอียดปัญหาและอาการเสียที่ได้รับแจ้ง</h3>
            <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-700">
              <p className="font-semibold text-slate-900 mb-1">{ticket.title}</p>
              <p>{ticket.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
            </div>
          </div>

          {/* Section 3: Root Cause & Action Taken */}
          {ticket.resolutionDetails && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 mb-1">2. การตรวจสอบและผลการซ่อมบำรุง (Forth Resolution)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs">
                  <p className="font-bold text-slate-900 mb-1">สาเหตุความเสียหาย (Root Cause):</p>
                  <p className="text-slate-700">{ticket.resolutionDetails.rootCause}</p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs">
                  <p className="font-bold text-slate-900 mb-1">วิธีดำเนินการแก้ไข (Action Taken):</p>
                  <p className="text-slate-700">{ticket.resolutionDetails.actionTaken}</p>
                </div>
              </div>

              {/* Spare Parts Table */}
              {ticket.resolutionDetails.partsReplaced && ticket.resolutionDetails.partsReplaced.length > 0 && (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2">ลำดับ</th>
                        <th className="p-2">รายการอะไหล่ / วัสดุอุปกรณ์</th>
                        <th className="p-2 font-mono">Part Number</th>
                        <th className="p-2 text-center">จำนวน</th>
                        <th className="p-2 text-center">หน่วยนับ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {ticket.resolutionDetails.partsReplaced.map((part, index) => (
                        <tr key={index}>
                          <td className="p-2 text-center text-slate-500">{index + 1}</td>
                          <td className="p-2 font-medium text-slate-800">{part.name}</td>
                          <td className="p-2 font-mono text-slate-600">{part.code || '-'}</td>
                          <td className="p-2 text-center font-bold text-slate-800">{part.quantity}</td>
                          <td className="p-2 text-center text-slate-600">{part.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Before and After Photos */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-2">ภาพเปรียบเทียบ ก่อนแก้ไข (Before) และ หลังแก้ไข (After)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 text-center">
                    <p className="text-[11px] font-bold text-slate-700 mb-1">ภาพก่อนการซ่อม (Before)</p>
                    <div className="h-44 rounded overflow-hidden bg-slate-200">
                      <img
                        src={ticket.resolutionDetails.beforePhoto || ticket.photos[0]}
                        alt="Before Repair"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 text-center">
                    <p className="text-[11px] font-bold text-slate-700 mb-1">ภาพหลังการซ่อม (After)</p>
                    <div className="h-44 rounded overflow-hidden bg-slate-200">
                      <img
                        src={ticket.resolutionDetails.afterPhoto || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80'}
                        alt="After Repair"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Inspection & Sign-off by BMA */}
          {ticket.bmaCloseDetails && (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2 text-xs">
              <h3 className="font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> 3. บันทึกผลการตรวจรับงานโดย กทม.
              </h3>
              <p><span className="text-slate-600">ผลการตรวจรับ:</span> ผ่านการตรวจรับความเรียบร้อย สมบูรณ์ตามสัญญา</p>
              <p><span className="text-slate-600">คะแนนประเมิน:</span> {ticket.bmaCloseDetails.rating} / 5 คะแนน</p>
              <p><span className="text-slate-600">ความเห็นผู้ตรวจรับ:</span> "{ticket.bmaCloseDetails.comment}"</p>
              <p><span className="text-slate-600">วันเวลาที่ปิดงาน:</span> {ticket.bmaCloseDetails.closedAt}</p>
            </div>
          )}

          {/* Section 5: Dual Signatures */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
            {/* Forth Sign */}
            <div className="space-y-2 flex flex-col items-center">
              <p className="font-bold text-slate-800">ผู้ดำเนินการซ่อมแซม (Forth Corporation)</p>
              <div className="h-16 flex items-center justify-center">
                {ticket.resolutionDetails?.technicianSignature?.startsWith('data:image') ? (
                  <img src={ticket.resolutionDetails.technicianSignature} alt="Tech Sig" className="max-h-14" />
                ) : (
                  <span className="font-serif italic text-base text-slate-700 underline decoration-slate-400">
                    {ticket.resolutionDetails?.technicianSignature || ticket.forthAssignee?.name || 'นายเกียรติศักดิ์ ช่างทอง'}
                  </span>
                )}
              </div>
              <p className="text-slate-700">({ticket.resolutionDetails?.resolvedBy || ticket.forthAssignee?.name || 'นายเกียรติศักดิ์ ช่างทอง'})</p>
              <p className="text-[11px] text-slate-500">วิศวกร/ช่างเทคนิค Forth</p>
            </div>

            {/* BMA Sign */}
            <div className="space-y-2 flex flex-col items-center">
              <p className="font-bold text-slate-800">ผู้ตรวจรับงาน (กรุงเทพมหานคร)</p>
              <div className="h-16 flex items-center justify-center">
                {ticket.bmaCloseDetails?.inspectorSignature?.startsWith('data:image') ? (
                  <img src={ticket.bmaCloseDetails.inspectorSignature} alt="Inspector Sig" className="max-h-14" />
                ) : (
                  <span className="font-serif italic text-base text-emerald-900 underline decoration-emerald-400">
                    {ticket.bmaCloseDetails?.inspectorSignature || ticket.reportedBy.name}
                  </span>
                )}
              </div>
              <p className="text-slate-700">({ticket.bmaCloseDetails?.closedBy || ticket.reportedBy.name})</p>
              <p className="text-[11px] text-slate-500">เจ้าหน้าที่ผู้ตรวจรับ กทม.</p>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
            <span>CM Maintenance Management System v{APP_VERSION}</span>
            <span>Generated on {new Date().toLocaleDateString('th-TH')} | กรุงเทพมหานคร & บริษัท ฟอร์ท คอร์ปอเรชั่น จำกัด (มหาชน)</span>
          </div>

        </div>

      </div>
    </div>
  );
};
