// https://davidwalsh.name/convert-xml-json
// https://www.xml.com/pub/a/2006/05/31/converting-between-xml-and-json.html
/**
 * Getting xml
 * Extracting an array of:
 * - layer title
 * - properties
 */
import sortBy from 'lodash/sortBy'
import xmlToJson from './xmlToJson'

const xmlToLayersData = (xml) => {
  const obj = xmlToJson(xml)

  // extract layers
  const outputs =
    obj?.HTML?.BODY?.['WFS:FEATURECOLLECTION']?.['GML:FEATUREMEMBER'] ?? []

  const returnValues = []
  for (const output1 of outputs) {
    // output is value of key beginning with QGS:
    // rest of keys name depends on ap
    const keysOfOutput1 = Object.keys(output1)
    const neededKey = keysOfOutput1.filter((v) => v.startsWith('QGS:'))
    const output = output1[neededKey]
    if (!output) break

    // build simpler object
    let properties = {}
    for (const [key, value] of Object.entries(output)) {
      if (key.includes('QGS:'))
        properties[key.replace('QGS:', '')] =
          value?.['#text'] === 'NULL' ? '' : value?.['#text']
    }

    const label = `${properties.MASSNDAT}: ${properties.MASSTYP}`

    returnValues.push({ label, properties: Object.entries(properties) })
  }

  return sortBy(returnValues, 'label')
}

export default xmlToLayersData
