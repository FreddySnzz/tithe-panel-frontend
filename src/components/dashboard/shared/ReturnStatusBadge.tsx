import { CheckCircle2, Clock, Hourglass, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ReturnStatus } from '@/data/types/return.type';

interface ReturnStatusBadgeProps {
  status: ReturnStatus;
  hasSubmission: boolean;
}

export function ReturnStatusBadge({
  status,
  hasSubmission,
}: ReturnStatusBadgeProps) {
  if (status === 'PAID') {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15 gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Devolvido
      </Badge>
    );
  }

  if (status === 'PENDING' && hasSubmission) {
    return (
      <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/15 gap-1">
        <Hourglass className="h-3 w-3" />
        Em Análise
      </Badge>
    );
  }

  if (status === 'CANCELLED') {
    return (
      <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/15 gap-1">
        <XCircle className="h-3 w-3" />
        Recusado
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="text-muted-foreground border-border gap-1"
    >
      <Clock className="h-3 w-3" />
      Pendente
    </Badge>
  );
}