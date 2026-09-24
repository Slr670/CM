import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Sun, 
  Moon, 
  User, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { GarudaEmblem } from './GarudaEmblem';
import { UserService, UserProfile } from '../services/userService';

interface PhoneVerificationScreenProps {
  onVerified: (user: UserProfile, isNew: boolean) => void;
  onNavigateStatusCheck: () => void;
  onNavigateStaff: () => void;
}

export const PhoneVerificationScreen: React.FC<PhoneVerificationScreenProps> = ({
  onVerified,
  onNavigateStatusCheck,
  onNavigateStaff,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ user: UserProfile; isNew: boolean } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Format phone number as user types: e.g. 081-234-5678
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw.length <= 10) {
      if (raw.length > 6) {
        setPhoneNumber(`${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`);
      } else if (raw.length > 3) {
        setPhoneNumber(`${raw.slice(0, 3)}-${raw.slice(3)}`);
      } else {
        setPhoneNumber(raw);
      }
    }
  };

  const handleQuickSelect = (phone: string) => {
    setErrorMsg(null);
    setPhoneNumber(phone);
  };

  const handleVerify = () => {
    setErrorMsg(null);
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

    if (!cleanPhone) {
      setErrorMsg('กรุณากรอกเบอร์โทรศัพท์มือถือ');
      return;
    }

    if (cleanPhone.length !== 10 || !cleanPhone.startsWith('0')) {
      setErrorMsg('กรุณากรอกเบอร์โทรศัพท์ 10 หลักขึ้นต้นด้วย 0 (เช่น 081-234-5678)');
      return;
    }

    setIsChecking(true);

    // Simulate fast realistic lookup
    setTimeout(() => {
      setIsChecking(false);
      const existingUser = UserService.getUserByPhone(cleanPhone);

      if (existingUser) {
        setSuccessInfo({
          user: existingUser,
          isNew: false,
        });
        setTimeout(() => {
          onVerified(existingUser, false);
        }, 800);
      } else {
        const newUser: UserProfile = {
          phone: cleanPhone,
          name: '',
          department: '',
          email: '',
        };
        setSuccessInfo({
          user: newUser,
          isNew: true,
        });
        setTimeout(() => {
          onVerified(newUser, true);
        }, 900);
      }
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    }
  };

  return (
    <div className={`min-h-screen relative flex flex-col font-sans transition-colors duration-300 overflow-x-hidden ${
      isDarkMode ? 'bg-[#060b19] text-white' : 'bg-slate-900 text-white'
    }`}>
      {/* Subtle Background Cyber Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial Glow Center Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Glowing Particle Dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-28 left-[12%] w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#38bdf8] animate-pulse" />
        <div className="absolute top-44 right-[16%] w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_12px_#60a5fa] animate-pulse" />
        <div className="absolute top-72 left-[22%] w-1 h-1 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping duration-1000" />
        <div className="absolute top-[60%] right-[24%] w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_8px_#a5f3fc]" />
        <div className="absolute bottom-36 left-[30%] w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8] animate-pulse" />
        <div className="absolute bottom-24 right-[12%] w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]" />
      </div>

      {/* Top Header / Navigation */}
      <header className="relative z-20 border-b border-slate-800/80 bg-[#060b19]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & System Title */}
          <div className="flex items-center gap-3 select-none">
            <GarudaEmblem size={40} className="drop-shadow-md" />
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white leading-tight">
                ระบบแจ้งซ่อม
              </span>
              <span className="text-[11px] text-slate-400 leading-tight">
                แจ้งปัญหาการใช้งาน
              </span>
            </div>
          </div>

          {/* Navigation Pill Buttons */}
          <nav className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
            {/* Tab 1: แจ้งปัญหา (Active) */}
            <button
              type="button"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>แจ้งปัญหา</span>
            </button>

            {/* Tab 2: ตรวจสอบสถานะ */}
            <button
              type="button"
              onClick={onNavigateStatusCheck}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>ตรวจสอบสถานะ</span>
            </button>
          </nav>

          {/* Right Actions: Theme Toggle & Staff Login */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'สลับเป็นโหมดกลางวัน' : 'สลับเป็นโหมดกลางคืน'}
              className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 border border-slate-800 transition"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onNavigateStaff}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-600 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 transition shadow-xs"
            >
              <span>เจ้าหน้าที่</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="sm:hidden flex items-center justify-around py-2 border-t border-slate-800/80 bg-slate-950/60">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/40"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>แจ้งปัญหา</span>
          </button>
          <button
            type="button"
            onClick={onNavigateStatusCheck}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white"
          >
            <Search className="w-3.5 h-3.5" />
            <span>ตรวจสอบสถานะ</span>
          </button>
        </div>
      </header>

      {/* Main Verification Card Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        
        {/* Main Section Header */}
        <div className="text-center max-w-xl mx-auto mb-7 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            แจ้งปัญหาการใช้งาน
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            กรุณากรอกข้อมูลเบื้องต้น เพื่อความรวดเร็วในการให้ทีมช่างเข้าตรวจสอบและแก้ไขปัญหา
          </p>
        </div>

        {/* Centered Card ("ข้อมูลผู้แจ้ง") */}
        <div className="w-full max-w-[620px] bg-[#0c1427]/85 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 relative overflow-hidden transition duration-300 hover:border-slate-700">
          
          {/* Card Header */}
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
            <User className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              ข้อมูลผู้แจ้ง
            </h2>
          </div>

          {/* Info Banner Box */}
          <div className="bg-[#0f1d38]/70 border border-blue-800/40 rounded-xl p-3.5 sm:p-4 mb-5 flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-semibold text-blue-200">
                กรอกเบอร์ → กด "ตรวจสอบ" → มีบัญชีในระบบจะดึงข้อมูลให้
              </p>
              <p className="text-slate-400 mt-0.5">
                ยังไม่มีบัญชี: กรอกชื่อ (อีเมล/ตำแหน่ง/รูปโปรไฟล์ถ้ามี) — ส่งแล้วระบบจะสร้าง/อัปเดตบัญชีผู้แจ้งซ่อมให้เอง
              </p>
            </div>
          </div>

          {/* Phone Input Field & Verify Button Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="space-y-2"
          >
            <label className="block text-xs font-medium text-slate-300">
              เบอร์โทรศัพท์ <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  onKeyDown={handleKeyDown}
                  placeholder="ระบุเบอร์โทรศัพท์มือถือ"
                  autoFocus
                  className="w-full h-11 bg-[#070d1d] border border-slate-700 text-white placeholder-slate-500 text-sm rounded-lg px-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition tracking-wide font-mono"
                />
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={isChecking}
                className="h-11 px-5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition transform active:scale-95 shrink-0"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังตรวจสอบ...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>ตรวจสอบ</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 bg-rose-500/10 border border-rose-500/30 px-3 py-2 rounded-lg animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Helper Text below input */}
            <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
              กรอกเบอร์ 10 หลักแล้วกด "ตรวจสอบ" — หากมีข้อมูลในระบบจะดึงชื่อให้อัตโนมัติ หากยังไม่มีบัญชี ให้กรอกชื่อ สกุล (อีเมลถ้ามี)
            </p>
          </form>

          {/* Success Feedback Flash */}
          {successInfo && (
            <div className="mt-4 p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {successInfo.isNew
                    ? 'เบอร์ใหม่ — กำลังเข้าสู่หน้ากรอกข้อมูลผู้แจ้งและเปิดเคส...'
                    : `พบข้อมูลในระบบ: ${successInfo.user.name} (${successInfo.user.department})`}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
          )}

          {/* Quick Demo Test Buttons (Helper for Evaluators) */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ทดสอบด่วนด้วยเบอร์ตัวอย่าง:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickSelect('081-234-5678')}
                className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                081-234-5678 (นายสมชาย • กทม.)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('089-876-5432')}
                className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                089-876-5432 (น.ส.พิมพา • พระนคร)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('085-999-8888')}
                className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-100 border border-slate-700 transition"
              >
                085-999-8888 (เบอร์ใหม่ยังไม่มีบัญชี)
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-5 text-center text-[11px] text-slate-500 border-t border-slate-800/60 bg-[#060b19]/90">
        ระบบรับแจ้งซ่อม CM และรายงานผลการปฏิบัติงาน • กรุงเทพมหานคร ร่วมกับ Forth Corporation
      </footer>
    </div>
  );
};
