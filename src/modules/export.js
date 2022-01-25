import omit from 'lodash/omit'

import exportXlsx from './exportXlsx'
import exportCsv from './exportCsv'
import exportKml from './exportKml'
// this version is ogc-compatible and can be used for https://map.geo.admin.ch
//import exportKml from './exportKml_ogc'

const exportModule = async ({ data: dataPassed, fileName, kml, store }) => {
  const { exportFileType } = store
  let data = dataPassed.map((d) => omit(d, ['__typename', 'Symbol(id)']))
  // now we could manipulate the data, for instance apply mapFilter
  // TODO: filter by dataFilterState
  // 1. add field to choose to filter by dataFilterState
  // 2. depending on typename check if this table is filtered
  // 3. if yes: filter by dataFilterState by converting camelCase to lower_case
  if (data.length === 0) {
    return store.enqueNotification({
      message: 'Es gibt offenbar keine Daten, welche exportiert werden können',
      options: {
        variant: 'warning',
      },
    })
  }
  if (kml) {
    exportKml({
      fileName,
      data,
    })
  } else if (exportFileType === 'csv') {
    exportCsv({
      fileName,
      data,
    })
  } else {
    // pass some data in case something goes wrong
    await exportXlsx({
      fileName,
      data,
      store,
    })
  }
}

export default exportModule
