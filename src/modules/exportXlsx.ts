import fileSaver from 'file-saver'
import { format } from 'date-fns/format'

import {
  store as jotaiStore,
  enqueNotificationAtom,
} from '../JotaiStore/index.ts'
export const exportXlsx = async ({ fileName, data, store }) => {
  const { getXlsxBuffer } = await import('./getXlsxBuffer.ts')
  let buffer
  try {
    buffer = await getXlsxBuffer({ data, store })
  } catch (error) {
    return jotaiStore.set(enqueNotificationAtom, {
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
