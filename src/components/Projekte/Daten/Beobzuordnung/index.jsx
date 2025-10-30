import { useContext } from 'react'
import { sortBy } from 'es-toolkit'
import Button from '@mui/material/Button'
import { FaRegEnvelope as SendIcon } from 'react-icons/fa'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useParams, useLocation } from 'react-router'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { TextField2 } from '../../../shared/TextField2.jsx'
import { CheckboxWithInfo } from '../../../shared/CheckboxWithInfo.jsx'
import { Select } from '../../../shared/Select.jsx'
import { DateField } from '../../../shared/Date.jsx'
import { SelectLoadingOptions } from '../../../shared/SelectLoadingOptions.jsx'
import { Beob } from '../Beob/index.jsx'
import { query } from './query.js'
import { queryAeTaxonomies } from './queryAeTaxonomies.js'
import { saveNichtZuordnenToDb } from './saveNichtZuordnenToDb.js'
import { saveArtIdToDb } from './saveArtIdToDb.js'
import { saveTpopIdToDb } from './saveTpopIdToDb.js'
import { sendMail } from '../../../../modules/sendMail.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import {
  aeTaxonomies,
  beob,
  pop,
  popStatusWerte,
} from '../../../shared/fragments.js'
import { Menu } from './Menu.jsx'

import {
  popoverContainer,
  container,
  formContainer,
  fieldsContainer,
  title,
  labelPopoverTitleRow,
  labelPopoverContentRow,
  originalArtDiv,
  infofloraRow,
  emailButton,
  styledSendIcon,
} from './index.module.css'

const fieldTypes = {
  idField: 'String',
  datum: 'Date',
  autor: 'String',
  geomPoint: 'GeoJSON',
  data: 'JSON',
  artId: 'UUID',
  artIdOriginal: 'UUID',
  infofloraInformiertDatum: 'Date',
  tpopId: 'UUID',
  nichtZuordnen: 'Boolean',
  bemerkungen: 'String',
  quelle: 'String',
}

const nichtZuordnenPopover = (
  <div className={popoverContainer}>
    <div className={labelPopoverTitleRow}>Legende</div>
    <div className={labelPopoverContentRow}>
      {'Will heissen: Die Beobachtung kann nicht zugeordnet werden.'}
      <br />
      {'Mögliche Gründe: Unsichere Bestimmung, nicht lokalisierbar.'}
      <br />
      {'Bitte im Bemerkungsfeld begründen.'}
    </div>
  </div>
)

const getTpopZuordnenSource = ({ row, ap }) => {
  // get all popIds of active ap
  const popList = ap?.popsByApId?.nodes ?? []
  // get all tpop
  let tpopList = popList
    .map((p) => p?.tpopsByPopId?.nodes ?? [])
    .flat()
    // with coordinates
    // and also: even keep own tpop if it has no coordinates
    .filter((t) => !!t.lv95X || t.id === row.tpopId)
    .map((t) => {
      // calculate their distance to this beob
      const dX = Math.abs(row.lv95X - t.lv95X)
      const dY = Math.abs(row.lv95Y - t.lv95Y)
      const distNr = Math.round((dX ** 2 + dY ** 2) ** 0.5)
      const distance = distNr?.toLocaleString('de-ch')
      // build label
      const tpopStatus = t?.popStatusWerteByStatus?.text ?? 'ohne Status'
      const popNr = t?.popByPopId?.nr ?? '(keine Nr)'
      const tpopNr = t.nr ?? '(keine Nr)'

      return {
        id: t.id,
        distNr,
        label: `${distance}m: ${popNr}/${tpopNr} (${tpopStatus})`,
      }
    })
  // order them by distance
  tpopList = sortBy(tpopList, ['distNr'])
  // return array of id, label
  return tpopList.map((t) => ({
    value: t.id,
    label: t.label,
  }))
}

export const Component = observer(() => {
  const { beobId: id, apId } = useParams()
  const { search, pathname } = useLocation()
  const type =
    pathname.includes('nicht-zuzuordnende-Beobachtungen') ? 'nichtZuzuordnen'
    : pathname.includes('nicht-beurteilte-Beobachtungen') ? 'nichtBeurteilt'
    : pathname.includes('Beobachtungen') ? 'zugeordnet'
    : 'uups'

  const apolloClient = useApolloClient()

  const store = useContext(MobxContext)

  const { data, loading, error, refetch } = useQuery(query, {
    variables: { id, apId },
  })

  const row = data?.beobById ?? {}
  const ap = data?.apById ?? {}

  // only include ap-arten (otherwise makes no sense, plus: error when app sets new activeNodeArray to non-existing ap)
  const aeTaxonomiesfilter = (inputValue) =>
    inputValue ?
      {
        artname: { includesInsensitive: inputValue },
        apartsByArtIdExist: true,
      }
    : { artname: { isNull: false }, apartsByArtIdExist: true }

  const onSaveArtIdToDb = (event) =>
    saveArtIdToDb({
      value: event.target.value,
      row,
      apolloClient,
      store,
      search,
    })

  const onSaveNichtZuordnenToDb = (value) =>
    saveNichtZuordnenToDb({
      value,
      id,
      refetch,
      apolloClient,
      store,
      search,
    })

  const onSaveTpopIdToDb = (event) =>
    saveTpopIdToDb({
      value: event.target.value,
      id,
      type,
      apolloClient,
      store,
      search,
    })

  const onUpdateField = (event) => {
    const changedField = event.target.name
    apolloClient.mutate({
      mutation: gql`
          mutation updateBeobForBeobzuordnung(
            $id: UUID!
            $${changedField}: ${fieldTypes[changedField]}
            $changedBy: String
          ) {
            updateBeobById(
              input: {
                id: $id
                beobPatch: {
                  ${changedField}: $${changedField}
                  changedBy: $changedBy
                }
              }
            ) {
              beob {
                ...BeobFields
                aeTaxonomyByArtId {
                  ...AeTaxonomiesFields
                  apByArtId {
                    id
                    popsByApId {
                      nodes {
                        id
                        tpopsByPopId {
                          nodes {
                            id
                            nr
                            lv95X
                            lv95Y
                            popStatusWerteByStatus {
                              ...PopStatusWerteFields
                            }
                            popByPopId {
                              ...PopFields
                            }
                          }
                        }
                      }
                    }
                  }
                }
                aeTaxonomyByArtIdOriginal {
                  id
                  artname
                }
              }
            }
          }
          ${aeTaxonomies}
          ${beob}
          ${pop}
          ${popStatusWerte}
        `,
      variables: {
        id,
        [event.target.name]: event.target.value,
        changedBy: store.user.name,
      },
    })
  }

  const tpopZuordnenSource = getTpopZuordnenSource({
    ap,
    row,
  })

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={container}>
        <FormTitle
          title="Beobachtung"
          MenuBarComponent={Menu}
        />
        <div className={formContainer}>
          <div className={fieldsContainer}>
            {row && row.artId !== row.artIdOriginal && (
              <div className={originalArtDiv}>{`Art gemäss Original-Meldung: ${
                row?.aeTaxonomyByArtIdOriginal?.artname ?? '(kein Name)'
              }`}</div>
            )}
            <SelectLoadingOptions
              key={`${row.id}artId`}
              field="artId"
              valueLabelPath="aeTaxonomyByArtId.artname"
              label="Art"
              row={row}
              saveToDb={onSaveArtIdToDb}
              query={queryAeTaxonomies}
              filter={aeTaxonomiesfilter}
              queryNodesName="allAeTaxonomies"
            />
            <CheckboxWithInfo
              key={`${row.id}nichtZuordnen`}
              name="nichtZuordnen"
              label="Nicht zuordnen"
              value={row.nichtZuordnen}
              saveToDb={onSaveNichtZuordnenToDb}
              popover={nichtZuordnenPopover}
            />
            <Select
              key={`${row.id}tpopId`}
              name="tpopId"
              value={row.tpopId ?? ''}
              field="tpopId"
              label="Teilpopulation"
              options={tpopZuordnenSource}
              saveToDb={onSaveTpopIdToDb}
            />
            <TextField2
              key={`${row.id}bemerkungen`}
              name="bemerkungen"
              label="Bemerkungen zur Zuordnung"
              row={row}
              type="text"
              multiLine
              saveToDb={onUpdateField}
            />
            <div className={infofloraRow}>
              <DateField
                key={`${row.id}infofloraInformiertDatum`}
                name="infofloraInformiertDatum"
                label="Info Flora informiert am:"
                value={row.infofloraInformiertDatum}
                saveToDb={onUpdateField}
              />
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  const origArt = `Art gemäss Beobachtung: SISF-Nr: ${
                    row?.aeTaxonomyByArtId?.taxid ?? '(keine)'
                  }, Artname: ${row?.aeTaxonomyByArtId?.artname ?? '(keiner)'}`
                  const neueArt = `Korrigierte Art: SISF-Nr: ${
                    row?.aeTaxonomyByArtIdOriginal?.taxid ?? '(keine)'
                  }, Artname: ${
                    row?.aeTaxonomyByArtIdOriginal?.artname ?? '(keiner)'
                  }`
                  const bemerkungen = row.bemerkungen
                  // remove all keys with null
                  const dataArray = Object.entries(JSON.parse(row.data)).filter(
                    (a) => !!a[1] || a[1] === 0 || a[1] === false,
                  )
                  let data = ''
                  dataArray.forEach((d) => {
                    data = `${data ? `${data}` : ''}${d[0]}: ${d[1]};\r\n`
                  })
                  const body = `${origArt}\r\n${neueArt}${
                    bemerkungen ?
                      `${bemerkungen ? `\r\nBemerkungen: ${bemerkungen}` : ''}`
                    : ''
                  }\r\n\r\nOriginal-Beobachtungs-Daten:\r\n${data}`
                  sendMail({
                    to: 'info@infoflora.ch',
                    subject: 'Flora-Beobachtung: Verifikation',
                    body,
                  })
                }}
                className={emailButton}
              >
                <SendIcon className={styledSendIcon} />
                Email an Info Flora
              </Button>
            </div>
          </div>
          <div className={title}>{`Informationen aus ${
            row?.quelle ?? '?'
          } (nicht veränderbar)`}</div>
          <Beob />
        </div>
      </div>
    </ErrorBoundary>
  )
})
