// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import { withApollo } from 'react-apollo'
import withProps from 'recompose/withProps'
import { observer } from 'mobx-react-lite'

import TextField from '../../../shared/TextField'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfo'
import Status from '../../../shared/Status'
import SelectCreatable from '../../../shared/SelectCreatableGemeinde'
import RadioButton from '../../../shared/RadioButton'
import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfo'
import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import FormTitle from '../../../shared/FormTitle'
import TpopAbBerRelevantInfoPopover from '../TpopAbBerRelevantInfoPopover'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withData from './withData'
import updateTpopByIdGql from './updateTpopById'
import getGemeindeForKoord from '../../../../modules/getGemeindeForKoord'
import mobxStoreContext from '../../../../mobxStoreContext'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
  fieldset {
    padding-right: 30px;
  }
`

const enhance = compose(
  withApollo,
  withProps(() => ({
    mobxStore: useContext(mobxStoreContext),
  })),
  withData,
  observer,
)

const Tpop = ({
  dimensions = { width: 380 },
  treeName,
  data,
  refetchTree,
  client,
}: {
  dimensions: Object,
  treeName: string,
  data: Object,
  refetchTree: () => void,
  client: Object,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { addError, nodeFilter, nodeFilterSetValue } = mobxStore

  const [errors, setErrors] = useState({})

  const showFilter = !!nodeFilter[treeName].activeTable
  let row
  if (showFilter) {
    row = nodeFilter[treeName].tpop
  } else {
    row = get(data, 'tpopById', {})
  }

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      let value = event.target.value
      if ([undefined, ''].includes(value)) value = null
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      if (showFilter) {
        nodeFilterSetValue({
          treeName,
          table: 'tpop',
          key: field,
          value,
        })
      } else {
        try {
          await client.mutate({
            mutation: updateTpopByIdGql,
            variables: {
              id: row.id,
              [field]: value,
            },
            /*optimisticResponse: {
            __typename: 'Mutation',
            updateTpopById: {
              tpop: {
                id: row.id,
                popId: field === 'popId' ? value : row.popId,
                nr: field === 'nr' ? value : row.nr,
                gemeinde: field === 'gemeinde' ? value : row.gemeinde,
                flurname: field === 'flurname' ? value : row.flurname,
                x: field === 'x' ? value : row.x,
                y: field === 'y' ? value : row.y,
                radius: field === 'radius' ? value : row.radius,
                hoehe: field === 'hoehe' ? value : row.hoehe,
                exposition: field === 'exposition' ? value : row.exposition,
                klima: field === 'klima' ? value : row.klima,
                neigung: field === 'neigung' ? value : row.neigung,
                beschreibung:
                  field === 'beschreibung' ? value : row.beschreibung,
                katasterNr: field === 'katasterNr' ? value : row.katasterNr,
                status: field === 'status' ? value : row.status,
                statusUnklarGrund:
                  field === 'statusUnklarGrund'
                    ? value
                    : row.statusUnklarGrund,
                apberRelevant:
                  field === 'apberRelevant' ? value : row.apberRelevant,
                bekanntSeit:
                  field === 'bekanntSeit' ? value : row.bekanntSeit,
                eigentuemer:
                  field === 'eigentuemer' ? value : row.eigentuemer,
                kontakt: field === 'kontakt' ? value : row.kontakt,
                nutzungszone:
                  field === 'nutzungszone' ? value : row.nutzungszone,
                bewirtschafter:
                  field === 'bewirtschafter' ? value : row.bewirtschafter,
                bewirtschaftung:
                  field === 'bewirtschaftung' ? value : row.bewirtschaftung,
                kontrollfrequenz:
                  field === 'kontrollfrequenz' ? value : row.kontrollfrequenz,
                kontrollfrequenzFreiwillige:
                  field === 'kontrollfrequenzFreiwillige'
                    ? value
                    : row.kontrollfrequenzFreiwillige,
                bemerkungen:
                  field === 'bemerkungen' ? value : row.bemerkungen,
                statusUnklar:
                  field === 'statusUnklar' ? value : row.statusUnklar,
                popStatusWerteByStatus: row.popStatusWerteByStatus,
                tpopApberrelevantWerteByApberRelevant:
                  row.tpopApberrelevantWerteByApberRelevant,
                popByPopId: row.popByPopId,
                __typename: 'Tpop',
              },
              __typename: 'Tpop',
            },
          },*/
          })
        } catch (error) {
          return setErrors({ [field]: error.message })
        }
        // update tpop on map
        if (
          (value && ((field === 'y' && row.x) || (field === 'x' && row.y))) ||
          (!value && (field === 'y' || field === 'x'))
        ) {
          refetchTree('tpopForMap')
        }
        setErrors({})
      }
    },
    [showFilter, row],
  )
  const apJahr = get(data, 'tpopById.popByPopId.apByApId.startJahr', null)
  let gemeindeWerte = get(data, 'allGemeindes.nodes', [])
  gemeindeWerte = gemeindeWerte
    .map(el => el.name)
    .sort()
    .map(o => ({ label: o, value: o }))
  let apberrelevantWerte = get(data, 'allTpopApberrelevantWertes.nodes', [])
  apberrelevantWerte = sortBy(apberrelevantWerte, 'sort')
  apberrelevantWerte = apberrelevantWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))
  let tpopkontrFrequenzWerte = get(data, 'allTpopkontrFrequenzWertes.nodes', [])
  tpopkontrFrequenzWerte = sortBy(tpopkontrFrequenzWerte, 'sort')
  tpopkontrFrequenzWerte = tpopkontrFrequenzWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))

  if (data.loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (data.error) return `Fehler: ${data.error.message}`
  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        <FormTitle
          apId={get(data, 'tpopById.popByPopId.apId')}
          title="Teil-Population"
          treeName={treeName}
          table="tpop"
        />
        <FieldsContainer
          data-width={isNaN(dimensions.width) ? 380 : dimensions.width}
        >
          <TextField
            key={`${row.id}nr`}
            name="nr"
            label="Nr."
            value={row.nr}
            type="number"
            saveToDb={saveToDb}
            error={errors.nr}
          />
          <TextFieldWithInfo
            key={`${row.id}flurname`}
            name="flurname"
            label="Flurname"
            value={row.flurname}
            type="text"
            saveToDb={saveToDb}
            popover="Dieses Feld möglichst immer ausfüllen"
            error={errors.flurname}
          />
          <Status
            key={`${row.id}status`}
            apJahr={apJahr}
            herkunftValue={row.status}
            bekanntSeitValue={row.bekanntSeit}
            saveToDb={saveToDb}
            treeName={treeName}
          />
          <RadioButton
            key={`${row.id}statusUnklar`}
            name="statusUnklar"
            label="Status unklar"
            value={row.statusUnklar}
            saveToDb={saveToDb}
            error={errors.statusUnklar}
          />
          <TextField
            key={`${row.id}statusUnklarGrund`}
            name="statusUnklarGrund"
            label="Begründung"
            value={row.statusUnklarGrund}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.statusUnklarGrund}
          />
          <RadioButtonGroupWithInfo
            value={row.apberRelevant}
            name="apberRelevant"
            dataSource={apberrelevantWerte}
            popover={TpopAbBerRelevantInfoPopover}
            label="Für AP-Bericht relevant"
            saveToDb={saveToDb}
            error={errors.apberRelevant}
          />
          <TextField
            key={`${row.id}x`}
            name="x"
            label="X-Koordinaten"
            value={row.x}
            type="number"
            saveToDb={saveToDb}
            error={errors.x}
          />
          <TextField
            key={`${row.id}y`}
            name="y"
            label="Y-Koordinaten"
            value={row.y}
            type="number"
            saveToDb={saveToDb}
            error={errors.y}
          />
          <SelectCreatable
            key={`${row.id}gemeinde`}
            name="gemeinde"
            value={row.gemeinde}
            field="gemeinde"
            label="Gemeinde"
            options={gemeindeWerte}
            saveToDb={saveToDb}
            onClickLocate={async setStateValue => {
              if (!row.x || !row.y) {
                return setErrors({
                  gemeinde: 'Es fehlen Koordinaten',
                })
              }
              const gemeinde = await getGemeindeForKoord({
                x: row.x,
                y: row.y,
                addError,
              })
              if (gemeinde) {
                const fakeEvent = {
                  target: { value: gemeinde, name: 'gemeinde' },
                }
                saveToDb(fakeEvent)
              }
            }}
            error={errors.gemeinde}
          />
          <TextField
            key={`${row.id}radius`}
            name="radius"
            label="Radius (m)"
            value={row.radius}
            type="number"
            saveToDb={saveToDb}
            error={errors.radius}
          />
          <TextField
            key={`${row.id}hoehe`}
            name="hoehe"
            label="Höhe (m.ü.M.)"
            value={row.hoehe}
            type="number"
            saveToDb={saveToDb}
            error={errors.hoehe}
          />
          <TextField
            key={`${row.id}exposition`}
            name="exposition"
            label="Exposition, Besonnung"
            value={row.exposition}
            type="text"
            saveToDb={saveToDb}
            error={errors.exposition}
          />
          <TextField
            key={`${row.id}klima`}
            name="klima"
            label="Klima"
            value={row.klima}
            type="text"
            saveToDb={saveToDb}
            error={errors.klima}
          />
          <TextField
            key={`${row.id}neigung`}
            name="neigung"
            label="Hangneigung"
            value={row.neigung}
            type="text"
            saveToDb={saveToDb}
            error={errors.neigung}
          />
          <TextField
            key={`${row.id}beschreibung`}
            name="beschreibung"
            label="Beschreibung"
            value={row.beschreibung}
            type="text"
            multiline
            saveToDb={saveToDb}
            error={errors.beschreibung}
          />
          <TextField
            key={`${row.id}katasterNr`}
            name="katasterNr"
            label="Kataster-Nr."
            value={row.katasterNr}
            type="text"
            saveToDb={saveToDb}
            error={errors.katasterNr}
          />
          <TextField
            key={`${row.id}eigentuemer`}
            name="eigentuemer"
            label="EigentümerIn"
            value={row.eigentuemer}
            type="text"
            saveToDb={saveToDb}
            error={errors.eigentuemer}
          />
          <TextField
            key={`${row.id}kontakt`}
            name="kontakt"
            label="Kontakt vor Ort"
            value={row.kontakt}
            type="text"
            saveToDb={saveToDb}
            error={errors.kontakt}
          />
          <TextField
            key={`${row.id}nutzungszone`}
            name="nutzungszone"
            label="Nutzungszone"
            value={row.nutzungszone}
            type="text"
            saveToDb={saveToDb}
            error={errors.nutzungszone}
          />
          <TextField
            key={`${row.id}bewirtschafter`}
            name="bewirtschafter"
            label="BewirtschafterIn"
            value={row.bewirtschafter}
            type="text"
            saveToDb={saveToDb}
            error={errors.bewirtschafter}
          />
          <TextField
            key={`${row.id}bewirtschaftung`}
            name="bewirtschaftung"
            label="Bewirtschaftung"
            value={row.bewirtschaftung}
            type="text"
            saveToDb={saveToDb}
            error={errors.bewirtschaftung}
          />
          <RadioButtonGroup
            value={row.kontrollfrequenz}
            name="kontrollfrequenz"
            dataSource={tpopkontrFrequenzWerte}
            label="Frequenz Feld-Kontrollen"
            saveToDb={saveToDb}
            error={errors.kontrollfrequenz}
          />
          <RadioButtonGroup
            value={row.kontrollfrequenzFreiwillige}
            name="kontrollfrequenzFreiwillige"
            dataSource={tpopkontrFrequenzWerte}
            label="Frequenz Freiwilligen-Kontrollen"
            saveToDb={saveToDb}
            error={errors.kontrollfrequenzFreiwillige}
          />
          <TextField
            key={`${row.id}bemerkungen`}
            name="bemerkungen"
            label="Bemerkungen"
            value={row.bemerkungen}
            type="text"
            multiline
            saveToDb={saveToDb}
            error={errors.bemerkungen}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Tpop)
