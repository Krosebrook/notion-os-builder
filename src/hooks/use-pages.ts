import { useState, useEffect, useCallback } from 'react';
import { blink } from '@/lib/blink';
import type { Page } from '@/types/page';

export function usePages(isAuthenticated: boolean) {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPages = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data = await blink.db.table<Page>('pages').list({
        where: { isArchived: "0" },
        orderBy: { updatedAt: 'desc' }
      });
      setPages(data);
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const createPage = async (title?: string, parentId?: string) => {
    try {
      const user = await blink.auth.me();
      if (!user) return null;

      const newPage = await blink.db.table<Page>('pages').create({
        userId: user.id,
        title: title || 'Untitled',
        parentId,
        isArchived: "0",
        isPublished: "0",
        content: JSON.stringify([{ type: 'paragraph', children: [{ text: '' }] }])
      });

      setPages(prev => [newPage, ...prev]);
      return newPage;
    } catch (error) {
      console.error('Failed to create page:', error);
      return null;
    }
  };

  const updatePage = async (id: string, updates: Partial<Page>) => {
    try {
      const updated = await blink.db.table<Page>('pages').update(id, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      setPages(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      return updated;
    } catch (error) {
      console.error('Failed to update page:', error);
      return null;
    }
  };

  const archivePage = async (id: string) => {
    return updatePage(id, { isArchived: "1" as any });
  };

  return {
    pages,
    isLoading,
    createPage,
    updatePage,
    archivePage,
    refresh: fetchPages
  };
}
