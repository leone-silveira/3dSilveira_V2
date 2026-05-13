import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import { foodApi } from '../../api/foodApi';
import type { IStockFood } from '../../interfaces/IStockFood';


export function useStockFoodMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedRow: IStockFood) => {
      const { id, ...payload } = updatedRow;
      return await foodApi.updateStockFood(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-foods'] });
    },
    onError: (error: AxiosError) => {
      const message = (error?.response?.data as { detail?: string })?.detail || 'Falha ao atualizar item';
      toast.error(`✗ ${message}`, { position: 'top-right', autoClose: 3000 });
    },
  });
}

export function useStockFoodCreateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: Omit<IStockFood, 'id'>) => {
      return await foodApi.createStockFood(newItem);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stock-foods'] });
      toast.success(`✓ "${data.name}" adicionado ao estoque!`, { position: 'top-right', autoClose: 2500 });
    },
    onError: (error: AxiosError) => {
      const message = (error?.response?.data as { detail?: string })?.detail || 'Falha ao adicionar item';
      toast.error(`✗ ${message}`, { position: 'top-right', autoClose: 3000 });
    },
  });
}

export function useStockFoodDeleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await foodApi.deleteStockFood(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-foods'] });
      toast.success('✓ Item removido do estoque', { position: 'top-right', autoClose: 2500 });
    },
    onError: (error: AxiosError) => {
      const message = (error?.response?.data as { detail?: string })?.detail || 'Falha ao remover item';
      toast.error(`✗ ${message}`, { position: 'top-right', autoClose: 3000 });
    },
  });
}
