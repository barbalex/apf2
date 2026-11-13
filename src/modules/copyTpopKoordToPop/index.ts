import { apiFetch, apiUpdateByVariables } from '../api.ts'
import {
  addNotificationAtom,
  type Notification,
  getTsQueryClientFrom,
} from '../../store/index.ts'
import type { Store } from 'jotai'

const addNotification = (
  store: Store,
  notification: Omit<Notification, 'key'>,
) => store.set(addNotificationAtom, notification)

export const copyTpopKoordToPop = async ({
  store,
  id,
}: {
  store: Store
  id: string
}) => {
  const tsQueryClient = getTsQueryClientFrom(store)
  // fetch tpop
  let tpop:
    | { pop_id: string | null; geom_point: { coordinates: number[] } | null }
    | undefined
  try {
    const tpops = await apiFetch<
      { pop_id: string | null; geom_point: { coordinates: number[] } | null }[]
    >(`/q_tpop?id=eq.${id}&select=pop_id,geom_point`)
    tpop = tpops?.[0]
  } catch (error) {
    return addNotification(store, {
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  if (!tpop?.pop_id || !tpop?.geom_point) {
    return addNotification(store, {
      message:
        'Die Teil-Population hat keine Koordinaten oder keine Population',
      options: {
        variant: 'error',
      },
    })
  }
  const { geom_point: geomPoint0, pop_id: popId } = tpop

  // set pop coordinates
  try {
    let geomPoint = null
    // geom_point arrives as GeoJSON: coordinates[0]/[1] (former x/y)
    if (geomPoint0.coordinates?.[0]) {
      geomPoint = {
        type: 'Point',
        coordinates: geomPoint0.coordinates,
        // need to add crs otherwise PostGIS v2.5 (on server) errors
        crs: {
          type: 'name',
          properties: {
            name: 'urn:ogc:def:crs:EPSG::4326',
          },
        },
      }
    }
    await apiUpdateByVariables('pop', {
      id: popId,
      geomPoint,
    })
  } catch (error) {
    return addNotification(store, {
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  void tsQueryClient.invalidateQueries({
    queryKey: [`PopForMapQuery`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`TpopForMapQuery`],
  })

  return
}
