"use client";

import { TasksBoard } from "@/components/tasks/TasksBoard";

export default function DemandasPage() {
  return (
    <TasksBoard
      title="Demandas Recebidas"
      subtitle="Caixa de entrada de solicitações pontuais para a equipe."
      fixedSetor="DEMANDAS_RECEBIDAS"
      showSetorColumn={false}
    />
  );
}
