export interface ComplaintCategoryEntity {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  isActive: boolean;
  associatedEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
}
