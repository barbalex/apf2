import { useContext, useState } from 'react'
import { sortBy } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'

import { button, progress } from '../index.module.css'

export const Idealbiotop = observer(() => {
  const store = useContext(MobxContext)
  const { enqueNotification } = store

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickIdealbiotop = async () => {
    setQueryState('lade Daten...')
    let result
    try {
      result = await apolloClient.query({
        query: gql`
          query idealbiotopsForExportQuery {
            allIdealbiotops {
              nodes {
                id
                apId
                apByApId {
                  id
                  aeTaxonomyByArtId {
                    id
                    artname
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
                  adresseByBearbeiter {
                    id
                    name
                  }
                }
                erstelldatum
                hoehenlage
                region
                exposition
                besonnung
                hangneigung
                bodenTyp
                bodenKalkgehalt
                bodenDurchlaessigkeit
                bodenHumus
                bodenNaehrstoffgehalt
                wasserhaushalt
                konkurrenz
                moosschicht
                krautschicht
                strauchschicht
                baumschicht
                bemerkungen
                createdAt
                updatedAt
                changedBy
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
    const rows = (result.data?.allIdealbiotops?.nodes ?? []).map((z) => ({
      ap_id: z.apId,
      artname: z?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
      ap_bearbeitung: z?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z?.apByApId?.startJahr ?? '',
      ap_umsetzung: z?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.apByApId?.adresseByBearbeiter?.name ?? '',
      id: z.id,
      erstelldatum: z.erstelldatum,
      hoehenlage: z.hoehenlage,
      region: z.region,
      exposition: z.exposition,
      besonnung: z.besonnung,
      hangneigung: z.hangneigung,
      boden_typ: z.bodenTyp,
      boden_kalkgehalt: z.bodenKalkgehalt,
      boden_durchlaessigkeit: z.bodenDurchlaessigkeit,
      boden_humus: z.bodenHumus,
      boden_naehrstoffgehalt: z.bodenNaehrstoffgehalt,
      wasserhaushalt: z.wasserhaushalt,
      konkurrenz: z.konkurrenz,
      moosschicht: z.moosschicht,
      krautschicht: z.krautschicht,
      strauchschicht: z.strauchschicht,
      baumschicht: z.baumschicht,
      bemerkungen: z.bemerkungen,
      created_at: z.createdAt,
      updated_at: z.updatedAt,
      changed_by: z.changedBy,
    }))
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
      data: sortBy(rows, ['artname']),
      fileName: 'Idealbiotope',
      store,
      apolloClient,
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={button}
      onClick={onClickIdealbiotop}
      color="inherit"
      disabled={!!queryState}
    >
      Idealbiotope
      {queryState ?
        <span className={progress}>{queryState}</span>
      : null}
    </Button>
  )
})
