import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import storeContext from '../../storeContext'

const ApfLayerNotifier = () => {
  const store = useContext(storeContext)
  const {
    showApfLayersForMultipleAps,
    enqueNotification,
    activeApfloraLayers,
  } = store

  const { apId } = useParams()

  useEffect(() => {
    if (!apId && activeApfloraLayers.length && !showApfLayersForMultipleAps) {
      // Either: apId was unset
      // Or: with unset apId an apfloraLayer was activated
      enqueNotification({
        message: `In der Standard-Einstellung werden Apflora-Layer nur eingeblendet, wenn bloss eine einzelne Art im Navigationsbaum aktiv ist. Sie können im Layertool der Karte "Layer auch anzeigen, wenn mehr als eine Art aktiv ist" wählen, wenn sie explizit die Layer für mehrere Arten anzeigen möchten. Und die dafür erforderliche Geduld sowie einen genügend leistungsfähigen Computer haben.`,
        options: {
          variant: 'info',
          autoHideDuration: 20000,
        },
      })
    }
    // do not react to changes in showApfLayersForMultipleAps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apId, activeApfloraLayers.length])

  useEffect(() => {
    if (!apId && activeApfloraLayers.length && showApfLayersForMultipleAps) {
      enqueNotification({
        message: `Sie laden in der Karte apflora-Informationen für mehrere Arten. Potentiell kann es sich um zehntausende von Datensätzen handeln. Sie müssen mit Verzögerungen bis hin zu Abstürzen rechnen.`,
        options: {
          variant: 'info',
          autoHideDuration: 10000,
        },
      })
    }
    // do not react to changes in showApfLayersForMultipleAps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showApfLayersForMultipleAps, activeApfloraLayers.length, apId])

  return null
}

export default observer(ApfLayerNotifier)
