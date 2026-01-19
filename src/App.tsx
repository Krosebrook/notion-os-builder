import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { usePages } from '@/hooks/use-pages';
import { Navigation } from '@/components/navigation';
import { Editor } from '@/components/editor';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { 
  Empty, 
  EmptyContent, 
  EmptyDescription, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle 
} from '@/components/ui/empty';
import { FileText, Plus } from 'lucide-react';

function App() {
  const { user, isLoading: authLoading, login } = useAuth();
  const { pages, isLoading: pagesLoading, createPage, updatePage, archivePage } = usePages(!!user);
  const [activePageId, setActivePageId] = useState<string | undefined>();

  const activePage = pages.find(p => p.id === activePageId);

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Notion OS Builder</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Effortlessly create, customize, and organize your own workspace templates and pages.
          </p>
          <Button size="lg" onClick={login} className="w-full h-12 text-lg">
            Get Started Free
          </Button>
        </div>
      </div>
    );
  }

  const handleCreatePage = async (parentId?: string) => {
    const newPage = await createPage('Untitled', parentId);
    if (newPage) {
      setActivePageId(newPage.id);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <aside className="w-64 flex-shrink-0">
        <Navigation 
          pages={pages}
          activePageId={activePageId}
          onPageSelect={setActivePageId}
          onCreatePage={handleCreatePage}
          onArchivePage={archivePage}
        />
      </aside>

      <main className="flex-1 h-full overflow-hidden">
        {activePage ? (
          <Editor 
            key={activePage.id}
            page={activePage}
            onUpdate={(updates) => updatePage(activePage.id, updates)}
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-8">
            <Empty>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No page selected</EmptyTitle>
                <EmptyDescription>
                  Select a page from the sidebar or create a new one to get started.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => handleCreatePage()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first page
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
