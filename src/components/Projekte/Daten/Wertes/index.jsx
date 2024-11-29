import { memo, useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

import { List } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(() => {
  const apolloClient = useApolloClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeWertes'],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeWertesQuery {
            allAdresses {
              totalCount
            }
            allTpopApberrelevantGrundWertes {
              totalCount
            }
            allEkAbrechnungstypWertes {
              totalCount
            }
            allTpopkontrzaehlEinheitWertes {
              totalCount
            }
          }
        `,
        fetchPolicy: 'no-cache',
      }),
  })
  const totalCount = 4
  const adressesCount = data?.data?.allAdresses?.totalCount ?? 0
  const tpopApberrelevantGrundWertesCount =
    data?.data?.allTpopApberrelevantGrundWertes?.totalCount ?? 0
  const ekAbrechnungstypWertesCount =
    data?.data?.allEkAbrechnungstypWertes?.totalCount ?? 0
  const tpopkontrzaehlEinheitWertesCount =
    data?.data?.allTpopkontrzaehlEinheitWertes?.totalCount ?? 0

  const items = useMemo(
    () => [
      {
        id: 'Adressen',
        label: `Adressen (${adressesCount})`,
      },
      {
        id: 'ApberrelevantGrundWerte',
        label: `Teil-Population: Grund für AP-Bericht Relevanz (${tpopApberrelevantGrundWertesCount})`,
      },
      {
        id: 'EkAbrechnungstypWerte',
        label: `Teil-Population: EK-Abrechnungstypen (${ekAbrechnungstypWertesCount})`,
      },
      {
        id: 'TpopkontrzaehlEinheitWerte',
        label: `Teil-Population: Zähl-Einheiten (${tpopkontrzaehlEinheitWertesCount})`,
      },
    ],
    [
      adressesCount,
      tpopApberrelevantGrundWertesCount,
      ekAbrechnungstypWertesCount,
      tpopkontrzaehlEinheitWertesCount,
    ],
  )

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <List
      items={items}
      title="Werte-Listen"
      totalCount={totalCount}
    />
  )
})
