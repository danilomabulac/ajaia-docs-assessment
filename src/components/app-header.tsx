"use client";

import Link from "next/link";
import { FileText, Users } from "lucide-react";
import { DEMO_USERS } from "@/lib/demo-users";
import { useDemoUser } from "@/components/user-provider";

export function AppHeader() {
  const { userId, setUserId } = useDemoUser();
  return (
    <header className="app-header">
      <Link href="/" className="brand"><span className="brand-mark"><FileText size={20} /></span>Ajaia Docs</Link>
      <div className="demo-user">
        <Users size={16} /><label htmlFor="demo-user">Viewing as</label>
        <select id="demo-user" value={userId} onChange={(event) => setUserId(event.target.value)}>
          {DEMO_USERS.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>
      </div>
    </header>
  );
}
