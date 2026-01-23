import { Dispatch, SetStateAction, type ChangeEvent } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { TextField } from '../../../shared/TextField.tsx'
import { TextFieldWithInfo } from '../../../shared/TextFieldWithInfo.tsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.tsx'
import { Status } from '../../../shared/Status.tsx'
import { SelectCreatableGemeinde } from '../../../shared/SelectCreatableGemeinde.tsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.tsx'
import { RadioButtonGroupWithInfo } from '../../../shared/RadioButtonGroupWithInfo.tsx'
import { TpopAbBerRelevantInfoPopover } from '../../../shared/TpopAbBerRelevantInfoPopover.tsx'
//import { getGemeindeForKoord } from '../../../../modules/getGemeindeForKoord.ts'

import type { TpopApberrelevantGrundWerteCode } from '../../../../models/apflora/TpopApberrelevantGrundWerteCode.ts'

import styles from './Tpop.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface TpopListsQueryResult {
  allTpopApberrelevantGrundWertes: {
    nodes: Array<{
      value: TpopApberrelevantGrundWerteCode
      label: string
    }>
  }
  allChAdministrativeUnits: {
    nodes: Array<{
      value: string
      label: string
    }>
  }
}

interface TpopProps {
  saveToDb: (event: ChangeEvent<HTMLInputElement>) => void
  fieldErrors: Record<string, string>
  setFieldErrors: Dispatch<SetStateAction<Record<string, string>>>
  row: any
  apJahr?: number
}

export const Tpop = ({
  saveToDb,
  fieldErrors,
  setFieldErrors,
  row,
  apJahr,
}: TpopProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  //console.log('Tpop rendering')

  const { data: dataLists } = useQuery<TpopListsQueryResult>({
    queryKey: ['tpopFilterLists'],
    queryFn: async () => {
      const result = await apolloClient.query<TpopListsQueryResult>({
        query: gql`
          query TpopListsQueryForTpopFilter {
            allTpopApberrelevantGrundWertes(
              orderBy: SORT_ASC
              filter: { code: { isNull: false } }
            ) {
              nodes {
                value: code
                label: text
              }
            }
            allChAdministrativeUnits(
              filter: { localisedcharacterstring: { equalTo: "Gemeinde" } }
              orderBy: TEXT_ASC
            ) {
              nodes {
                value: text
                label: text
              }
            }
          }
        `,
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  if (!row) return null

  return (
    <div className={styles.container}>
      <TextField
        name="nr"
        label="Nr."
        type="number"
        value={row.nr}
        saveToDb={saveToDb}
        error={fieldErrors.nr}
      />
      <TextFieldWithInfo
        name="flurname"
        label="Flurname"
        type="text"
        value={row.flurname}
        saveToDb={saveToDb}
        popover="Dieses Feld möglichst immer ausfüllen"
        error={fieldErrors.flurname}
      />
      <Status
        apJahr={apJahr}
        showFilter={true}
        saveToDb={saveToDb}
        errors={fieldErrors}
        row={row}
        // this is just to enforce re-render on change
        status={row.status}
      />
      <Checkbox2States
        name="statusUnklar"
        label="Status unklar"
        value={row.statusUnklar}
        saveToDb={saveToDb}
        error={fieldErrors.statusUnklar}
      />
      <TextField
        name="statusUnklarGrund"
        label="Begründung"
        type="text"
        value={row.statusUnklarGrund}
        saveToDb={saveToDb}
        multiLine
        error={fieldErrors.statusUnklarGrund}
      />
      <Checkbox2States
        name="apberRelevant"
        label="Für AP-Bericht relevant"
        value={row.apberRelevant}
        saveToDb={saveToDb}
        error={fieldErrors.apberRelevant}
      />
      <RadioButtonGroupWithInfo
        name="apberRelevantGrund"
        dataSource={dataLists?.allTpopApberrelevantGrundWertes?.nodes ?? []}
        popover={TpopAbBerRelevantInfoPopover}
        label="Grund für AP-Bericht (Nicht-)Relevanz"
        value={row.apberRelevantGrund}
        saveToDb={saveToDb}
        error={fieldErrors.apberRelevantGrund}
      />
      <SelectCreatableGemeinde
        key={`${row?.id}gemeinde`}
        name="gemeinde"
        value={row.gemeinde}
        error={fieldErrors.gemeinde}
        label="Gemeinde"
        options={dataLists?.allChAdministrativeUnits?.nodes ?? []}
        loading={false}
        showLocate={false}
        onClickLocate={async () => {
          if (!row.lv95X) {
            return setFieldErrors({
              gemeinde: 'Es fehlen Koordinaten',
            })
          }
          const geojson = row?.geomPoint?.geojson
          if (!geojson) return
          const geojsonParsed = JSON.parse(geojson)
          if (!geojsonParsed) return
          let result
          try {
            result = await apolloClient.query({
              // this is a hack
              // see: https://github.com/graphile-contrib/postgraphile-plugin-connection-filter-postgis/issues/10
              query: gql`
                        query tpopGemeindeFilterQuery {
                          allChAdministrativeUnits(
                            filter: {
                              geom: { containsProperly: {type: "${geojsonParsed.type}", coordinates: [${geojsonParsed.coordinates}]} },
                              localisedcharacterstring: {equalTo: "Gemeinde"}
                            }
                          ) {
                            nodes {
                              # apollo wants an id for its cache
                              id
                              text
                            }
                          }
                        }
                      `,
            })
          } catch (error) {
            return addNotification({
              message: (error as Error).message,
              options: {
                variant: 'error',
              },
            })
          }
          const gemeinde =
            result?.data?.allChAdministrativeUnits?.nodes?.[0]?.text ?? ''
          // keep following method in case table ch_administrative_units is removed again
          /*const gemeinde = await getGemeindeForKoord({
                    lv95X: row.lv95X,
                    lv95Y: row.lv95Y,
                  })*/
          if (gemeinde) {
            const fakeEvent = {
              target: { value: gemeinde, name: 'gemeinde' },
            }
            //handleChange(fakeEvent)
            //handleBlur(fakeEvent)
            saveToDb(fakeEvent)
          }
        }}
        saveToDb={saveToDb}
      />
      <TextField
        name="radius"
        label="Radius (m)"
        type="number"
        value={row.radius}
        saveToDb={saveToDb}
        error={fieldErrors.radius}
      />
      <TextField
        name="hoehe"
        label="Höhe (m.ü.M.)"
        type="number"
        value={row.hoehe}
        saveToDb={saveToDb}
        error={fieldErrors.hoehe}
      />
      <TextField
        name="exposition"
        label="Exposition, Besonnung"
        type="text"
        value={row.exposition}
        saveToDb={saveToDb}
        error={fieldErrors.exposition}
      />
      <TextField
        name="klima"
        label="Klima"
        type="text"
        value={row.klima}
        saveToDb={saveToDb}
        error={fieldErrors.klima}
      />
      <TextField
        name="neigung"
        label="Hangneigung"
        type="text"
        value={row.neigung}
        saveToDb={saveToDb}
        error={fieldErrors.neigung}
      />
      <TextField
        name="bodenTyp"
        label="Boden: Typ"
        type="text"
        value={row.bodenTyp}
        saveToDb={saveToDb}
        error={fieldErrors.bodenTyp}
      />
      <TextField
        name="bodenKalkgehalt"
        label="Boden: Kalkgehalt"
        type="text"
        value={row.bodenKalkgehalt}
        saveToDb={saveToDb}
        error={fieldErrors.bodenKalkgehalt}
      />
      <TextField
        name="bodenDurchlaessigkeit"
        label="Boden: Durchlässigkeit"
        type="text"
        value={row.bodenDurchlaessigkeit}
        saveToDb={saveToDb}
        error={fieldErrors.bodenDurchlaessigkeit}
      />
      <TextField
        name="bodenHumus"
        label="Boden: Humusgehalt"
        type="text"
        value={row.bodenHumus}
        saveToDb={saveToDb}
        error={fieldErrors.bodenHumus}
      />
      <TextField
        name="bodenNaehrstoffgehalt"
        label="Boden: Nährstoffgehalt"
        type="text"
        value={row.bodenNaehrstoffgehalt}
        saveToDb={saveToDb}
        error={fieldErrors.bodenNaehrstoffgehalt}
      />
      <TextField
        name="bodenAbtrag"
        label="Boden: Abtrag"
        type="text"
        value={row.bodenAbtrag}
        saveToDb={saveToDb}
        error={fieldErrors.bodenAbtrag}
      />
      <TextField
        name="wasserhaushalt"
        label="Boden: Wasserhaushalt"
        type="text"
        value={row.wasserhaushalt}
        saveToDb={saveToDb}
        error={fieldErrors.wasserhaushalt}
      />
      <TextField
        name="beschreibung"
        label="Beschreibung"
        type="text"
        value={row.beschreibung}
        saveToDb={saveToDb}
        error={fieldErrors.beschreibung}
      />
      <TextField
        name="katasterNr"
        label="Kataster-Nr."
        type="text"
        value={row.katasterNr}
        saveToDb={saveToDb}
        error={fieldErrors.katasterNr}
      />
      <TextField
        name="eigentuemer"
        label="EigentümerIn"
        type="text"
        value={row.eigentuemer}
        saveToDb={saveToDb}
        error={fieldErrors.eigentuemer}
      />
      <TextField
        name="kontakt"
        label="Kontakt vor Ort"
        type="text"
        value={row.kontakt}
        saveToDb={saveToDb}
        error={fieldErrors.kontakt}
      />
      <TextField
        name="nutzungszone"
        label="Nutzungszone"
        type="text"
        value={row.nutzungszone}
        saveToDb={saveToDb}
        error={fieldErrors.nutzungszone}
      />
      <TextField
        name="bewirtschafter"
        label="BewirtschafterIn"
        type="text"
        value={row.bewirtschafter}
        saveToDb={saveToDb}
        error={fieldErrors.bewirtschafter}
      />
      <TextField
        name="bewirtschaftung"
        label="Bewirtschaftung"
        type="text"
        value={row.bewirtschaftung}
        saveToDb={saveToDb}
        error={fieldErrors.bewirtschaftung}
      />
      <MarkdownField
        name="bemerkungen"
        label="Bemerkungen"
        value={row.bemerkungen}
        saveToDb={saveToDb}
        error={fieldErrors.bemerkungen}
      />
    </div>
  )
}
