export interface UserProfile {
  phone: string;
  name: string;
  department: string;
  email: string;
  position?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const STORAGE_KEY_USERS = 'cm_repair_users_v1';

export const INITIAL_USERS: UserProfile[] = [
  {
    phone: '0812345678',
    name: 'นายสมชาย เจริญสุข',
    department: 'สำนักการจราจรและขนส่ง กทม.',
    email: 'somchai.j@bangkok.go.th',
    position: 'นายช่างเครื่องกลชำนาญงาน',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10 09:00:00',
  },
  {
    phone: '0898765432',
    name: 'นางสาวพิมพา พรทิพย์',
    department: 'ฝ่ายโยธา สำนักงานเขตพระนคร',
    email: 'pimpa.p@bangkok.go.th',
    position: 'วิศวกรโยธาปฏิบัติการ',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-15 10:30:00',
  },
  {
    phone: '0861112233',
    name: 'นายธีรภัทร ชาญวิทย์',
    department: 'ศูนย์ควบคุมการจราจร กทม.',
    email: 'theerapat.c@bangkok.go.th',
    position: 'เจ้าพนักงานสื่อสารชำนาญงาน',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-03-01 11:15:00',
  },
];

export class UserService {
  private static cleanPhone(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
  }

  public static getStoredUsers(): UserProfile[] {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_USERS;
    }
  }

  public static getUserByPhone(phone: string): UserProfile | null {
    const clean = this.cleanPhone(phone);
    if (!clean) return null;
    const users = this.getStoredUsers();
    return users.find((u) => this.cleanPhone(u.phone) === clean) || null;
  }

  public static saveOrUpdateUser(profile: UserProfile): UserProfile {
    const clean = this.cleanPhone(profile.phone);
    const users = this.getStoredUsers();
    const existingIndex = users.findIndex((u) => this.cleanPhone(u.phone) === clean);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const updatedProfile: UserProfile = {
      ...profile,
      phone: clean,
      updatedAt: nowStr,
      createdAt: existingIndex >= 0 ? (users[existingIndex].createdAt || nowStr) : nowStr,
    };

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...updatedProfile };
    } else {
      users.push(updatedProfile);
    }

    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    return updatedProfile;
  }

  public static resetUsers(): void {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USERS));
  }
}
