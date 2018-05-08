// @flow

import fileSaver from 'file-saver'
import format from 'date-fns/format'

import getXlsxBuffer from './getXlsxBuffer'

export default async ({
  store,
  fileName,
  data,
}: {
  store: Object,
  fileName: string,
  data: Array<Object>,
}) => {
  let buffer
  try {
    buffer = await getXlsxBuffer(store, data)
  } catch (error) {
    store.listError(error)
  }
  const file = `${fileName}_${format(new Date(), 'YYYY-MM-DD_HH-mm-ss')}`
  fileSaver.saveAs(
    new Blob([buffer], { type: 'application/octet-stream' }),
    `${file}.xlsx`
  )
}
