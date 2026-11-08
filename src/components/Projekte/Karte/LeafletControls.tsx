import { createControlComponent } from '@react-leaflet/core'
import {
  ZoomControl as LeafletZoomControl,
  ScaleControl as LeafletScaleControl,
} from 'leaflet'
import type {
  ScaleControlOptions,
  ZoomControlOptions,
} from 'leaflet'

// react-leaflet 5's built-in ZoomControl/ScaleControl instantiate the
// Leaflet-1 nested classes (new Control.Zoom / new Control.Scale),
// which Leaflet 2 flattened to ZoomControl / ScaleControl.
// Local wrappers on the Leaflet-2 classes until react-leaflet
// ships Leaflet 2 support.
export const ZoomControl = createControlComponent<
  LeafletZoomControl,
  ZoomControlOptions
>((props) => new LeafletZoomControl(props))

export const ScaleControl = createControlComponent<
  LeafletScaleControl,
  ScaleControlOptions
>((props) => new LeafletScaleControl(props))
