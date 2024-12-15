import { memo, useContext, useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery, useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { TextField } from '../../../shared/TextField.jsx'
import { TextFieldWithInfo } from '../../../shared/TextFieldWithInfo.jsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.jsx'
import { Status } from '../../../shared/Status.jsx'
import { SelectCreatableGemeinde } from '../../../shared/SelectCreatableGemeinde.jsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.jsx'
import { RadioButtonGroupWithInfo } from '../../../shared/RadioButtonGroupWithInfo.jsx'
import { TpopAbBerRelevantInfoPopover } from '../TpopAbBerRelevantInfoPopover.jsx'
//import { getGemeindeForKoord } from '../../../../modules/getGemeindeForKoord.js'
import { constants } from '../../../../modules/constants.js'
import { MobxContext } from '../../../../mobxContext.js'
import { Coordinates } from '../../../shared/Coordinates.jsx'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import {
  popStatusWerte,
  tpop,
  tpopApberrelevantGrundWerte,
} from '../../../shared/fragments.js'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { query } from './query.js'
import { Menu } from './Menu.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 10px;
  column-width: ${constants.columnWidth}px;
`

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

export const Component = memo(
  observer(() => {
    const { tpopId } = useParams()
    const store = useContext(MobxContext)
    const { enqueNotification } = store
    const client = useApolloClient()
    const queryClient = useQueryClient()

    const {
      data,
      loading,
      error,
      refetch: refetchTpop,
    } = useQuery(query, {
      variables: {
        id: tpopId,
      },
    })

    const apJahr = data?.tpopById?.popByPopId?.apByApId?.startJahr ?? null

    const row = data?.tpopById ?? {}

    const {
      data: dataLists,
      loading: loadingLists,
      error: errorLists,
    } = useQuery(gql`
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
    `)
    const [fieldErrors, setFieldErrors] = useState({})
    const saveToDb = useCallback(
      async (event) => {
        const field = event.target.name
        const value = ifIsNumericAsNumber(event.target.value)

        const variables = {
          id: row.id,
          [field]: value,
          changedBy: store.user.name,
        }
        try {
          await client.mutate({
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
            // no optimistic responce as geomPoint
          })
        } catch (error) {
          return setFieldErrors({ [field]: error.message })
        }
        // update tpop on map
        if (
          (value &&
            ((field === 'ylv95Y' && row?.lv95X) ||
              (field === 'lv95X' && row?.y))) ||
          (!value && (field === 'ylv95Y' || field === 'lv95X'))
        ) {
          client.refetchQueries({
            include: ['TpopForMapQuery', 'PopForMapQuery'],
          })
        }
        if (Object.keys(fieldErrors).length) {
          setFieldErrors({})
        }
        if (['nr', 'flurname'].includes(field)) {
          queryClient.invalidateQueries({
            queryKey: [`treeTpop`],
          })
        }
      },
      [
        client,
        fieldErrors,
        queryClient,
        row.id,
        row?.lv95X,
        row?.y,
        store.user.name,
      ],
    )

    if (error) return <Error error={error} />

    if (loading) return <Spinner />

    return (
      <>
        <FormTitle
          title="Teil-Population"
          menuBar={<Menu row={row} />}
        />
        <Container>
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
          {errorLists ?
            <div>errorLists.message</div>
          : <RadioButtonGroupWithInfo
              name="apberRelevantGrund"
              dataSource={
                dataLists?.allTpopApberrelevantGrundWertes?.nodes ?? []
              }
              popover={TpopAbBerRelevantInfoPopover}
              label="Grund für AP-Bericht (Nicht-)Relevanz"
              value={row.apberRelevantGrund}
              saveToDb={saveToDb}
              error={fieldErrors.apberRelevantGrund}
            />
          }
          <Coordinates
            row={row}
            refetchForm={refetchTpop}
            table="tpop"
          />
          {errorLists ?
            <div>errorLists.message</div>
          : <SelectCreatableGemeinde
              name="gemeinde"
              value={row.gemeinde}
              error={fieldErrors.gemeinde}
              label="Gemeinde"
              options={dataLists?.allChAdministrativeUnits?.nodes ?? []}
              loading={loadingLists}
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
                  result = await client.query({
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
                  return enqueNotification({
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
                    store,
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
          }
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
        </Container>
      </>
    )
  }),
)
