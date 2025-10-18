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
  _id: number;
  header: string;
  img?: string; 
  desc: string;
  likes: number[]; 
  dislikes: number[]; 
  views: number[]; 
  createdAt: string;
}
