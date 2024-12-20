import { GetDataArrayFromExportObjectsWorker } from './getDataArrayFromExportObjects.worker.js'

export const getDataArrayFromExportObjectsWorker =
  typeof window === 'object' && new GetDataArrayFromExportObjectsWorker()
