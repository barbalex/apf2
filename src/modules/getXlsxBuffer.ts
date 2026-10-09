/**
 * writes a dataArray to an Excel workbook
 */
import { Workbook } from 'exceljs'

//import { getDataArrayFromExportObjectsWorker } from './getDataArrayFromExportObjectsWorker.ts'
import { getDataArrayFromExportObjects } from './getDataArrayFromExportObjects.ts'

import {
  store,
  addNotificationAtom,
  type Notification,
} from '../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const getXlsxBuffer = async ({
  data,
}: {
  data: Record<string, unknown>[]
}) => {
  /**
   * using this worker may make the ui more responsive
   * but only while this code runs
   * this code is only a small part of the time the user has to wait
   * most is used by: 1. query 2. other processing steps needing libs
   * and: using a worker makes it take significantly longer...
   */
  // const dataArray =
  //   await getDataArrayFromExportObjectsWorker.getDataArrayFromExportObjects(
  //     data,
  //   )
  const dataArray = getDataArrayFromExportObjects(data)

  const numberOfColumns =
    dataArray && dataArray[0] && dataArray[0].length ? dataArray[0].length : 0
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('Daten', {
    views: [
      {
        state: 'frozen',
        xSplit: 0,
        ySplit: 1,
      },
    ],
    // autoFilter is applied below — exceljs' option typing misses it here
    ...( {
    autoFilter: {
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: numberOfColumns,
      },
    },
    } as unknown as Record<string, unknown>),
  })
  worksheet.addRows(dataArray)
  worksheet.getRow(1).fill = {
    type: 'gradient',
    gradient: 'angle',
    degree: 0,
    stops: [
      { position: 0, color: { argb: 'FFD3D3D3' } },
      { position: 1, color: { argb: 'FFD3D3D3' } },
    ],
  }
  worksheet.getRow(1).font = {
    bold: true,
  }
  worksheet.getRow(1).border = {
    bottom: {
      style: 'thin',
    },
  }
  let buffer: ArrayBuffer | undefined
  try {
    buffer = await workbook.xlsx.writeBuffer()
  } catch (error) {
    console.log(error)
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  
  return buffer
}
