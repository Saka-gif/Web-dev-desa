import fs from "fs";
import path from "path";
import { DEFAULT_USERS, StoredUser } from "./users-store";

const LOCAL_STORE_FILE = path.join(process.cwd(), "app", "data", "registered_users.json");

export function getStoredUsersList(): StoredUser[] {
  const g = globalThis as any;
  if (!g.__sawotratap_users) {
    g.__sawotratap_users = [];
  }

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

export function saveStoredUsersList(list: StoredUser[]) {
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

export function getAllMemoryUsers(): StoredUser[] {
  const fileUsers = getStoredUsersList();
  const merged: StoredUser[] = [...fileUsers];

  for (const def of DEFAULT_USERS) {
    const exists = merged.some(
      (u) => u.id === def.id || u.email.toLowerCase() === def.email.toLowerCase()
    );
    if (!exists) {
      merged.unshift({
        ...def,
        is_active: true,
        created_at: "2026-01-01T00:00:00.000Z",
      });
    }
  }

  return merged;
}

export function updateMemoryUser(id: string, updates: Partial<StoredUser>): StoredUser | null {
  const list = getAllMemoryUsers();
  const idx = list.findIndex((u) => u.id === id);
  if (idx === -1) return null;

  const existing = list[idx];
  const updatedUser: StoredUser = {
    ...existing,
    ...updates,
    id: existing.id,
  };

  if (updates.password && updates.password.trim() !== "") {
    updatedUser.password = updates.password;
    updatedUser.passwords = Array.from(new Set([updates.password, ...(existing.passwords || [])]));
  }

  list[idx] = updatedUser;
  saveStoredUsersList(list);
  return updatedUser;
}

export function deleteMemoryUser(id: string): boolean {
  let list = getAllMemoryUsers();
  const initialLength = list.length;
  list = list.filter((u) => u.id !== id);
  if (list.length !== initialLength) {
    saveStoredUsersList(list);
    return true;
  }
  return false;
}

export function addMemoryUser(user: StoredUser) {
  const list = getAllMemoryUsers();
  const existingIdx = list.findIndex(
    (u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase() || (u.nik && user.nik && u.nik === user.nik)
  );
  if (existingIdx >= 0) {
    list[existingIdx] = {
      ...list[existingIdx],
      ...user,
      id: list[existingIdx].id || user.id,
    };
  } else {
    list.unshift({
      ...user,
      is_active: user.is_active !== undefined ? user.is_active : true,
      created_at: user.created_at || new Date().toISOString(),
    });
  }
  saveStoredUsersList(list);
}

export function isIdentifierTaken(
  email: string,
  nik: string,
  excludeId?: string
): { taken: boolean; reason?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const allUsers = getAllMemoryUsers();

  const foundEmail = allUsers.find(
    (u) => u.email.toLowerCase() === cleanEmail && (!excludeId || u.id !== excludeId)
  );
  if (foundEmail) return { taken: true, reason: "email" };

  if (nik) {
    const foundNik = allUsers.find(
      (u) => u.nik && u.nik === nik && (!excludeId || u.id !== excludeId)
    );
    if (foundNik) return { taken: true, reason: "nik" };
  }

  return { taken: false };
}
