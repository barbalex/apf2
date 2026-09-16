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

const asObj = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined

export const xmlToLayersData = (xml: Document) => {
  const obj = xmlToJson(xml)

  // extract layers
  const featureMembers = asObj(asObj(asObj(obj)?.['HTML'])?.['BODY'])?.[
    'WFS:FEATURECOLLECTION'
  ]
  let outputs: unknown[] = (asObj(featureMembers)?.['GML:FEATUREMEMBER'] ??
    []) as unknown[]

  // the output is object in points and lines, array in polygons
  // want array in all cases
  if (!Array.isArray(outputs)) {
    outputs = [outputs]
  }

  const returnValues: { label: string; properties: [string, unknown][] }[] = []
  for (const output1 of outputs) {
    // output is value of key beginning with QGS:
    // rest of keys name depends on ap
    const output1Obj = asObj(output1)
    if (!output1Obj) break
    const keysOfOutput1 = Object.keys(output1Obj)
    const neededKey = keysOfOutput1.filter((v) => v.startsWith('QGS:'))
    const output = asObj(output1Obj[neededKey as unknown as number])
    if (!output) break
    if (Object.entries(output).length === 0) break

    // build simpler object
    const properties: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(output)) {
      if (key.includes('QGS:'))
        properties[key.replace('QGS:', '')] =
          asObj(value)?.['#text'] === 'NULL' ? '' : asObj(value)?.['#text']
    }

    const label = `${properties.MASSNAHMENDATUM}: ${properties.MASSNAHMENTYP}`

    returnValues.push({ label, properties: Object.entries(properties) })
  }

  return sortBy(returnValues, ['label'])
}
