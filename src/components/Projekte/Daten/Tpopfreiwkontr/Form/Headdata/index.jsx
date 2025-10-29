import { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import { Select } from '../../../../../shared/Select.jsx'
import { MobxContext } from '../../../../../../mobxContext.js'
import { query } from './query.js'
import {
  adresse as adresseFragment,
  pop as popFragment,
  tpop as tpopFragment,
  tpopfreiwkontr as tpopfreiwkontrFragment,
  tpopkontrzaehlEinheitWerte as tpopkontrzaehlEinheitWerteFragment,
} from '../../../../../shared/fragments.js'
import { Error } from '../../../../../shared/Error.jsx'

import {
  container,
  popLabel,
  popVal,
  tpopLabel,
  tpopVal,
  koordLabel,
  koordVal,
  tpopNrLabel,
  tpopNrVal,
  bearbLabel,
  bearbVal,
  statusLabel,
} from './index.module.css'

export const Headdata = observer(({ pop, tpop, row }) => {
  const store = useContext(MobxContext)
  const { user, isPrint } = store

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [errors, setErrors] = useState(null)

  const { data, loading, error } = useQuery(query)

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
      return setErrors(error.message)
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

  if (error) return <Error error={error} />
  return (
    <div className={container}>
      <div className={popLabel}>Population</div>
      <div className={popVal}>{pop?.name ?? ''}</div>
      <div className={tpopLabel}>Teilpopulation</div>
      <div className={tpopVal}>{tpop?.flurname ?? ''}</div>
      <div className={koordLabel}>Koordinaten</div>
      <div
        className={koordVal}
      >{`${tpop?.lv95X ?? ''} / ${tpop?.lv95Y ?? ''}`}</div>
      <div className={tpopNrLabel}>Teilpop.Nr.</div>
      <div className={tpopNrVal}>{`${pop?.nr ?? ''}.${tpop?.nr ?? ''}`}</div>
      <div className={bearbLabel}>BeobachterIn</div>
      <div className={bearbVal}>
        <Select
          key={`${row.id}bearbeiter`}
          name="bearbeiter"
          value={row.bearbeiter}
          field="bearbeiter"
          options={data?.allAdresses?.nodes ?? []}
          loading={loading}
          saveToDb={saveToDb}
          error={
            row.bearbeiter && !userCount && !isPrint ?
              'Es ist kein Benutzer mit dieser Adresse verbunden. Damit dieser Benutzer Kontrollen erfassen kann, muss er ein Benutzerkonto haben, dem diese Adresse zugeordnet wurde.'
            : errors
          }
        />
      </div>
      <div className={statusLabel}>{status}</div>
    </div>
  )
})
