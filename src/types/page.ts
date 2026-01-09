export interface Page {
  id: string;
  userId: string;
  title: string;
  icon?: string;
  coverImage?: string;
  parentId?: string;
  content?: string;
  isPublished: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
