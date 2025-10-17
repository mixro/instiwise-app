import { Ionicons } from "@expo/vector-icons";

export const calendarEvents = [
    {
      id: 1,
      date: '12/11/2025',
      title: 'DDS Youth engineering event',
      location: 'Teaching Tower Basement (TT-B)',
      category: 'Engineering event',
    },
    {
      id: 2,
      date: '12/11/2025',
      title: 'DDS Youth engineering event',
      location: 'Teaching Tower Basement (TT-B)',
      category: 'Engineering event',
    },
    {
      id: 3,
      date: '12/11/2025',
      title: 'DDS Youth engineering event',
      location: 'Teaching Tower Basement (TT-B)',
      category: 'Engineering event',
    },
]

export const homeStatsData: { title: string; value: string; icon: React.ComponentProps<typeof Ionicons>['name']; desc: string }[] = [ 
  { 
    title: 'News', 
    value: '134,348', 
    icon: 'reader', 
    desc: 'Get instant updates and announcements from your institute.' 
  },
  { 
    title: 'Events', 
    value: '145', 
    icon: 'calendar', 
    desc: 'Stay on top of upcoming academic and social events.' 
  },
  { 
    title: 'Projects', 
    value: '1034', 
    icon: 'folder', 
    desc: 'Discover creative projects shared by students and staff.' 
  },
  { 
    title: 'Users', 
    value: '5000+', 
    icon: 'people', 
    desc: 'Join a vibrant community of learners and educators.' 
  },
];
