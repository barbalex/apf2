export function GetDataArrayFromExportObjectsWorker(exportObjects) {
  const dataArray = []
  // first the field names:
  dataArray.push(Object.keys(exportObjects[0]))
  // then the field values
  exportObjects.forEach((object) =>
    dataArray.push(
      Object.keys(object).map((key) => {
        return object[key]
      }),
    ),
  )
  return dataArray
}
