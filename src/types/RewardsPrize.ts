export interface RewardsPrize{
  id:number;
  code: string;
  description: string;
  imageUrl?: string | null;
  cost: number;
  stock: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}