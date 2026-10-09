// https://davidwalsh.name/convert-xml-json
// https://www.xml.com/pub/a/2006/05/31/converting-between-xml-and-json.html
/**
 * Getting xml
 * Extracting an array of:
 * - layer title
 * - properties
 */
import { xmlToJson } from './xmlToJson.ts'

export const textXmlToLayersData = (xml: Document) => {
  const obj = xmlToJson(xml)
  // extract layers
  const output = obj?.['ogr:FeatureCollection']?.['gml:featureMember']
  const layersLabelValueArray = Object.entries(output ?? {}).filter(([key]) =>
    key.toLowerCase().startsWith('ogr:'),
  )

  const layersData = layersLabelValueArray.map(([label, value]) => {
    const properties = Object.entries(value ?? {})
      .filter(([key]) => key.toLowerCase().startsWith('ogr:'))
      .filter(([key]) => key !== 'ogr:geometryProperty')
      .map(([key, value]) => [key.replace('ogr:', ''), value?.['#text']])

    return { label: label.replace('ogr:', ''), properties }
  })

  return layersData
}
