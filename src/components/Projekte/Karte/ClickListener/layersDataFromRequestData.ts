import { vndOgcGmlToLayersData } from '../../../../modules/vndOgcGmlToLayersData.ts'
import { textXmlToLayersData } from '../../../../modules/textXmlToLayersData.ts'

export const layersDataFromRequestData = ({
  layersData,
  requestData,
  infoFormat,
}) => {
  switch (infoFormat) {
    case 'application/vnd.ogc.gml':
    case 'application/vnd.ogc.gml/3.1.1': {
      const parser = new window.DOMParser()
      const dataArray = vndOgcGmlToLayersData(
        parser.parseFromString(requestData, 'text/html'),
      )
      // do not open empty popups
      if (dataArray.length) {
        dataArray.forEach((data) => {
          layersData.push(data)
        })
      }
      break
    }
    case 'text/xml': {
      const parser = new window.DOMParser()
      const dataArray = textXmlToLayersData(
        parser.parseFromString(requestData, 'text/xml'),
      )
      // do not open empty popups
      if (dataArray.length) {
        dataArray.forEach((data) => {
          layersData.push(data)
        })
      }
      break
    }
    case 'labelPropertiesArray': {
      layersData.push(...requestData)
      break
    }
    // TODO: implement these
    case 'text/html': {
      layersData.push({ html: requestData })
      break
    }
    // TODO: test
    case 'application/json':
    case 'application/json; subtype=geojson':
    case 'text/javascript': {
      // do not open empty popups
      if (!requestData?.length) return
      if (requestData.includes('no results')) return

      layersData.push({ json: requestData })
      break
    }
    case 'text/plain':
    default: {
      // do not open empty popups
      if (!requestData?.length) return
      if (requestData.includes('no results')) return

      layersData.push({ text: requestData })

      break
    }
  }
}
