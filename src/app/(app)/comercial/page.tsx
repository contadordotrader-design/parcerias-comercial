"use client";

import { TasksBoard } from "@/components/tasks/TasksBoard";

export default function ComercialPage() {
  return (
    <TasksBoard
      title="Comercial"
      subtitle="Atendimento, follow-up, prospecção e base de clientes."
      fixedSetor="COMERCIAL"
      showSetorColumn={false}
    />
  );
}
