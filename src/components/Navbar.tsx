import React from 'react';
import { 
  Building2, 
  Wrench, 
  Shield, 
  Bell, 
  PlusCircle, 
  Download, 
  RotateCcw
} from 'lucide-react';
import type { UserRole } from '../types/ticket';
import { APP_VERSION } from '../version';

interface NavbarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  unreadEmailCount: number;
  onOpenEmails: () => void;
  onOpenNewTicket: () => void;
  onOpenReportExport: () => void;
  onResetData: () => void;
  onNavigateCitizen?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onChangeRole,
  unreadEmailCount,
  onOpenEmails,
  onOpenNewTicket,
  onOpenReportExport,
  onResetData,
  onNavigateCitizen,
}) => {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 text-sm tracking-wider">
                  CM
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  ระบบรับแจ้งซ่อม CM
                </span>
                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  กทม. x Forth
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  v{APP_VERSION}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Corrective Maintenance Tracking & Service Report Portal
              </p>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="hidden lg:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <span className="text-xs text-slate-400 px-2 font-medium">สลับบทบาท:</span>
            
            <button
              onClick={() => onChangeRole('BMA')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentRole === 'BMA'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              กทม. (ผู้แจ้ง/ตรวจรับ)
            </button>

            <button
              onClick={() => onChangeRole('FORTH')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentRole === 'FORTH'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Forth (ผู้รับเหมา)
            </button>

            <button
              onClick={() => onChangeRole('ADMIN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentRole === 'ADMIN'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin (ทั้งหมด)
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Case Report Export Button (Step 1 feature) */}
            <button
              onClick={onOpenReportExport}
              title="ดึง Report สรุปรายการเคสแจ้งซ่อม (Export CSV/Excel)"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">ดึง Report เคส</span>
            </button>

            {/* Email Outbox Simulator */}
            <button
              onClick={onOpenEmails}
              className="relative p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
              title="กล่องข้อความอีเมลแจ้งเตือนอัตโนมัติ"
            >
              <Bell className="w-4 h-4" />
              {unreadEmailCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900 animate-pulse">
                  {unreadEmailCount}
                </span>
              )}
            </button>

            {/* Reset Mock Data */}
            <button
              onClick={onResetData}
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-700 border border-slate-700/60 rounded-lg transition hidden md:block"
              title="รีเซ็ตข้อมูลตัวอย่างเป็นค่าเริ่มต้น"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Switch to Citizen Portal */}
            {onNavigateCitizen && (
              <button
                type="button"
                onClick={onNavigateCitizen}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 rounded-lg transition"
                title="สลับไปยังหน้าจอแจ้งปัญหาสำหรับประชาชน / เจ้าหน้าที่ทั่วไป"
              >
                <span>หน้าแจ้งปัญหา (ผู้แจ้ง)</span>
              </button>
            )}

            {/* Create Ticket Button (Primary action for BMA/Admin) */}
            <button
              onClick={onOpenNewTicket}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg shadow-md shadow-blue-600/30 transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>แจ้งซ่อมใหม่ (กทม)</span>
            </button>
          </div>

        </div>

        {/* Mobile Role Switcher Bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => onChangeRole('BMA')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${
              currentRole === 'BMA' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            <Building2 className="w-3 h-3" /> กทม.
          </button>
          <button
            onClick={() => onChangeRole('FORTH')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${
              currentRole === 'FORTH' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            <Wrench className="w-3 h-3" /> Forth
          </button>
          <button
            onClick={() => onChangeRole('ADMIN')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${
              currentRole === 'ADMIN' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            <Shield className="w-3 h-3" /> Admin
          </button>
        </div>

      </div>
    </header>
  );
};
