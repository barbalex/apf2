import { gql } from '@apollo/client'

const setIdsFiltered = async (store) => {
  const { enqueNotification, mapFilter, client } = store
  const { setPopIdsFiltered, setTpopIdsFiltered, setBeobIdsFiltered } =
    store.tree.map
  const geometry = mapFilter?.[0]?.geometry
  if (!geometry) {
    setPopIdsFiltered([])
    setTpopIdsFiltered([])
    setBeobIdsFiltered([])
    return
  }

  let popResult
  try {
    popResult = await client.query({
      query: gql`
        query PopsFilteredQuery($filter: PopFilter!) {
          allPops(filter: $filter) {
            nodes {
              id
            }
          }
        }
      `,
      variables: {
        filter: {
          geomPoint: { coveredBy: mapFilter?.[0]?.geometry },
        },
      },
    })
  } catch (error) {
    enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const popIds = popResult?.data?.allPops?.nodes?.map((n) => n.id) ?? []
  setPopIdsFiltered(popIds)

  let tpopResult
  try {
    tpopResult = await client.query({
      query: gql`
        query TpopsFilteredQuery($filter: TpopFilter!) {
          allTpops(filter: $filter) {
            nodes {
              id
            }
          }
        }
      `,
      variables: {
        filter: {
          geomPoint: { coveredBy: mapFilter?.[0]?.geometry },
        },
      },
    })
  } catch (error) {
    enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const tpopIds = tpopResult?.data?.allTpops?.nodes?.map((n) => n.id) ?? []
  setTpopIdsFiltered(tpopIds)

  let beobResult
  try {
    beobResult = await client.query({
      query: gql`
        query BeobsFilteredQuery($filter: BeobFilter!) {
          allBeobs(filter: $filter) {
            nodes {
              id
            }
          }
        }
      `,
      variables: {
        filter: {
          geomPoint: { coveredBy: mapFilter?.[0]?.geometry },
        },
      },
    })
  } catch (error) {
    enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const beobIds = beobResult?.data?.allBeobs?.nodes?.map((n) => n.id) ?? []
  setBeobIdsFiltered(beobIds)
}

export default setIdsFiltered
