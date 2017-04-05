import axios from 'axios'

import apiBaseUrl from '../../modules/apiBaseUrl'
import deleteDatasetInIdb from './deleteDatasetInIdb'

export default (store, beobId) => {
  const { tree, table } = store
  const { activeNodes } = tree
  // delete beobzuordnung
  const deleteUrl = `${apiBaseUrl}/apflora/tabelle=beobzuordnung/tabelleIdFeld=NO_NOTE/tabelleId=${beobId}`
  axios.delete(deleteUrl)
    .then(() => {
      // remove this dataset in store.table
      table.beobzuordnung.delete(beobId)
      // remove from idb
      deleteDatasetInIdb(store, `beobzuordnung`, beobId)
      // set activeNodeArray to corresponding beob_bereitgestellt
      const newActiveNodeArray = [`Projekte`, activeNodes.projekt, `Arten`, activeNodes.ap, `nicht-beurteilte-Beobachtungen`, beobId]
      store.tree.setActiveNodeArray(newActiveNodeArray)
    })
    .catch((error) =>
      store.listError(error)
    )
}
