// @flow
import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import Button from '@material-ui/core/Button'
import SendIcon from '@material-ui/icons/EmailOutlined'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import FormTitle from '../../../shared/FormTitle'
import TextField from '../../../shared/TextField2'
import CheckboxWithInfo from '../../../shared/CheckboxWithInfo'
import Select from '../../../shared/Select'
import SelectLoadingOptions from '../../../shared/SelectLoadingOptions'
import Beob from '../Beob'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './query'
import queryAeEigenschaftens from './queryAeEigenschaftens'
import updateBeobByIdGql from './updateBeobById'
import saveNichtZuordnenToDb from './saveNichtZuordnenToDb'
import saveArtIdToDb from './saveArtIdToDb'
import saveTpopIdToDb from './saveTpopIdToDb'
import sendMail from '../../../../modules/sendMail'
import storeContext from '../../../../storeContext'

const Container = styled.div`
  height: 100%;
  overflow-x: auto;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`
const FormContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const DataContainer = styled.div`
  height: 100%;
  overflow: auto !important;
`
const FieldsContainer = styled.div`
  padding: 10px;
`
const Title = styled.div`
  padding: 10px 10px 0 10px;
  color: #b3b3b3;
  font-weight: bold;
  background-color: #424242;
  margin-top: 10px;
  padding-bottom: 10px;
`
const ZuordnenDiv = styled.div`
  margin-bottom: -10px;
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
const EmailButton = styled(Button)`
  margin-top: -8px !important;
  margin-bottom: -10px !important;
`
const EmailButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
`
const StyledSendIcon = styled(SendIcon)`
  margin-right: 8px;
`
const nichtZuordnenPopover = (
  <Container>
    <LabelPopoverTitleRow>Legende</LabelPopoverTitleRow>
    <LabelPopoverContentRow>
      {'Will heissen: Die Beobachtung kann nicht zugeordnet werden.'}
      <br />
      {'Mögliche Gründe: Unsichere Bestimmung, nicht lokalisierbar.'}
      <br />
      {'Bitte im Bemerkungsfeld begründen.'}
    </LabelPopoverContentRow>
  </Container>
)

const getTpopZuordnenSource = (row: Object, apId: string) => {
  // get all popIds of active ap
  const apArt = get(row, 'aeEigenschaftenByArtId.apartsByArtId.nodes[0]', [])
  if (!apArt) return []
  const popList = get(apArt, 'apByApId.popsByApId.nodes', [])
  // get all tpop
  let tpopList = flatten(popList.map(p => get(p, 'tpopsByPopId.nodes', [])))
    // with coordinates
    // and also: even keep own tpop if it has no coordinates
    .filter(t => (!!t.x && !!t.y) || t.id === row.tpopId)
    .map(t => {
      // calculate their distance to this beob
      const dX = Math.abs(row.x - t.x)
      const dY = Math.abs(row.y - t.y)
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
  return tpopList.map(t => ({
    value: t.id,
    label: t.label,
  }))
}

const Beobzuordnung = ({
  type,
  treeName,
}: {
  type: string,
  treeName: string,
}) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const tree = store[treeName]
  const { activeNodeArray } = store[treeName]
  const id = activeNodeArray[activeNodeArray.length - 1]
  const apId =
    activeNodeArray.length > 3
      ? activeNodeArray[3]
      : '99999999-9999-9999-9999-999999999999'

  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
      apId,
    },
  })

  const row = get(data, 'beobById', {})

  // only include ap-arten (otherwise makes no sense, plus: error when app sets new activeNodeArray to non-existing ap)
  const aeEigenschaftenfilter = useCallback(inputValue =>
    !!inputValue
      ? {
          artname: { includesInsensitive: inputValue },
          apartsByArtIdExist: true,
        }
      : { artname: { isNull: false }, apartsByArtIdExist: true },
  )

  const onSaveArtIdToDb = useCallback(
    event => {
      const { value } = event.target
      saveArtIdToDb({ value, row, treeName, client, store })
    },
    [row, tree],
  )
  const onSaveNichtZuordnenToDb = useCallback(
    value => {
      saveNichtZuordnenToDb({
        value,
        id,
        treeName,
        refetch: data.refetch,
        client,
        store,
      })
    },
    [id, tree],
  )
  const onSaveTpopIdToDb = useCallback(
    event => {
      const { value } = event.target
      saveTpopIdToDb({ value, id, treeName, type, client, store })
    },
    [id, tree, type],
  )
  const onUpdateBemerkungen = useCallback(event => {
    client.mutate({
      mutation: updateBeobByIdGql,
      variables: {
        id,
        bemerkungen: event.target.value,
        changedBy: store.user.name,
      },
    })
  })

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  return (
    <ErrorBoundary>
      <FormContainer>
        <FormTitle
          apId={get(row, 'aeEigenschaftenByArtId.apByArtId.id', null)}
          title="Beobachtung"
          treeName={treeName}
          table="beob"
        />
        <DataContainer>
          <FieldsContainer>
            {row && row.artId !== row.artIdOriginal && (
              <OriginalArtDiv>{`Art gemäss Original-Meldung: ${get(
                row,
                'aeEigenschaftenByArtIdOriginal.artname',
              )}`}</OriginalArtDiv>
            )}
            <SelectLoadingOptions
              key={`${row.id}artId`}
              field="artId"
              valueLabelPath="aeEigenschaftenByArtId.artname"
              label="Art"
              row={row}
              saveToDb={onSaveArtIdToDb}
              query={queryAeEigenschaftens}
              filter={aeEigenschaftenfilter}
              queryNodesName="allAeEigenschaftens"
            />
            <CheckboxWithInfo
              key={`${row.id}nichtZuordnen`}
              name="nichtZuordnen"
              label="Nicht zuordnen"
              value={row.nichtZuordnen}
              saveToDb={onSaveNichtZuordnenToDb}
              popover={nichtZuordnenPopover}
            />
            <ZuordnenDiv>
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
            </ZuordnenDiv>
            <TextField
              key={`${row.id}bemerkungen`}
              name="bemerkungen"
              label="Bemerkungen zur Zuordnung"
              row={row}
              type="text"
              multiLine
              saveToDb={onUpdateBemerkungen}
            />
            <EmailButtonRow>
              <EmailButton
                variant="outlined"
                onClick={() => {
                  const origArt = `Art gemäss Beobachtung: SISF-Nr: ${get(
                    row,
                    'aeEigenschaftenByArtId.taxid',
                  )}, Artname: ${get(row, 'aeEigenschaftenByArtId.artname')}`
                  const neueArt = `Korrigierte Art: SISF-Nr: ${get(
                    row,
                    'aeEigenschaftenByArtIdOriginal.taxid',
                  )}, Artname: ${get(
                    row,
                    'aeEigenschaftenByArtIdOriginal.artname',
                  )}`
                  const bemerkungen = row.bemerkungen
                  // remove all keys with null
                  const dataArray = Object.entries(JSON.parse(row.data)).filter(
                    a => !!a[1] || a[1] === 0 || a[1] === false,
                  )
                  let data = ''
                  dataArray.forEach(d => {
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
                Email an Info Flora senden
              </EmailButton>
            </EmailButtonRow>
          </FieldsContainer>
          <Title>{`Informationen aus ${get(
            row,
            'beobQuelleWerteByQuelleId.name',
            '?',
          )} (nicht veränderbar)`}</Title>
          <Beob treeName={treeName} />
        </DataContainer>
      </FormContainer>
    </ErrorBoundary>
  )
}

export default observer(Beobzuordnung)
