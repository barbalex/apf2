export const GetDataArrayFromExportObjectsWorker = (exportObjects) => [
  // first the field names:
  Object.keys(exportObjects[0]),
  // then the field values
  ...exportObjects.map((o) => Object.values(o)),
]
