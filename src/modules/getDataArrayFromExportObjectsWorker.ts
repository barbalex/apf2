import { GetDataArrayFromExportObjectsWorker } from './getDataArrayFromExportObjects.worker.ts'

export const getDataArrayFromExportObjectsWorker =
  typeof window === 'object' && new GetDataArrayFromExportObjectsWorker()
