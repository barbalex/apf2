// this version is ogc-compatible and can be used for https://map.geo.admin.ch
//import exportKml from './exportKml_ogc'
import { omit } from 'es-toolkit'

import {
  store,
  addNotificationAtom,
  exportFileTypeAtom,
} from '../store/index.ts'

const addNotification = (notification) =>
  store.set(addNotificationAtom, notification)

export const exportModule = async ({ data: dataPassed, fileName, kml }) => {
  const exportFileType = store.get(exportFileTypeAtom)
  let data = dataPassed.map((d) => omit(d, ['__typename', 'Symbol(id)']))
  // now we could manipulate the data, for instance apply mapFilter
  // TODO: filter by dataFilterState
  // 1. add field to choose to filter by dataFilterState
  // 2. depending on typename check if this table is filtered
  // 3. if yes: filter by dataFilterState by converting camelCase to lower_case
  if (data.length === 0) {
    return addNotification({
      message: 'Es gibt offenbar keine Daten, welche exportiert werden können',
      options: {
        variant: 'warning',
      },
    })
  }
  if (kml) {
    const { exportKml } = await import('./exportKml.ts')
    exportKml({
      fileName,
      data,
    })
  } else if (exportFileType === 'csv') {
    const { exportCsv } = await import('./exportCsv.ts')
    exportCsv({
      fileName,
      data,
    })
  } else {
    const { exportXlsx } = await import('./exportXlsx.ts')
    // pass some data in case something goes wrong
    await exportXlsx({
      fileName,
      data,
    })
  }
}
