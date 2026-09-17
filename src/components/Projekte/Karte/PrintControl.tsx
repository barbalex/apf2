import 'leaflet'
import 'leaflet-easyprint'
import { createControlComponent } from '@react-leaflet/core'
import type { Control as LeafletControl, ControlOptions } from 'leaflet'

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

// the leaflet-easyprint plugin registers L.easyPrint without typings
const easyPrint = (window.L as unknown as {
  easyPrint: (options: Record<string, unknown>) => LeafletControl
}).easyPrint

export const PrintControl = createControlComponent(
  (props: ControlOptions) =>
    easyPrint({
      ...options,
      ...props,
    }),
)
