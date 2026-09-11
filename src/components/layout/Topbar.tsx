"use client";

import { Bell, LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { MobileSidebar } from "@/components/layout/MobileSidebar";

function bomPeriodo(): string {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export function Topbar({ nome }: { nome: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const primeiroNome = nome.split(" ")[0];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {bomPeriodo()}, {primeiroNome}
          </p>
          <p className="text-xs text-slate-500">
            Aqui está o resumo da sua rotina hoje.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
