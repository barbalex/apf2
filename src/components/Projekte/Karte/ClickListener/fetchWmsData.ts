import { store, addNotificationAtom } from '../../../../store/index.ts'
import type { Notification } from '../../../../store/index.ts'

import type { LayerData } from '../layers/Popup.js'

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
  // params values are scalars (strings/numbers from the WMS option objects)
  const query = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  )
  let res: Response
  try {
    res = await fetch(`${url}?${query}`)
  } catch (error) {
    // fetch only rejects on network errors ("Failed to fetch")
    console.error(`fetchWmsData ${layerLabel}:`, error)
    store.set(addNotificationAtom, {
      title: `Fehler beim Laden der Informationen${layerLabel ? ` für ${layerLabel}` : ''}`,
      body: (error as Error).message,
      intent: 'info',
      // the atom only models message/title/options but this
      // pre-existing payload is passed through to the store unchanged
    } as unknown as Omit<Notification, 'key'>)
    return undefined
  }
  // 406: user clicked where no feature exists
  if (res.status === 406) return undefined
  if (!res.ok) {
    console.error(`fetchWmsData ${layerLabel}: status ${res.status}`)
    store.set(addNotificationAtom, {
      title: `Fehler beim Laden der Informationen${layerLabel ? ` für ${layerLabel}` : ''}`,
      body: `Status ${res.status}`,
      intent: 'info',
    } as unknown as Omit<Notification, 'key'>)
    return undefined
  }
  return await res.text()
}
