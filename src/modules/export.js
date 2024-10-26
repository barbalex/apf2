// this version is ogc-compatible and can be used for https://map.geo.admin.ch
//import exportKml from './exportKml_ogc'

export const exportModule = async ({
  data: dataPassed,
  fileName,
  kml,
  store,
}) => {
  const { exportFileType } = store
  const { default: omit } = await import('lodash/omit')
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
    const { default: exportKml } = await import('./exportKml.js')
    exportKml({
      fileName,
      data,
    })
  } else if (exportFileType === 'csv') {
    const { default: exportCsv } = await import('./exportCsv.js')
    exportCsv({
      fileName,
      data,
    })
  } else {
    const { default: exportXlsx } = await import('./exportXlsx.js')
    // pass some data in case something goes wrong
    await exportXlsx({
      fileName,
      data,
      store,
    })
  }
}
