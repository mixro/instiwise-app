export const themes = {
  light: {
    background: '#ffffffff',
    text: '#000000',
    tabBackground: '#FFFFFF',
    tabActiveTint: '#2E7D32', // Green for InstiWise theme
    tabInactiveTint: '#666666',
    border: '#DDDDDD',
  },
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    tabBackground: '#1C2526',
    tabActiveTint: '#A3BE8C', // Lighter green for contrast
    tabInactiveTint: '#D8DEE9',
    border: '#2E3440',
  },
};

export type Theme = typeof themes.light;