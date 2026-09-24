import React, { useState } from 'react';
import { X, Mail, ArrowRight } from 'lucide-react';
import type { EmailNotification } from '../types/ticket';

interface EmailSimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  emails: EmailNotification[];
  onMarkAsRead: (id: string) => void;
  onSelectTicketById: (ticketId: string) => void;
}

export const EmailSimulatorDrawer: React.FC<EmailSimulatorDrawerProps> = ({
  isOpen,
  onClose,
  emails,
  onMarkAsRead,
  onSelectTicketById,
}) => {
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(emails[0] || null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-400 border border-blue-500/30">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">กล่องข้อความอีเมลแจ้งเตือน (Email Simulator)</h3>
              <p className="text-[11px] text-slate-400">
                จำลองอีเมลอัตโนมัติตาม Flowchart ในระบบ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two-pane layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Email List Sidebar */}
          <div className="w-full md:w-5/12 border-r border-slate-200 overflow-y-auto bg-slate-50 p-2 space-y-2">
            <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              อีเมลที่ถูกส่ง ({emails.length})
            </div>

            {emails.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                ยังไม่มีรายการอีเมลส่งออก
              </div>
            ) : (
              emails.map((em) => (
                <button
                  key={em.id}
                  onClick={() => {
                    setSelectedEmail(em);
                    onMarkAsRead(em.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    selectedEmail?.id === em.id
                      ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      em.type === 'TO_FORTH_NEW_TICKET'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {em.type === 'TO_FORTH_NEW_TICKET' ? '→ ถึง Forth (งานใหม่)' : '→ ถึง กทม (ซ่อมเสร็จ)'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {em.sentAt.slice(11, 16)} น.
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 truncate mb-1">
                    {em.subject}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {em.previewText}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Email Preview Pane */}
          <div className="flex-1 overflow-y-auto p-4 bg-white flex flex-col justify-between">
            {selectedEmail ? (
              <div>
                {/* Meta details */}
                <div className="border-b border-slate-200 pb-3 mb-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{selectedEmail.subject}</h4>
                    <button
                      onClick={() => {
                        onSelectTicketById(selectedEmail.ticketId);
                        onClose();
                      }}
                      className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
                    >
                      เปิดเคส {selectedEmail.ticketId} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p><span className="text-slate-500">ถึง (To):</span> <strong className="text-slate-800">{selectedEmail.toName}</strong> &lt;{selectedEmail.to}&gt;</p>
                  <p><span className="text-slate-500">วันที่ส่ง:</span> {selectedEmail.sentAt}</p>
                </div>

                {/* HTML Body Render */}
                <div
                  className="email-rendered-content text-xs"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.htmlContent }}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                เลือกอีเมลทางซ้ายมือเพื่อดูเนื้อหา
              </div>
            )}

            {/* Note */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
              <span>* จำลองการทำงานของ Email Notification Server</span>
              <span>พร้อมเชื่อมต่อ SMTP / Webhook สำหรับใช้งานจริง</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
