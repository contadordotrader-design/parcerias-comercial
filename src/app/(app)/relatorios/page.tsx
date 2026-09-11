import { Construction } from "lucide-react";

export default function RelatoriosPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Relatórios</h1>
        <p className="text-sm text-slate-500">
          Relatórios visuais de produtividade, tarefas por período, colaborador e área.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-20 text-center">
        <Construction className="mb-3 h-8 w-8 text-slate-300" />
        <p className="text-sm font-medium text-slate-600">Módulo previsto para a próxima etapa</p>
        <p className="mt-1 max-w-sm text-sm text-slate-400">
          O dashboard já cobre boa parte dessas visões. Filtros de período e exportação entram
          no próximo ciclo de desenvolvimento.
        </p>
      </div>
    </div>
  );
}
