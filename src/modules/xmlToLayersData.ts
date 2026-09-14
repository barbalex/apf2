// https://davidwalsh.name/convert-xml-json
// https://www.xml.com/pub/a/2006/05/31/converting-between-xml-and-json.html
/**
 * Getting xml
 * Extracting an array of:
 * - layer title
 * - properties
 */
import { sortBy } from 'es-toolkit'

import { xmlToJson } from './xmlToJson.ts'

export const xmlToLayersData = (xml: Document) => {
  const obj = xmlToJson(xml)

  // extract layers
  let outputs: any[] | any =
    obj?.HTML?.BODY?.['WFS:FEATURECOLLECTION']?.['GML:FEATUREMEMBER'] ?? []

  // the output is object in points and lines, array in polygons
  // want array in all cases
  if (!Array.isArray(outputs)) {
    outputs = [outputs]
  }

  const returnValues = []
  for (const output1 of outputs) {
    // output is value of key beginning with QGS:
    // rest of keys name depends on ap
    const keysOfOutput1 = Object.keys(output1)
    const neededKey = keysOfOutput1.filter((v) => v.startsWith('QGS:'))
    const output = output1[neededKey as unknown as number]
    if (!output) break
    if (Object.entries(output).length === 0) break

    // build simpler object
    const properties: Record<string, any> = {}
    for (const [key, value] of Object.entries(output) as [string, any][]) {
      if (key.includes('QGS:'))
        properties[key.replace('QGS:', '')] =
          value?.['#text'] === 'NULL' ? '' : value?.['#text']
    }

    const label = `${properties.MASSNAHMENDATUM}: ${properties.MASSNAHMENTYP}`

    returnValues.push({ label, properties: Object.entries(properties) })
  }

  return sortBy(returnValues, ['label'])
}
