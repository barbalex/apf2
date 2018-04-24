// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import FormTitle from '../../shared/FormTitle'
import TextField from '../../shared/TextField'
import CheckboxWithInfo from '../../shared/CheckboxWithInfo'
import AutoComplete from '../../shared/Autocomplete'
import Beob from './Beob'
import ErrorBoundary from '../../shared/ErrorBoundary'

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

const getTpopZuordnenSource = (store: Object, tree: Object): Array<Object> => {
  const { activeDataset, activeNodes } = tree
  // get all popIds of active ap
  const popList = Array.from(store.table.pop.values()).filter(
    p => p.ap_id === activeNodes.ap
  )
  const popIdList = popList.map(p => p.id)
  // get all tpop
  let tpopList = Array.from(store.table.tpop.values())
    // of active ap
    .filter(t => popIdList.includes(t.pop_id))
    // with coordinates
    .filter(t => t.x && t.y)
  // calculate their distance to this beob
  const beob = store.table.beob.get(activeDataset.row.id)
  // beob loads later
  // prevent an error occuring if it does not yet exist
  // by passing back an empty array
  if (!beob) {
    return []
  }
  tpopList.forEach(t => {
    const dX = Math.abs(beob.x - t.x)
    const dY = Math.abs(beob.y - t.y)
    t.distance = Math.round((dX ** 2 + dY ** 2) ** 0.5)
    const pop = store.table.pop.get(t.pop_id)
    // build label
    const popStatusWerte = Array.from(store.table.pop_status_werte.values())
    let popStatusWert
    if (popStatusWerte) {
      popStatusWert = popStatusWerte.find(x => x.code === t.status)
    }
    if (popStatusWert && popStatusWert.text) {
      t.herkunft = popStatusWert.text
    } else {
      t.herkunft = 'ohne Status'
    }
    const popNr = pop.nr || pop.nr === 0 ? pop.nr : '(keine Nr)'
    const tpopNr = t.nr || t.nr === 0 ? t.nr : '(keine Nr)'
    t.label = `${t.distance.toLocaleString('de-ch')}m: ${popNr}/${tpopNr} (${
      t.herkunft
    })`
  })
  // order them by distance
  tpopList = sortBy(tpopList, 'distance')
  // return array of id, label
  return tpopList.map(t => ({
    id: t.id,
    value: t.label,
  }))
}

const enhance = compose(
  inject('store'),
  withHandlers({
    updatePropertyInDb: props => (
      treePassedByUpdatePropertyInDb,
      fieldname,
      val
    ) => {
      const { store, tree } = props
      const {
        insertBeobzuordnung,
        updatePropertyInDb,
        deleteBeobzuordnung,
      } = store
      const { activeDataset } = tree
      if (val) {
        if (activeDataset.table === 'beob') {
          insertBeobzuordnung(tree, activeDataset.row, fieldname, val)
        } else {
          // beob was moved from one tpop-id to another
          updatePropertyInDb(tree, fieldname, val)
        }
      } else {
        deleteBeobzuordnung(tree, activeDataset.row.id)
      }
    },
  }),
  observer
)

const Beobzuordnung = ({
  store,
  tree,
  updatePropertyInDb,
  dimensions = { width: 380 },
}: {
  store: Object,
  tree: Object,
  updatePropertyInDb: () => void,
  dimensions: Object,
}) => {
  const { table } = store
  const { activeDataset } = tree
  const beob = activeDataset.row
  const quelle = beob ? table.beob_quelle_werte.get(beob.quelle_id) : null
  const quelleName = quelle && quelle.name ? quelle.name : '?'
  const beobTitle = `Informationen aus ${quelleName} (nicht veränderbar)`
  const showTPopId = activeDataset.row.nicht_zuordnen !== 1
  const adbArt =
    beob && beob.art_id ? store.table.ae_eigenschaften.get(beob.art_id) : null
  const artname = adbArt ? adbArt.artname : ''
  const artLabel = `Beobachtete Art: ${artname}`
  const tpopZuordnenSource = getTpopZuordnenSource(store, tree)
  const tpopZuordnenObject = tpopZuordnenSource.find(
    o => o.id === activeDataset.row.tpop_id
  )
  const tpopZuordnenValue =
    tpopZuordnenObject && tpopZuordnenObject.value
      ? tpopZuordnenObject.value
      : null
  console.log('tpopZuordnenSource:', tpopZuordnenSource)

  return (
    <ErrorBoundary>
      <FormContainer>
        <FormTitle tree={tree} title="Beobachtung" />
        <DataContainer>
          <FieldsContainer>
            <div>{artLabel}</div>
            <CheckboxWithInfo
              tree={tree}
              fieldName="nicht_zuordnen"
              label="Nicht zuordnen"
              value={activeDataset.row.nicht_zuordnen}
              updatePropertyInDb={updatePropertyInDb}
              popover={nichtZuordnenPopover}
            />
            {showTPopId && (
              <ZuordnenDiv>
                <AutoComplete
                  key={`${activeDataset.row.id}tpop_id`}
                  tree={tree}
                  label="Einer Teilpopulation zuordnen"
                  fieldName="tpop_id"
                  value={tpopZuordnenValue}
                  objects={tpopZuordnenSource}
                  updatePropertyInDb={updatePropertyInDb}
                />
              </ZuordnenDiv>
            )}
            <TextField
              key={`${activeDataset.row.id}bemerkungen`}
              tree={tree}
              label="Bemerkungen zur Zuordnung"
              fieldName="bemerkungen"
              value={activeDataset.row.bemerkungen}
              errorText={activeDataset.valid.bemerkungen}
              type="text"
              multiLine
              fullWidth
              updateProperty={store.updateProperty}
              updatePropertyInDb={store.updatePropertyInDb}
            />
          </FieldsContainer>
          <Title>{beobTitle}</Title>
          <Beob tree={tree} dimensions={dimensions} />
        </DataContainer>
      </FormContainer>
    </ErrorBoundary>
  )
}

export default enhance(Beobzuordnung)
