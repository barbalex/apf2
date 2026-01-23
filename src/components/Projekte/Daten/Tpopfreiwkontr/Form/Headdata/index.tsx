import { useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { Select } from '../../../../../shared/Select.tsx'
import {
  userNameAtom,
  isPrintAtom,
} from '../../../../../../store/index.ts'
import { query } from './query.ts'
import {
  adresse as adresseFragment,
  pop as popFragment,
  tpop as tpopFragment,
  tpopfreiwkontr as tpopfreiwkontrFragment,
  tpopkontrzaehlEinheitWerte as tpopkontrzaehlEinheitWerteFragment,
} from '../../../../../shared/fragments.ts'

import type { AdresseId } from '../../../../../../models/apflora/AdresseId.ts'

interface TpopfreiwkontrAdressesQueryResult {
  allAdresses: {
    nodes: Array<{
      value: AdresseId
      label: string
    }>
  }
}

interface HeaddataProps {
  pop: any
  tpop: any
  row: any
}

import styles from './index.module.css'

export const Headdata = ({ pop, tpop, row }: HeaddataProps) => {
  const isPrint = useAtomValue(isPrintAtom)
  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [errors, setErrors] = useState<string | null>(null)

  const { data } = useQuery<TpopfreiwkontrAdressesQueryResult>({
    queryKey: ['tpopfreiwkontrAdresses'],
    queryFn: async () => {
      const result =
        await apolloClient.query<TpopfreiwkontrAdressesQueryResult>({
          query,
        })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const saveToDb = async (event) => {
    const { value } = event.target
    const variables = {
      id: row.id,
      bearbeiter: value,
      changedBy: user.name,
    }
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation updateTpopkontrForEkfHeaddata(
            $id: UUID!
            $bearbeiter: UUID
            $changedBy: String
          ) {
            updateTpopkontrById(
              input: {
                id: $id
                tpopkontrPatch: {
                  bearbeiter: $bearbeiter
                  changedBy: $changedBy
                }
              }
            ) {
              tpopkontr {
                ...TpopfreiwkontrFields
                adresseByBearbeiter {
                  ...AdresseFields
                  usersByAdresseId {
                    totalCount
                  }
                }
                tpopByTpopId {
                  ...TpopFields
                  popByPopId {
                    ...PopFields
                    apByApId {
                      id
                      ekzaehleinheitsByApId {
                        nodes {
                          id
                          tpopkontrzaehlEinheitWerteByZaehleinheitId {
                            ...TpopkontrzaehlEinheitWerteFields
                          }
                        }
                      }
                    }
                  }
                }
                tpopkontrzaehlsByTpopkontrId {
                  nodes {
                    id
                    anzahl
                    einheit
                  }
                }
              }
            }
          }
          ${adresseFragment}
          ${popFragment}
          ${tpopFragment}
          ${tpopfreiwkontrFragment}
          ${tpopkontrzaehlEinheitWerteFragment}
        `,
        variables,
      })
    } catch (error) {
      return setErrors((error as Error).message)
    }
    tsQueryClient.invalidateQueries({
      queryKey: ['tpopkontrByIdQueryForEkf'],
    })
    setErrors(null)
  }

  const userCount = row?.adresseByBearbeiter?.usersByAdresseId?.totalCount ?? 0

  const statusValue = tpop?.status ?? ''
  const status =
    [200, 201, 202].includes(statusValue) ? 'angesiedelt' : 'natürlich'

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
          value={row.bearbeiter}
          field="bearbeiter"
          options={data?.allAdresses?.nodes ?? []}
          saveToDb={saveToDb}
          error={
            row.bearbeiter && !userCount && !isPrint ?
              'Es ist kein Benutzer mit dieser Adresse verbunden. Damit dieser Benutzer Kontrollen erfassen kann, muss er ein Benutzerkonto haben, dem diese Adresse zugeordnet wurde.'
            : errors
          }
        />
      </div>
      <div className={styles.statusLabel}>{status}</div>
    </div>
  )
}
