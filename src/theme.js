import { createMuiTheme } from '@material-ui/core/styles'
import orange from '@material-ui/core/colors/orange'
import red from '@material-ui/core/colors/red'

// All the following keys are optional.
// We try our best to provide a great default value.
const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: { main: '#2e7d32' },
    error: {
      main: red[500],
    },
  },
  background: {
    default: orange[50],
  },
  typography: {
    useNextVariants: true,
  },
})

export default theme
