import axios from 'redaxios'
import type { Response } from 'redaxios'

import { store, addNotificationAtom } from '../../../../store/index.ts'
import type { Notification } from '../../../../store/index.ts'

import type { LayerData } from '../layers/Popup.js'

export interface RedaxiosError {
  status?: number
  response?: { data?: unknown; status?: number; headers?: unknown }
  request?: unknown
  message?: string
  toJSON?: () => unknown
}

interface FetchWmsDataProps {
  url: string
  params: Record<string, unknown>
  layerLabel: string
}

export const fetchWmsData = async ({
  url,
  params,
  layerLabel,
}: FetchWmsDataProps): Promise<string | LayerData[] | undefined> => {
  let res: Response<string> | undefined
  let failedToFetch = false
  try {
    res = await axios<string>({
      method: 'get',
      url,
      params,
    })
  } catch (error) {
    // redaxios rejections are response-like objects
    // augmented with optional request and response fields
    const axiosError = error as RedaxiosError
    console.log({ error: axiosError, errorToJSON: axiosError?.toJSON?.(), res })
    if (axiosError.status == 406) {
      // user clicked where no feature exists
    } else if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('error.response.data', axiosError.response.data)
      console.error('error.response.status', axiosError.response.status)
      console.error('error.response.headers', axiosError.response.headers)
      failedToFetch = true
    } else if (axiosError.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error('error.request:', axiosError.request)
      failedToFetch = true
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('error.message', axiosError.message)
      failedToFetch = true
    }
    if (axiosError.message?.toLowerCase()?.includes('failed to fetch')) {
      failedToFetch = true
    }
    if (failedToFetch) {
      store.set(addNotificationAtom, {
        title: `Fehler beim Laden der Informationen${layerLabel ? ` für ${layerLabel}` : ''}`,
        body: axiosError.message,
        intent: 'info',
        // the atom only models message/title/options but this
        // pre-existing payload is passed through to the store unchanged
      } as unknown as Omit<Notification, 'key'>)
    }
  }
  if (!failedToFetch && res?.data) {
    return res.data
  }
  return undefined
}
