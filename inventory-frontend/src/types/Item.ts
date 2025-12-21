export interface Item {
  id?: number;
  type: 'vinyl' | 'bike';
  name: string;

  artist?: string;
  year?: number;

  category?: string;
  quantity?: number;

  location?: string;
  notes?: string;
}
