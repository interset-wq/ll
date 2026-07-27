export interface User {
  id: number;
  username: string;
  email: string;
  date_joined: string;
  token?: string;
}

export interface Topic {
  id: number;
  text: string;
  date_added: string;
  entry_count: number;
}

export interface Entry {
  id: number;
  title: string;
  text: string;
  display_title: string;
  date_added: string;
  updated_at: string;
  word_count: number;
  favorited: boolean;
  topic_pk: number;
  topic_text: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
