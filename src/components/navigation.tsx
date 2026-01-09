import React from 'react';
import { 
  Search, 
  Settings, 
  PlusCircle, 
  ChevronRight, 
  ChevronDown, 
  FileText,
  Trash2,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Page } from '@/types/page';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  pages: Page[];
  activePageId?: string;
  onPageSelect: (id: string) => void;
  onCreatePage: (parentId?: string) => void;
  onArchivePage: (id: string) => void;
}

export function Navigation({
  pages,
  activePageId,
  onPageSelect,
  onCreatePage,
  onArchivePage
}: NavigationProps) {
  const rootPages = pages.filter(p => !p.parentId);

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r">
      <div className="p-3 flex items-center gap-2 font-medium hover:bg-sidebar-accent cursor-pointer transition-colors group">
        <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center text-primary">N</div>
        <span className="truncate">Workspace</span>
      </div>

      <div className="px-3 py-2 flex flex-col gap-0.5">
        <NavItem icon={Search} label="Search" />
        <NavItem icon={Settings} label="Settings" />
        <NavItem 
          icon={PlusCircle} 
          label="New Page" 
          onClick={() => onCreatePage()} 
        />
      </div>

      <div className="mt-4 px-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
          <span>Private</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4" 
            onClick={() => onCreatePage()}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex flex-col gap-0.5">
          {rootPages.map(page => (
            <PageItem 
              key={page.id}
              page={page}
              allPages={pages}
              level={0}
              activePageId={activePageId}
              onSelect={onPageSelect}
              onCreateSubpage={onCreatePage}
              onArchive={onArchivePage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) {
  return (
    <div 
      className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-sidebar-accent cursor-pointer transition-colors group"
      onClick={onClick}
    >
      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-sidebar-foreground" />
      <span>{label}</span>
    </div>
  );
}

interface PageItemProps {
  page: Page;
  allPages: Page[];
  level: number;
  activePageId?: string;
  onSelect: (id: string) => void;
  onCreateSubpage: (parentId: string) => void;
  onArchive: (id: string) => void;
}

function PageItem({ 
  page, 
  allPages, 
  level, 
  activePageId, 
  onSelect,
  onCreateSubpage,
  onArchive
}: PageItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const childPages = allPages.filter(p => p.parentId === page.id);
  const isActive = activePageId === page.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col">
      <div 
        className={cn(
          "flex items-center gap-1 px-1 py-1 text-sm rounded-md cursor-pointer group transition-colors",
          isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent"
        )}
        style={{ paddingLeft: `${level * 12 + 4}px` }}
        onClick={() => onSelect(page.id)}
      >
        <div 
          className="p-0.5 rounded hover:bg-sidebar-accent-foreground/10 transition-colors"
          onClick={handleToggle}
        >
          {childPages.length > 0 ? (
            isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <div className="w-3.5 h-3.5" />
          )}
        </div>
        
        <span className="mr-1.5">{page.icon || '📄'}</span>
        <span className="truncate flex-1">{page.title || 'Untitled'}</span>

        <div className="hidden group-hover:flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div className="p-1 rounded hover:bg-sidebar-accent-foreground/10">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right">
              <DropdownMenuItem onClick={() => onArchive(page.id)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="p-2 text-xs text-muted-foreground">
                Last edited by you
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div 
            className="p-1 rounded hover:bg-sidebar-accent-foreground/10"
            onClick={(e) => {
              e.stopPropagation();
              onCreateSubpage(page.id);
              setIsExpanded(true);
            }}
          >
            <Plus className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {isExpanded && childPages.length > 0 && (
        <div className="flex flex-col">
          {childPages.map(child => (
            <PageItem 
              key={child.id}
              page={child}
              allPages={allPages}
              level={level + 1}
              activePageId={activePageId}
              onSelect={onSelect}
              onCreateSubpage={onCreateSubpage}
              onArchive={onArchive}
            />
          ))}
        </div>
      )}
    </div>
  );
}
