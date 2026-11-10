/**
 * writes a dataArray to an Excel workbook
 */
import type { CellObject, Sheet } from 'write-excel-file/browser'

import { autoFilterFeature } from './autoFilterFeature.ts'
import { getDataArrayFromExportObjects } from './getDataArrayFromExportObjects.ts'

import {
  store,
  addNotificationAtom,
  type Notification,
} from '../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export interface XlsxCellStyle {
  textColor?: string
  backgroundColor?: string
  fontWeight?: 'bold'
}

export const getXlsxBuffer = async ({
  data,
  getCellStyle,
}: {
  data: Record<string, unknown>[]
  /**
   * styles data rows (f.i. colored text) based on the row's values.
   * The header (the property name) allows styling single columns
   */
  getCellStyle?: ((params: {
    row: Record<string, unknown>
    header: string
  }) => XlsxCellStyle | undefined) | undefined
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
  const headers = dataArray[0]?.map((header) => String(header)) ?? []

  const sheets: Sheet<Blob>[] = [
    {
      sheet: 'Daten',
      stickyRowsCount: 1,
      data: dataArray.map((row, rowIndex) =>
        rowIndex === 0 ?
          row.map((cell) => ({
            value: cell,
            fontWeight: 'bold',
            backgroundColor: '#D3D3D3',
            bottomBorderStyle: 'thin',
          }))
        : getCellStyle ?
          row.map(
            (cell, columnIndex): CellObject => ({
              value: cell as Exclude<CellObject['value'], undefined>,
              ...getCellStyle({
                row: data[rowIndex - 1] ?? {},
                header: headers[columnIndex] ?? '',
              }),
            }),
          )
        : row,
      ) as Sheet<Blob>['data'],
    },
  ]

  let buffer: ArrayBuffer | undefined
  try {
    const { default: writeXlsxFile } = await import('write-excel-file/browser')
    const blob = await writeXlsxFile(sheets, {
      features: [autoFilterFeature],
    }).toBlob()
    buffer = await blob.arrayBuffer()
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
