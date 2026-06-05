// https://davidwalsh.name/convert-xml-json
// https://www.xml.com/pub/a/2006/05/31/converting-between-xml-and-json.html
/**
 * Getting xml
 * Extracting an array of:
 * - layer title
 * - properties
 */
import { xmlToJson } from './xmlToJson.ts'

export const vndOgcGmlToLayersData = (xml: Document) => {
  const obj = xmlToJson(xml)
  // extract layers
  const output = obj?.HTML?.BODY?.MSGMLOUTPUT
  const layers = Object.entries(output ?? {})
    .filter(([key]) => key.toLowerCase().includes('_layer'))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([key, value]) => value)

  const layersData = layers.map((l) => {
    const label = l['GML:NAME']?.['#text']

    const propsObject = Object.entries(l ?? {})
      .filter(([key]) => key.toLowerCase().includes('_feature'))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([key, value]) => value)?.[0]

    if (propsObject?.['#text']) delete propsObject['#text']

    const properties = Object.entries(propsObject)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, value]) => !key.includes(':'))
      .map(([key, value]) => [key, value?.['#text']])

    return { label, properties }
  })

  return layersData
}
