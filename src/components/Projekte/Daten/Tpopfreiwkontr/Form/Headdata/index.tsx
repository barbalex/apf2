import { apiUpdateByVariables } from '../../../../../../modules/api.ts'
import type { SaveToDbEvent } from '../../../../../shared/types.ts'
import { useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { Select } from '../../../../../shared/Select.tsx'
import { userNameAtom, isPrintAtom } from '../../../../../../store/index.ts'
import { query } from './query.ts'

import type { AdresseId } from '../../../../../../models/apflora/Adresse.ts'
import type {
  TpopkontrRow,
  TpopfreiwkontrPopRow,
  TpopfreiwkontrTpopRow,
} from '../index.tsx'

interface TpopfreiwkontrAdressesQueryResult {
  allAdresses: {
    nodes: {
      value: AdresseId
      label: string | null
    }[]
  }
}

interface HeaddataProps {
  pop: Partial<TpopfreiwkontrPopRow>
  tpop: Partial<TpopfreiwkontrTpopRow>
  row: Partial<TpopkontrRow>
}

import styles from './index.module.css'

export const Headdata = ({ pop, tpop, row }: HeaddataProps) => {
  const isPrint = useAtomValue(isPrintAtom)
  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [errors, setErrors] = useState<string | null>(null)

  const { data } = useQuery({
    queryKey: ['tpopfreiwkontrAdresses'],
    queryFn: async () => {
      const result =
        await apolloClient.query<TpopfreiwkontrAdressesQueryResult>({
          query,
        })
      if (result.error) throw result.error
      return result.data
    },
  })

  const saveToDb = async (event: SaveToDbEvent) => {
    const { value } = event.target
    const variables = {
      id: row.id,
      bearbeiter: value,
      changedBy: userName,
    }
    try {
      await apiUpdateByVariables('tpopkontr', variables)
    } catch (error) {
      return setErrors((error as Error).message)
    }
    void tsQueryClient.invalidateQueries({
      queryKey: ['tpopkontrByIdQueryForEkf'],
    })
    setErrors(null)
  }

  const userCount = row?.adresseByBearbeiter?.usersByAdresseId?.totalCount ?? 0

  const statusValue = tpop?.status ?? ''
  const status =
    ([200, 201, 202] as (number | string)[]).includes(statusValue) ?
      'angesiedelt'
    : 'natürlich'

  return (
    <div className={styles.container}>
      <div className={styles.popLabel}>Population</div>
      <div className={styles.popVal}>{pop?.name ?? ''}</div>
      <div className={styles.tpopLabel}>Teilpopulation</div>
      <div className={styles.tpopVal}>{tpop?.flurname ?? ''}</div>
      <div className={styles.koordLabel}>Koordinaten</div>
      <div
        className={styles.koordVal}
      >{`${tpop?.lv95X ?? ''} / ${tpop?.lv95Y ?? ''}`}</div>
      <div className={styles.tpopNrLabel}>Teilpop.Nr.</div>
      <div
        className={styles.tpopNrVal}
      >{`${pop?.nr ?? ''}.${tpop?.nr ?? ''}`}</div>
      <div className={styles.bearbLabel}>BeobachterIn</div>
      <div className={styles.bearbVal}>
        <Select
          key={`${row.id}bearbeiter`}
          name="bearbeiter"
          value={row.bearbeiter ?? null}
          field="bearbeiter"
          options={data?.allAdresses?.nodes ?? []}
          saveToDb={(event) => void saveToDb(event)}
          error={
            row.bearbeiter && !userCount && !isPrint ?
              'Es ist kein Benutzer mit dieser Adresse verbunden. Damit dieser Benutzer Kontrollen erfassen kann, muss er ein Benutzerkonto haben, dem diese Adresse zugeordnet wurde.'
            : (errors ?? '')
          }
        />
      </div>
      <div className={styles.statusLabel}>{status}</div>
    </div>
  )
}
