import { createMuiTheme } from 'material-ui-next/styles'
import orange from 'material-ui-next/colors/orange'
import red from 'material-ui-next/colors/red'

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
})

export default theme
