import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';

const COVERS = [
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518655061766-48c238e8260d?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522252234503-e356532cafd5?q=80&w=2050&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1454165833767-027508496b41?q=80&w=2070&auto=format&fit=crop',
];

interface CoverPickerProps {
  onChange: (url: string) => void;
  children: React.ReactNode;
}

export function CoverPicker({ onChange, children }: CoverPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="p-2 w-80" align="center">
        <div className="grid grid-cols-2 gap-2">
          {COVERS.map((url, i) => (
            <div 
              key={i}
              className="relative aspect-video rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onChange(url)}
            >
              <img src={url} alt="Cover option" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
