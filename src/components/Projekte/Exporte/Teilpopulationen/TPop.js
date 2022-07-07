import React, { useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const Teilpopulationen = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification, tableIsFiltered } = store
  const { tpopGqlFilter } = store[treeName]

  const [queryState, setQueryState] = useState()

  console.log('Exporte, TPop', { tpopGqlFilter, treeName })

  const onClickTPop = useCallback(async () => {
    setQueryState('lade Daten...')
    //console.time('querying')
    let result
    try {
      result = await client.query({
        query: gql`
          query tpopForExportQuery($filter: TpopFilter) {
            allTpops(
              filter: $filter
              orderBy: [AP_NAME_ASC, POP_BY_POP_ID__NR_ASC, NR_ASC]
            ) {
              nodes {
                popByPopId {
                  id
                  apByApId {
                    id
                    aeTaxonomyByArtId {
                      id
                      artname
                      familie
                    }
                    apBearbstandWerteByBearbeitung {
                      id
                      text
                    }
                    startJahr
                    apUmsetzungWerteByUmsetzung {
                      id
                      text
                    }
                  }
                  id
                  nr
                  name
                  popStatusWerteByStatus {
                    id
                    text
                  }
                  bekanntSeit
                  statusUnklar
                  statusUnklarBegruendung
                  x: lv95X
                  y: lv95Y
                }
                id
                nr
                gemeinde
                flurname
                status
                popStatusWerteByStatus {
                  id
                  text
                }
                bekanntSeit
                statusUnklar
                statusUnklarGrund
                x: lv95X
                y: lv95Y
                radius
                hoehe
                exposition
                klima
                neigung
                beschreibung
                katasterNr
                apberRelevant
                apberRelevantGrund
                eigentuemer
                kontakt
                nutzungszone
                bewirtschafter
                bewirtschaftung
                ekfrequenz
                ekfrequenzAbweichend
                adresseByEkfKontrolleur {
                  id
                  name
                }
                createdAt
                updatedAt
                changedBy
              }
            }
          }
        `,
        variables: {
          filter: tpopGqlFilter.filtered,
          // seems to have no or little influence on ram usage:
          //fetchPolicy: 'no-cache',
        },
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: { variant: 'error' },
      })
    }
    //console.timeEnd('querying')
    setQueryState('verarbeite...')
    //console.time('processing')
    const rows = (result.data?.allTpops?.nodes ?? []).map((n) => ({
      apId: n?.popByPopId?.apByApId?.id ?? null,
      apFamilie: n?.popByPopId?.apByApId?.aeTaxonomyByArtId?.familie ?? null,
      apArtname: n?.popByPopId?.apByApId?.aeTaxonomyByArtId?.artname ?? null,
      apBearbeitung:
        n?.popByPopId?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? null,
      apStartJahr: n?.popByPopId?.apByApId?.startJahr ?? null,
      apUmsetzung:
        n?.popByPopId?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? null,
      popId: n?.popByPopId?.id ?? null,
      popNr: n?.popByPopId?.nr ?? null,
      popName: n?.popByPopId?.name ?? null,
      popStatus: n?.popByPopId?.popStatusWerteByStatus?.text ?? null,
      popBekanntSeit: n?.popByPopId?.bekanntSeit ?? null,
      popStatusUnklar: n?.popByPopId?.statusUnklar ?? null,
      popStatusUnklarBegruendung:
        n?.popByPopId?.statusUnklarBegruendung ?? null,
      popX: n?.popByPopId?.x ?? null,
      popY: n?.popByPopId?.y ?? null,
      id: n.id,
      nr: n.nr,
      gemeinde: n.gemeinde,
      flurname: n.flurname,
      status: n.status,
      statusDecodiert: n?.popStatusWerteByStatus?.text ?? null,
      bekanntSeit: n.bekanntSeit,
      statusUnklar: n.statusUnklar,
      statusUnklarGrund: n.statusUnklarGrund,
      x: n.x,
      y: n.y,
      radius: n.radius,
      hoehe: n.hoehe,
      exposition: n.exposition,
      klima: n.klima,
      neigung: n.neigung,
      beschreibung: n.beschreibung,
      katasterNr: n.katasterNr,
      apberRelevant: n.apberRelevant,
      apberRelevantGrund: n.apberRelevantGrund,
      eigentuemer: n.eigentuemer,
      kontakt: n.kontakt,
      nutzungszone: n.nutzungszone,
      bewirtschafter: n.bewirtschafter,
      bewirtschaftung: n.bewirtschaftung,
      ekfrequenz: n.ekfrequenz,
      ekfrequenzAbweichend: n.ekfrequenzAbweichend,
      ekfKontrolleur: n?.adresseByEkfKontrolleur?.name ?? null,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
      changedBy: n.changedBy,
    }))
    const enrichedData = rows.map((oWithout) => {
      let o = { ...oWithout }
      let nachBeginnAp = null
      if (
        o.apStartJahr &&
        o.bekanntSeit &&
        [200, 201, 202].includes(o.status)
      ) {
        if (o.apStartJahr <= o.bekanntSeit) {
          nachBeginnAp = true
        } else {
          nachBeginnAp = false
        }
      }
      o.angesiedeltNachBeginnAp = nachBeginnAp
      return o
    })
    //console.timeEnd('processing')
    //console.time('exporting')
    if (rows.length === 0) {
      setQueryState(undefined)
      return enqueNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    await exportModule({
      data: enrichedData,
      fileName: 'Teilpopulationen',
      store,
    })
    setQueryState(undefined)
    //console.timeEnd('exporting')
  }, [client, enqueNotification, store, tpopGqlFilter])

  const tpopIsFiltered = tableIsFiltered({
    treeName,
    table: 'tpop',
  })

  return (
    <DownloadCardButton
      onClick={onClickTPop}
      color="inherit"
      disabled={!!queryState}
    >
      {`Teilpopulationen${tpopIsFiltered ? ' (gefiltert)' : ''}`}
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(Teilpopulationen)
