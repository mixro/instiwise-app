export interface EventItem {
  _id: number;
  title: string;
  location: string;
  category: string;
  date: string;
  start: string;
  end: string;
  isFavorite: boolean;
  description?: string; 
}

export type CalendarItem = 
  | (EventItem & { type: 'event' })
  | { type: 'header'; month: string; count: number };

export interface NewsItem {
  _id: string;
  userId: string;
  header: string;
  desc: string;
  img?: string;
  likes: string[];
  dislikes: string[];
  views: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsItem {
  _id: number,
  title: string;
  userId: string; 
  description: string;
  img: string;
  category: string;
  problem?: string;
  owner?: string;
  duration?: string;
  status?: 'in progress' | 'on hold' | 'completed';
  goals: any[]; 
  resources?: any[];
  budget?: any[];
  scope?: any[];
  plan?: any[];
  challenges?: any[];
  likes?: any[];
  createdAt?: string;
  updatedAt?: string;
}