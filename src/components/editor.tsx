import React, { useEffect, useState } from 'react';
import type { Page } from '@/types/page';
import { Button } from '@/components/ui/button';
import { ImageIcon, Smile, X } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { useDebounce } from '@/hooks/use-debounce';
import { IconPicker } from './icon-picker';
import { CoverPicker } from './cover-picker';

interface EditorProps {
  page: Page;
  onUpdate: (updates: Partial<Page>) => void;
}

export function Editor({ page, onUpdate }: EditorProps) {
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content || '');

  const debouncedTitle = useDebounce(title, 500);
  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    setTitle(page.title);
    setContent(page.content || '');
  }, [page.id]);

  useEffect(() => {
    if (debouncedTitle !== page.title) {
      onUpdate({ title: debouncedTitle });
    }
  }, [debouncedTitle]);

  useEffect(() => {
    if (debouncedContent !== page.content) {
      onUpdate({ content: debouncedContent });
    }
  }, [debouncedContent]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Cover Image Placeholder */}
      <div className="relative group/cover h-[25vh] bg-muted/30">
        {page.coverImage ? (
          <>
            <img 
              src={page.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 right-4 opacity-0 group-hover/cover:opacity-100 transition-opacity flex gap-2">
              <CoverPicker onChange={(url) => onUpdate({ coverImage: url })}>
                <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
                  Change cover
                </Button>
              </CoverPicker>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-background/80 backdrop-blur-sm"
                onClick={() => onUpdate({ coverImage: '' })}
              >
                Remove
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity">
            <CoverPicker onChange={(url) => onUpdate({ coverImage: url })}>
              <Button variant="outline" size="sm" className="bg-background">
                <ImageIcon className="w-4 h-4 mr-2" />
                Add cover
              </Button>
            </CoverPicker>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto w-full px-12 pb-20">
        <div className="relative -mt-16 mb-8 group/icon inline-block">
          <IconPicker onChange={(icon) => onUpdate({ icon })}>
            <div className="text-7xl hover:bg-muted/50 rounded-lg p-2 cursor-pointer transition-colors">
              {page.icon || '📄'}
            </div>
          </IconPicker>
          <div className="absolute -top-4 -right-4 opacity-0 group-hover/icon:opacity-100 transition-opacity flex gap-1">
             <IconPicker onChange={(icon) => onUpdate({ icon })}>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-background shadow-sm">
                  <Smile className="w-4 h-4" />
                </Button>
             </IconPicker>
             {page.icon && (
               <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-background shadow-sm"
                onClick={() => onUpdate({ icon: '' })}
              >
                <X className="w-4 h-4" />
              </Button>
             )}
          </div>
        </div>

        <TextareaAutosize
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled"
          className="w-full text-5xl font-bold bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/30 mb-8"
        />

        <TextareaAutosize
          value={content}
          onChange={handleContentChange}
          placeholder="Type '/' for commands..."
          className="w-full text-lg bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/30 min-h-[500px]"
        />
      </div>
    </div>
  );
}
