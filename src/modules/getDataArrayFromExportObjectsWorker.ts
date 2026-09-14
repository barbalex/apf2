// the worker variant is not actually a worker (see the .worker file) —
// it is only used behind a flag in getDataArrayFromExportObjects
import { GetDataArrayFromExportObjectsWorker } from './getDataArrayFromExportObjects.worker.ts'

export const getDataArrayFromExportObjectsWorker =
  typeof window === 'object' && GetDataArrayFromExportObjectsWorker
