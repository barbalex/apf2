import { memo, useState, useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery, useApolloClient, gql } from '@apollo/client'

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

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
`
const Container = styled(Area)`
  grid-area: headdata;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    'popLabel popVal popVal'
    'tpopLabel tpopVal tpopVal'
    'koordLabel koordVal koordVal'
    'tpopNrLabel tpopNrVal statusVal'
    'bearbLabel bearbVal bearbVal';
  grid-column-gap: 10px;
  div:nth-of-type(n + 3) {
    padding-top: 10px;
  }
`
const Label = styled.div`
  font-weight: 700;
`
const PopLabel = styled(Label)`
  grid-area: popLabel;
`
const PopVal = styled.div`
  grid-area: popVal;
`
const TpopLabel = styled(Label)`
  grid-area: tpopLabel;
`
const TpopVal = styled.div`
  grid-area: tpopVal;
`
const KoordLabel = styled(Label)`
  grid-area: koordLabel;
`
const KoordVal = styled.div`
  grid-area: koordVal;
`
const TpopNrLabel = styled(Label)`
  grid-area: tpopNrLabel;
`
const TpopNrVal = styled.div`
  grid-area: tpopNrVal;
`
const BearbLabel = styled(Label)`
  grid-area: bearbLabel;
  margin-top: 5px;
`
const BearbVal = styled.div`
  grid-area: bearbVal;
  > div {
    margin-top: -5px;
    padding-bottom: 0;
  }
`
const StatusLabel = styled(Label)`
  grid-area: statusVal;
`

export const Headdata = memo(
  observer(({ pop, tpop, row }) => {
    const client = useApolloClient()
    const store = useContext(MobxContext)
    const { user, isPrint } = store
    const { data, loading, error } = useQuery(query)
    const [errors, setErrors] = useState(null)

    const saveToDb = useCallback(
      async (event) => {
        const { value } = event.target
        const variables = {
          id: row.id,
          bearbeiter: value,
          changedBy: user.name,
        }
        try {
          await client.mutate({
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
            refetchQueries: ['tpopkontrByIdQueryForEkf'],
          })
        } catch (error) {
          return setErrors(error.message)
        }
        setErrors(null)
      },
      [row.id, user.name, client],
    )

    const userCount =
      row?.adresseByBearbeiter?.usersByAdresseId?.totalCount ?? 0

    const statusValue = tpop?.status ?? ''
    const status =
      [200, 201, 202].includes(statusValue) ? 'angesiedelt' : 'natürlich'

    if (error) return <Error error={error} />
    return (
      <Container>
        <PopLabel>Population</PopLabel>
        <PopVal>{pop?.name ?? ''}</PopVal>
        <TpopLabel>Teilpopulation</TpopLabel>
        <TpopVal>{tpop?.flurname ?? ''}</TpopVal>
        <KoordLabel>Koordinaten</KoordLabel>
        <KoordVal>{`${tpop?.lv95X ?? ''} / ${tpop?.lv95Y ?? ''}`}</KoordVal>
        <TpopNrLabel>Teilpop.Nr.</TpopNrLabel>
        <TpopNrVal>{`${pop?.nr ?? ''}.${tpop?.nr ?? ''}`}</TpopNrVal>
        <BearbLabel>BeobachterIn</BearbLabel>
        <BearbVal>
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
        </BearbVal>
        <StatusLabel>{status}</StatusLabel>
      </Container>
    )
  }),
)
