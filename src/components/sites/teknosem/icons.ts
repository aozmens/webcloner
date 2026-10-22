// Icons the panel can assign to cards ("Neden TEKNOSEM?", strengths, services).
import {
  Award,
  Bot,
  Box,
  Cpu,
  Factory,
  FlaskConical,
  Gauge,
  Headset,
  KeyRound,
  PackageCheck,
  PenTool,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const icons = {
  box: { icon: Box, label: "Kutu" },
  "package-check": { icon: PackageCheck, label: "Paket" },
  "pen-tool": { icon: PenTool, label: "Tasarım" },
  "shield-check": { icon: ShieldCheck, label: "Kalkan" },
  "flask-conical": { icon: FlaskConical, label: "Ar-Ge" },
  "key-round": { icon: KeyRound, label: "Anahtar" },
  award: { icon: Award, label: "Ödül" },
  wrench: { icon: Wrench, label: "Servis" },
  bot: { icon: Bot, label: "Robot" },
  cpu: { icon: Cpu, label: "İşlemci" },
  factory: { icon: Factory, label: "Fabrika" },
  gauge: { icon: Gauge, label: "Gösterge" },
  headset: { icon: Headset, label: "Destek" },
  settings: { icon: Settings, label: "Ayar" },
  truck: { icon: Truck, label: "Teslimat" },
  users: { icon: Users, label: "Ekip" },
  zap: { icon: Zap, label: "Enerji" },
} satisfies Record<string, { icon: LucideIcon; label: string }>;

export type IconName = keyof typeof icons;

export const iconNames = Object.keys(icons) as IconName[];

export const iconFor = (name: string): LucideIcon => (icons as Record<string, { icon: LucideIcon }>)[name]?.icon ?? Box;
