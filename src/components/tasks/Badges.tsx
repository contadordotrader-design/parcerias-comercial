import { Badge } from "@/components/ui/Badge";
import {
  PRIORITY_LABELS,
  PRIORITY_STYLES,
  STATUS_LABELS,
  STATUS_STYLES,
} from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={STATUS_STYLES[status]}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <Badge className={PRIORITY_STYLES[priority]}>
      {PRIORITY_LABELS[priority] ?? priority}
    </Badge>
  );
}
