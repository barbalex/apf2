// @flow

import fileSaver from 'file-saver'
import format from 'date-fns/format'

import getXlsxBuffer from './getXlsxBuffer'
import listError from './listError'

export default async ({
  fileName,
  data,
}: {
  fileName: string,
  data: Array<Object>,
}) => {
  let buffer
  try {
    buffer = await getXlsxBuffer(data)
  } catch (error) {
    return listError(error)
  }
  const file = `${fileName}_${format(new Date(), 'YYYY-MM-DD_HH-mm-ss')}`
  fileSaver.saveAs(
    new Blob([buffer], { type: 'application/octet-stream' }),
    `${file}.xlsx`
  )
}
