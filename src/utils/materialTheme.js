import { createMuiTheme } from "@material-ui/core/styles"
//import orange from "@material-ui/core/colors/orange"
import red from "@material-ui/core/colors/red"
import green from "@material-ui/core/colors/green"

// All the following keys are optional.
// We try our best to provide a great default value.
const theme = createMuiTheme({
  palette: {
    primary: { main: green[800] },
    error: {
      main: red[500],
    },
  },
})

export default theme
