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

export interface ProjectUser {
  _id: string;
  email: string;
  username: string;
  img?: string;
  awards: any[];
  connectionsCount: number;
  projectsCount: number;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsItem {
  _id: string;
  title: string;
  userId: ProjectUser; // ← populated user object
  description: string;
  img: string;
  category: string;

  // Optional fields
  problem?: string;
  collaborators?: string[];
  duration?: string;
  status?: 'in progress' | 'on hold' | 'completed';
  goals?: string[];
  resources?: string[];
  budget?: number[];
  scope?: string[];
  plan?: string[];
  challenges?: string[];

  likes: string[]; // ← array of user IDs (strings)
  createdAt: string;
  updatedAt: string;
}