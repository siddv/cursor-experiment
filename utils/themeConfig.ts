import { DecadeTheme } from '@/types';

export const getDecadeTheme = (year: number): DecadeTheme => {
  const decade = Math.floor(year / 10) * 10;
  
  const themes: { [key: number]: DecadeTheme } = {
    2020: {
      primaryColor: '#FF3366',
      secondaryColor: '#6C5CE7',
      fontFamily: 'Inter, sans-serif',
      backgroundPattern: 'linear-gradient(135deg, #FF3366 0%, #6C5CE7 100%)',
    },
    2010: {
      primaryColor: '#00B894',
      secondaryColor: '#0984E3',
      fontFamily: 'Roboto, sans-serif',
      backgroundPattern: 'linear-gradient(135deg, #00B894 0%, #0984E3 100%)',
    },
    2000: {
      primaryColor: '#E17055',
      secondaryColor: '#FDCB6E',
      fontFamily: 'Arial, sans-serif',
      backgroundPattern: 'linear-gradient(135deg, #E17055 0%, #FDCB6E 100%)',
    },
    1990: {
      primaryColor: '#6C5CE7',
      secondaryColor: '#A8E6CF',
      fontFamily: 'Times New Roman, serif',
      backgroundPattern: 'linear-gradient(135deg, #6C5CE7 0%, #A8E6CF 100%)',
    },
    1980: {
      primaryColor: '#FF7675',
      secondaryColor: '#74B9FF',
      fontFamily: 'Helvetica, sans-serif',
      backgroundPattern: 'linear-gradient(135deg, #FF7675 0%, #74B9FF 100%)',
    },
    1970: {
      primaryColor: '#55EFC4',
      secondaryColor: '#FFA502',
      fontFamily: 'Courier New, monospace',
      backgroundPattern: 'linear-gradient(135deg, #55EFC4 0%, #FFA502 100%)',
    },
    1960: {
      primaryColor: '#FF6B6B',
      secondaryColor: '#4ECDC4',
      fontFamily: 'Georgia, serif',
      backgroundPattern: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
    },
    1950: {
      primaryColor: '#A8E6CF',
      secondaryColor: '#FFD3A5',
      fontFamily: 'Palatino, serif',
      backgroundPattern: 'linear-gradient(135deg, #A8E6CF 0%, #FFD3A5 100%)',
    },
    1940: {
      primaryColor: '#FF8B94',
      secondaryColor: '#B5EAD7',
      fontFamily: 'Bookman, serif',
      backgroundPattern: 'linear-gradient(135deg, #FF8B94 0%, #B5EAD7 100%)',
    },
    1930: {
      primaryColor: '#C7CEEA',
      secondaryColor: '#FFB7B2',
      fontFamily: 'Garamond, serif',
      backgroundPattern: 'linear-gradient(135deg, #C7CEEA 0%, #FFB7B2 100%)',
    },
  };

  return themes[decade] || themes[2020]; // Default to 2020s theme if decade not found
}; 