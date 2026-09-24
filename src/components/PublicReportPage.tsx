import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  User, 
  Send, 
  ArrowLeft, 
  X, 
  ShieldCheck, 
  FileText,
  Search,
  Sun,
  Moon
} from 'lucide-react';
import { GarudaEmblem } from './GarudaEmblem';
import { UserProfile, UserService } from '../services/userService';
import { TicketService } from '../services/ticketService';
import type { Ticket, UrgencyLevel } from '../types/ticket';

interface PublicReportPageProps {
  user: UserProfile;
  isNewUser: boolean;
  onBackToVerification: () => void;
  onNavigateStatusCheck: () => void;
  onNavigateStaff: () => void;
  onTicketCreated: (ticket: Ticket) => void;
}

export const PublicReportPage: React.FC<PublicReportPageProps> = ({
  user,
  isNewUser,
  onBackToVerification,
  onNavigateStatusCheck,
  onNavigateStaff,
  onTicketCreated,
}) => {
  // Reporter details
  const [reporterName, setReporterName] = useState(user.name || '');
  const [department, setDepartment] = useState(user.department || '');
  const [email, setEmail] = useState(user.email || '');
  const [position, setPosition] = useState(user.position || '');

  // Issue details
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('CCTV / กล้องวงจรปิด');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [assetId, setAssetId] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('HIGH');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
  ]);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Quick Template Helper
  const handleApplyTemplate = (type: 'CCTV' | 'TRAFFIC' | 'SMART_POLE' | 'FIBER') => {
    if (type === 'CCTV') {
      setTitle('กล้องวงจรปิด CCTV ดับมืด ไม่ส่งสัญญาณภาพเข้าระบบ');
      setCategory('CCTV / กล้องวงจรปิด');
      setAssetId('BMA-CCTV-BKK-0518');
      setLocation('สี่แยกประตูน้ำ ถนนเพชรบุรีตัดใหม่ แขวงถนนพญาไท เขตราชเทวี กรุงเทพฯ');
      setCoordinates('13.7501, 100.5401');
      setUrgency('HIGH');
      setDescription('กล้องตรวจการณ์ตัวที่ 2 หมุนไม่ได้และภาพสัญญาณขาดหาย ตรวจสอบ Switch PoE ที่ตู้ควบคุมไฟไม่ติด');
    } else if (type === 'TRAFFIC') {
      setTitle('โคมไฟจราจรสีแดงฝั่งทิศเหนือชำรุดดับ สี่แยกคลองเตย');
      setCategory('Traffic Light / สัญญาณไฟจราจร');
      setAssetId('BMA-TL-KT-003');
      setLocation('สี่แยกคลองเตย ถนนพระราม 4 ตัดถนนรัชดาภิเษก เขตคลองเตย กรุงเทพฯ');
      setCoordinates('13.7198, 100.5592');
      setUrgency('EMERGENCY');
      setDescription('ไฟแดงสัญญาณดับทำให้เกิดความสับสนในการเดินรถ เสี่ยงเกิดอุบัติเหตุรุนแรง ต้องการช่างเข้าซ่อมด่วน');
    } else if (type === 'SMART_POLE') {
      setTitle('เสาไฟ Smart Pole ไฟส่องสว่างดับและจอแสดงค่าฝุ่น PM2.5 ค้าง');
      setCategory('Smart Pole / เสาไฟอัจฉริยะ');
      setAssetId('BMA-SP-ARI-010');
      setLocation('ปากซอยอารีย์ (พหลโยธิน 7) แขวงพญาไท เขตพญาไท กรุงเทพฯ');
      setCoordinates('13.7797, 100.5448');
      setUrgency('NORMAL');
      setDescription('โคมไฟ LED หัวเสาไม่ติดในเวลากลางคืน และหน้าจอแสดงผลสภาพอากาศขึ้น Error 404');
    } else if (type === 'FIBER') {
      setTitle('สายสัญญาณเคเบิลใยแก้วนำแสงหย่อนยาน กีดขวางการจราจร');
      setCategory('Network / ระบบโครงข่ายสื่อสาร');
      setAssetId('BMA-FIBER-RAMA3-04');
      setLocation('ถนนพระราม 3 หน้าวัดด่าน แขวงบางโพงพาง เขตยานนาวา กรุงเทพฯ');
      setCoordinates('13.6823, 100.5432');
      setUrgency('EMERGENCY');
      setDescription('สายเคเบิลสื่อสารหลักหลุดจากเสาพาดสาย ตกหย่อนลงมาในระดับรถบรรทุกผ่านไม่ได้ เสี่ยงถูกเกี่ยวขาด');
    }
  };

  const handleAddPhoto = () => {
    if (photoUrl.trim()) {
      setPhotos([...photos, photoUrl.trim()]);
      setPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!reporterName.trim()) {
      setErrorMsg('กรุณากรอกชื่อ-นามสกุลผู้แจ้ง');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('กรุณากรอกหัวข้อปัญหาที่พบ');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('กรุณากรอกสถานที่เกิดเหตุหรือจุดติดตั้ง');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // 1. Save / Update User Profile
      const updatedUser = UserService.saveOrUpdateUser({
        phone: user.phone,
        name: reporterName.trim(),
        department: department.trim() || 'หน่วยงานทั่วไป / ประชาชน',
        email: email.trim() || `${user.phone}@bangkok.go.th`,
        position: position.trim(),
      });

      // 2. Create CM Repair Ticket
      const ticket = TicketService.createTicket({
        title: title.trim(),
        category,
        location: location.trim(),
        coordinates: coordinates.trim() || undefined,
        assetId: assetId.trim() || `ASSET-${Date.now().toString().slice(-4)}`,
        urgency,
        description: description.trim(),
        reportedByName: updatedUser.name,
        department: updatedUser.department,
        phone: updatedUser.phone,
        email: updatedUser.email,
        photos,
      });

      setIsSubmitting(false);
      setCreatedTicket(ticket);
      onTicketCreated(ticket);
    }, 400);
  };

  return (
    <div className={`min-h-screen relative flex flex-col font-sans transition-colors duration-300 ${
      isDarkMode ? 'bg-[#060b19] text-white' : 'bg-slate-900 text-white'
    }`}>
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top Header */}
      <header className="relative z-20 border-b border-slate-800/80 bg-[#060b19]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            onClick={onBackToVerification}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
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

          <nav className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl p-1">
            <button
              type="button"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/50"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>แจ้งปัญหา</span>
            </button>
            <button
              type="button"
              onClick={onNavigateStatusCheck}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>ตรวจสอบสถานะ</span>
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 border border-slate-800 transition"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onNavigateStaff}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 bg-slate-800/60 hover:bg-slate-800 transition"
            >
              <span>เจ้าหน้าที่</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onBackToVerification}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>เปลี่ยนเบอร์โทรศัพท์</span>
          </button>

          {/* Verified Phone Chip */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>เบอร์โทรยืนยันแล้ว: <strong>{user.phone}</strong></span>
          </div>
        </div>

        {/* Welcome Status Banner */}
        {isNewUser ? (
          <div className="mb-6 p-4 rounded-xl border border-blue-500/40 bg-blue-950/40 text-blue-200 text-xs flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">ยินดีต้อนรับผู้แจ้งรายใหม่!</p>
              <p className="text-slate-300 mt-0.5">
                เบอร์โทรศัพท์ของคุณได้รับการยืนยันแล้ว กรุณากรอกชื่อและหน่วยงานด้านล่าง ระบบจะบันทึกโปรไฟล์ผู้แจ้งให้อัตโนมัติเมื่อส่งเรื่อง
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>ดึงข้อมูลผู้แจ้งในระบบเรียบร้อย: <strong className="text-white">{user.name}</strong> ({user.department})</span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">* สามารถปรับปรุงข้อมูลก่อนส่งได้</span>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-[#0c1427]/85 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Card Top Title Banner */}
          <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/40">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              แบบฟอร์มแจ้งปัญหาการใช้งาน (Create CM Ticket)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              กรอกรายละเอียดปัญหาเพื่อส่งต่อให้ศูนย์ควบคุมและทีมช่าง Forth เข้าดำเนินการตาม SLA
            </p>

            {/* Quick Templates */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ตัวอย่างเคสด่วน:
              </span>
              <button
                type="button"
                onClick={() => handleApplyTemplate('CCTV')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
              >
                กล้อง CCTV ดับ
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('TRAFFIC')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-red-300 border border-slate-700 transition"
              >
                ไฟจราจรชำรุด
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('SMART_POLE')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
              >
                เสาไฟ Smart Pole
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('FIBER')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition"
              >
                สาย Fiber ขาด/หย่อน
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
            
            {/* Section 1: Reporter Info */}
            <div className="bg-[#091021] p-4 sm:p-5 rounded-xl border border-slate-800/80 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 tracking-wide">
                <User className="w-4 h-4" />
                <span>ข้อมูลผู้แจ้งซ่อม (Reporter Profile)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="เช่น นายสมชาย เจริญสุข"
                    className="w-full h-10 bg-[#060b18] border border-slate-700 rounded-lg px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    หน่วยงาน / สังกัด
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="เช่น สำนักการจราจรและขนส่ง กทม."
                    className="w-full h-10 bg-[#060b18] border border-slate-700 rounded-lg px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    เบอร์โทรศัพท์ (ยืนยันแล้ว)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      value={user.phone}
                      className="w-full h-10 bg-slate-900/60 border border-slate-800 text-slate-400 rounded-lg px-3 text-xs cursor-not-allowed font-mono"
                    />
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    อีเมล (รับแจ้งเตือนเมื่อซ่อมเสร็จ)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="เช่น name@bangkok.go.th"
                    className="w-full h-10 bg-[#060b18] border border-slate-700 rounded-lg px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ตำแหน่ง / บทบาท (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="เช่น นายช่างเครื่องกล, เจ้าพนักงานสื่อสาร, ประชาชน"
                    className="w-full h-10 bg-[#060b18] border border-slate-700 rounded-lg px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Problem Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 tracking-wide">
                <FileText className="w-4 h-4" />
                <span>รายละเอียดปัญหาและอาการเสีย</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  หัวข้อแจ้งปัญหา / สรุปอาการ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น กล้องวงจรปิดดับมืด สี่แยกราชประสงค์ หรือ ไฟจราจรดับ"
                  className="w-full h-11 bg-[#091021] border border-slate-700 rounded-lg px-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ประเภทอุปกรณ์ / หมวดหมู่
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 bg-[#091021] border border-slate-700 rounded-lg px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="CCTV / กล้องวงจรปิด">CCTV / กล้องวงจรปิด</option>
                    <option value="Traffic Light / สัญญาณไฟจราจร">Traffic Light / สัญญาณไฟจราจร</option>
                    <option value="Smart Pole / เสาไฟอัจฉริยะ">Smart Pole / เสาไฟอัจฉริยะ</option>
                    <option value="VMS / ป้ายจราจรอัจฉริยะ">VMS / ป้ายจราจรอัจฉริยะ</option>
                    <option value="Network / ระบบโครงข่ายสื่อสาร">Network / ระบบโครงข่ายสื่อสาร</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ระดับความเร่งด่วน
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setUrgency('EMERGENCY')}
                      className={`h-10 rounded-lg text-xs font-semibold border transition ${
                        urgency === 'EMERGENCY'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      ด่วนที่สุด (SLA 2ชม.)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgency('HIGH')}
                      className={`h-10 rounded-lg text-xs font-semibold border transition ${
                        urgency === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      เร่งด่วน (SLA 4ชม.)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgency('NORMAL')}
                      className={`h-10 rounded-lg text-xs font-semibold border transition ${
                        urgency === 'NORMAL'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      ปกติ (SLA 8ชม.)
                    </button>
                  </div>
                </div>
              </div>

              {/* Location & Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    สถานที่เกิดเหตุ / จุดติดตั้ง <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="เช่น สี่แยกราชประสงค์ ถ.พระราม 1 เขตปทุมวัน"
                    className="w-full h-10 bg-[#091021] border border-slate-700 rounded-lg px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    พิกัด GPS (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    value={coordinates}
                    onChange={(e) => setCoordinates(e.target.value)}
                    placeholder="เช่น 13.7443, 100.5404"
                    className="w-full h-10 bg-[#091021] border border-slate-700 rounded-lg px-3 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  รายละเอียดอาการเสีย / ปัญหาที่สังเกตพบ
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ระบุอาการชำรุด หรือข้อมูลเพิ่มเติมเพื่อให้ช่างจัดเตรียมอะไหล่ได้ตรงจุด..."
                  className="w-full bg-[#091021] border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Photo Attachments */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  ภาพถ่ายหน้างาน / อาการเสีย (Before Photos)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="ใส่ URL รูปภาพหน้างาน เช่น https://..."
                    className="flex-1 h-10 bg-[#091021] border border-slate-700 rounded-lg px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-4 h-10 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
                  >
                    เพิ่มรูปภาพ
                  </button>
                </div>

                {photos.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 pt-1">
                    {photos.map((url, i) => (
                      <div key={i} className="relative group shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-slate-700">
                        <img src={url} alt="Problem preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(i)}
                          className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onBackToVerification}
                className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
              >
                ยกเลิก / ย้อนกลับ
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-lg shadow-lg shadow-blue-600/30 transition flex items-center gap-2 transform active:scale-95"
              >
                {isSubmitting ? (
                  <span>กำลังส่งข้อมูลเข้าระบบ...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ยืนยันและส่งเรื่องแจ้งซ่อม</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </main>

      {/* Ticket Created Success Modal */}
      {createdTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c1427] border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 sm:p-7 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">บันทึกการแจ้งซ่อมสำเร็จ!</h3>
            <p className="text-xs text-slate-400 mt-1">
              ระบบได้รับข้อมูลและส่งอีเมลแจ้งเตือนงานด่วนไปยังทีมช่าง Forth เรียบร้อยแล้ว
            </p>

            <div className="my-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">เลขที่เคสแจ้งซ่อม:</span>
                <span className="font-mono text-sm font-bold text-cyan-400">{createdTicket.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">หัวข้อ:</span>
                <span className="text-white font-medium truncate max-w-[240px]">{createdTicket.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">สถานที่:</span>
                <span className="text-slate-300 truncate max-w-[240px]">{createdTicket.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">ผู้แจ้ง:</span>
                <span className="text-slate-300">{createdTicket.reportedBy.name} ({createdTicket.reportedBy.phone})</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setCreatedTicket(null);
                  onNavigateStatusCheck();
                }}
                className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
              >
                ติดตามสถานะเคสนี้
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreatedTicket(null);
                  setTitle('');
                  setLocation('');
                  setDescription('');
                }}
                className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                แจ้งซ่อมเคสใหม่
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreatedTicket(null);
                  onNavigateStaff();
                }}
                className="py-2.5 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition"
              >
                ไปหน้าเจ้าหน้าที่
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-5 text-center text-[11px] text-slate-500 border-t border-slate-800/60 bg-[#060b19]/90">
        ระบบรับแจ้งซ่อม CM และรายงานผลการปฏิบัติงาน • กรุงเทพมหานคร ร่วมกับ Forth Corporation
      </footer>
    </div>
  );
};
