import axios, { type AxiosInstance } from 'axios';
import type { Item } from '@/types/Item';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8080',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getItems(type: 'vinyl' | 'bike'): Promise<Item[]> {
    const response = await this.api.get<Item[]>(`/api/items/${type}`);
    return response.data;
  }

  async searchItems(type: 'vinyl' | 'bike', query: string): Promise<Item[]> {
    const response = await this.api.get<Item[]>(`/api/items/${type}/search`, {
      params: { q: query },
    });
    return response.data;
  }

  async createItem(item: Omit<Item, 'id'>): Promise<Item> {
    const response = await this.api.post<Item>('/api/items', item);
    return response.data;
  }

  async updateItem(id: number, item: Item): Promise<Item> {
    const response = await this.api.put<Item>(`/api/items/${id}`, item);
    return response.data;
  }

  async deleteItem(id: number): Promise<void> {
    await this.api.delete(`/api/items/${id}`);
  }
}

export const apiService = new ApiService();
