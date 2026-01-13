import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'

import styles from '../index.module.css'

export const TPopFuerWebgisBun = observer(() => {
  const store = useContext(MobxContext)
  const { enqueNotification } = store

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result
        try {
          result = await apolloClient.query({
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
          store,
          apolloClient,
        })
        setQueryState(undefined)
      }}
    >
      Teilpopulationen für WebGIS BUN
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
})
