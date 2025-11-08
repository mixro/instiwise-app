export interface EventItem {
  _id: string;
  userId: string;
  header: string;
  location: string;
  category: string;
  date: string; // "DD/MM/YYYY"
  start: string; // "09:00 AM"
  end: string; // "11:00 AM"
  favorites: string[];
  img?: string;
  desc: string;
  createdAt: string;
  updatedAt: string;
}

export type CalendarItem = 
  | { type: 'header'; month: string; count: number }
  | ({ type: 'event' } & EventItem);

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