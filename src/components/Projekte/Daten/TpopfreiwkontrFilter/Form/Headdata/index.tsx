import { type ChangeEvent } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { Select } from '../../../../../shared/Select.tsx'
import { treeDataFilterSetValueAtom } from '../../../../../../store/index.ts'
import { query } from './query.ts'

import type { AdresseId } from '../../../../../../models/apflora/AdresseId.ts'

import styles from '../../../Tpopfreiwkontr/Form/Headdata/index.module.css'

interface TpopfreiwkontrAdressesFilterQueryResult {
  allAdresses: {
    nodes: Array<{
      value: AdresseId
      label: string
    }>
  }
}

interface HeaddataProps {
  row: any
  activeTab: number
}

export const Headdata = ({ row, activeTab }: HeaddataProps) => {
  const setDataFilterValue = useSetAtom(treeDataFilterSetValueAtom)

  const apolloClient = useApolloClient()

  const { data } = useQuery<TpopfreiwkontrAdressesFilterQueryResult>({
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
  })

  const saveToDb = (event: ChangeEvent<HTMLInputElement>) =>
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
          value={row?.bearbeiter}
          field="bearbeiter"
          options={data?.allAdresses?.nodes ?? []}
          saveToDb={saveToDb}
        />
      </div>
    </div>
  )
}
