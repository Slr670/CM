import { Ticket, EmailNotification } from '../types/ticket';

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'CM-2026-001',
    title: 'กล้อง CCTV สี่แยกราชประสงค์ ดับ ไม่ส่งสัญญาณภาพเข้าศูนย์ควบคุม',
    category: 'CCTV / กล้องวงจรปิด',
    location: 'สี่แยกราชประสงค์ (เสาหมายเลข RP-04) แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ',
    coordinates: '13.7443, 100.5404',
    assetId: 'BMA-CCTV-BKK-0492',
    urgency: 'EMERGENCY',
    description: 'กล้องวงจรปิดจับภาพทิศทางถนนพระราม 1 ดับมืดสนิท ตรวจสอบระบบเครือข่ายศูนย์ควบคุมแจ้งเตือน Offline ตั้งแต่เวลา 07:30 น.',
    reportedBy: {
      name: 'นายสมชาย เจริญสุข',
      department: 'สำนักการจราจรและขนส่ง กทม.',
      phone: '02-354-1234 ต่อ 102',
      email: 'somchai.j@bangkok.go.th',
    },
    reportedAt: '2026-09-24 08:15:00',
    photos: [
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'REPORTED',
    workLogs: [
      {
        id: 'log-1',
        timestamp: '2026-09-24 08:15:00',
        author: 'นายสมชาย เจริญสุข (กทม.)',
        role: 'BMA',
        status: 'REPORTED',
        note: 'เปิดแจ้งซ่อม CM ในระบบ และส่งอีเมลแจ้งเตือนไปยังทีมช่าง Forth อัตโนมัติ',
      },
    ],
  },
  {
    id: 'CM-2026-002',
    title: 'สัญญาณไฟกระพริบชำรุด ทางข้ามม้าลายหน้า รร.สวนกุหลาบวิทยาลัย',
    category: 'Traffic Light / สัญญาณไฟจราจร',
    location: 'ถนนตรีเพชร แขวงวังบูรพาภิรมย์ เขตพระนคร กรุงเทพฯ',
    coordinates: '13.7431, 100.4998',
    assetId: 'BMA-TL-SK-012',
    urgency: 'HIGH',
    description: 'โคมไฟคนข้ามถนนสีเหลืองกระพริบดับ 1 ข้าง ทำให้รถไม่ชะลอความเร็ว เสี่ยงเกิดอุบัติเหตุต่อนักเรียน',
    reportedBy: {
      name: 'นางสาวพิมพา พรทิพย์',
      department: 'ฝ่ายโยธา สำนักงานเขตพระนคร',
      phone: '02-221-5678',
      email: 'pimpa.p@bangkok.go.th',
    },
    reportedAt: '2026-09-23 14:20:00',
    photos: [
      'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'ACCEPTED',
    forthAssignee: {
      name: 'นายเกียรติศักดิ์ ช่างทอง',
      phone: '081-456-7890',
      team: 'Forth Mobile Maintenance Unit 3',
    },
    acceptedAt: '2026-09-23 14:45:00',
    estimatedFinish: '2026-09-24 12:00:00',
    workLogs: [
      {
        id: 'log-2a',
        timestamp: '2026-09-23 14:20:00',
        author: 'นางสาวพิมพา พรทิพย์ (กทม.)',
        role: 'BMA',
        status: 'REPORTED',
        note: 'เปิดแจ้งซ่อมในระบบ ส่งอีเมลแจ้งเตือน Forth',
      },
      {
        id: 'log-2b',
        timestamp: '2026-09-23 14:45:00',
        author: 'นายเกียรติศักดิ์ ช่างทอง (Forth)',
        role: 'FORTH',
        status: 'ACCEPTED',
        note: 'Forth รับงานเรียบร้อย มอบหมายชุดเคลื่อนที่เร็ว Unit 3 เข้าตรวจสอบและเตรียมอะไหล่โมดูลไฟ LED',
      },
    ],
  },
  {
    id: 'CM-2026-003',
    title: 'ป้าย VMS อัจฉริยะ แสดงผลภาพล้มและตัวอักษรขาดหาย แยกอโศก',
    category: 'VMS / ป้ายจราจรอัจฉริยะ',
    location: 'ถนนสุขุมวิท มุ่งหน้าแยกอโศกมนตรี แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ',
    coordinates: '13.7371, 100.5603',
    assetId: 'BMA-VMS-ASOKE-01',
    urgency: 'NORMAL',
    description: 'แถบ LED แนวนอนบรรทัดที่ 2 และ 3 ดับ ข้อมูลแจ้งสภาพการจราจรอ่านไม่ได้',
    reportedBy: {
      name: 'นายธีรภัทร ชาญวิทย์',
      department: 'ศูนย์ควบคุมการจราจร กทม.',
      phone: '02-354-6789',
      email: 'theerapat.c@bangkok.go.th',
    },
    reportedAt: '2026-09-23 10:00:00',
    photos: [
      'https://images.unsplash.com/photo-1508873696983-2df570464756?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'IN_PROGRESS',
    forthAssignee: {
      name: 'นายมนัส สิทธิชัย',
      phone: '089-112-3344',
      team: 'Forth Display Engineering Team',
    },
    acceptedAt: '2026-09-23 10:30:00',
    estimatedFinish: '2026-09-24 17:00:00',
    workLogs: [
      {
        id: 'log-3a',
        timestamp: '2026-09-23 10:00:00',
        author: 'นายธีรภัทร ชาญวิทย์ (กทม.)',
        role: 'BMA',
        status: 'REPORTED',
        note: 'เปิดแจ้งซ่อมในระบบ ส่งอีเมลแจ้งเตือน Forth',
      },
      {
        id: 'log-3b',
        timestamp: '2026-09-23 10:30:00',
        author: 'นายมนัส สิทธิชัย (Forth)',
        role: 'FORTH',
        status: 'ACCEPTED',
        note: 'Forth รับงานและเบิกอุปกรณ์ LED Driver Card จากคลังสินค้า',
      },
      {
        id: 'log-3c',
        timestamp: '2026-09-23 15:30:00',
        author: 'นายมนัส สิทธิชัย (Forth)',
        role: 'FORTH',
        status: 'IN_PROGRESS',
        note: 'Forth อัพเดทสถานะ: ทีมงานเข้าตรวจหน้างานด้วยรถกระเช้า พบว่าสาย Ribbon Cable หลวมและ Power Supply เสื่อมสภาพ กำลังดำเนินการเปลี่ยนใหม่',
      },
    ],
  },
  {
    id: 'CM-2026-004',
    title: 'เสาไฟ Smart Pole ปุ่มแจ้งเหตุฉุกเฉิน SOS ไม่ตอบสนอง สวนลุมพินี',
    category: 'Smart Pole / เสาไฟอัจฉริยะ',
    location: 'ภายในสวนลุมพินี บริเวณริมสระน้ำ ประตู 3 แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ',
    coordinates: '13.7314, 100.5415',
    assetId: 'BMA-SP-LUMP-007',
    urgency: 'HIGH',
    description: 'ทดสอบกดปุ่ม SOS แล้วไม่มีสัญญาณเสียงและไฟไซเรนไม่ทำงาน จำเป็นต้องแก้ไขเพื่อความปลอดภัยของประชาชน',
    reportedBy: {
      name: 'นายวิชัย สุวรรณโชติ',
      department: 'สำนักสิ่งแวดล้อม กทม. (ส่วนดูแลสวนสาธารณะ)',
      phone: '02-245-5555',
      email: 'wichai.s@bangkok.go.th',
    },
    reportedAt: '2026-09-22 09:00:00',
    photos: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'RESOLVED',
    forthAssignee: {
      name: 'นายอัครเดช รุ่งโรจน์',
      phone: '086-778-9900',
      team: 'Forth IoT & Smart City Maintenance',
    },
    acceptedAt: '2026-09-22 09:30:00',
    estimatedFinish: '2026-09-23 14:00:00',
    workLogs: [
      {
        id: 'log-4a',
        timestamp: '2026-09-22 09:00:00',
        author: 'นายวิชัย สุวรรณโชติ (กทม.)',
        role: 'BMA',
        status: 'REPORTED',
        note: 'เปิดแจ้งซ่อมในระบบ ส่งอีเมลแจ้งเตือน Forth',
      },
      {
        id: 'log-4b',
        timestamp: '2026-09-22 09:30:00',
        author: 'นายอัครเดช รุ่งโรจน์ (Forth)',
        role: 'FORTH',
        status: 'ACCEPTED',
        note: 'Forth รับงาน เตรียมอุปกรณ์ชุดสวิตช์กันน้ำและบอร์ดขยายเสียง',
      },
      {
        id: 'log-4c',
        timestamp: '2026-09-22 13:00:00',
        author: 'นายอัครเดช รุ่งโรจน์ (Forth)',
        role: 'FORTH',
        status: 'IN_PROGRESS',
        note: 'Forth อัพเดทสถานะ: เข้าตรวจสอบพบหน้าสัมผัสสวิตช์ SOS มีความชื้นสะสมและคราบออกไซด์',
      },
      {
        id: 'log-4d',
        timestamp: '2026-09-23 11:30:00',
        author: 'นายอัครเดช รุ่งโรจน์ (Forth)',
        role: 'FORTH',
        status: 'RESOLVED',
        note: 'Forth ยืนยันการแก้ไขเสร็จ: เปลี่ยนชุด Switch IP67 และทดสอบระบบเสียง Siren ใช้งานได้ 100% ส่งอีเมลแจ้ง กทม เรียบร้อย',
      },
    ],
    resolutionDetails: {
      summary: 'เปลี่ยนชุดปุ่มกดฉุกเฉิน Emergency SOS Switch IP67 และเคลือบน้ำยาป้องกันความชื้น พร้อมปรับระดับเสียงลำโพง',
      rootCause: 'น้ำฝนซึมเข้าบริเวณขอบยางทำให้หน้าสัมผัสคอนแทกต์เป็นสนิม',
      actionTaken: 'ถอดเปลี่ยนสวิตช์แท้ตรงรุ่น Forth-SOS-V2 ทำความสะอาดกล่องขั้วต่อ และซีลซิลิโคนเกรดทนแดดภายนอก',
      resolvedAt: '2026-09-23 11:30:00',
      resolvedBy: 'นายอัครเดช รุ่งโรจน์ (Forth IoT & Smart City)',
      partsReplaced: [
        { id: 'p1', name: 'Emergency Push Button Switch IP67', code: 'FORTH-SW-SOS-01', quantity: 1, unit: 'ชุด' },
        { id: 'p2', name: 'Silicone Weatherproof Gasket', code: 'GSK-WP-02', quantity: 1, unit: 'ชิ้น' },
      ],
      beforePhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      afterPhoto: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
      technicianSignature: 'Akaradech R. (Forth Technician)',
    },
  },
  {
    id: 'CM-2026-005',
    title: 'ไฟสัญญาณจราจรทางแยกหลัก ดับกระพริบทั้งระบบ แยกอุดมสุข',
    category: 'Traffic Light / สัญญาณไฟจราจร',
    location: 'สี่แยกอุดมสุข ถนนสุขุมวิท แขวงบางนาเหนือ เขตบางนา กรุงเทพฯ',
    coordinates: '13.6797, 100.6094',
    assetId: 'BMA-TL-UDS-001',
    urgency: 'EMERGENCY',
    description: 'ตู้คอนโทรลเลอร์จราจรเกิดอาการโอเวอร์โหลด สัญญาณไฟกระพริบสีเหลืองตลอดเวลา',
    reportedBy: {
      name: 'พ.ต.ท. บรรจง ยิ้มละมัย (จนท. ประสานงาน กทม.)',
      department: 'กองบังคับการตำรวจจราจร ร่วมกับ สำนักการจราจร กทม.',
      phone: '02-398-1234',
      email: 'traffic.bkk@bangkok.go.th',
    },
    reportedAt: '2026-09-21 06:40:00',
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'CLOSED',
    forthAssignee: {
      name: 'นายธนาธิป เจตนาดี',
      phone: '085-333-2211',
      team: 'Forth Traffic Control Systems',
    },
    acceptedAt: '2026-09-21 07:00:00',
    estimatedFinish: '2026-09-21 11:00:00',
    workLogs: [
      {
        id: 'log-5a',
        timestamp: '2026-09-21 06:40:00',
        author: 'เจ้าหน้าที่ กทม.',
        role: 'BMA',
        status: 'REPORTED',
        note: 'เปิดแจ้งซ่อมในระบบ ส่งอีเมลแจ้งเตือน Forth',
      },
      {
        id: 'log-5b',
        timestamp: '2026-09-21 07:00:00',
        author: 'นายธนาธิป เจตนาดี (Forth)',
        role: 'FORTH',
        status: 'ACCEPTED',
        note: 'Forth รับงานและส่งทีมด่วนเข้าพื้นที่',
      },
      {
        id: 'log-5c',
        timestamp: '2026-09-21 08:15:00',
        author: 'นายธนาธิป เจตนาดี (Forth)',
        role: 'FORTH',
        status: 'IN_PROGRESS',
        note: 'Forth อัพเดทสถานะ: เปลี่ยนโมดูล CPU Controller ในตู้ตลับควบคุม',
      },
      {
        id: 'log-5d',
        timestamp: '2026-09-21 09:40:00',
        author: 'นายธนาธิป เจตนาดี (Forth)',
        role: 'FORTH',
        status: 'RESOLVED',
        note: 'Forth ยืนยันการแก้ไขเสร็จ: สัญญาณไฟกลับสู่รอบเวลาปกติ ส่งอีเมลแจ้ง กทม.',
      },
      {
        id: 'log-5e',
        timestamp: '2026-09-21 14:00:00',
        author: 'นายสมชาย เจริญสุข (กทม.)',
        role: 'BMA',
        status: 'CLOSED',
        note: 'กทม ตรวจรับงานและกดปิดงาน: สัญญาณไฟทำงานสอดคล้องกับจังหวะเวลาปกติ ให้คะแนน 5 ดาว',
      },
    ],
    resolutionDetails: {
      summary: 'เปลี่ยนชุด Main CPU Controller Board และ Calibrate ระบบ Loop Detector',
      rootCause: 'ไฟกระชากจากหม้อแปลงแรงดันไฟฟ้าภายนอก',
      actionTaken: 'เปลี่ยนบอร์ดคอนโทรลเลอร์รุ่น FTC-9000 และติดตั้ง Surge Protection เพิ่มเติม',
      resolvedAt: '2026-09-21 09:40:00',
      resolvedBy: 'นายธนาธิป เจตนาดี (Forth)',
      partsReplaced: [
        { id: 'p5-1', name: 'Traffic Controller CPU Mainboard', code: 'FTC-CPU-9000', quantity: 1, unit: 'ตัว' },
        { id: 'p5-2', name: 'Surge Protection Device 40kA', code: 'SPD-40K-AC', quantity: 2, unit: 'ตัว' },
      ],
      beforePhoto: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      afterPhoto: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&auto=format&fit=crop&q=80',
      technicianSignature: 'Thanathip J. (Forth)',
    },
    bmaCloseDetails: {
      closedAt: '2026-09-21 14:00:00',
      closedBy: 'นายสมชาย เจริญสุข (สำนักการจราจร กทม.)',
      rating: 5,
      comment: 'ช่าง Forth มาถึงหน้างานรวดเร็วมาก ซ่อมแซมเสร็จภายในระยะเวลา SLA ระบบไฟทำงานได้สมบูรณ์',
      inspectorSignature: 'Somchai C. (กทม. ตรวจรับ)',
    },
  },
  {
    id: 'CM-2026-006',
    title: 'ระบบสายสัญญาณ Fiber Optic ขาดเนื่องจากการขุดเจาะท่อประปา แยกบางโพ',
    category: 'Network / ระบบโครงข่ายสื่อสาร',
    location: 'ถนนประชาราษฎร์สาย 1 แยกบางโพ แขวงบางซื่อ เขตบางซื่อ กรุงเทพฯ',
    coordinates: '13.8055, 100.5218',
    assetId: 'BMA-FIBER-BP-008',
    urgency: 'EMERGENCY',
    description: 'สายไฟเบอร์ออปติก 24 Core ของศูนย์ควบคุมเชื่อมต่อ CCTV บางซื่อขาด ส่งผลให้กล้อง 16 ตัว Offline',
    reportedBy: {
      name: 'นายกิตติคุณ ศรีสวัสดิ์',
      department: 'ศูนย์โทรมาตรและสารสนเทศ กทม.',
      phone: '02-224-8899',
      email: 'kittikun.s@bangkok.go.th',
    },
    reportedAt: '2026-09-20 09:10:00',
    photos: [
      'https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'REPORT_SENT',
    forthAssignee: {
      name: 'นายอนุชา พงษ์ศิริ',
      phone: '082-990-1122',
      team: 'Forth Fiber Splicing Specialist Team',
    },
    acceptedAt: '2026-09-20 09:30:00',
    estimatedFinish: '2026-09-20 18:00:00',
    workLogs: [
      {
        id: 'log-6a',
        timestamp: '2026-09-20 09:10:00',
        author: 'นายกิตติคุณ ศรีสวัสดิ์ (กทม.)',
        role: 'BMA',
        status: 'REPORTED',
        note: 'เปิดแจ้งซ่อมในระบบ ส่งอีเมลแจ้งเตือน Forth',
      },
      {
        id: 'log-6b',
        timestamp: '2026-09-20 09:30:00',
        author: 'นายอนุชา พงษ์ศิริ (Forth)',
        role: 'FORTH',
        status: 'ACCEPTED',
        note: 'Forth รับงาน นำเครื่อง OTDR และ Fusion Splicer ลงพื้นที่',
      },
      {
        id: 'log-6c',
        timestamp: '2026-09-20 11:45:00',
        author: 'นายอนุชา พงษ์ศิริ (Forth)',
        role: 'FORTH',
        status: 'IN_PROGRESS',
        note: 'Forth อัพเดทสถานะ: สแกนจุดขาดพบระยะ 340 เมตรจากบ่อพัก ทำการดึงสายและติดตั้ง Joint Closure ใหม่',
      },
      {
        id: 'log-6d',
        timestamp: '2026-09-20 16:30:00',
        author: 'นายอนุชา พงษ์ศิริ (Forth)',
        role: 'FORTH',
        status: 'RESOLVED',
        note: 'Forth ยืนยันการแก้ไขเสร็จ: สไปลซ์สายครบ 24 Core ค่า Loss ต่ำกว่า 0.02 dB กล้องทั้ง 16 ตัวกลับมาออนไลน์ ส่งอีเมลแจ้ง กทม.',
      },
      {
        id: 'log-6e',
        timestamp: '2026-09-20 17:30:00',
        author: 'นายกิตติคุณ ศรีสวัสดิ์ (กทม.)',
        role: 'BMA',
        status: 'CLOSED',
        note: 'กทม ตรวจรับงานและกดปิดงาน: สัญญาณเครือข่ายเสถียร ตรวจรับเรียบร้อย',
      },
      {
        id: 'log-6f',
        timestamp: '2026-09-20 18:00:00',
        author: 'นายอนุชา พงษ์ศิริ (Forth)',
        role: 'FORTH',
        status: 'REPORT_SENT',
        note: 'Forth ส่ง report: ออกใบรับรองผลการซ่อม CM Service Report เลขที่ FORTH-CM-2026-09-006 ส่งมอบให้ กทม. สมบูรณ์',
      },
    ],
    resolutionDetails: {
      summary: 'ดึงสายและตัดต่อ Fusion Splicing Fiber Optic 24 Core พร้อมใส่กล่องกันน้ำ Closure Dome ใต้ดิน',
      rootCause: 'เครื่องจักรของผู้รับเหมาประปาขุดตัดโดนท่อร้อยสายใต้ฟุตบาท',
      actionTaken: 'สไปลซ์เชื่อมต่อสายใยแก้ว 24 Core ตรวจสอบด้วยเครื่อง OTDR ผลผ่านเกณฑ์มาตรฐาน ITU-T',
      resolvedAt: '2026-09-20 16:30:00',
      resolvedBy: 'นายอนุชา พงษ์ศิริ (Forth Splicing Team)',
      partsReplaced: [
        { id: 'p6-1', name: 'Fiber Optic Cable 24C Armored', code: 'FO-24C-ARM', quantity: 45, unit: 'เมตร' },
        { id: 'p6-2', name: 'Fiber Dome Splice Closure 24C', code: 'FDC-DOME-24', quantity: 1, unit: 'ชุด' },
        { id: 'p6-3', name: 'Fusion Splice Sleeve 60mm', code: 'SLV-60MM', quantity: 24, unit: 'ชิ้น' },
      ],
      beforePhoto: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?w=600&auto=format&fit=crop&q=80',
      afterPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      technicianSignature: 'Anucha P. (Forth Fiber Lead)',
    },
    bmaCloseDetails: {
      closedAt: '2026-09-20 17:30:00',
      closedBy: 'นายกิตติคุณ ศรีสวัสดิ์ (กทม.)',
      rating: 5,
      comment: 'แก้ไขได้รวดเร็วมาก กล้องทุกตัวส่งสัญญาณภาพได้คมชัดตามปกติ',
      inspectorSignature: 'Kittikun S. (กทม. ผู้ตรวจรับ)',
    },
    reportSentDetails: {
      sentAt: '2026-09-20 18:00:00',
      reportNumber: 'FORTH-CM-2026-09-006',
      sentBy: 'ฝ่ายวิศวกรรมบริการ บริษัท ฟอร์ท คอร์ปอเรชั่น จำกัด (มหาชน)',
      notes: 'ส่งมอบรายงานผลการปฏิบัติงานซ่อมบำรุง CM พร้อมผลการทดสอบค่าการสูญเสียแสง (OTDR Report) เรียบร้อยแล้ว',
    },
  },
];

export const INITIAL_EMAILS: EmailNotification[] = [
  {
    id: 'em-001',
    ticketId: 'CM-2026-001',
    ticketTitle: 'กล้อง CCTV สี่แยกราชประสงค์ ดับ ไม่ส่งสัญญาณภาพเข้าศูนย์ควบคุม',
    sentAt: '2026-09-24 08:15:00',
    type: 'TO_FORTH_NEW_TICKET',
    to: 'service.cm@forth.co.th',
    toName: 'Forth Service & Maintenance Team',
    subject: '[แจ้งเตือนงานด่วน] กทม. เปิดแจ้งซ่อม CM ใหม่: CM-2026-001 (ฉุกเฉินด่วนมาก)',
    previewText: 'กทม. ได้เปิดใบแจ้งซ่อม CM-2026-001 กรุณาเข้าระบบเพื่อกดรับงานและมอบหมายช่าง...',
    htmlContent: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: #1e3a8a; color: white; padding: 18px 24px;">
          <h2 style="margin: 0; font-size: 18px;">ระบบแจ้งซ่อม CM กทม. - Forth Corporation</h2>
          <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.85;">อีเมลแจ้งเตือนงานแจ้งซ่อมใหม่ (Notification to Contractor)</p>
        </div>
        <div style="padding: 24px;">
          <p>เรียน <strong>ทีมงานบำรุงรักษา บริษัท ฟอร์ท คอร์ปอเรชั่น จำกัด (มหาชน)</strong>,</p>
          <p>ทาง <strong>กรุงเทพมหานคร (กทม.)</strong> ได้บันทึกเปิดแจ้งซ่อมบำรุง (Corrective Maintenance) รายการใหม่ในระบบ โดยมีรายละเอียดดังนี้:</p>
          <div style="background: #f8fafc; border-left: 4px solid #ef4444; padding: 14px 16px; margin: 16px 0; border-radius: 4px;">
            <p style="margin: 0 0 6px;"><strong>เลขที่เคส:</strong> CM-2026-001</p>
            <p style="margin: 0 0 6px;"><strong>ความเร่งด่วน:</strong> <span style="background: #fee2e2; color: #b91c1c; padding: 2px 8px; border-radius: 4px; font-weight: bold;">EMERGENCY (ฉุกเฉินด่วนมาก - SLA 2 ชม.)</span></p>
            <p style="margin: 0 0 6px;"><strong>หัวข้อ:</strong> กล้อง CCTV สี่แยกราชประสงค์ ดับ ไม่ส่งสัญญาณภาพเข้าศูนย์ควบคุม</p>
            <p style="margin: 0 0 6px;"><strong>สถานที่:</strong> สี่แยกราชประสงค์ (เสาหมายเลข RP-04) แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ</p>
            <p style="margin: 0;"><strong>ผู้แจ้ง:</strong> นายสมชาย เจริญสุข (สำนักการจราจรและขนส่ง กทม.)</p>
          </div>
          <p>โปรดเข้าสู่ระบบเพื่อดำเนินการ <strong>"Forth รับงาน"</strong> และมอบหมายทีมช่างเข้าตรวจสอบตามขั้นตอนในสัญญาสัมปทานต่อไป</p>
        </div>
        <div style="background: #f1f5f9; padding: 12px 24px; font-size: 12px; color: #64748b; text-align: center;">
          ระบบแจ้งเตือนอัตโนมัติ กรุงเทพมหานคร & บริษัท ฟอร์ท คอร์ปอเรชั่น จำกัด (มหาชน)
        </div>
      </div>
    `,
    isRead: false,
  },
  {
    id: 'em-002',
    ticketId: 'CM-2026-004',
    ticketTitle: 'เสาไฟ Smart Pole ปุ่มแจ้งเหตุฉุกเฉิน SOS ไม่ตอบสนอง สวนลุมพินี',
    sentAt: '2026-09-23 11:30:00',
    type: 'TO_BMA_TICKET_RESOLVED',
    to: 'wichai.s@bangkok.go.th',
    toName: 'นายวิชัย สุวรรณโชติ (กทม.)',
    subject: '[แจ้งผลการซ่อมเสร็จ] Forth ดำเนินการแก้ไขเคส CM-2026-004 เรียบร้อยแล้ว - โปรดตรวจรับงาน',
    previewText: 'ทีมช่าง Forth ได้ดำเนินการแก้ไขเคส CM-2026-004 สำเร็จแล้ว กรุณาเข้าตรวจรับและปิดงาน...',
    htmlContent: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: #047857; color: white; padding: 18px 24px;">
          <h2 style="margin: 0; font-size: 18px;">ระบบแจ้งซ่อม CM กทม. - Forth Corporation</h2>
          <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.85;">อีเมลแจ้งยืนยันการแก้ไขเสร็จสิ้น (Notification to BMA Inspector)</p>
        </div>
        <div style="padding: 24px;">
          <p>เรียน <strong>เจ้าหน้าที่ผู้เกี่ยวข้อง กรุงเทพมหานคร</strong>,</p>
          <p>ทางทีมงาน บริษัท ฟอร์ท คอร์ปอเรชั่น จำกัด (มหาชน) ขอเรียนแจ้งว่า เคสแจ้งซ่อม <strong>CM-2026-004</strong> ได้รับการแก้ไขและทดสอบการใช้งานเรียบร้อยแล้ว โดยมีรายละเอียดการแก้ไขดังนี้:</p>
          <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 14px 16px; margin: 16px 0; border-radius: 4px;">
            <p style="margin: 0 0 6px;"><strong>เลขที่เคส:</strong> CM-2026-004</p>
            <p style="margin: 0 0 6px;"><strong>สถานที่:</strong> สวนลุมพินี บริเวณริมสระน้ำ ประตู 3 เขตปทุมวัน</p>
            <p style="margin: 0 0 6px;"><strong>การแก้ไข:</strong> เปลี่ยนชุด Emergency SOS Switch IP67 และทดสอบระบบเสียง Siren พร้อมบันทึกภาพ Before/After</p>
            <p style="margin: 0;"><strong>ช่างผู้รับผิดชอบ:</strong> นายอัครเดช รุ่งโรจน์ (Forth IoT & Smart City)</p>
          </div>
          <p>ขอความกรุณาเจ้าหน้าที่ กทม. เข้าสู่ระบบเพื่อตรวจสอบความเรียบร้อย และกด <strong>"กทม ปิดงาน"</strong> เพื่อให้กระบวนการเสร็จสมบูรณ์</p>
        </div>
        <div style="background: #f1f5f9; padding: 12px 24px; font-size: 12px; color: #64748b; text-align: center;">
          ระบบแจ้งเตือนอัตโนมัติ กรุงเทพมหานคร & บริษัท ฟอร์ท คอร์ปอเรชั่น จำกัด (มหาชน)
        </div>
      </div>
    `,
    isRead: true,
  },
];
