import React, { useState, useMemo } from 'react';
import { X, FileSpreadsheet, Printer, Search } from 'lucide-react';
import type { Ticket, TicketStatus } from '../types/ticket';
import { APP_VERSION } from '../version';

interface CaseReportExportModalProps {
  tickets: Ticket[];
  isOpen: boolean;
  onClose: () => void;
  onSelectTicket: (ticket: Ticket) => void;
}

export const CaseReportExportModal: React.FC<CaseReportExportModalProps> = ({
  tickets,
  isOpen,
  onClose,
  onSelectTicket,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        searchTerm === '' ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.assetId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
      const matchCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
      const matchUrgency = selectedUrgency === 'ALL' || t.urgency === selectedUrgency;

      return matchSearch && matchStatus && matchCategory && matchUrgency;
    });
  }, [tickets, searchTerm, selectedStatus, selectedCategory, selectedUrgency]);

  if (!isOpen) return null;

  const exportToCSV = () => {
    const headers = [
      'Ticket ID',
      'สถานะ',
      'ระดับความเร่งด่วน',
      'หมวดหมู่',
      'รหัสทรัพย์สิน',
      'หัวข้อปัญหา',
      'สถานที่',
      'วันเวลาที่แจ้ง',
      'ผู้แจ้ง (กทม.)',
      'หน่วยงาน',
      'เบอร์โทรผู้แจ้ง',
      'ช่างผู้รับผิดชอบ (Forth)',
      'วันเวลาที่ซ่อมเสร็จ',
      'วันเวลาที่ปิดงาน (กทม.)',
      'คะแนนประเมิน (1-5)',
      'เลขที่รายงาน Forth',
    ];

    const rows = filteredTickets.map((t) => [
      `"${t.id}"`,
      `"${t.status}"`,
      `"${t.urgency}"`,
      `"${t.category}"`,
      `"${t.assetId}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.location.replace(/"/g, '""')}"`,
      `"${t.reportedAt}"`,
      `"${t.reportedBy.name}"`,
      `"${t.reportedBy.department}"`,
      `"${t.reportedBy.phone}"`,
      `"${t.forthAssignee?.name || '-'}"`,
      `"${t.resolutionDetails?.resolvedAt || '-'}"`,
      `"${t.bmaCloseDetails?.closedAt || '-'}"`,
      `"${t.bmaCloseDetails?.rating || '-'}"`,
      `"${t.reportSentDetails?.reportNumber || '-'}"`,
    ]);

    // UTF-8 BOM for Excel Thai support
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BMA_CM_Case_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'REPORTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">1. แจ้งในระบบ</span>;
      case 'ACCEPTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800">2. Forth รับงาน</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800">3. กำลังซ่อม</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-100 text-teal-800">4. แก้ไขเสร็จ</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">5. กทม ปิดงาน</span>;
      case 'REPORT_SENT':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-white">6. ส่ง Report แล้ว</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-5 text-white flex items-center justify-between no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-700/50 border border-emerald-500/40 text-emerald-100">
                ฟังก์ชัน: กทม. ดึง report เคสได้
              </span>
              <span className="text-xs text-emerald-200">CM Case Report & Analytics</span>
            </div>
            <h3 className="text-lg font-bold mt-1">รายงานสรุปรายการแจ้งซ่อม CM ทั้งหมด</h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              ค้นหา คัดกรอง และส่งออกรายงาน (Export CSV / Excel) สำหรับตรวจประเมิน
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              ส่งออก Excel / CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition"
            >
              <Printer className="w-4 h-4" />
              พิมพ์
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar (no-print) */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center gap-3 no-print text-xs">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาตามเลขเคส, หัวข้อ, สถานที่, Asset ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
            >
              <option value="ALL">สถานะทั้งหมด</option>
              <option value="REPORTED">1. แจ้งในระบบ</option>
              <option value="ACCEPTED">2. Forth รับงาน</option>
              <option value="IN_PROGRESS">3. กำลังซ่อม</option>
              <option value="RESOLVED">4. Forth ซ่อมเสร็จ</option>
              <option value="CLOSED">5. กทม ปิดงาน</option>
              <option value="REPORT_SENT">6. Forth ส่ง report แล้ว</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
            >
              <option value="ALL">หมวดหมู่ทั้งหมด</option>
              <option value="CCTV / กล้องวงจรปิด">CCTV</option>
              <option value="Traffic Light / สัญญาณไฟจราจร">Traffic Light</option>
              <option value="Smart Pole / เสาไฟอัจฉริยะ">Smart Pole</option>
              <option value="VMS / ป้ายจราจรอัจฉริยะ">VMS</option>
              <option value="Network / ระบบโครงข่ายสื่อสาร">Network</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none font-medium"
            >
              <option value="ALL">ความเร่งด่วนทั้งหมด</option>
              <option value="EMERGENCY">EMERGENCY (ฉุกเฉิน)</option>
              <option value="HIGH">HIGH (ด่วนสูง)</option>
              <option value="NORMAL">NORMAL (ปกติ)</option>
            </select>
          </div>

          <div className="text-slate-500 font-medium">
            พบทั้งหมด <strong className="text-slate-900">{filteredTickets.length}</strong> รายการ
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto flex-1 p-4">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
              <tr>
                <th className="p-2.5">เลขที่เคส</th>
                <th className="p-2.5">สถานะใน Flow</th>
                <th className="p-2.5">ความเร่งด่วน</th>
                <th className="p-2.5">หัวข้อ / ปัญหาที่แจ้ง</th>
                <th className="p-2.5">สถานที่</th>
                <th className="p-2.5">ผู้แจ้ง (กทม)</th>
                <th className="p-2.5">ช่าง Forth</th>
                <th className="p-2.5">วันที่แจ้ง</th>
                <th className="p-2.5 no-print text-center">ดูเคส</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    ไม่พบข้อมูลเคสแจ้งซ่อมตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="p-2.5 font-mono font-bold text-blue-700">{t.id}</td>
                    <td className="p-2.5">{getStatusBadge(t.status)}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.urgency === 'EMERGENCY'
                          ? 'bg-red-100 text-red-700'
                          : t.urgency === 'HIGH'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {t.urgency}
                      </span>
                    </td>
                    <td className="p-2.5 font-medium text-slate-800 max-w-[200px] truncate" title={t.title}>
                      {t.title}
                    </td>
                    <td className="p-2.5 text-slate-600 max-w-[180px] truncate" title={t.location}>
                      {t.location}
                    </td>
                    <td className="p-2.5 text-slate-600">{t.reportedBy.name}</td>
                    <td className="p-2.5 text-slate-600">{t.forthAssignee?.name || '-'}</td>
                    <td className="p-2.5 text-slate-500 whitespace-nowrap">{t.reportedAt.slice(0, 16)}</td>
                    <td className="p-2.5 no-print text-center">
                      <button
                        onClick={() => {
                          onSelectTicket(t);
                          onClose();
                        }}
                        className="px-2 py-1 text-[11px] bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium rounded transition"
                      >
                        เปิดดู
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between no-print">
          <span>รายงานเคสแจ้งซ่อมบำรุง CM กทม. x Forth Corporation • App v{APP_VERSION}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
