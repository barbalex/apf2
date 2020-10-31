import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import Button from '@material-ui/core/Button'
import { FaRegEnvelope as SendIcon } from 'react-icons/fa'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'

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
import {
  aeTaxonomies,
  beob,
  beobQuelleWerte,
  pop,
  popStatusWerte,
} from '../../../shared/fragments'

const PopoverContainer = styled.div`
  overflow-x: auto;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`
const LoadingContainer = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  padding: 10px;
`
const FormContainer = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  display: flex;
  flex-direction: column;
`
const DataContainer = styled.div`
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
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
  background-color: #565656;
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
  quelleId: 'UUID',
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

const getTpopZuordnenSource = (row, apId) => {
  // get all popIds of active ap
  const apArt = get(row, 'aeTaxonomyByArtId.apartsByArtId.nodes[0]', [])
  if (!apArt) return []
  const popList = get(apArt, 'apByApId.popsByApId.nodes', [])
  // get all tpop
  let tpopList = flatten(popList.map((p) => get(p, 'tpopsByPopId.nodes', [])))
    // with coordinates
    // and also: even keep own tpop if it has no coordinates
    .filter((t) => !!t.lv95X || t.id === row.tpopId)
    .map((t) => {
      // calculate their distance to this beob
      const dX = Math.abs(row.lv95X - t.lv95X)
      const dY = Math.abs(row.lv95Y - t.lv95Y)
      const distNr = Math.round((dX ** 2 + dY ** 2) ** 0.5)
      const distance = distNr.toLocaleString('de-ch')
      // build label
      const tpopStatus = get(t, 'popStatusWerteByStatus.text', 'ohne Status')
      const popNr = get(t, 'popByPopId.nr', '(keine Nr)')
      const tpopNr = t.nr || '(keine Nr)'

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
}

const Beobzuordnung = ({ type, treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { appBarHeight } = store
  const tree = store[treeName]
  const { activeNodeArray } = tree
  const id = activeNodeArray[activeNodeArray.length - 1]
  const apId =
    activeNodeArray.length > 3
      ? activeNodeArray[3]
      : '99999999-9999-9999-9999-999999999999'

  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      id,
      apId,
    },
  })

  const row = get(data, 'beobById', {})

  // only include ap-arten (otherwise makes no sense, plus: error when app sets new activeNodeArray to non-existing ap)
  const aeTaxonomiesfilter = useCallback(
    (inputValue) =>
      !!inputValue
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
      saveArtIdToDb({ value, row, treeName, client, store })
    },
    [client, row, store, treeName],
  )
  const onSaveNichtZuordnenToDb = useCallback(
    (value) => {
      saveNichtZuordnenToDb({
        value,
        id,
        treeName,
        refetch,
        client,
        store,
      })
    },
    [client, id, refetch, store, treeName],
  )
  const onSaveTpopIdToDb = useCallback(
    (event) => {
      const { value } = event.target
      saveTpopIdToDb({ value, id, treeName, type, client, store })
    },
    [client, id, store, treeName, type],
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
                beobQuelleWerteByQuelleId {
                  ...BeobQuelleWerteFields
                }
              }
            }
          }
          ${aeTaxonomies}
          ${beob}
          ${beobQuelleWerte}
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

  const [formTitleHeight, setFormTitleHeight] = useState(43)

  if (loading) {
    return (
      <LoadingContainer data-appbar-height={appBarHeight}>
        Lade...
      </LoadingContainer>
    )
  }
  if (error) return <Error error={error} />
  return (
    <ErrorBoundary>
      <FormContainer data-appbar-height={appBarHeight}>
        <FormTitle
          apId={get(row, 'aeTaxonomyByArtId.apByArtId.id', null)}
          title="Beobachtung"
          treeName={treeName}
          table="beob"
          setFormTitleHeight={setFormTitleHeight}
        />
        <DataContainer data-form-title-height={formTitleHeight}>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FieldsContainer>
              {row && row.artId !== row.artIdOriginal && (
                <OriginalArtDiv>{`Art gemäss Original-Meldung: ${get(
                  row,
                  'aeTaxonomyByArtIdOriginal.artname',
                )}`}</OriginalArtDiv>
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
                value={row.tpopId ? row.tpopId : ''}
                field="tpopId"
                label={
                  !!row.tpopId
                    ? 'Einer anderen Teilpopulation zuordnen'
                    : 'Einer Teilpopulation zuordnen'
                }
                options={getTpopZuordnenSource(row, apId)}
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
                  onClick={() => {
                    const origArt = `Art gemäss Beobachtung: SISF-Nr: ${get(
                      row,
                      'aeTaxonomyByArtId.taxid',
                    )}, Artname: ${get(row, 'aeTaxonomyByArtId.artname')}`
                    const neueArt = `Korrigierte Art: SISF-Nr: ${get(
                      row,
                      'aeTaxonomyByArtIdOriginal.taxid',
                    )}, Artname: ${get(
                      row,
                      'aeTaxonomyByArtIdOriginal.artname',
                    )}`
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
            <Title>{`Informationen aus ${get(
              row,
              'beobQuelleWerteByQuelleId.name',
              '?',
            )} (nicht veränderbar)`}</Title>
            <Beob treeName={treeName} />
          </SimpleBar>
        </DataContainer>
      </FormContainer>
    </ErrorBoundary>
  )
}

export default observer(Beobzuordnung)
