// @flow

import fileSaver from 'file-saver'
import format from 'date-fns/format'

import getXlsxBuffer from './getXlsxBuffer'

export default async ({
  fileName,
  data,
  errorState,
}: {
  fileName: String,
  data: Array<Object>,
  errorState: Object,
}) => {
  let buffer
  try {
    buffer = await getXlsxBuffer({ data, errorState })
  } catch (error) {
    return errorState.add(error)
  }
  const file = `${fileName}_${format(new Date(), 'YYYY-MM-DD_HH-mm-ss')}`
  fileSaver.saveAs(
    new Blob([buffer], { type: 'application/octet-stream' }),
    `${file}.xlsx`
  )
}
