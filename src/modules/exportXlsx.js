import fileSaver from 'file-saver'
import format from 'date-fns/format'

import getXlsxBuffer from './getXlsxBuffer'

export default async ({ fileName, data, addError }) => {
  let buffer
  try {
    buffer = await getXlsxBuffer({ data, addError })
  } catch (error) {
    return addError(error)
  }
  const file = `${fileName}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`
  fileSaver.saveAs(
    new Blob([buffer], { type: 'application/octet-stream' }),
    `${file}.xlsx`,
  )
}
