import type { LayerData } from '../layers/Popup.js'
import { vndOgcGmlToLayersData } from '../../../../modules/vndOgcGmlToLayersData.ts'
import { textXmlToLayersData } from '../../../../modules/textXmlToLayersData.ts'

interface LayersDataFromRequestDataProps {
  layersData: LayerData[]
  requestData: string | LayerData[]
  infoFormat: string
}

export const layersDataFromRequestData = ({
  layersData,
  requestData,
  infoFormat,
}: LayersDataFromRequestDataProps) => {
  switch (infoFormat) {
    case 'application/vnd.ogc.gml':
    case 'application/vnd.ogc.gml/3.1.1': {
      const parser = new window.DOMParser()
      const dataArray = vndOgcGmlToLayersData(
        parser.parseFromString(requestData as string, 'text/html'),
      )
      // do not open empty popups
      if (dataArray.length) {
        dataArray.forEach((data) => {
          layersData.push(data as LayerData)
        })
      }
      break
    }
    case 'text/xml': {
      const parser = new window.DOMParser()
      const dataArray = textXmlToLayersData(
        parser.parseFromString(requestData as string, 'text/xml'),
      )
      // do not open empty popups
      if (dataArray.length) {
        dataArray.forEach((data) => {
          layersData.push(data as LayerData)
        })
      }
      break
    }
    case 'labelPropertiesArray': {
      layersData.push(...(requestData as LayerData[]))
      break
    }
    // TODO: implement these
    case 'text/html': {
      // dormant path: the payload is not LayerData-shaped
      layersData.push({ html: requestData } as unknown as LayerData)
      break
    }
    // TODO: test
    case 'application/json':
    case 'application/json; subtype=geojson':
    case 'text/javascript': {
      // do not open empty popups
      if (!requestData?.length) return
      if ((requestData as string).includes('no results')) return

      // dormant path: the payload is not LayerData-shaped
      layersData.push({ json: requestData } as unknown as LayerData)
      break
    }
    case 'text/plain':
    default: {
      // do not open empty popups
      if (!requestData?.length) return
      if ((requestData as string).includes('no results')) return

      // dormant path: the payload is not LayerData-shaped
      layersData.push({ text: requestData } as unknown as LayerData)

      break
    }
  }
}
