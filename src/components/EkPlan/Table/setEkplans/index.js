import get from 'lodash/get'

import queryEkplans from './queryEkplans'
import mutationDeleteEkplans from './mutationDeleteEkplans'

export default async ({
  tpopId,
  ekfrequenzCode,
  ekfrequenzStartjahr,
  client,
  store,
}) => {
  console.log('TODO: set ekplan', {
    tpopId,
    ekfrequenzCode,
    ekfrequenzStartjahr,
    client,
    store,
  })
  // 1. query all ekplans beginning with ekfrequenzStartJahr
  let ekplansResult
  try {
    ekplansResult = await client.query({
      query: queryEkplans,
      variables: {
        tpopId,
        jahr: ekfrequenzStartjahr,
      },
    })
  } catch (error) {
    return store.enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const ekplansToDelete = get(ekplansResult, 'data.allEkplans.nodes').map(
    e => e.id,
  )
  console.log('setEkplans', { ekplansResult, ekplansToDelete })
  // 2. delete them
  ekplansToDelete.map(id => {
    client.mutate({
      mutation: mutationDeleteEkplans,
      variables: {
        id,
      },
    })
  })
  // 3. fetch ekfrequenz.kontrolljahre for this tpop.ekfrequenz
  // 4. add kontrolljahre to ekplan
  // 5. tell user how it went
}
