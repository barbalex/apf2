import Typography from 'typography'

const typography = new Typography({
  title: 'Homegrown',
  baseFontSize: '16px',
  headerFontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
  bodyFontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
  fontFeatureSettings: 'normal',
  googleFonts: [
    {
      name: 'Roboto',
      styles: ['400', '500', '700'],
    },
  ],
})

export default typography
