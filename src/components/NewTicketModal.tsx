import React, { useState } from 'react';
import { X, Send, MapPin, Building, Sparkles } from 'lucide-react';
import type { Ticket } from '../types/ticket';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    category: string;
    location: string;
    coordinates?: string;
    assetId: string;
    urgency: Ticket['urgency'];
    description: string;
    reportedByName: string;
    department: string;
    phone: string;
    email: string;
    photos: string[];
  }) => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('CCTV / กล้องวงจรปิด');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [assetId, setAssetId] = useState('');
  const [urgency, setUrgency] = useState<Ticket['urgency']>('HIGH');
  const [description, setDescription] = useState('');
  const [reportedByName, setReportedByName] = useState('นายสมชาย เจริญสุข');
  const [department, setDepartment] = useState('สำนักการจราจรและขนส่ง กทม.');
  const [phone, setPhone] = useState('02-354-1234');
  const [email, setEmail] = useState('somchai.j@bangkok.go.th');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80'
  ]);

  if (!isOpen) return null;

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
    if (!title.trim() || !location.trim()) {
      alert('กรุณากรอกหัวข้อปัญหาและสถานที่');
      return;
    }

    onSubmit({
      title,
      category,
      location,
      coordinates,
      assetId: assetId || `ASSET-${Date.now().toString().slice(-4)}`,
      urgency,
      description,
      reportedByName,
      department,
      phone,
      email,
      photos,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/30 border border-blue-400/40 text-blue-100">
                ขั้นตอนที่ 1 : กทม.
              </span>
              <span className="text-xs text-blue-200">ระบบรับแจ้งซ่อม CM</span>
            </div>
            <h3 className="text-lg font-bold mt-1">แจ้งซ่อมในระบบ (Create CM Ticket)</h3>
            <p className="text-xs text-blue-100 mt-0.5">
              เมื่อกดบันทึก ระบบจะส่งอีเมลแจ้งเตือนไปยังทีมช่าง Forth ทันที
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-blue-600/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Templates */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            ตัวอย่างเคสด่วน:
          </span>
          <button
            type="button"
            onClick={() => handleApplyTemplate('CCTV')}
            className="text-xs px-2.5 py-1 rounded bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 shadow-2xs transition"
          >
            กล้อง CCTV
          </button>
          <button
            type="button"
            onClick={() => handleApplyTemplate('TRAFFIC')}
            className="text-xs px-2.5 py-1 rounded bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 shadow-2xs transition"
          >
            ไฟจราจร
          </button>
          <button
            type="button"
            onClick={() => handleApplyTemplate('SMART_POLE')}
            className="text-xs px-2.5 py-1 rounded bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 shadow-2xs transition"
          >
            เสาไฟ Smart Pole
          </button>
          <button
            type="button"
            onClick={() => handleApplyTemplate('FIBER')}
            className="text-xs px-2.5 py-1 rounded bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 shadow-2xs transition"
          >
            สาย Fiber
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              หัวข้อปัญหา / รายการแจ้งซ่อม <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น กล้องวงจรปิดสี่แยกราชประสงค์ ดับ ไม่ส่งสัญญาณภาพ"
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                หมวดหมู่อุปกรณ์
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="CCTV / กล้องวงจรปิด">CCTV / กล้องวงจรปิด</option>
                <option value="Traffic Light / สัญญาณไฟจราจร">Traffic Light / สัญญาณไฟจราจร</option>
                <option value="Smart Pole / เสาไฟอัจฉริยะ">Smart Pole / เสาไฟอัจฉริยะ</option>
                <option value="VMS / ป้ายจราจรอัจฉริยะ">VMS / ป้ายจราจรอัจฉริยะ</option>
                <option value="Network / ระบบโครงข่ายสื่อสาร">Network / ระบบโครงข่ายสื่อสาร</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ระดับความเร่งด่วน (Urgency & SLA)
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Ticket['urgency'])}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
              >
                <option value="EMERGENCY" className="text-red-600 font-bold">EMERGENCY (ฉุกเฉินด่วนมาก - SLA 2 ชม.)</option>
                <option value="HIGH" className="text-amber-600 font-bold">HIGH (ด่วนสูง - SLA 6 ชม.)</option>
                <option value="NORMAL" className="text-slate-700 font-medium">NORMAL (ปกติ - SLA 24 ชม.)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Asset ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                รหัสทรัพย์สิน / หมายเลขเสา (Asset ID)
              </label>
              <input
                type="text"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                placeholder="เช่น BMA-CCTV-BKK-0492"
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
            </div>

            {/* GPS Coordinates */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                พิกัด GPS (ละติจูด, ลองจิจูด)
              </label>
              <input
                type="text"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                placeholder="เช่น 13.7443, 100.5404"
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              สถานที่เกิดเหตุ / จุดติดตั้ง <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="เช่น สี่แยกราชประสงค์ (เสาหมายเลข RP-04) แขวงลุมพินี เขตปทุมวัน"
                className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              รายละเอียดอาการเสีย / ปัญหาที่พบ
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุอาการอย่างละเอียด เพื่อให้ทีมช่าง Forth จัดเตรียมอะไหล่และอุปกรณ์ได้ตรงจุด..."
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Reporter Information (กทม) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              ข้อมูลเจ้าหน้าที่ผู้แจ้ง (กทม.)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={reportedByName}
                  onChange={(e) => setReportedByName(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">หน่วยงาน / สำนัก</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">เบอร์โทรศัพท์ติดต่อ</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">อีเมล (รับแจ้งเตือนเมื่อซ่อมเสร็จ)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ภาพถ่ายหน้างาน / จุดเกิดเหตุ (Before Photos)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="วาง URL รูปภาพ เช่น https://..."
                className="flex-1 text-xs px-3 py-1.5 rounded border border-slate-300"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded border border-slate-300 transition"
              >
                เพิ่มรูป
              </button>
            </div>
            
            {photos.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {photos.map((url, i) => (
                  <div key={i} className="relative group shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                    <img src={url} alt="Problem Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-500/20 transition"
            >
              <Send className="w-3.5 h-3.5" />
              บันทึกและส่งแจ้งเตือน Forth
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
