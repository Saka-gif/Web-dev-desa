import fs from "fs";
import path from "path";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  nik?: string;
  password: string;
  passwords?: string[];
  role: "admin" | "kades" | "user" | string;
  avatar?: string;
  telepon?: string;
  rw?: string;
  alamat?: string;
  created_at?: string;
}

// Akun bawaan referensi UKL Kelas 11 & Portal Desa Sawotratap
export const DEFAULT_USERS: StoredUser[] = [
  {
    id: "usr-admin-1",
    name: "Admin Desa Sawotratap",
    email: "admin@sawotratap.com",
    nik: "3515111101900001",
    password: "admin123",
    passwords: ["admin123", "password"],
    role: "admin",
    avatar: "/Logo/IMG_1650.GIF",
    telepon: "081234567891",
    rw: "RW 01",
    alamat: "Kantor Balai Desa Sawotratap, Gedangan, Sidoarjo",
  },
  {
    id: "usr-kades-1",
    name: "Kepala Desa Sawotratap",
    email: "kades@sawotratap.desa.id",
    nik: "3515110101750001",
    password: "password",
    passwords: ["password", "kades123"],
    role: "kades",
    avatar: "/aset/kades.jpg",
    telepon: "081234567892",
    rw: "RW 01",
    alamat: "Rumah Dinas Kepala Desa, Sawotratap Krajan RW 01",
  },
  {
    id: "usr-warga-1",
    name: "Hadi Purnomo (Warga Sawotratap)",
    email: "user@sawotratap.com",
    nik: "3515112001000001",
    password: "user123",
    passwords: ["user123", "password123", "password"],
    role: "user",
    avatar: "/Logo/IMG_1650.GIF",
    telepon: "081234567893",
    rw: "RW 03",
    alamat: "Jl. Merpati No. 04 RT 02 / RW 03, Sawotratap",
  },
];

const LOCAL_STORE_FILE = path.join(process.cwd(), "app", "data", "registered_users.json");

function getStoredUsersList(): StoredUser[] {
  // 1. Cek globalThis
  const g = globalThis as any;
  if (!g.__sawotratap_users) {
    g.__sawotratap_users = [];
  }

  // 2. Baca dari file registered_users.json jika ada
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const content = fs.readFileSync(LOCAL_STORE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  return g.__sawotratap_users;
}

function saveStoredUsersList(list: StoredUser[]) {
  const g = globalThis as any;
  g.__sawotratap_users = list;

  try {
    const dir = path.dirname(LOCAL_STORE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.warn("Gagal menyimpan file registered_users.json:", err);
  }
}

export function addMemoryUser(user: StoredUser) {
  const list = getStoredUsersList();
  const existingIdx = list.findIndex(
    (u) => u.email.toLowerCase() === user.email.toLowerCase() || (u.nik && u.nik === user.nik)
  );
  if (existingIdx >= 0) {
    list[existingIdx] = user;
  } else {
    list.push(user);
  }
  saveStoredUsersList(list);
}

export function findMemoryUser(identifier: string, pass: string): StoredUser | null {
  const cleanId = identifier.trim().toLowerCase();
  const memoryList = getStoredUsersList();
  const allUsers = [...memoryList, ...DEFAULT_USERS];

  return (
    allUsers.find((u) => {
      const matchId =
        u.email.toLowerCase() === cleanId ||
        (u.nik && u.nik === cleanId) ||
        (cleanId === "admin" && u.role === "admin") ||
        (cleanId === "kades" && u.role === "kades") ||
        (cleanId === "user" && u.role === "user");

      const matchPass =
        u.password === pass || (u.passwords && u.passwords.includes(pass));

      return matchId && matchPass;
    }) || null
  );
}

export function isIdentifierTaken(email: string, nik: string): { taken: boolean; reason?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const memoryList = getStoredUsersList();
  const allUsers = [...memoryList, ...DEFAULT_USERS];

  const foundEmail = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (foundEmail) return { taken: true, reason: "email" };

  const foundNik = allUsers.find((u) => u.nik && u.nik === nik);
  if (foundNik) return { taken: true, reason: "nik" };

  return { taken: false };
}
