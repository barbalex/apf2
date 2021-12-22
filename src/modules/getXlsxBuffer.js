/**
 * writes a dataArray to an Excel workbook
 */
// see: https://github.com/guyonroche/exceljs/issues/313
import * as ExcelJs from 'exceljs/dist/exceljs.min.js'

import getDataArrayFromExportObjectsWorker from './getDataArrayFromExportObjectsWorker.js'
import getDataArrayFromExportObjects from './getDataArrayFromExportObjects'

const getXlsxBuffer = async ({ data, store }) => {
  // const dataArray =
  //   await getDataArrayFromExportObjectsWorker.getDataArrayFromExportObjects(
  //     data,
  //   )
  const dataArray = getDataArrayFromExportObjects(data)

  const numberOfColumns =
    dataArray && dataArray[0] && dataArray[0].length ? dataArray[0].length : 0
  const workbook = new ExcelJs.Workbook()
  const worksheet = workbook.addWorksheet('Daten', {
    views: [
      {
        state: 'frozen',
        xSplit: 0,
        ySplit: 1,
      },
    ],
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
  let buffer
  try {
    buffer = await workbook.xlsx.writeBuffer()
  } catch (error) {
    console.log(error)
    return store.enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  return buffer
}

export default getXlsxBuffer
