import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { TextField } from '../../../shared/TextField.tsx'
import { TextFieldWithInfo } from '../../../shared/TextFieldWithInfo.tsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.tsx'
import { Status } from '../../../shared/Status.tsx'
import { SelectCreatableGemeinde } from '../../../shared/SelectCreatableGemeinde.tsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.tsx'
import { RadioButtonGroupWithInfo } from '../../../shared/RadioButtonGroupWithInfo.tsx'
import { TpopAbBerRelevantInfoPopover } from '../../../shared/TpopAbBerRelevantInfoPopover.tsx'
//import { getGemeindeForKoord } from '../../../../modules/getGemeindeForKoord.ts'
import { Coordinates } from '../../../shared/Coordinates.tsx'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import {
  popStatusWerte,
  tpop,
  tpopApberrelevantGrundWerte,
} from '../../../shared/fragments.ts'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { query } from './query.ts'
import { Menu } from './Menu.tsx'
import {
  addNotificationAtom,
  userNameAtom,
} from '../../../../store/index.ts'

import type {
  TpopId,
  PopId,
  ApId,
  TpopStatusWerteCode,
  TpopApberrelevantGrundWerteCode,
  EkfrequenzId,
  AdresseId,
} from '../../../../models/apflora/index.tsx'

import styles from './Tpop.module.css'

interface TpopQueryResult {
  tpopById?: {
    id: TpopId
    popId: PopId
    nr: number | null
    gemeinde: string | null
    flurname: string | null
    status: TpopStatusWerteCode | null
    popStatusWerteByStatus?: {
      code: TpopStatusWerteCode
      text: string | null
    }
    bekanntSeit: number | null
    statusUnklar: boolean | null
    statusUnklarGrund: string | null
    lv95X: number | null
    lv95Y: number | null
    wgs84Lat: number | null
    wgs84Long: number | null
    radius: number | null
    hoehe: number | null
    exposition: string | null
    klima: string | null
    neigung: string | null
    beschreibung: string | null
    katasterNr: string | null
    apberRelevant: boolean | null
    apberRelevantGrund: TpopApberrelevantGrundWerteCode | null
    tpopApberrelevantGrundWerteByApberRelevantGrund?: {
      code: TpopApberrelevantGrundWerteCode
      text: string | null
    }
    eigentuemer: string | null
    kontakt: string | null
    nutzungszone: string | null
    bewirtschafter: string | null
    bewirtschaftung: string | null
    ekfrequenz: EkfrequenzId | null
    ekfrequenzAbweichend: boolean | null
    ekfKontrolleur: AdresseId | null
    ekfrequenzStartjahr: number | null
    bemerkungen: string | null
    bodenTyp: string | null
    bodenKalkgehalt: string | null
    bodenDurchlaessigkeit: string | null
    bodenHumus: string | null
    bodenNaehrstoffgehalt: string | null
    bodenAbtrag: string | null
    wasserhaushalt: string | null
    geomPoint?: {
      x: number | null
      y: number | null
    }
    popByPopId?: {
      id: PopId
      apId: ApId
      apByApId?: {
        id: ApId
        startJahr: number | null
      }
    }
  }
}

interface TpopListsQueryResult {
  allTpopApberrelevantGrundWertes?: {
    nodes: Array<{
      value: TpopApberrelevantGrundWerteCode
      label: string | null
    }>
  }
  allChAdministrativeUnits?: {
    nodes: Array<{
      value: string
      label: string
    }>
  }
}

export const fieldTypes = {
  popId: 'UUID',
  nr: 'Int',
  gemeinde: 'String',
  flurname: 'String',
  radius: 'Int',
  hoehe: 'Int',
  exposition: 'String',
  klima: 'String',
  neigung: 'String',
  bodenTyp: 'String',
  bodenKalkgehalt: 'String',
  bodenDurchlaessigkeit: 'String',
  bodenHumus: 'String',
  bodenNaehrstoffgehalt: 'String',
  bodenAbtrag: 'String',
  wasserhaushalt: 'String',
  beschreibung: 'String',
  katasterNr: 'String',
  status: 'Int',
  statusUnklarGrund: 'String',
  apberRelevant: 'Boolean',
  apberRelevantGrund: 'Int',
  bekanntSeit: 'Int',
  eigentuemer: 'String',
  kontakt: 'String',
  nutzungszone: 'String',
  bewirtschafter: 'String',
  bewirtschaftung: 'String',
  ekfrequenz: 'UUID',
  ekfrequenzAbweichend: 'Boolean',
  ekfKontrolleur: 'UUID',
  ekfrequenzStartjahr: 'Int',
  bemerkungen: 'String',
  statusUnklar: 'Boolean',
}

export const Component = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { tpopId } = useParams()

  const userName = useAtomValue(userNameAtom)
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const { data, refetch: refetchTpop } = useQuery<TpopQueryResult>({
    queryKey: ['tpop', tpopId],
    queryFn: async () => {
      const result = await apolloClient.query<TpopQueryResult>({
        query,
        variables: { id: tpopId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const apJahr = data?.tpopById?.popByPopId?.apByApId?.startJahr ?? null

  const row = data?.tpopById ?? {}

  const { data: dataLists } = useQuery<TpopListsQueryResult>({
    queryKey: ['tpopLists'],
    queryFn: async () => {
      const result = await apolloClient.query<TpopListsQueryResult>({
        query: gql`
          query TpopListsQueryForTpop {
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const saveToDb = async (event) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    try {
      await apolloClient.mutate({
        mutation: gql`
            mutation updateTpop${field}(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateTpopById(
                input: {
                  id: $id
                  tpopPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpop {
                  ...TpopFields
                  popStatusWerteByStatus {
                    ...PopStatusWerteFields
                  }
                  tpopApberrelevantGrundWerteByApberRelevantGrund {
                    ...TpopApberrelevantGrundWerteFields
                  }
                  popByPopId {
                    id
                    apId
                  }
                }
              }
            }
            ${popStatusWerte}
            ${tpop}
            ${tpopApberrelevantGrundWerte}
          `,
        variables,
        // no optimistic response as geomPoint
      })
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // invalidate tpop queries
    tsQueryClient.invalidateQueries({ queryKey: ['tpop', tpopId] })
    // update tpop on map
    if (
      (value &&
        ((field === 'ylv95Y' && row?.lv95X) ||
          (field === 'lv95X' && row?.y))) ||
      (!value && (field === 'ylv95Y' || field === 'lv95X'))
    ) {
      tsQueryClient.invalidateQueries({
        queryKey: [`PopForMapQuery`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`TpopForMapQuery`],
      })
    }
    if (Object.keys(fieldErrors).length) {
      setFieldErrors((prev) => {
        const { [field]: _, ...rest } = prev
        return rest
      })
    }
    if (['nr', 'flurname'].includes(field)) {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeTpop`],
      })
    }
  }

  return (
    <>
      <FormTitle
        title="Teil-Population"
        MenuBarComponent={Menu}
        menuBarProps={{ row }}
      />
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
          showFilter={false}
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
        <Coordinates
          row={row}
          refetchForm={refetchTpop}
          table="tpop"
        />
        <SelectCreatableGemeinde
          key={`${tpopId}gemeinde`}
          name="gemeinde"
          value={row.gemeinde}
          error={fieldErrors.gemeinde}
          label="Gemeinde"
          options={dataLists?.allChAdministrativeUnits?.nodes ?? []}
          loading={false}
          showLocate={true}
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
                        query tpopGemeindeQuery {
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
                message: error.message,
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
        <MarkdownField
          name="bemerkungen"
          label="Bemerkungen"
          value={row.bemerkungen}
          saveToDb={saveToDb}
          error={fieldErrors.bemerkungen}
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
      </div>
    </>
  )
}
