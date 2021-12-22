import React, { useContext, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const PopBerichte = () => {
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
              query popPopberUndMassnberQuery {
                allPops(filter: { vPopPopberundmassnbersByPopIdExist: true }) {
                  nodes {
                    id
                    vPopPopberundmassnbersByPopId {
                      nodes {
                        apId
                        artname
                        apBearbeitung
                        apStartJahr
                        apUmsetzung
                        popId
                        popNr
                        popName
                        popStatus
                        popBekanntSeit
                        popStatusUnklar
                        popStatusUnklarBegruendung
                        popX
                        popY
                        popCreatedAt
                        popUpdatedAt
                        popChangedBy
                        jahr
                        popberId
                        popberJahr
                        popberEntwicklung
                        popberBemerkungen
                        popberCreatedAt
                        popberUpdatedAt
                        popberChangedBy
                        popmassnberId
                        popmassnberJahr
                        popmassnberEntwicklung
                        popmassnberBemerkungen
                        popmassnberCreatedAt
                        popmassnberUpdatedAt
                        popmassnberChangedBy
                      }
                    }
                  }
                }
              }
            `,
          })
        } catch (error) {
          enqueNotification({
            message: error.message,
            options: {
              variant: 'error',
            },
          })
        }
        setQueryState('verarbeite...')
        // need to flatmap because view delivers multiple rows per pop
        const rows = (result?.data?.allPops?.nodes ?? []).flatMap((z0) =>
          (z0?.vPopPopberundmassnbersByPopId?.nodes ?? []).map((z) => ({
            ap_id: z.apId,
            artname: z.artname,
            ap_bearbeitung: z.apBearbeitung,
            ap_start_jahr: z.apStartJahr,
            ap_umsetzung: z.apUmsetzung,
            pop_id: z.popId,
            pop_nr: z.popNr,
            pop_name: z.popName,
            pop_status: z.popStatus,
            pop_bekannt_seit: z.popBekanntSeit,
            pop_status_unklar: z.popStatusUnklar,
            pop_status_unklar_begruendung: z.popStatusUnklarBegruendung,
            pop_x: z.popX,
            pop_y: z.popY,
            pop_created_at: z.popCreatedAt,
            pop_updated_at: z.popUpdatedAt,
            pop_changed_by: z.popChangedBy,
            jahr: z.jahr,
            popber_id: z.popberId,
            popber_jahr: z.popberJahr,
            popber_entwicklung: z.popberEntwicklung,
            popber_bemerkungen: z.popberBemerkungen,
            popber_created_at: z.popberCreatedAt,
            popber_updated_at: z.popberUpdatedAt,
            popber_changed_by: z.popberChangedBy,
            popmassnber_id: z.popmassnberId,
            popmassnber_jahr: z.popmassnberJahr,
            popmassnber_entwicklung: z.popmassnberEntwicklung,
            popmassnber_bemerkungen: z.popmassnberBemerkungen,
            popmassnber_created_at: z.popmassnberCreatedAt,
            popmassnber_updated_at: z.popmassnberUpdatedAt,
            popmassnber_changed_by: z.popmassnberChangedBy,
          })),
        )
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
          data: sortBy(rows, ['artname', 'pop_nr', 'jahr']),
          fileName: 'PopulationenPopUndMassnBerichte',
          idKey: 'pop_id',
          xKey: 'pop_wgs84lat',
          yKey: 'pop_wgs84long',
          store,
        })
        setQueryState(undefined)
      }}
    >
      Populationen inkl. Populations- und Massnahmen-Berichte
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(PopBerichte)
