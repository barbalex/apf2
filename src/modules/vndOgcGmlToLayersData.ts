// https://davidwalsh.name/convert-xml-json
// https://www.xml.com/pub/a/2006/05/31/converting-between-xml-and-json.html
/**
 * Getting xml
 * Extracting an array of:
 * - layer title
 * - properties
 */
import { xmlToJson } from './xmlToJson.ts'

const asObj = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined

export const vndOgcGmlToLayersData = (xml: Document) => {
  const obj = xmlToJson(xml)
  // extract layers
  const output = asObj(asObj(asObj(obj)?.['HTML'])?.['BODY'])?.['MSGMLOUTPUT']
  const layers = Object.entries(asObj(output) ?? {})
    .filter(([key]) => key.toLowerCase().includes('_layer'))
    .map(([, value]) => value)

  const layersData = layers.map((l) => {
    const layer = asObj(l)
    const label = asObj(layer?.['GML:NAME'])?.['#text']

    const propsObject = Object.entries(layer ?? {})
      .filter(([key]) => key.toLowerCase().includes('_feature'))
      .map(([, value]) => asObj(value))?.[0]

    if (propsObject && '#text' in propsObject) delete propsObject['#text']

    const properties = Object.entries(propsObject ?? {})
      .filter(([key]) => !key.includes(':'))
      .map(([key, value]) => [key, asObj(value)?.['#text']])

    return { label, properties }
  })

  return layersData
}
