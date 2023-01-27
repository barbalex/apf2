import 'leaflet'
import 'leaflet-easyprint'
import { createControlComponent } from '@react-leaflet/core'

const options = {
  title: 'drucken',
  customWindowTitle: 'AP-Flora',
  position: 'topright',
  sizeModes: ['Current', 'A4Portrait', 'A4Landscape'],
  tileWait: 2000,
  defaultSizeTitles: {
    Current: 'Aktuelle Grösse',
    A4Landscape: 'A4 quer',
    A4Portrait: 'A4 hoch',
  },
  spinnerBgColor: '#2e7d32',
}

const PrintControl = createControlComponent((props) =>
  window.L.easyPrint({
    ...options,
    ...props,
  }),
)

export default PrintControl
