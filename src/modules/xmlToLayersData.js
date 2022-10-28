// https://davidwalsh.name/convert-xml-json
// https://www.xml.com/pub/a/2006/05/31/converting-between-xml-and-json.html
/**
 * Getting xml
 * Extracting an array of:
 * - layer title
 * - properties
 */
import xmlToJson from './xmlToJson'

const xmlToLayersData = (xml) => {
  const obj = xmlToJson(xml)

  // extract layers
  const output1 =
    obj?.HTML?.BODY?.['WFS:FEATURECOLLECTION']?.['GML:FEATUREMEMBER']
  if (!output1) return []
  // output is value of key beginning with QGS:
  // rest of keys name depends on ap
  const keysOfOutput1 = Object.keys(output1)
  const neededKey = keysOfOutput1.filter((v) => v.startsWith('QGS:'))
  const output = output1[neededKey]
  if (!output) return []

  // build simpler object
  let properties = {}
  for (const [key, value] of Object.entries(output)) {
    if (key.includes('QGS:'))
      properties[key.replace('QGS:', '')] =
        value?.['#text'] === 'NULL' ? '' : value?.['#text']
  }

  const label = `${properties.MASSNDAT}: ${properties.MASSTYP}`

  return [{ label, properties: Object.entries(properties) }]
}

export default xmlToLayersData
