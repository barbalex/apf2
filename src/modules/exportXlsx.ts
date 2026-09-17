import fileSaver from 'file-saver'
import { format } from 'date-fns/format'

import {
  store,
  addNotificationAtom,
  type Notification,
} from '../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const exportXlsx = async ({
  fileName,
  data,
}: {
  fileName: string
  data: Record<string, unknown>[]
}) => {
  const { getXlsxBuffer } = await import('./getXlsxBuffer.ts')
  let buffer: ArrayBuffer | undefined
  try {
    buffer = (await getXlsxBuffer({ data })) ?? undefined
  } catch (error) {
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  const file = `${fileName}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`
  fileSaver.saveAs(
    new Blob([buffer ?? ''], { type: 'application/octet-stream' }),
    `${file}.xlsx`,
  )
}
