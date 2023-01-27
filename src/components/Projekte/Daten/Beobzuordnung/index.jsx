import React, { useCallback, useContext, useMemo } from 'react'
import styled from '@emotion/styled'
import sortBy from 'lodash/sortBy'
import flatten from 'lodash/flatten'
import Button from '@mui/material/Button'
import { FaRegEnvelope as SendIcon } from 'react-icons/fa'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import SimpleBar from 'simplebar-react'
import { useParams, useLocation } from 'react-router-dom'

import FormTitle from '../../../shared/FormTitle'
import TextField from '../../../shared/TextField2'
import CheckboxWithInfo from '../../../shared/CheckboxWithInfo'
import Select from '../../../shared/Select'
import DateField from '../../../shared/Date'
import SelectLoadingOptions from '../../../shared/SelectLoadingOptions'
import Beob from '../Beob'
import query from './query'
import queryAeTaxonomies from './queryAeTaxonomies'
import saveNichtZuordnenToDb from './saveNichtZuordnenToDb'
import saveArtIdToDb from './saveArtIdToDb'
import saveTpopIdToDb from './saveTpopIdToDb'
import sendMail from '../../../../modules/sendMail'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'
import {
  aeTaxonomies,
  beob,
  pop,
  popStatusWerte,
} from '../../../shared/fragments'

const PopoverContainer = styled.div`
  overflow-x: auto;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`
const FormContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const DataContainer = styled.div`
  overflow-y: auto;
`
const FieldsContainer = styled.div`
  padding: 10px;
  padding-bottom: 0;
`
const Title = styled.div`
  padding: 10px 10px 0 10px;
  color: #b3b3b3;
  font-weight: bold;
  background-color: #424242;
  padding-bottom: 10px;
`
const LabelPopoverRow = styled.div`
  padding: 2px 5px 2px 5px;
`
const LabelPopoverTitleRow = styled(LabelPopoverRow)`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: rgb(46, 125, 50);
  color: white;
`
const LabelPopoverContentRow = styled(LabelPopoverRow)`
  display: flex;
  border-color: grey;
  border-width: thin;
  border-style: solid;
  border-top-style: none;
  &:last-child {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
`
const OriginalArtDiv = styled.div`
  margin-bottom: 10px;
`
const InfofloraRow = styled.div`
  display: flex;
  justify-content: space-between;
`
const EmailButton = styled(Button)`
  margin-top: 12px !important;
  margin-left: 15px !important;
  flex-basis: 320px;
  height: 36px;
  text-transform: none !important;
`
const StyledSendIcon = styled(SendIcon)`
  margin-right: 8px;
`

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
  <PopoverContainer>
    <LabelPopoverTitleRow>Legende</LabelPopoverTitleRow>
    <LabelPopoverContentRow>
      {'Will heissen: Die Beobachtung kann nicht zugeordnet werden.'}
      <br />
      {'Mögliche Gründe: Unsichere Bestimmung, nicht lokalisierbar.'}
      <br />
      {'Bitte im Bemerkungsfeld begründen.'}
    </LabelPopoverContentRow>
  </PopoverContainer>
)

const Beobzuordnung = ({ type }) => {
  const { beobId: id, apId } = useParams()
  const { search } = useLocation()

  const queryClient = useQueryClient()
  const client = useApolloClient()
  const store = useContext(storeContext)

  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      id,
      apId,
    },
  })

  const row = useMemo(() => data?.beobById ?? {}, [data?.beobById])
  const ap = useMemo(() => data?.apById ?? {}, [data?.apById])

  // only include ap-arten (otherwise makes no sense, plus: error when app sets new activeNodeArray to non-existing ap)
  const aeTaxonomiesfilter = useCallback(
    (inputValue) =>
      inputValue
        ? {
            artname: { includesInsensitive: inputValue },
            apartsByArtIdExist: true,
          }
        : { artname: { isNull: false }, apartsByArtIdExist: true },
    [],
  )

  const onSaveArtIdToDb = useCallback(
    (event) => {
      const { value } = event.target
      saveArtIdToDb({ value, row, client, store, queryClient, search })
    },
    [client, queryClient, row, search, store],
  )
  const onSaveNichtZuordnenToDb = useCallback(
    (value) => {
      saveNichtZuordnenToDb({
        value,
        id,
        refetch,
        client,
        store,
        queryClient,
        search,
      })
    },
    [client, id, queryClient, refetch, search, store],
  )
  const onSaveTpopIdToDb = useCallback(
    (event) => {
      const { value } = event.target
      saveTpopIdToDb({ value, id, type, client, store, search })
    },
    [client, id, search, store, type],
  )
  const onUpdateField = useCallback(
    (event) => {
      const changedField = event.target.name
      client.mutate({
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
    },
    [client, id, store.user.name],
  )

  const tpopZuordnenSource = useMemo(() => {
    // get all popIds of active ap
    const popList = ap?.popsByApId?.nodes ?? []
    // get all tpop
    let tpopList = flatten(popList.map((p) => p?.tpopsByPopId?.nodes ?? []))
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
    tpopList = sortBy(tpopList, 'distNr')
    // return array of id, label
    return tpopList.map((t) => ({
      value: t.id,
      label: t.label,
    }))
  }, [row, ap])

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <FormContainer>
        <FormTitle title="Beobachtung" />
        <DataContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FieldsContainer>
              {row && row.artId !== row.artIdOriginal && (
                <OriginalArtDiv>{`Art gemäss Original-Meldung: ${
                  row?.aeTaxonomyByArtIdOriginal?.artname ?? '(kein Name)'
                }`}</OriginalArtDiv>
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
                label={
                  row.tpopId
                    ? 'Einer anderen Teilpopulation zuordnen'
                    : 'Einer Teilpopulation zuordnen'
                }
                options={tpopZuordnenSource}
                saveToDb={onSaveTpopIdToDb}
              />
              <TextField
                key={`${row.id}bemerkungen`}
                name="bemerkungen"
                label="Bemerkungen zur Zuordnung"
                row={row}
                type="text"
                multiLine
                saveToDb={onUpdateField}
              />
              <InfofloraRow>
                <DateField
                  key={`${row.id}infofloraInformiertDatum`}
                  name="infofloraInformiertDatum"
                  label="Info Flora informiert am:"
                  value={row.infofloraInformiertDatum}
                  saveToDb={onUpdateField}
                />
                <EmailButton
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    const origArt = `Art gemäss Beobachtung: SISF-Nr: ${
                      row?.aeTaxonomyByArtId?.taxid ?? '(keine)'
                    }, Artname: ${
                      row?.aeTaxonomyByArtId?.artname ?? '(keiner)'
                    }`
                    const neueArt = `Korrigierte Art: SISF-Nr: ${
                      row?.aeTaxonomyByArtIdOriginal?.taxid ?? '(keine)'
                    }, Artname: ${
                      row?.aeTaxonomyByArtIdOriginal?.artname ?? '(keiner)'
                    }`
                    const bemerkungen = row.bemerkungen
                    // remove all keys with null
                    const dataArray = Object.entries(
                      JSON.parse(row.data),
                    ).filter((a) => !!a[1] || a[1] === 0 || a[1] === false)
                    let data = ''
                    dataArray.forEach((d) => {
                      data = `${data ? `${data}` : ''}${d[0]}: ${d[1]};\r\n`
                    })
                    const body = `${origArt}\r\n${neueArt}${
                      bemerkungen
                        ? `${
                            bemerkungen ? `\r\nBemerkungen: ${bemerkungen}` : ''
                          }`
                        : ''
                    }\r\n\r\nOriginal-Beobachtungs-Daten:\r\n${data}`
                    sendMail({
                      to: 'info@infoflora.ch',
                      subject: 'Flora-Beobachtung: Verifikation',
                      body,
                    })
                  }}
                >
                  <StyledSendIcon />
                  Email an Info Flora
                </EmailButton>
              </InfofloraRow>
            </FieldsContainer>
            <Title>{`Informationen aus ${
              row?.quelle ?? '?'
            } (nicht veränderbar)`}</Title>
            <Beob />
          </SimpleBar>
        </DataContainer>
      </FormContainer>
    </ErrorBoundary>
  )
}

export default observer(Beobzuordnung)
