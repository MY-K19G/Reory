import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}
