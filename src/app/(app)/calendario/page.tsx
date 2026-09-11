import { Construction } from "lucide-react";

export default function CalendarioPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Calendário</h1>
        <p className="text-sm text-slate-500">
          Visualização mensal/semanal de tarefas, prazos, reuniões e ações de parceiros.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-20 text-center">
        <Construction className="mb-3 h-8 w-8 text-slate-300" />
        <p className="text-sm font-medium text-slate-600">Módulo previsto para a próxima etapa</p>
        <p className="mt-1 max-w-sm text-sm text-slate-400">
          A fundação do sistema (autenticação, tarefas, parcerias e colaboradores) já está pronta.
          Este módulo entra no próximo ciclo de desenvolvimento.
        </p>
      </div>
    </div>
  );
}
