export interface Task {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  priority?: 'High' | 'Medium' | 'Low' | '';
}

export type FilterStatus = 'all' | 'active' | 'completed';

export interface TaskFilters {
  search: string;
  status: FilterStatus;
  category: string;
  priority: string;
}
