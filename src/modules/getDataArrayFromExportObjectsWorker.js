import GetDataArrayFromExportObjectsWorker from './getDataArrayFromExportObjects.worker.js'

const getDataArrayFromExportObjectsWorker =
  typeof window === 'object' && new GetDataArrayFromExportObjectsWorker()

export default getDataArrayFromExportObjectsWorker
