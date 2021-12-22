import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const Teilpopulationen = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const [queryState, setQueryState] = useState()

  return (
    <DownloadCardButton
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result
        try {
          result = await client.query({
            query: gql`
              query viewTpopWebgisbuns {
                allVTpopWebgisbuns {
                  nodes {
                    APARTID: apartid
                    APART: apart
                    APSTATUS: apstatus
                    APSTARTJAHR: apstartjahr
                    APSTANDUMSETZUNG: apstandumsetzung
                    POPGUID: popguid
                    POPNR: popnr
                    POPNAME: popname
                    POPSTATUS: popstatus
                    POPSTATUSUNKLAR: popstatusunklar
                    POPUNKLARGRUND: popunklargrund
                    POPBEKANNTSEIT: popbekanntseit
                    POP_X: popX
                    POP_Y: popY
                    TPOPID: tpopid
                    TPOPGUID: tpopguid
                    TPOPNR: tpopnr
                    TPOPGEMEINDE: tpopgemeinde
                    TPOPFLURNAME: tpopflurname
                    TPOPSTATUS: tpopstatus
                    tpopapberrelevant: tPopApberRelevant
                    tpopapberrelevantgrund: tPopApberRelevantGrund
                    TPOPSTATUSUNKLAR: tpopstatusunklar
                    TPOPUNKLARGRUND: tpopunklargrund
                    TPOP_X: tpopX
                    TPOP_Y: tpopY
                    TPOPRADIUS: tpopradius
                    TPOPHOEHE: tpophoehe
                    TPOPEXPOSITION: tpopexposition
                    TPOPKLIMA: tpopklima
                    TPOPHANGNEIGUNG: tpophangneigung
                    TPOPBESCHREIBUNG: tpopbeschreibung
                    TPOPKATASTERNR: tpopkatasternr
                    TPOPVERANTWORTLICH: tpopverantwortlich
                    TPOPBERICHTSRELEVANZ: tpopberichtsrelevanz
                    TPOPBEKANNTSEIT: tpopbekanntseit
                    TPOPEIGENTUEMERIN: tpopeigentuemerin
                    TPOPKONTAKTVO: tpopkontaktVo
                    TPOPNUTZUNGSZONE: tpopNutzungszone
                    TPOPBEWIRTSCHAFTER: tpopbewirtschafter
                    TPOPBEWIRTSCHAFTUNG: tpopbewirtschaftung
                    TPOPCHANGEDAT: tpopchangedat
                    TPOPCHANGEBY: tpopchangeby
                  }
                }
              }
            `,
          })
        } catch (error) {
          enqueNotification({
            message: error.message,
            options: { variant: 'error' },
          })
        }
        setQueryState('verarbeite...')
        const rows = result.data?.allVTpopWebgisbuns?.nodes ?? []
        if (rows.length === 0) {
          setQueryState(undefined)
          return enqueNotification({
            message: 'Die Abfrage retournierte 0 Datensätze',
            options: {
              variant: 'warning',
            },
          })
        }
        exportModule({
          data: rows,
          fileName: 'TeilpopulationenWebGisBun',
          idKey: 'TPOPID',
          xKey: 'TPOP_WGS84LAT',
          yKey: 'TPOP_WGS84LONG',
          store,
        })
        setQueryState(undefined)
      }}
    >
      Teilpopulationen für WebGIS BUN
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(Teilpopulationen)
