import Typography from "typography"

const typography = new Typography({
  title: "Homegrown",
  baseFontSize: "16px",
  headerFontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
  bodyFontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
  fontFeatureSettings: "normal",
  googleFonts: [
    {
      name: "Roboto",
      styles: ["300", "400", "500", "600", "700"],
    },
  ],
})

export default typography
