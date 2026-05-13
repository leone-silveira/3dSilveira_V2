import type { IFood } from './IFoods';

export interface IDishItem {
  id: number;
  food_id: number;
  quantity: number;
  food: IFood;
}

export interface IDish {
  id: number;
  name: string;
  description?: string;
  items: IDishItem[];
}

export interface IDishCreate {
  name: string;
  description?: string;
  items: { food_id: number; quantity: number }[];
}

export interface IMealPlanEntry {
  id: number;
  date: string;
  meal_type: string;
  dish_id: number;
  servings: number;
  dish: IDish;
}
