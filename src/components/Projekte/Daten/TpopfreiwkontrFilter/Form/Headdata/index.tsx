import { useApolloClient } from '@apollo/client/react'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { Select } from '../../../../../shared/Select.tsx'
import { treeDataFilterSetValueAtom } from '../../../../../../store/index.ts'
import { query } from './query.ts'

import type { AdresseId } from '../../../../../../models/apflora/Adresse.ts'
import type { TpopfreiwkontrFilterRow } from '../index.tsx'

interface TpopfreiwkontrAdressesFilterQueryResult {
  allAdresses: {
    nodes: {
      value: AdresseId
      label: string
    }[]
  }
}

interface HeaddataProps {
  row: TpopfreiwkontrFilterRow | undefined
  activeTab: number
}

import styles from '../../../Tpopfreiwkontr/Form/Headdata/index.module.css'

// react-query v5 omitted suspense from the public useQuery options
// although it is still honored at runtime
type TpopfreiwkontrAdressesFilterUseQueryOptions = UseQueryOptions<
  TpopfreiwkontrAdressesFilterQueryResult | undefined,
  Error
> & {
  suspense: boolean
}

export const Headdata = ({ row, activeTab }: HeaddataProps) => {
  const setDataFilterValue = useSetAtom(treeDataFilterSetValueAtom)

  const apolloClient = useApolloClient()

  const adressesQueryOptions: TpopfreiwkontrAdressesFilterUseQueryOptions = {
    queryKey: ['tpopfreiwkontrFilterAdresses'],
    queryFn: async () => {
      const result =
        await apolloClient.query<TpopfreiwkontrAdressesFilterQueryResult>({
          query,
        })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
    staleTime: Infinity,
    gcTime: Infinity,
  }
  const { data } = useQuery(adressesQueryOptions)

  const saveToDb = (event: {
    target: { name?: string; value: string | number | null }
  }) =>
    setDataFilterValue({
      table: 'tpopfreiwkontr',
      key: 'bearbeiter',
      value: event.target.value,
      index: activeTab,
    })

  return (
    <div className={styles.container}>
      <div className={styles.bearbLabel}>BeobachterIn</div>
      <div className={styles.bearbVal}>
        <Select
          key={`${row?.id}${activeTab}bearbeiter`}
          name="bearbeiter"
          value={row?.bearbeiter ?? null}
          field="bearbeiter"
          options={data?.allAdresses?.nodes ?? []}
          saveToDb={saveToDb}
        />
      </div>
    </div>
  )
}
