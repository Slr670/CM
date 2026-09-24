import React from 'react';
import { 
  FilePlus2, 
  Mail, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Download
} from 'lucide-react';
import type { TicketStatus } from '../types/ticket';

interface WorkflowDiagramBannerProps {
  activeStatusFilter: TicketStatus | 'ALL';
  onSelectStatusFilter: (status: TicketStatus | 'ALL') => void;
  onOpenReportExport: () => void;
  onOpenNewTicket?: () => void;
}

export const WorkflowDiagramBanner: React.FC<WorkflowDiagramBannerProps> = ({
  activeStatusFilter,
  onSelectStatusFilter,
  onOpenReportExport,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5" />
              Corrective Maintenance Workflow
            </span>
            <span className="text-xs text-slate-500">ตามกระบวนการทำงานมาตรฐาน กทม. x Forth</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            แผนผังขั้นตอนการรับแจ้งซ่อม CM (CM Process Flow)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectStatusFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              activeStatusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            แสดงทั้งหมด
          </button>
          <button
            onClick={onOpenReportExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5" />
            ดึง Report เคส (กทม)
          </button>
        </div>
      </div>

      {/* Visual Flowchart Track */}
      <div className="mt-5 overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[960px] flex items-center justify-between gap-1 text-center">
          
          {/* Step 1: กทม แจ้งในระบบ */}
          <div className="flex-1 flex flex-col items-center">
            <button
              onClick={() => {
                onSelectStatusFilter('REPORTED');
              }}
              className={`w-full group p-3 rounded-xl border transition text-left flex flex-col justify-between h-[120px] ${
                activeStatusFilter === 'REPORTED'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                  : 'bg-blue-50/60 hover:bg-blue-50 text-blue-950 border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeStatusFilter === 'REPORTED' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'
                }`}>
                  1. กทม.
                </span>
                <FilePlus2 className={`w-4 h-4 ${activeStatusFilter === 'REPORTED' ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <div className="my-1">
                <p className="font-bold text-xs">แจ้งในระบบ</p>
                <p className={`text-[10px] ${activeStatusFilter === 'REPORTED' ? 'text-blue-100' : 'text-slate-500'}`}>
                  เปิดเคสแจ้งซ่อม
                </p>
              </div>
              <div className="pt-1 border-t border-blue-200/50 flex items-center justify-between">
                <span className={`text-[9px] font-medium flex items-center gap-1 ${
                  activeStatusFilter === 'REPORTED' ? 'text-blue-100' : 'text-blue-700'
                }`}>
                  <Download className="w-2.5 h-2.5" /> ดึง report เคสได้
                </span>
              </div>
            </button>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mx-1" />

          {/* Step 2: อีเมลแจ้งเตือน */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/60 text-amber-950 flex flex-col justify-between h-[120px] text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  ระบบ Auto
                </span>
                <Mail className="w-4 h-4 text-amber-600" />
              </div>
              <div className="my-1">
                <p className="font-bold text-xs text-amber-900">อีเมลแจ้งเตือน</p>
                <p className="text-[10px] text-amber-700">
                  แจ้งเตือนทีม Forth ทันที
                </p>
              </div>
              <div className="pt-1 border-t border-amber-200 text-[9px] text-amber-700">
                Notification to Contractor
              </div>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mx-1" />

          {/* Step 3: Forth รับงาน */}
          <div className="flex-1 flex flex-col items-center">
            <button
              onClick={() => onSelectStatusFilter('ACCEPTED')}
              className={`w-full group p-3 rounded-xl border transition text-left flex flex-col justify-between h-[120px] ${
                activeStatusFilter === 'ACCEPTED'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-300'
                  : 'bg-purple-50/60 hover:bg-purple-50 text-purple-950 border-purple-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeStatusFilter === 'ACCEPTED' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700'
                }`}>
                  2. Forth
                </span>
                <Wrench className={`w-4 h-4 ${activeStatusFilter === 'ACCEPTED' ? 'text-white' : 'text-purple-600'}`} />
              </div>
              <div className="my-1">
                <p className="font-bold text-xs">Forth รับงาน</p>
                <p className={`text-[10px] ${activeStatusFilter === 'ACCEPTED' ? 'text-purple-100' : 'text-slate-500'}`}>
                  มอบหมายช่าง & SLA
                </p>
              </div>
              <div className="pt-1 border-t border-purple-200/50 text-[9px] opacity-80">
                Acknowledge & Assign
              </div>
            </button>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mx-1" />

          {/* Step 4: Forth อัพเดทสถานะ */}
          <div className="flex-1 flex flex-col items-center">
            <button
              onClick={() => onSelectStatusFilter('IN_PROGRESS')}
              className={`w-full group p-3 rounded-xl border transition text-left flex flex-col justify-between h-[120px] ${
                activeStatusFilter === 'IN_PROGRESS'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                  : 'bg-indigo-50/60 hover:bg-indigo-50 text-indigo-950 border-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeStatusFilter === 'IN_PROGRESS' ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  3. Forth
                </span>
                <Clock className={`w-4 h-4 ${activeStatusFilter === 'IN_PROGRESS' ? 'text-white' : 'text-indigo-600'}`} />
              </div>
              <div className="my-1">
                <p className="font-bold text-xs">อัพเดทสถานะ</p>
                <p className={`text-[10px] ${activeStatusFilter === 'IN_PROGRESS' ? 'text-indigo-100' : 'text-slate-500'}`}>
                  รายงานความคืบหน้า
                </p>
              </div>
              <div className="pt-1 border-t border-indigo-200/50 text-[9px] opacity-80">
                Work Log & Photos
              </div>
            </button>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mx-1" />

          {/* Step 5: Forth ยืนยันการแก้ไขเสร็จ */}
          <div className="flex-1 flex flex-col items-center">
            <button
              onClick={() => onSelectStatusFilter('RESOLVED')}
              className={`w-full group p-3 rounded-xl border transition text-left flex flex-col justify-between h-[120px] ${
                activeStatusFilter === 'RESOLVED'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-300'
                  : 'bg-teal-50/60 hover:bg-teal-50 text-teal-950 border-teal-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeStatusFilter === 'RESOLVED' ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-700'
                }`}>
                  4. Forth
                </span>
                <CheckCircle2 className={`w-4 h-4 ${activeStatusFilter === 'RESOLVED' ? 'text-white' : 'text-teal-600'}`} />
              </div>
              <div className="my-1">
                <p className="font-bold text-xs">ยืนยันแก้ไขเสร็จ</p>
                <p className={`text-[10px] ${activeStatusFilter === 'RESOLVED' ? 'text-teal-100' : 'text-slate-500'}`}>
                  สรุปผลซ่อม/Before-After
                </p>
              </div>
              <div className="pt-1 border-t border-teal-200/50 text-[9px] opacity-80">
                Fix Confirmed
              </div>
            </button>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mx-1" />

          {/* Step 6: อีเมลส่งไปยัง กทม */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 text-emerald-950 flex flex-col justify-between h-[120px] text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  ระบบ Auto
                </span>
                <Mail className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="my-1">
                <p className="font-bold text-xs text-emerald-950">อีเมลส่งไปยัง กทม</p>
                <p className="text-[10px] text-emerald-700">
                  แจ้งผลการซ่อมเสร็จสิ้น
                </p>
              </div>
              <div className="pt-1 border-t border-emerald-200 text-[9px] text-emerald-700">
                Notify to Inspector
              </div>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mx-1" />

          {/* Step 7: กทม ปิดงาน */}
          <div className="flex-1 flex flex-col items-center">
            <button
              onClick={() => onSelectStatusFilter('CLOSED')}
              className={`w-full group p-3 rounded-xl border transition text-left flex flex-col justify-between h-[120px] ${
                activeStatusFilter === 'CLOSED'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
                  : 'bg-emerald-50/60 hover:bg-emerald-50 text-emerald-950 border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeStatusFilter === 'CLOSED' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  5. กทม.
                </span>
                <ShieldCheck className={`w-4 h-4 ${activeStatusFilter === 'CLOSED' ? 'text-white' : 'text-emerald-600'}`} />
              </div>
              <div className="my-1">
                <p className="font-bold text-xs">กทม ปิดงาน</p>
                <p className={`text-[10px] ${activeStatusFilter === 'CLOSED' ? 'text-emerald-100' : 'text-slate-500'}`}>
                  ตรวจรับ & ประเมินผล
                </p>
              </div>
              <div className="pt-1 border-t border-emerald-200/50 text-[9px] opacity-80">
                Inspection & Sign-off
              </div>
            </button>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mx-1" />

          {/* Step 8: Forth ส่ง report */}
          <div className="flex-1 flex flex-col items-center">
            <button
              onClick={() => onSelectStatusFilter('REPORT_SENT')}
              className={`w-full group p-3 rounded-xl border transition text-left flex flex-col justify-between h-[120px] ${
                activeStatusFilter === 'REPORT_SENT'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-400'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-900 border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeStatusFilter === 'REPORT_SENT' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  6. Forth
                </span>
                <FileSpreadsheet className={`w-4 h-4 ${activeStatusFilter === 'REPORT_SENT' ? 'text-white' : 'text-slate-700'}`} />
              </div>
              <div className="my-1">
                <p className="font-bold text-xs">Forth ส่ง report</p>
                <p className={`text-[10px] ${activeStatusFilter === 'REPORT_SENT' ? 'text-slate-200' : 'text-slate-500'}`}>
                  ส่งมอบรายงานทางการ
                </p>
              </div>
              <div className="pt-1 border-t border-slate-200/40 text-[9px] opacity-80">
                CM Service Report
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
