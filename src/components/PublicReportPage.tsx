import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  User, 
  Send, 
  FileText,
  Search,
  Sun,
  Moon,
  MapPin,
  Camera,
  Upload,
  UploadCloud,
  Trash2,
  Navigation
} from 'lucide-react';
import { GarudaEmblem } from './GarudaEmblem';
import { UserProfile, UserService } from '../services/userService';
import { TicketService } from '../services/ticketService';
import type { Ticket, UrgencyLevel } from '../types/ticket';
import { 
  THAI_PROVINCES, 
  PRESET_ORGANIZATIONS, 
  PRESET_STATIONS 
} from '../data/thaiLocations';
import { APP_VERSION } from '../version';

interface PublicReportPageProps {
  initialUser?: UserProfile | null;
  onNavigateStatusCheck: () => void;
  onNavigateStaff: () => void;
  onTicketCreated?: (ticket: Ticket) => void;
}

export const PublicReportPage: React.FC<PublicReportPageProps> = ({
  initialUser = null,
  onNavigateStatusCheck,
  onNavigateStaff,
  onTicketCreated,
}) => {
  // Theme state (Dark Navy Blue #0B132B / #0F172A default)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Section 1: Phone & Verification State
  const [phoneNumber, setPhoneNumber] = useState(initialUser?.phone || '');
  const [isVerified, setIsVerified] = useState(!!initialUser);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [verificationBadge, setVerificationBadge] = useState<{ isNew: boolean; text: string } | null>(
    initialUser ? { isNew: false, text: `ยืนยันแล้ว: ${initialUser.name}` } : null
  );

  // Section 1: Profile fields
  const [profileImage, setProfileImage] = useState<string | null>(initialUser?.avatarUrl || null);
  const [fullName, setFullName] = useState(initialUser?.name || '');
  const [email, setEmail] = useState(initialUser?.email || '');
  const [position, setPosition] = useState(initialUser?.position || '');
  const [department, setDepartment] = useState(initialUser?.department || '');
  const profileFileInputRef = useRef<HTMLInputElement | null>(null);

  // Section 2: Incident Location (Cascading Province / District / Subdistrict)
  const [province, setProvince] = useState('กรุงเทพมหานคร');
  const [district, setDistrict] = useState('เขตปทุมวัน');
  const [subdistrict, setSubdistrict] = useState('แขวงลุมพินี');
  const [locationOrg, setLocationOrg] = useState('สี่แยกราชประสงค์ ถ.พระราม 1');
  const [isCustomOrg, setIsCustomOrg] = useState(false);
  const [customOrgText, setCustomOrgText] = useState('');
  const [stationName, setStationName] = useState('สถานีตรวจการณ์ CCTV-BKK-0492 (แยกราชประสงค์)');
  const [isCustomStation, setIsCustomStation] = useState(false);
  const [customStationText, setCustomStationText] = useState('');
  const [coordinates, setCoordinates] = useState('13.7443, 100.5404');

  // Section 3: Issue Details
  const [urgency, setUrgency] = useState<UrgencyLevel>('HIGH');
  const [category, setCategory] = useState('CCTV / กล้องวงจรปิด');
  const [issueTitle, setIssueTitle] = useState('กล้อง CCTV สี่แยกราชประสงค์ ดับมืด ไม่ส่งสัญญาณภาพ');
  const [symptoms, setSymptoms] = useState('');
  const minDescLength = 10;
  const maxDescLength = 500;

  // Section 4: 3-Column Photo Upload Slots
  const [photoSlots, setPhotoSlots] = useState<(string | null)[]>([
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
    null,
    null,
  ]);
  const slotFileInputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  // Submission & Dialog
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);

  // Derived location lists
  const currentProvinceData = THAI_PROVINCES.find((p) => p.name === province) || THAI_PROVINCES[0];
  const availableDistricts = currentProvinceData.districts;
  const currentDistrictData = availableDistricts.find((d) => d.name === district) || availableDistricts[0];
  const availableSubdistricts = currentDistrictData?.subdistricts || [];

  // When province changes, reset district & subdistrict
  const handleProvinceChange = (newProv: string) => {
    setProvince(newProv);
    const pData = THAI_PROVINCES.find((p) => p.name === newProv);
    if (pData && pData.districts.length > 0) {
      const firstDist = pData.districts[0];
      setDistrict(firstDist.name);
      setSubdistrict(firstDist.subdistricts[0] || '');
    } else {
      setDistrict('');
      setSubdistrict('');
    }
  };

  // When district changes, reset subdistrict
  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const dData = availableDistricts.find((d) => d.name === newDist);
    if (dData && dData.subdistricts.length > 0) {
      setSubdistrict(dData.subdistricts[0]);
    } else {
      setSubdistrict('');
    }
  };

  // Auto-format phone input (08x-xxx-xxxx)
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneError(null);
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
    // If phone changed, reset verification
    if (isVerified && raw !== phoneNumber.replace(/[^0-9]/g, '')) {
      setIsVerified(false);
      setVerificationBadge(null);
    }
  };

  // Quick Demo Phone Select
  const handleQuickSelectPhone = (phoneStr: string) => {
    setPhoneNumber(phoneStr);
    setPhoneError(null);
    executeVerify(phoneStr);
  };

  // Execute Phone Verification
  const executeVerify = (inputPhone?: string) => {
    const target = inputPhone || phoneNumber;
    const clean = target.replace(/[^0-9]/g, '');

    if (!clean) {
      setPhoneError('กรุณากรอกเบอร์โทรศัพท์มือถือ');
      return;
    }
    if (clean.length !== 10 || !clean.startsWith('0')) {
      setPhoneError('กรุณากรอกเบอร์โทรศัพท์ 10 หลัก (ขึ้นต้นด้วย 0)');
      return;
    }

    setPhoneError(null);
    setIsCheckingPhone(true);

    setTimeout(() => {
      setIsCheckingPhone(false);
      const existingUser = UserService.getUserByPhone(clean);

      if (existingUser) {
        setIsVerified(true);
        setFullName(existingUser.name);
        setEmail(existingUser.email || '');
        setPosition(existingUser.position || '');
        setDepartment(existingUser.department || '');
        if (existingUser.avatarUrl) {
          setProfileImage(existingUser.avatarUrl);
        }
        setVerificationBadge({
          isNew: false,
          text: `พบข้อมูลในระบบ: ${existingUser.name}`,
        });
      } else {
        setIsVerified(true);
        setVerificationBadge({
          isNew: true,
          text: 'เบอร์ใหม่ — กรุณากรอกข้อมูลชื่อ สกุล เพื่อสร้างโปรไฟล์',
        });
      }
    }, 400);
  };

  // Profile Image Upload Handler
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ขนาดไฟล์รูปโปรไฟล์เกิน 5MB กรุณาเลือกรูปภาพขนาดเล็กลง');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfileImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Slot Image Upload Handler (Slots 1, 2, 3)
  const handleSlotImageChange = (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(`ขนาดไฟล์ของรูปที่ ${slotIndex + 1} เกิน 5MB กรุณาเลือกไฟล์ขนาดไม่เกิน 5MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const nextSlots = [...photoSlots];
        nextSlots[slotIndex] = event.target.result as string;
        setPhotoSlots(nextSlots);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSlotImage = (slotIndex: number) => {
    const nextSlots = [...photoSlots];
    nextSlots[slotIndex] = null;
    setPhotoSlots(nextSlots);
  };

  // Quick Problem Templates
  const applyTemplate = (type: 'CCTV' | 'TRAFFIC' | 'SMART_POLE' | 'FIBER') => {
    if (type === 'CCTV') {
      setCategory('CCTV / กล้องวงจรปิด');
      setIssueTitle('กล้องวงจรปิด CCTV ดับมืด ไม่ส่งสัญญาณภาพเข้าระบบ');
      setUrgency('HIGH');
      setStationName('สถานีตรวจการณ์ CCTV-BKK-0518 (แยกประตูน้ำ)');
      setLocationOrg('สี่แยกประตูน้ำ ถ.เพชรบุรีตัดใหม่');
      setSymptoms('กล้องตรวจการณ์ทิศทางมุ่งหน้าแยกราชประสงค์ ดับมืดสนิท ไม่สามารถหมุน PTZ ได้ ตรวจสอบไฟเลี้ยง Switch PoE พบสถานะไฟสีส้มดับ');
    } else if (type === 'TRAFFIC') {
      setCategory('Traffic Light / สัญญาณไฟจราจร');
      setIssueTitle('โคมไฟจราจรสีแดงฝั่งทิศเหนือชำรุดดับ สี่แยกคลองเตย');
      setUrgency('EMERGENCY');
      setStationName('สถานีสัญญาณไฟจราจร BMA-TL-KT-003 (สี่แยกคลองเตย)');
      setLocationOrg('สี่แยกคลองเตย ถ.พระราม 4');
      setSymptoms('โคมไฟสัญญาณสีแดงดับทำให้รถวิ่งสับสน เสี่ยงเกิดอุบัติเหตุรุนแรง มีเสียงกริ่งเตือนขัดข้องดังเป็นจังหวะที่ตู้ควบคุม');
    } else if (type === 'SMART_POLE') {
      setCategory('Smart Pole / เสาไฟอัจฉริยะ');
      setIssueTitle('เสาไฟ Smart Pole ไฟส่องสว่างดับและจอแสดงค่าฝุ่น PM2.5 ค้าง');
      setUrgency('NORMAL');
      setStationName('สถานีเสาไฟอัจฉริยะ Smart Pole BMA-SP-ARI-010 (ซอยอารีย์)');
      setLocationOrg('ปากซอยอารีย์ (พหลโยธิน 7)');
      setSymptoms('หลอดไฟ LED ด้านบนหัวเสาไม่ติดในเวลากลางคืน จอแสดงผลสภาพอากาศขึ้นหน้าจอ Error 404 ไม่ดึงข้อมูลเซนเซอร์');
    } else if (type === 'FIBER') {
      setCategory('Network / ระบบโครงข่ายสื่อสาร');
      setIssueTitle('สายสัญญาณเคเบิลใยแก้วนำแสงหย่อนยาน กีดขวางการจราจร');
      setUrgency('EMERGENCY');
      setStationName('สถานีเครือข่ายใยแก้วนำแสง BMA-FIBER-RAMA3-04 (ถ.พระราม 3)');
      setLocationOrg('ถนนพระราม 3 หน้าวัดด่าน');
      setSymptoms('สายเคเบิลหลักหลุดจากแคลมป์รัดเสา ห้อยหย่อนลงมาในระดับรถบรรทุกและรถเมล์ผ่านไม่ได้ เสี่ยงถูกเกี่ยวขาดทั้งแนว');
    }
  };

  // Form Submission
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Phone verification check
    if (!isVerified) {
      setFormError('กรุณากรอกเบอร์โทรศัพท์และกด "ตรวจสอบ" เพื่อยืนยันตัวตนก่อนส่งข้อมูล');
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    // 2. Full Name check
    if (!fullName.trim()) {
      setFormError('กรุณากรอก "ชื่อ-สกุล" ผู้แจ้ง');
      return;
    }

    // 3. Location checks
    if (!province.trim() || !district.trim()) {
      setFormError('กรุณาเลือกจังหวัดและอำเภอที่เกิดปัญหา');
      return;
    }

    const finalLocationOrg = isCustomOrg ? customOrgText.trim() : locationOrg.trim();
    if (!finalLocationOrg) {
      setFormError('กรุณาระบุสถานที่ / หน่วยงาน');
      return;
    }

    const finalStationName = isCustomStation ? customStationText.trim() : stationName.trim();
    if (!finalStationName) {
      setFormError('กรุณาระบุชื่อสถานี');
      return;
    }

    // 4. Symptoms check (Min 10, Max 500)
    if (symptoms.trim().length < minDescLength) {
      setFormError(`กรุณาระบุ "อาการที่พบ" อย่างน้อย ${minDescLength} ตัวอักษร (ปัจจุบันมี ${symptoms.trim().length} ตัวอักษร)`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

      // 1. Save or Update User Profile in local storage
      const savedUser = UserService.saveOrUpdateUser({
        phone: cleanPhone,
        name: fullName.trim(),
        department: department.trim() || finalLocationOrg,
        email: email.trim() || `${cleanPhone}@bangkok.go.th`,
        position: position.trim(),
        avatarUrl: profileImage || undefined,
      });

      // 2. Collect valid uploaded photos
      const validPhotos = photoSlots.filter((p): p is string => Boolean(p));

      // 3. Create Ticket in TicketService
      const fullLocationString = `${finalLocationOrg}, ${subdistrict ? `${subdistrict}, ` : ''}${district}, จังหวัด${province}`;

      const created = TicketService.createTicket({
        title: issueTitle.trim() || `แจ้งซ่อม ${category} (${finalStationName})`,
        category,
        location: fullLocationString,
        coordinates: coordinates.trim() || undefined,
        assetId: finalStationName,
        urgency,
        description: symptoms.trim(),
        reportedByName: savedUser.name,
        department: savedUser.department,
        phone: savedUser.phone,
        email: savedUser.email,
        photos: validPhotos.length > 0 ? validPhotos : [
          'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
        ],
      });

      setIsSubmitting(false);
      setCreatedTicket(created);
      if (onTicketCreated) {
        onTicketCreated(created);
      }
    }, 500);
  };

  return (
    <div className={`min-h-screen relative flex flex-col font-sans transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0B132B] text-slate-100' : 'bg-slate-900 text-white'
    }`}>
      
      {/* Background Cyber Grid Lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient Radial Glow */}
      <div className="absolute top-48 left-1/2 -translate-x-1/2 w-[750px] h-[550px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP NAVIGATION */}
      <header className="relative z-30 border-b border-slate-800/80 bg-[#0B132B]/85 backdrop-blur-md sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo / System Title */}
          <div className="flex items-center gap-3 select-none">
            <GarudaEmblem size={38} className="drop-shadow-md" />
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white leading-tight">
                ระบบแจ้งซ่อม
              </span>
              <span className="text-[11px] text-slate-400 leading-tight hidden sm:inline">
                แจ้งปัญหาการใช้งาน (Issue Reporting Portal)
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
            <button
              type="button"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition"
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

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'สลับโหมด' : 'สลับโหมด'}
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
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 flex-1 max-w-[880px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        
        {/* Page Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            แจ้งปัญหาการใช้งาน
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
            กรุณากรอกข้อมูลเบื้องต้น เพื่อความรวดเร็วในการให้ทีมช่างเข้าตรวจสอบและแก้ไขปัญหา
          </p>
        </div>

        {/* Global Error Notice */}
        {formError && (
          <div className="mb-6 p-4 rounded-xl border border-rose-500/40 bg-rose-950/40 text-rose-200 text-xs sm:text-sm flex items-start gap-3 animate-in shake duration-200">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-300">ไม่สามารถส่งข้อมูลได้</p>
              <p className="mt-0.5 leading-relaxed">{formError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitForm} className="space-y-6">

          {/* ============================================================== */}
          {/* SECTION 1: ข้อมูลผู้แจ้ง (Reporter Information) */}
          {/* ============================================================== */}
          <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl shadow-xl p-5 sm:p-7 relative overflow-hidden transition hover:border-slate-600/70">
            
            {/* Section Title */}
            <div className="flex items-center gap-2.5 pb-3 mb-5 border-b border-slate-700/70">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-wide">
                ข้อมูลผู้แจ้ง
              </h2>
            </div>

            {/* Info Callout Banner */}
            <div className="bg-[#0F172A]/80 border border-blue-800/40 rounded-xl p-4 mb-5 flex items-start gap-3">
              <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs leading-relaxed">
                <p className="font-semibold text-blue-200">
                  กรอกเบอร์ → กด "ตรวจสอบ" → มีบัญชีในระบบจะดึงข้อมูลให้
                </p>
                <p className="text-slate-400 mt-0.5">
                  ยังไม่มีบัญชี: กรอกชื่อ (อีเมล/ตำแหน่ง/รูปโปรไฟล์ถ้ามี) — ส่งแล้วระบบจะสร้าง/อัปเดตบัญชีผู้แจ้งซ่อมให้เอง
                </p>
              </div>
            </div>

            {/* Phone Input Row */}
            <div className="space-y-2 mb-6">
              <label className="block text-xs font-semibold text-slate-300">
                เบอร์โทรศัพท์ <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneInputChange}
                    placeholder="ระบุเบอร์โทรศัพท์มือถือ"
                    className="w-full h-11 bg-[#0F172A] border border-slate-700 text-white placeholder-slate-500 text-sm rounded-lg px-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono tracking-wider transition"
                  />
                  {isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3.5" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => executeVerify()}
                  disabled={isCheckingPhone}
                  className="h-11 px-5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition transform active:scale-95 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>{isCheckingPhone ? 'กำลังตรวจสอบ...' : 'ตรวจสอบ'}</span>
                </button>
              </div>

              {/* Phone Error Message */}
              {phoneError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{phoneError}</span>
                </div>
              )}

              {/* Helper text under phone */}
              <p className="text-[11px] text-slate-400 pt-0.5 leading-relaxed">
                กรอกเบอร์ 10 หลักแล้วกด "ตรวจสอบ" — หากมีข้อมูลในระบบจะดึงชื่อให้อัตโนมัติ หากยังไม่มีบัญชี ให้กรอกชื่อ สกุล (อีเมลถ้ามี)
              </p>

              {/* Quick sample chips */}
              <div className="flex items-center flex-wrap gap-2 pt-2">
                <span className="text-[11px] text-slate-500 font-medium">เบอร์ตัวอย่างทดสอบ:</span>
                <button
                  type="button"
                  onClick={() => handleQuickSelectPhone('081-234-5678')}
                  className="text-[11px] px-2.5 py-1 rounded bg-[#0F172A] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                >
                  081-234-5678 (นายสมชาย)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelectPhone('089-876-5432')}
                  className="text-[11px] px-2.5 py-1 rounded bg-[#0F172A] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                >
                  089-876-5432 (น.ส.พิมพา)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelectPhone('085-999-8888')}
                  className="text-[11px] px-2.5 py-1 rounded bg-[#0F172A] hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-slate-700 transition"
                >
                  085-999-8888 (เบอร์ใหม่)
                </button>
              </div>
            </div>

            {/* Verification Status Banner */}
            {verificationBadge && (
              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between mb-5 animate-in fade-in duration-300 ${
                verificationBadge.isNew
                  ? 'border-blue-500/40 bg-blue-950/40 text-blue-200'
                  : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span className="font-medium">{verificationBadge.text}</span>
                </div>
                <span className="text-[11px] opacity-75 hidden sm:inline">
                  {verificationBadge.isNew ? 'กรุณากรอกข้อมูลเพิ่มเติม' : 'ดึงข้อมูลสำเร็จ'}
                </span>
              </div>
            )}

            {/* User Profile Fields Grid (Revealed after verification) */}
            <div className={`pt-5 border-t border-slate-700/60 transition-all duration-300 ${
              isVerified ? 'opacity-100' : 'opacity-40 pointer-events-none'
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                
                {/* Left: Profile Picture Upload Thumbnail Area */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 bg-[#0F172A] border border-slate-700 rounded-xl text-center">
                  <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-slate-600 bg-slate-800 flex items-center justify-center shadow-inner mb-3">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <User className="w-12 h-12 text-slate-500" />
                    )}

                    {/* Camera overlay icon */}
                    <div 
                      onClick={() => profileFileInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition"
                    >
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span className="text-[10px]">เปลี่ยนรูป</span>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={profileFileInputRef}
                    accept="image/jpeg,image/png,image/webp,image/heic"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => profileFileInputRef.current?.click()}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-medium transition flex items-center gap-1.5 mb-1.5"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{profileImage ? 'เปลี่ยนรูปโปรไฟล์' : 'อัปโหลดรูปโปรไฟล์'}</span>
                  </button>

                  <p className="text-[10px] text-slate-400 leading-tight">
                    รองรับ JPG, PNG, WebP, HEIC ขนาดไม่เกิน 5MB
                  </p>
                </div>

                {/* Right: Two-Column Form Grid */}
                <div className="sm:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ชื่อ-สกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="ระบุชื่อ-นามสกุลจริง"
                      className="w-full h-10 bg-[#0F172A] border border-slate-700 rounded-lg px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      อีเมล (ถ้ามี)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="เช่น somchai@bangkok.go.th"
                      className="w-full h-10 bg-[#0F172A] border border-slate-700 rounded-lg px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ตำแหน่ง (ถ้ามี)
                    </label>
                    <input
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="เช่น นายช่างเครื่องกล, เจ้าพนักงานสื่อสาร"
                      className="w-full h-10 bg-[#0F172A] border border-slate-700 rounded-lg px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      หน่วยงาน / สังกัด (ถ้ามี)
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="เช่น สำนักการจราจรและขนส่ง กทม."
                      className="w-full h-10 bg-[#0F172A] border border-slate-700 rounded-lg px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* ============================================================== */}
          {/* SECTION 2: สถานที่เกิดปัญหา (Incident Location) */}
          {/* ============================================================== */}
          <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl shadow-xl p-5 sm:p-7 relative overflow-hidden transition hover:border-slate-600/70">
            
            {/* Section Title */}
            <div className="flex items-center gap-2.5 pb-3 mb-5 border-b border-slate-700/70">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <MapPin className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-wide">
                สถานที่เกิดปัญหา
              </h2>
            </div>

            {/* Two-Column Cascading Dropdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Province */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  จังหวัด <span className="text-red-500">*</span>
                </label>
                <select
                  value={province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full h-10 bg-[#0F172A] border border-slate-700 rounded-lg px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {THAI_PROVINCES.map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  อำเภอ / เขต <span className="text-red-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full h-10 bg-[#0F172A] border border-slate-700 rounded-lg px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {availableDistricts.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Subdistrict */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ตำบล / แขวง (ถ้ามี)
                </label>
                <select
                  value={subdistrict}
                  onChange={(e) => setSubdistrict(e.target.value)}
                  className="w-full h-10 bg-[#0F172A] border border-slate-700 rounded-lg px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {availableSubdistricts.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="">-- ไม่ระบุ / อื่นๆ --</option>
                </select>
              </div>

              {/* Coordinates / GPS */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  พิกัด GPS (ถ้ามี)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={coordinates}
                    onChange={(e) => setCoordinates(e.target.value)}
                    placeholder="เช่น 13.7443, 100.5404"
                    className="w-full h-10 bg-[#0F172A] border border-slate-700 rounded-lg px-3 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setCoordinates(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
                          },
                          () => {
                            setCoordinates('13.7500, 100.5400');
                          }
                        );
                      }
                    }}
                    title="ระบุตำแหน่งพิกัดปัจจุบัน"
                    className="absolute right-2 top-2 p-1 text-slate-400 hover:text-cyan-400 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Location / Organization */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    สถานที่ / หน่วยงาน <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomOrg(!isCustomOrg)}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    {isCustomOrg ? '← เลือกจากรายการที่พบบ่อย' : '+ พิมพ์สถานที่เอง'}
                  </button>
                </div>

                {isCustomOrg ? (
                  <input
                    type="text"
                    required
                    value={customOrgText}
                    onChange={(e) => setCustomOrgText(e.target.value)}
                    placeholder="พิมพ์ชื่อสถานที่ / ซอย / ถนน / อาคาร..."
                    className="w-full h-10 bg-[#0F172A] border border-slate-700 rounded-lg px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <select
                    value={locationOrg}
                    onChange={(e) => setLocationOrg(e.target.value)}
                    className="w-full h-10 bg-[#0F172A] border border-slate-700 rounded-lg px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {PRESET_ORGANIZATIONS.map((org) => (
                      <option key={org} value={org}>{org}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Station Name */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    ชื่อสถานี <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomStation(!isCustomStation)}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    {isCustomStation ? '← เลือกจากรายการสถานีมาตรฐาน' : '+ พิมพ์ชื่อสถานีเอง'}
                  </button>
                </div>

                {isCustomStation ? (
                  <input
                    type="text"
                    required
                    value={customStationText}
                    onChange={(e) => setCustomStationText(e.target.value)}
                    placeholder="พิมพ์ชื่อสถานี / รหัสเสา / จุดควบคุม..."
                    className="w-full h-10 bg-[#0F172A] border border-slate-700 rounded-lg px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <select
                    value={stationName}
                    onChange={(e) => setStationName(e.target.value)}
                    className="w-full h-10 bg-[#0F172A] border border-slate-700 rounded-lg px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {PRESET_STATIONS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                )}
              </div>

            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 3: รายละเอียดปัญหา (Issue Details) */}
          {/* ============================================================== */}
          <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl shadow-xl p-5 sm:p-7 relative overflow-hidden transition hover:border-slate-600/70">
            
            {/* Section Title */}
            <div className="flex items-center gap-2.5 pb-3 mb-5 border-b border-slate-700/70">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-wide">
                รายละเอียดปัญหา
              </h2>
            </div>

            {/* Quick Template Helper Buttons */}
            <div className="mb-4 pb-3 border-b border-slate-700/60 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ตัวอย่างเคสด่วน:
              </span>
              <button
                type="button"
                onClick={() => applyTemplate('CCTV')}
                className="text-xs px-2.5 py-1 rounded bg-[#0F172A] hover:bg-slate-800 text-cyan-300 border border-slate-700 transition"
              >
                กล้อง CCTV ดับ
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('TRAFFIC')}
                className="text-xs px-2.5 py-1 rounded bg-[#0F172A] hover:bg-slate-800 text-red-300 border border-slate-700 transition"
              >
                ไฟจราจรชำรุด
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('SMART_POLE')}
                className="text-xs px-2.5 py-1 rounded bg-[#0F172A] hover:bg-slate-800 text-amber-300 border border-slate-700 transition"
              >
                เสาไฟ Smart Pole
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('FIBER')}
                className="text-xs px-2.5 py-1 rounded bg-[#0F172A] hover:bg-slate-800 text-indigo-300 border border-slate-700 transition"
              >
                สาย Fiber ขาด/หย่อน
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Category & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ประเภทอุปกรณ์ / ระบบงาน
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 bg-[#0F172A] border border-slate-700 rounded-lg px-3 text-xs text-white focus:outline-none focus:border-blue-500"
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ระดับความเร่งด่วน
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setUrgency('EMERGENCY')}
                      className={`h-10 rounded-lg text-xs font-semibold border transition ${
                        urgency === 'EMERGENCY'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                          : 'bg-[#0F172A] border-slate-700 text-slate-400 hover:text-white'
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
                          : 'bg-[#0F172A] border-slate-700 text-slate-400 hover:text-white'
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
                          : 'bg-[#0F172A] border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      ปกติ (SLA 8ชม.)
                    </button>
                  </div>
                </div>
              </div>

              {/* Symptoms / Issue Description Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    อาการที่พบ <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-[11px] font-mono ${
                    symptoms.length < minDescLength
                      ? 'text-amber-400'
                      : symptoms.length > 450
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}>
                    {symptoms.length}/{maxDescLength} ตัวอักษร (ขั้นต่ำ {minDescLength})
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    maxLength={maxDescLength}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="ระบุรายละเอียดอาการที่พบ เช่น สัญญาณภาพดับมืด, เสียงผิดปกติ, ไฟสถานะเปลี่ยนเป็นสีแดง, โค้ดข้อผิดพลาดที่ปรากฏบนหน้าจอ เพื่อให้เจ้าหน้าที่เตรียมเครื่องมือและอะไหล่ได้ถูกต้อง..."
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 4: รูปภาพประกอบ (Photo Attachments - 3 Slots) */}
          {/* ============================================================== */}
          <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl shadow-xl p-5 sm:p-7 relative overflow-hidden transition hover:border-slate-600/70">
            
            {/* Section Title */}
            <div className="flex items-center gap-2.5 pb-3 mb-2 border-b border-slate-700/70">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Camera className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-wide">
                รูปภาพประกอบ
              </h2>
            </div>

            {/* Helper label */}
            <p className="text-xs text-slate-400 mb-5">
              ถ่ายรูปจุดที่เกิดปัญหา (ถ้ามี) — รองรับ JPG, PNG, WebP หรือ HEIC ไม่เกิน 5MB ต่อรูป
            </p>

            {/* 3-Column Upload Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[0, 1, 2].map((slotIndex) => {
                const photoUrl = photoSlots[slotIndex];
                return (
                  <div 
                    key={slotIndex}
                    className="flex flex-col bg-[#0F172A] border border-slate-700 rounded-xl overflow-hidden group hover:border-slate-600 transition"
                  >
                    {/* Slot Header Label */}
                    <div className="bg-slate-900/80 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">
                        รูปที่ {slotIndex + 1}
                      </span>
                      {photoUrl && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSlotImage(slotIndex)}
                          title="ลบรูปนี้"
                          className="text-slate-400 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Slot Content Body */}
                    <div className="p-4 flex-1 flex flex-col items-center justify-center min-h-[160px]">
                      {photoUrl ? (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-700">
                          <img 
                            src={photoUrl} 
                            alt={`Preview slot ${slotIndex + 1}`}
                            className="w-full h-full object-cover" 
                          />
                          <button
                            type="button"
                            onClick={() => slotFileInputRefs[slotIndex].current?.click()}
                            className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition text-xs font-medium"
                          >
                            <Upload className="w-4 h-4 mb-1" />
                            <span>เปลี่ยนรูป</span>
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => slotFileInputRefs[slotIndex].current?.click()}
                          className="w-full h-32 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/70 hover:bg-slate-900/60 transition p-3 text-center"
                        >
                          <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-1.5">
                            <Camera className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-slate-200 tracking-wider">
                            UPLOAD
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5">
                            คลิกเพื่อเลือกรูป
                          </span>
                        </div>
                      )}

                      <input
                        type="file"
                        ref={slotFileInputRefs[slotIndex]}
                        accept="image/jpeg,image/png,image/webp,image/heic"
                        onChange={(e) => handleSlotImageChange(slotIndex, e)}
                        className="hidden"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ============================================================== */}
          {/* SUBMIT BUTTON */}
          {/* ============================================================== */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-13 rounded-xl text-base font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition transform active:scale-[0.99] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>กำลังส่งข้อมูลแจ้งปัญหา...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ส่งข้อมูลแจ้งปัญหา</span>
                </>
              )}
            </button>
          </div>

        </form>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#0B132B]/90 py-5 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            © 2026 ระบบแจ้งซ่อม
          </div>
          <div>
            กรุงเทพมหานคร ร่วมกับ Forth Corporation • เวอร์ชัน <strong className="text-slate-200 font-mono">v{APP_VERSION}</strong>
          </div>
        </div>
      </footer>

      {/* TICKET CREATED SUCCESS DIALOG */}
      {createdTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl p-6 sm:p-7 text-center animate-in zoom-in-95 duration-200 text-white">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">บันทึกการแจ้งซ่อมสำเร็จ!</h3>
            <p className="text-xs text-slate-400 mt-1">
              ระบบได้รับข้อมูลและส่งอีเมลแจ้งเตือนไปยังทีมช่าง Forth เรียบร้อยแล้ว
            </p>

            <div className="my-5 p-4 rounded-xl bg-[#0F172A] border border-slate-700/80 text-left text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
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
                  setSymptoms('');
                  setPhotoSlots([null, null, null]);
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

    </div>
  );
};
