import { useEffect } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { useParams } from 'react-router'

import { useProjekteTabs } from '../../modules/useProjekteTabs.ts'

import {
  addNotificationAtom,
  mapActiveApfloraLayersAtom,
  mapShowApfLayersForMultipleApsAtom,
} from '../../store/index.ts'

// TODO: only show messages if map is visible
export const ApfLayerNotifier = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const showApfLayersForMultipleAps = useAtomValue(
    mapShowApfLayersForMultipleApsAtom,
  )
  const activeApfloraLayers = useAtomValue(mapActiveApfloraLayersAtom)
  const { apId } = useParams()

  const [projekteTabs] = useProjekteTabs()
  const mapIsOpen = projekteTabs.includes(`karte`)

  useEffect(() => {
    if (
      !apId &&
      activeApfloraLayers.length &&
      !showApfLayersForMultipleAps &&
      mapIsOpen
    ) {
      // Either: apId was unset
      // Or: with unset apId an apfloraLayer was activated
      addNotification({
        message: `In der Standard-Einstellung werden Apflora-Layer nur eingeblendet, wenn bloss eine einzelne Art im Navigationsbaum aktiv ist. Sie können im Layertool der Karte "Layer auch anzeigen, wenn mehr als eine Art aktiv ist" wählen, wenn sie explizit die Layer für mehrere Arten anzeigen möchten. Und die dafür erforderliche Geduld sowie einen genügend leistungsfähigen Computer haben.`,
        options: {
          variant: 'info',
          autoHideDuration: 20000,
        },
      })
    }
    // do not react to changes in showApfLayersForMultipleAps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apId, activeApfloraLayers.length, mapIsOpen])

  useEffect(() => {
    if (
      !apId &&
      activeApfloraLayers.length &&
      showApfLayersForMultipleAps &&
      mapIsOpen
    ) {
      addNotification({
        message: `Sie laden in der Karte apflora-Informationen für mehrere Arten. Potentiell kann es sich um zehntausende von Datensätzen handeln. Sie müssen mit Verzögerungen bis hin zu Abstürzen rechnen. Empfehlung bei Problemen: minimieren Sie die Anzahl Arten mit einem Filter`,
        options: {
          variant: 'info',
          autoHideDuration: 10000,
        },
      })
    }
    // do not react to changes in showApfLayersForMultipleAps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showApfLayersForMultipleAps, activeApfloraLayers.length, apId, mapIsOpen])

  return null
}
