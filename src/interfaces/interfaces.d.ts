// interfaces/interfaces.d.ts
export interface EventItem {
  _id: number;
  title: string;
  location: string;
  category: string;
  date: string;
  start: string;
  end: string;
  isFavorite: boolean;
  description?: string; // Optional field for extra details
}

export type CalendarItem = 
  | (EventItem & { type: 'event' })
  | { type: 'header'; month: string; count: number };