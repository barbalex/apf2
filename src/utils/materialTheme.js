import { createTheme } from '@mui/material/styles'
import { green, red } from '@mui/material/colors'

// All the following keys are optional.
// We try our best to provide a great default value.
const theme = createTheme({
  palette: {
    primary: { main: green[800] },
    error: {
      main: red[500],
    },
  },
})

export default theme
