import { Construction } from "lucide-react";

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Configurações</h1>
        <p className="text-sm text-slate-500">
          Administração de categorias, tags, permissões e parâmetros gerais do sistema.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-20 text-center">
        <Construction className="mb-3 h-8 w-8 text-slate-300" />
        <p className="text-sm font-medium text-slate-600">Módulo previsto para a próxima etapa</p>
        <p className="mt-1 max-w-sm text-sm text-slate-400">
          O cadastro de colaboradores já está disponível no menu. Categorias, tags e permissões
          finas entram no próximo ciclo de desenvolvimento.
        </p>
      </div>
    </div>
  );
}
