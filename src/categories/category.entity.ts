export class Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  parentId?: number;
  children?: Category[];
  createdAt: Date;
  updatedAt: Date;
}
