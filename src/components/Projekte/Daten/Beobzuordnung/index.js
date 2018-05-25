// @flow
import React from 'react'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
import flatten from 'lodash/flatten'
import gql from 'graphql-tag'

import FormTitle from '../../../shared/FormTitle'
import TextField from '../../../shared/TextField'
import CheckboxWithInfo from '../../../shared/CheckboxWithInfo'
import AutoComplete from '../../../shared/Autocomplete'
import Beob from '../Beob'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import updateBeobByIdGql from './updateBeobById.graphql'
import setTreeKeyGql from './setTreeKey.graphql'
import saveNichtZuordnenToDb from './saveNichtZuordnenToDb'

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

const getTpopZuordnenSource = (row: Object): Array<Object> => {
  // get all popIds of active ap
  const popList = get(
    row,
    'aeEigenschaftenByArtId.apByArtId.popsByApId.nodes',
    []
  )
  // get all tpop
  let tpopList = flatten(popList.map(p => get(p, 'tpopsByPopId.nodes', [])))
    // with coordinates
    .filter(t => !!t.x && !!t.y)
    .map(t => {
      // calculate their distance to this beob
      const dX = Math.abs(row.x - t.x)
      const dY = Math.abs(row.y - t.y)
      const distance = Math.round((dX ** 2 + dY ** 2) ** 0.5).toLocaleString(
        'de-ch'
      )
      // build label
      const tpopStatus = get(t, 'popStatusWerteByStatus.text', 'ohne Status')
      const popNr = get(t, 'popByPopId.nr', '(keine Nr)')
      const tpopNr = t.nr || '(keine Nr)'

      return {
        id: t.id,
        distance,
        label: `${distance}m: ${popNr}/${tpopNr} (${tpopStatus})`,
      }
    })
  // order them by distance
  tpopList = sortBy(tpopList, 'distance')
  // return array of id, label
  return tpopList.map(t => ({
    id: t.id,
    value: t.label,
  }))
}

const Beobzuordnung = ({
  id,
  tree,
  type,
  dimensions = { width: 380 },
  refetchTree
}: {
  id: String,
  tree: Object,
  type: String,
  dimensions: Object,
  refetchTree: () => void
}) => (
  <Query query={dataGql} variables={{ id }}>
    {({ loading, error, data, client, refetch }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'beobById')
      const tpop = get(row, 'aeEigenschaftenByArtId.apByArtId.popsByApId.tpopsByPopId')
      let tpopLabel
      if (tpop) {
        const dX = Math.abs(tpop.x - row.x)
        const dY = Math.abs(tpop.y - row.y)
        const distance = Math.round((dX ** 2 + dY ** 2) ** 0.5).toLocaleString(
          'de-ch'
        )
        // build label
        const tpopStatus = get(tpop, 'popStatusWerteByStatus.text', 'ohne Status')
        const popNr = get(tpop, 'popByPopId.nr', '(keine Nr)')
        const tpopNr = tpop.nr || '(keine Nr)'
        tpopLabel = `${distance}m: ${popNr}/${tpopNr} (${tpopStatus})`
      }

      return (
        <ErrorBoundary>
          <FormContainer>
            <FormTitle
              apId={get(row, 'aeEigenschaftenByArtId.apByArtId.id', null)}
              title="Beobachtung"
            />
            <DataContainer>
              <Mutation mutation={updateBeobByIdGql}>
                {(updateBeob, { data }) => (
                  <FieldsContainer>
                    <div>{`Beobachtete Art: ${get(
                      row,
                      'aeEigenschaftenByArtId.artname'
                    )}`}</div>
                    <CheckboxWithInfo
                      key={`${row.id}nichtZuordnen`}
                      label="Nicht zuordnen"
                      value={row.nichtZuordnen}
                      saveToDb={value => saveNichtZuordnenToDb({
                          value,
                          id,
                          updateBeob,
                          tree,
                          client,
                          refetch,
                          refetchTree
                        })
                      }
                      popover={nichtZuordnenPopover}
                    />
                    <ZuordnenDiv>
                      <AutoComplete
                        key={`${row.id}tpopId`}
                        label={
                          !!row.tpopId
                            ? 'Einer anderen Teilpopulation zuordnen'
                            : 'Einer Teilpopulation zuordnen'
                        }
                        value={tpop ? tpopLabel : ''}
                        objects={getTpopZuordnenSource(row)}
                        saveToDb={async value => {
                          console.log('Beobzuordnung:', {value,id})
                          const variables = {
                            id,
                            tpopId: value
                          }
                          if (value) variables.nichtZuordnen = false
                          // if value, set nichtZuordnen false
                          if (!!value) variables.nichtZuordnen = false
                          updateBeob({
                            variables,
                          })
                          // TODO: value null > nichtBeurteilt!!!
                          // need to update activeNodeArray and openNodes
                          const { activeNodeArray: aNA, openNodes } = tree

                          if (value) {
                            let result = {}
                            result = await client.query({
                              query: gql`
                                query Query($id: UUID!) {
                                  tpopById(id: $id) {
                                    id
                                    popId
                                  }
                                }`,
                                variables: { id: value }
                            })
                            // aNA = activeNodeArray
                            const popId = get(result, 'data.tpopById.popId')
                            const tpopId = get(result, 'data.tpopById.id')
                            const newANA = [ aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen', popId, 'Teil-Populationen', tpopId, 'Beobachtungen', id ]
                            const oldParentNodeUrl = clone(aNA)
                            oldParentNodeUrl.pop()
                            const oldGParentNodeUrl = clone(oldParentNodeUrl)
                            oldGParentNodeUrl.pop()
                            const oldGGParentNodeUrl = clone(oldGParentNodeUrl)
                            oldGGParentNodeUrl.pop()
                            const oldGGGParentNodeUrl = clone(oldGGParentNodeUrl)
                            oldGGGParentNodeUrl.pop()
                            let newOpenNodes
                            if (['nichtZuzuordnen', 'nichtBeurteilt'].includes(type)) {
                              newOpenNodes = [
                                ...openNodes.filter(n => 
                                  !isEqual(n, aNA) &&
                                  !isEqual(n, oldParentNodeUrl)
                                ),
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen' ],
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen', popId ],
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen', popId, 'Teil-Populationen' ],
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen', popId, 'Teil-Populationen', tpopId ],
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen', popId, 'Teil-Populationen', tpopId, 'Beobachtungen' ],
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen', popId, 'Teil-Populationen', tpopId, 'Beobachtungen', id ]
                              ]
                            } else {
                              newOpenNodes = [
                                ...openNodes.filter(n => 
                                  !isEqual(n, aNA) &&
                                  !isEqual(n, oldParentNodeUrl) &&
                                  !isEqual(n, oldGParentNodeUrl) &&
                                  !isEqual(n, oldGParentNodeUrl) &&
                                  !isEqual(n, oldGGParentNodeUrl)
                                ),
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen', popId ],
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen', popId, 'Teil-Populationen' ],
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen', popId, 'Teil-Populationen', tpopId ],
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen', popId, 'Teil-Populationen', tpopId, 'Beobachtungen' ],
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'Populationen', popId, 'Teil-Populationen', tpopId, 'Beobachtungen', id ]
                              ]
                            }
                            await client.mutate({
                              mutation: setTreeKeyGql,
                              variables: {
                                tree: tree.name,
                                value1: newANA,
                                key1: 'activeNodeArray',
                                value2: newOpenNodes,
                                key2: 'openNodes'
                              }
                            })
                          } else {
                            const newANA = [ aNA[0], aNA[1], aNA[2], aNA[3], 'nicht-beurteilte-Beobachtungen', id ]
                            const oldParentNodeUrl = clone(aNA)
                            oldParentNodeUrl.pop()
                            const oldGParentNodeUrl = clone(oldParentNodeUrl)
                            oldGParentNodeUrl.pop()
                            const oldGGParentNodeUrl = clone(oldGParentNodeUrl)
                            oldGGParentNodeUrl.pop()
                            const oldGGGParentNodeUrl = clone(oldGGParentNodeUrl)
                            oldGGGParentNodeUrl.pop()
                            const oldGGGGParentNodeUrl = clone(oldGGGParentNodeUrl)
                            oldGGGGParentNodeUrl.pop()
                            let newOpenNodes
                            if (['nichtZuzuordnen', 'nichtBeurteilt'].includes(type)) {
                              newOpenNodes = [
                                ...openNodes.filter(n => 
                                  !isEqual(n, aNA) &&
                                  !isEqual(n, oldParentNodeUrl)
                                ),
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'nicht-beurteilte-Beobachtungen' ],
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'nicht-beurteilte-Beobachtungen', id ],
                              ]
                            } else {
                              newOpenNodes = [
                                ...openNodes.filter(n => 
                                  !isEqual(n, aNA) &&
                                  !isEqual(n, oldParentNodeUrl) &&
                                  !isEqual(n, oldGParentNodeUrl) &&
                                  !isEqual(n, oldGParentNodeUrl) &&
                                  !isEqual(n, oldGGParentNodeUrl) &&
                                  !isEqual(n, oldGGGParentNodeUrl)
                                ),
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'nicht-beurteilte-Beobachtungen' ],
                                [ aNA[0], aNA[1], aNA[2], aNA[3], 'nicht-beurteilte-Beobachtungen', id ],
                              ]
                            }
                            await client.mutate({
                              mutation: setTreeKeyGql,
                              variables: {
                                tree: tree.name,
                                value1: newANA,
                                key1: 'activeNodeArray',
                                value2: newOpenNodes,
                                key2: 'openNodes'
                              }
                            })
                          }
                          refetchTree()
                        }}
                      />
                    </ZuordnenDiv>
                    <TextField
                      key={`${row.id}bemerkungen`}
                      label="Bemerkungen zur Zuordnung"
                      value={row.bemerkungen}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        updateBeob({
                          variables: {
                            id,
                            bemerkungen: value,
                          },
                        })
                      }
                    />
                  </FieldsContainer>
                )}
              </Mutation>
              <Title>{`Informationen aus ${get(
                row,
                'beobQuelleWerteByQuelleId.name',
                '?'
              )} (nicht veränderbar)`}</Title>
              <Beob id={id} dimensions={dimensions} />
            </DataContainer>
          </FormContainer>
        </ErrorBoundary>
      )
    }}
  </Query>
)

export default Beobzuordnung
