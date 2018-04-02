// @flow

import fileSaver from 'file-saver'
import format from 'date-fns/format'

import getXlsxBuffer from './getXlsxBuffer'

export default async ({
  store,
  changeArtFuerEierlegendeWollmilchsau,
  artFuerEierlegendeWollmilchsau,
  fileName,
  jsonData,
}: {
  store: Object,
  changeArtFuerEierlegendeWollmilchsau: () => {},
  artFuerEierlegendeWollmilchsau: string,
  fileName: string,
  jsonData: Array<Object>,
}) => {
  let buffer
  try {
    buffer = await getXlsxBuffer(store, jsonData)
  } catch (error) {
    if (artFuerEierlegendeWollmilchsau) {
      changeArtFuerEierlegendeWollmilchsau('')
    }
    store.listError(error)
    store.export.removeDownload(fileName)
  }
  const file = `${fileName}_${format(new Date(), 'YYYY-MM-DD_HH-mm-ss')}`
  fileSaver.saveAs(
    new Blob([buffer], { type: 'application/octet-stream' }),
    `${file}.xlsx`
  )
}
