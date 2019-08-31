import queryEkplans from './queryEkplans'

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
  // 2. delete them
  // 3. fetch ekfrequenz.kontrolljahre for this tpop.ekfrequenz
  // 4. add kontrolljahre to ekplan
  // 5. tell user how it went
}
