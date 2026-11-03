import type { Feature } from 'write-excel-file/browser'

/**
 * write-excel-file has no built-in autoFilter support.
 * This feature injects an `<autoFilter/>` element spanning
 * the header row into every worksheet.
 */
// the FileContent type write-excel-file expects in the browser
type FileContent = File | Blob | ArrayBuffer

export const autoFilterFeature: Feature<FileContent> = {
  files: {
    transform: {
      'xl/worksheets/sheet{id}.xml': {
        transform: (xml) => {
          const ref = getHeaderRowRange(xml)
          if (!ref) return xml
          // per ECMA-376 element order, autoFilter follows sheetData
          // and precedes mergeCells
          const autoFilterXml = `<autoFilter ref="${ref}"/>`
          if (xml.includes('</sheetData>')) {
            return xml.replace('</sheetData>', `</sheetData>${autoFilterXml}`)
          }
          return xml.replace('<sheetData/>', `<sheetData/>${autoFilterXml}`)
        },
      },
    },
  },
}

/**
 * builds a range like `A1:AB1` from the addresses
 * of the cells the library generated for the first row
 */
const getHeaderRowRange = (xml: string): string | undefined => {
  const firstRowMatch = xml.match(/<row[^>]*\br="1"[^>]*>([\s\S]*?)<\/row>/)
  const firstRow = firstRowMatch?.[1]
  if (!firstRow) return undefined
  const cellAddressPattern = /\br="([A-Z]+)1"/g
  let lastColumn: string | undefined
  for (const match of firstRow.matchAll(cellAddressPattern)) {
    lastColumn = match[1] ?? lastColumn
  }
  if (!lastColumn) return undefined
  return `A1:${lastColumn}1`
}
