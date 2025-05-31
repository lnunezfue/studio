import { HeartPulse } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function Logo({ className, iconSize = 28, textSize = "text-xl" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-headline font-bold ${className}`}>
      <HeartPulse size={iconSize} className="text-primary" />
      <span className={textSize}>Rural Health Hub</span>
    </Link>
  );
}
