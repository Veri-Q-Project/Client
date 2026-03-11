import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';

export const vars = createGlobalTheme('#app', {
  colors: {
    white: '#FFFFFF',
    black: '#0B0B0B',
    main: '#006AE4',
    mainDark: '#0054B3',
    mainLight: '#3388ED',
    mainLightHover: '#B4D7FF',
    mainXLight: '#E6F0FF',
    mainBorder: '#B5D3FF',
    sub: '#F3F4F6',
    subHover: '#E5E7EB',
    subDark: '#A0A4B0',
    subText: '#4B4E57',
    border: '#CECECE',
    label: '#404040',
    error: '#F20D0D',
    success: '#11D483',
    warning: '#F2DF0D',
  },
  font: {
    size: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '32px',
      '5xl': '36px',
      '6xl': '40px',
      '7xl': '44px',
      '8xl': '48px',
    },
    weight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    ml: '20px',
    lg: '24px',
    xl: '32px',
    bottom: '10px',
    authLogo: '48px',
    header: '72px',
  },
});

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});

globalStyle('html, body, #app', {
  margin: 0,
  minHeight: '100%',
  padding: 0,
  width: '100%',
});
