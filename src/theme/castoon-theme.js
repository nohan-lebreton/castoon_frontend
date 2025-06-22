import { definePreset } from '@primeuix/themes'
import Lara from '@primeuix/themes/lara'

const MyPreset = definePreset(Lara, {
  semantic: {
    primary: {
      //declinaison #E3562B
      50: '#FDEDE9',
      100: '#FBD3C8',
      200: '#F9B8A7',
      300: '#F79D86',
      400: '#F58365',
      500: '#E3562B',
      600: '#D24F28',
      700: '#C04825',
      800: '#B04122',
      900: '#A03A1F',
      950: '#A03A1F',
    },
    success: {
      //declinaison #31AF97
      50: '#E6F9F2',
      100: '#C4F1EB',
      200: '#A0E3E0',
      300: '#7ED4D5',
      400: '#31AF97',
      500: '#31AF97',
      600: '#31AF97',
      700: '#31AF97',
      800: '#31AF97',
      900: '#0FAF57',
      950: '#0FAF57',
    },
    danger: {
      //declinaison #F79C07
      50: '#FFF4E5',
      100: '#FFE0B3',
      200: '#FFD18A',
      300: '#FFBF61',
      400: '#FFAD38',
      500: '#F79C07',
      600: '#F79C07',
      700: '#D67A05',
      800: '#C66904',
      900: '#B65803',
      950: '#B65803',
    },
    info: {
      //declinaison #2E89E5
      50: '#E5F2FD',
      100: '#B3DDFB',
      200: '#80C8F9',
      300: '#4DB3F7',
      400: '#1A9EF5',
      500: '#2E89E5',
      600: '#2779D4',
      700: '#2069C3',
      800: '#1A59B2',
      900: '#1449A1',
      950: '#1449A1',
    },
  },
})

export default MyPreset
