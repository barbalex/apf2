import { type ChangeEvent } from 'react'
import { sortBy } from 'es-toolkit'
import Button from '@mui/material/Button'
import { FaRegEnvelope as SendIcon } from 'react-icons/fa'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useLocation } from 'react-router'
import { useAtomValue } from 'jotai'

import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { TextField2 } from '../../../shared/TextField2.tsx'
import { CheckboxWithInfo } from '../../../shared/CheckboxWithInfo.tsx'
import { Select } from '../../../shared/Select.tsx'
import { DateField } from '../../../shared/Date.tsx'
import { SelectLoadingOptions } from '../../../shared/SelectLoadingOptions.tsx'
import { Beob } from '../Beob/index.tsx'
import { query } from './query.ts'
import { queryAeTaxonomies } from './queryAeTaxonomies.ts'
import { saveNichtZuordnenToDb } from './saveNichtZuordnenToDb.ts'
import { saveArtIdToDb } from './saveArtIdToDb.ts'
import { saveTpopIdToDb } from './saveTpopIdToDb.ts'
import { sendMail } from '../../../../modules/sendMail.ts'
import { userNameAtom } from '../../../../JotaiStore/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  aeTaxonomies,
  beob,
  pop,
  popStatusWerte,
} from '../../../shared/fragments.ts'
import { Menu } from './Menu.tsx'

import type BeobType from '../../../../models/apflora/Beob.ts'
import type Ap from '../../../../models/apflora/Ap.ts'
import type { AeTaxonomiesId } from '../../../../models/apflora/AeTaxonomies.ts'
import type { TpopId } from '../../../../models/apflora/Tpop.ts'
import type { PopStatusWerteCode } from '../../../../models/apflora/PopStatusWerte.ts'

import styles from './index.module.css'

interface BeobzuordnungQueryResult {
  beobById: BeobType & {
    aeTaxonomyByArtId?: {
      artname: string
      taxid: number
      apByArtId?: Ap
    }
    aeTaxonomyByArtIdOriginal?: {
      artname: string
      taxid: number
    }
  }
  apById: Ap & {
    popsByApId: {
      nodes: Array<{
        id: string
        nr: number
        tpopsByPopId: {
          nodes: Array<{
            id: TpopId
            nr: number
            lv95X: number
            lv95Y: number
            popStatusWerteByStatus?: {
              text: string
            }
            popByPopId?: {
              nr: number
            }
          }>
        }
      }>
    }
  }
}

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
  <div className={styles.popoverContainer}>
    <div className={styles.labelPopoverTitleRow}>Legende</div>
    <div className={styles.labelPopoverContentRow}>
      {'Will heissen: Die Beobachtung kann nicht zugeordnet werden.'}
      <br />
      {'Mögliche Gründe: Unsichere Bestimmung, nicht lokalisierbar.'}
      <br />
      {'Bitte im Bemerkungsfeld begründen.'}
    </div>
  </div>
)

const getTpopZuordnenSource = ({ row, ap }: { row: any; ap: any }) => {
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

export const Component = () => {
  const { beobId: id, apId } = useParams<{ beobId: string; apId: string }>()
  const { search, pathname } = useLocation()
  const type =
    pathname.includes('nicht-zuzuordnende-Beobachtungen') ? 'nichtZuzuordnen'
    : pathname.includes('nicht-beurteilte-Beobachtungen') ? 'nichtBeurteilt'
    : pathname.includes('Beobachtungen') ? 'zugeordnet'
    : 'uups'

  const apolloClient = useApolloClient()

  const userName = useAtomValue(userNameAtom)

  const { data, refetch } = useQuery({
    queryKey: ['beobzuordnung', id, apId],
    queryFn: async () => {
      const result = await apolloClient.query<BeobzuordnungQueryResult>({
        query,
        variables: { id, apId },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const row = data?.data?.beobById ?? {}
  const ap = data?.data?.apById ?? {}

  // only include ap-arten (otherwise makes no sense, plus: error when app sets new activeNodeArray to non-existing ap)
  const aeTaxonomiesfilter = (inputValue: string) =>
    inputValue ?
      {
        artname: { includesInsensitive: inputValue },
        apartsByArtIdExist: true,
      }
    : { artname: { isNull: false }, apartsByArtIdExist: true }

  const onSaveArtIdToDb = (event: ChangeEvent<HTMLInputElement>) =>
    saveArtIdToDb({
      value: event.target.value,
      row,
      search,
    })

  const onSaveNichtZuordnenToDb = (value: boolean) =>
    saveNichtZuordnenToDb({
      value,
      id,
      refetch,
      search,
    })

  const onSaveTpopIdToDb = (event: ChangeEvent<HTMLInputElement>) =>
    saveTpopIdToDb({
      value: event.target.value,
      id,
      type,
      search,
    })

  const onUpdateField = (event: ChangeEvent<HTMLInputElement>) => {
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
        changedBy: user.name,
      },
    })
  }

  const tpopZuordnenSource = getTpopZuordnenSource({
    ap,
    row,
  })

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Beobachtung"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
          <div className={styles.fieldsContainer}>
            {row && row.artId !== row.artIdOriginal && (
              <div
                className={styles.originalArtDiv}
              >{`Art gemäss Original-Meldung: ${
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
            <div className={styles.infofloraRow}>
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
                className={styles.emailButton}
              >
                <SendIcon className={styles.styledSendIcon} />
                Email an Info Flora
              </Button>
            </div>
          </div>
          <div className={styles.title}>{`Informationen aus ${
            row?.quelle ?? '?'
          } (nicht veränderbar)`}</div>
          <Beob />
        </div>
      </div>
    </ErrorBoundary>
  )
}
