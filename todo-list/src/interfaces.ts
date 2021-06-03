export interface Todo {
  id: string;
  completed: boolean;
  title: string;
  searchedTitle?: string[];
  searchInput?: string;
}
