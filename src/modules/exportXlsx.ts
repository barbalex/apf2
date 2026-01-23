import fileSaver from 'file-saver'
import { format } from 'date-fns/format'

import {
  store,
  addNotificationAtom,
} from '../store/index.ts'

const addNotification = (notification) =>
  store.set(addNotificationAtom, notification)

export const exportXlsx = async ({ fileName, data }) => {
  const { getXlsxBuffer } = await import('./getXlsxBuffer.ts')
  let buffer
  try {
    buffer = await getXlsxBuffer({ data })
  } catch (error) {
    return addNotification({
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
