import fileSaver from 'file-saver'
import format from 'date-fns/format'

import getXlsxBuffer from './getXlsxBuffer'

const exportXlsx = async ({ fileName, data, store }) => {
  let buffer
  try {
    buffer = await getXlsxBuffer({ data, store })
  } catch (error) {
    return store.enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const file = `${fileName}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`
  fileSaver.saveAs(
    new Blob([buffer], { type: 'application/octet-stream' }),
    `${file}.xlsx`,
  )
}

export default exportXlsx
