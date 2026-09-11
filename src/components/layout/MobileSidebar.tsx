"use client";

import { cn } from "@/lib/utils";
import {
  Building2,
  CalendarDays,
  Handshake,
  Inbox,
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
  X,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/minhas-tarefas", label: "Minhas Tarefas", icon: ListTodo },
  { href: "/comercial", label: "Comercial", icon: Building2 },
  { href: "/parcerias", label: "Parcerias", icon: Handshake },
  { href: "/demandas", label: "Demandas Recebidas", icon: Inbox },
  { href: "/colaboradores", label: "Colaboradores", icon: Users },
  { href: "/calendario", label: "Calendário", icon: CalendarDays },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="w-64 flex-col bg-slate-950 flex">
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-sm font-bold text-slate-900">
              CDT
            </div>
            <p className="text-sm font-semibold text-white">CDT Tarefas</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-2 flex-1 space-y-0.5 px-3">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 bg-slate-900/40" onClick={onClose} />
    </div>,
    document.body
  );
}
