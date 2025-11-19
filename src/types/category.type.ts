export type CategoryType = {
  id: number;
  name: string;
  slug: string;
  image?: string;
  parentId?: number;
  children?: CategoryType[];
  createdAt: Date;
  updatedAt: Date;
};
