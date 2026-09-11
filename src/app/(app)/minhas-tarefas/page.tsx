"use client";

import { TasksBoard } from "@/components/tasks/TasksBoard";

export default function MinhasTarefasPage() {
  return (
    <TasksBoard
      title="Minhas Tarefas"
      subtitle="Tudo o que está atribuído a você, em um só lugar."
      onlyMine
      showPrazoQuickFilters
    />
  );
}
