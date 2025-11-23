export const getDataArrayFromExportObjects = (exportObjects) => {
  const dataArray = []
  // first the field names:
  dataArray.push(Object.keys(exportObjects[0]))
  // then the field values
  exportObjects.forEach((object) => dataArray.push(Object.values(object)))
  return dataArray
}
