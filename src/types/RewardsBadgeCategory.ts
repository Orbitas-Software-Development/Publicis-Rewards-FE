import type { RewardsBadgeSubcategory } from "./RewardsBadgeSubcategory";

export interface RewardsBadgeCategory {
  id: number;
  code: string;
  description: string;
  points: number;
  createdAt?: string;
  updatedAt?: string;
  isActive: boolean;
  isAutomatic: boolean;
  subcategories: RewardsBadgeSubcategory[];
}