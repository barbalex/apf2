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
  const output: any = obj?.HTML?.BODY?.MSGMLOUTPUT
  const layers = Object.entries(output ?? {})
    .filter(([key]) => key.toLowerCase().includes('_layer'))
    .map(([, value]) => value)

  const layersData = layers.map((l: any) => {
    const label = l['GML:NAME']?.['#text']

    const propsObject = Object.entries(l ?? {})
      .filter(([key]) => key.toLowerCase().includes('_feature'))
      .map(([, value]: [string, any]) => value)?.[0]

    if (propsObject?.['#text']) delete propsObject['#text']

    const properties = Object.entries(propsObject)
      .filter(([key]) => !key.includes(':'))
      .map(([key, value]: [string, any]) => [key, value?.['#text']])

    return { label, properties }
  })

  return layersData
}
