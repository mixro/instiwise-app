export const themes = {
  light: {
    background: '#ffffffff',
    text: '#000000',
    icons: '#222222ff',
    tabBackground: '#FFFFFF',
    tabActiveTint: '#2E7D32', 
    tabInactiveTint: '#666666',
    border: '#DDDDDD',
    event_card: '#fafafaff',
    cards_background: '#cfcfcfff',
  },
  dark: {
    background: '#1b1b1bff',
    text: '#FFFFFF',
    icons: '#FFFFFF',
    tabBackground: '#1C2526',
    tabActiveTint: '#A3BE8C', 
    tabInactiveTint: '#D8DEE9',
    event_card: '#2E3440',
    border: '#2E3440',
    cards_background: '#2E3440',
  },
};

export type Theme = typeof themes.light;