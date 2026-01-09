import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';

const ICONS = ['📄', '📁', '🏠', '🚀', '📝', '📅', '📊', '💡', '🎨', '🎬', '🎮', '🎧', '📸', '🌍', '❤️', '🔥', '⭐', '🌈', '🍦', '☕'];

interface IconPickerProps {
  onChange: (icon: string) => void;
  children: React.ReactNode;
}

export function IconPicker({ onChange, children }: IconPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="p-2 w-full max-w-[280px]" align="start">
        <div className="grid grid-cols-5 gap-1">
          {ICONS.map((icon) => (
            <Button
              key={icon}
              variant="ghost"
              className="h-10 w-10 text-xl p-0"
              onClick={() => onChange(icon)}
            >
              {icon}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
