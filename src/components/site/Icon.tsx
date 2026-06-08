import {
  Activity,
  ArrowRight,
  Boxes,
  Building2,
  CalendarCheck,
  ClipboardList,
  FileText,
  Filter,
  Globe,
  Layers,
  LayoutDashboard,
  LineChart,
  ListChecks,
  MessageSquare,
  Package,
  Sparkles,
  Target,
  User,
  UserCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

// Mapa de iconos usados por las capas de datos (solutions, cases).
// Mantener sincronizado con los nombres de icon en src/lib/*.
const ICONS: Record<string, LucideIcon> = {
  Activity,
  ArrowRight,
  Boxes,
  Building2,
  CalendarCheck,
  ClipboardList,
  FileText,
  Filter,
  Globe,
  Layers,
  LayoutDashboard,
  LineChart,
  ListChecks,
  MessageSquare,
  Package,
  Sparkles,
  Target,
  User,
  UserCheck,
  Users,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = ICONS[name] ?? Boxes;
  return <Cmp className={className} />;
}
