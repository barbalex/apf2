// https://davidwalsh.name/convert-xml-json
// https://www.xml.com/pub/a/2006/05/31/converting-between-xml-and-json.html
/**
 * Getting xml
 * Extracting an array of:
 * - layer title
 * - properties
 */
// the parsed shape is recursive and unpredictable — consumers navigate it dynamically
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type XmlNode = any

export const xmlToJson = (xml: Node): XmlNode => {
  // Create the return object
  let obj: XmlNode = {}
  const record = () => obj as Record<string, unknown>

  if (xml.nodeType == 1) {
    // element
    // do attributes
    const attributes = (xml as Element).attributes
    if (attributes.length > 0) {
      obj = { '@attributes': {} }
      const target = record()['@attributes'] as Record<string, unknown>
      for (let j = 0; j < attributes.length; j++) {
        const attribute = attributes.item(j)
        if (!attribute) continue
        target[attribute.nodeName] = attribute.nodeValue
      }
    }
  } else if (xml.nodeType == 3) {
    // text
    obj = xml.nodeValue
  }

  // do children
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i)
      if (!item) continue
      const nodeName = item.nodeName
      if (typeof record()[nodeName] == 'undefined') {
        record()[nodeName] = xmlToJson(item)
      } else {
        if (typeof (record()[nodeName] as { push?: unknown }).push == 'undefined') {
          const old = record()[nodeName]
          record()[nodeName] = [old]
        }
        ;(record()[nodeName] as unknown[]).push(xmlToJson(item))
      }
    }
  }

  return obj
}
