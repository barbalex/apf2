// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { Scrollbars } from 'react-custom-scrollbars'

import FormTitle from '../../shared/FormTitle'
import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import RadioButtonWithInfo from '../../shared/RadioButtonWithInfo'
import Label from '../../shared/Label'
import Beob from './Beob'
import getBeobFromBeobBereitgestelltInActiveDataset from '../../../modules/getBeobFromBeobBereitgestelltInActiveDataset'

const Container = styled.div`
  height: 100%;
  overflow-x: auto;
`
const FieldsContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
`
const LabelPopoverRow = styled.div`
  padding: 2px 5px 2px 5px;
`
const LabelPopoverTitleRow = styled(LabelPopoverRow)`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: grey;
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
const MaxHeightDiv = styled.div`
  max-height: 250px;
  overflow-x: auto;
`
const nichtZuordnenPopover = (
  <Container>
    <LabelPopoverTitleRow>
      Legende
    </LabelPopoverTitleRow>
    <LabelPopoverContentRow>
      {`Will heissen: Die Beobachtung kann nicht zugeordnet werden.`}<br />
      {`Mögliche Gründe: Unsichere Bestimmung, nicht lokalisierbar.`}<br />
      {`Bitte im Bemerkungsfeld begründen.`}
    </LabelPopoverContentRow>
  </Container>
)

const getTpopZuordnenSource = (store) => {
  const { activeDataset } = store
  const beobzuordnung = activeDataset.row
  // get all popIds of active ap
  const popList = Array.from(store.table.pop.values())
    .filter(p => p.ApArtId === store.activeUrlElements.ap)
  const popIdList = popList.map(p => p.PopId)
  // get all tpop
  let tpopList = Array.from(store.table.tpop.values())
    // of active ap
    .filter(t => popIdList.includes(t.PopId))
    // with coordinates
    .filter(t => t.TPopXKoord && t.TPopYKoord)
  // calculate their distance to this beobzuordnung
  const beob = getBeobFromBeobBereitgestelltInActiveDataset(store)
  // beob loads later
  // prevent an error occuring if it does not yet exist
  // by passing back an empty array
  if (!beob) {
    return []
  }
  const beobX = (
    beobzuordnung.QuelleId === 2 ?
    beob.FNS_XGIS :
    beob.COORDONNEE_FED_E
  )
  const beobY = (
    beobzuordnung.QuelleId === 2 ?
    beob.FNS_YGIS :
    beob.COORDONNEE_FED_N
  )
  tpopList.forEach((t) => {
    const dX = Math.abs(beobX - t.TPopXKoord)
    const dY = Math.abs(beobY - t.TPopYKoord)
    t.distance = Math.round(((dX ** 2) + (dY ** 2)) ** 0.5)
    t.popNr = store.table.pop.get(t.PopId).PopNr
    // build label
    t.herkunft = (
      t.TPopHerkunft ?
      Array.from(store.table.pop_status_werte.values()).find(x => x.HerkunftId === t.TPopHerkunft).HerkunftTxt :
      `ohne Status`
    )
    t.label = `${t.distance.toLocaleString(`de-ch`)}m: ${t.popNr}/${t.TPopNr} (${t.herkunft})`
  })
  // order them by distance
  tpopList = sortBy(tpopList, `distance`)
  // return array of TPopId, label
  return tpopList.map(t => ({
    value: t.TPopId,
    label: t.label,
  }))
}

const enhance = compose(
  inject(`store`),
  withHandlers({
    updatePropertyInDb: props => (fieldname, val) => {
      if (val) {
        if (props.store.activeDataset.table === `beob_bereitgestellt`) {
          props.store.insertBeobzuordnung(fieldname, val)
        } else {
          // probably beobzuordnung was moved from one TPopId to another
          props.store.updatePropertyInDb(fieldname, val)
        }
      } else {
        console.log(`need to delete beobzuordnung`)
      }
    },
  }),
  observer
)

const Beobzuordnung = ({ store, updatePropertyInDb }) => {
  const { activeDataset } = store
  const beobzuordnung = activeDataset.row
  const beobTitle = (
    beobzuordnung.QuelleId === 1 ?
    `Informationen aus EvAB (nicht veränderbar)` :
    `Informationen aus Infospezies (nicht veränderbar)`
  )
  const showTPopId = activeDataset.row.BeobNichtZuordnen !== 1

  return (
    <Scrollbars>
      <FormTitle title="Beobachtung" />
      <FieldsContainer>
        <Label label="Nicht zuordnen" />
        <RadioButtonWithInfo
          fieldName="BeobNichtZuordnen"
          value={activeDataset.row.BeobNichtZuordnen}
          updatePropertyInDb={updatePropertyInDb}
          popover={nichtZuordnenPopover}
        />
        {
          showTPopId &&
          <div>
            <Label label="Einer Teilpopulation zuordnen" />
            <MaxHeightDiv>
              <RadioButtonGroup
                fieldName="TPopId"
                value={activeDataset.row.TPopId}
                dataSource={getTpopZuordnenSource(store)}
                updatePropertyInDb={updatePropertyInDb}
                onChange={() => console.log('changed')}
              />
            </MaxHeightDiv>
          </div>
        }
        <TextField
          label="Bemerkungen zur Zuordnung"
          fieldName="BeobBemerkungen"
          value={activeDataset.row.BeobBemerkungen}
          errorText={activeDataset.valid.BeobBemerkungen}
          type="text"
          multiLine
          fullWidth
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
      </FieldsContainer>
      <FormTitle title={beobTitle} noTestdataMessage={true} />
      <FieldsContainer>
        <Beob />
      </FieldsContainer>
    </Scrollbars>
  )
}

Beobzuordnung.propTypes = {
  store: PropTypes.object.isRequired,
  updatePropertyInDb: PropTypes.func.isRequired,
}

export default enhance(Beobzuordnung)
