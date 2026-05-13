export interface IStockFood {
  id: number;
  food_type: string;
  name: string;
  quantity: number;
  unit: string;
  min_quantity?: number | null;
  expiry?: string | null;
};
