import { store, addNotificationAtom } from '../../../../store/index.ts'

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
      message: `Fehler beim Laden der Informationen${layerLabel ? ` für ${layerLabel}` : ''}: ${(error as Error).message}`,
      options: { variant: 'info' },
    })
    return undefined
  }
  // 406: user clicked where no feature exists
  if (res.status === 406) return undefined
  if (!res.ok) {
    console.error(`fetchWmsData ${layerLabel}: status ${res.status}`)
    store.set(addNotificationAtom, {
      message: `Fehler beim Laden der Informationen${layerLabel ? ` für ${layerLabel}` : ''}: Status ${res.status}`,
      options: { variant: 'info' },
    })
    return undefined
  }
  return await res.text()
}
