import React, { useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery, useApolloClient, gql } from '@apollo/client'
import { Formik, Form, Field } from 'formik'

import TextField from '../../../../shared/TextFieldFormik'
import TextFieldWithInfo from '../../../../shared/TextFieldWithInfoFormik'
import MdField from '../../../../shared/MarkdownFieldFormik'
import Status from '../../../../shared/Status'
import SelectCreatable from '../../../../shared/SelectCreatableGemeinde'
import Checkbox2States from '../../../../shared/Checkbox2StatesFormik'
import RadioButtonGroupWithInfo from '../../../../shared/RadioButtonGroupWithInfoFormik'
import TpopAbBerRelevantInfoPopover from '../../TpopAbBerRelevantInfoPopover'
import queryLists from './queryLists'
//import getGemeindeForKoord from '../../../../../modules/getGemeindeForKoord'
import constants from '../../../../../modules/constants'
import storeContext from '../../../../../storeContext'
import Coordinates from '../../../../shared/Coordinates'

const FormContainer = styled.div`
  padding: 10px;
  overflow-y: auto !important;
  height: calc(100% - 20px);
  column-width: ${(props) =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const Tpop = ({ treeName, showFilter, onSubmit, row, apJahr, refetchTpop }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()

  const { enqueNotification } = store
  const { datenWidth, filterWidth } = store[treeName]

  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  return (
    <FormContainer data-width={showFilter ? filterWidth : datenWidth}>
      <Formik
        key={showFilter ? row : row ? row.id : 'tpop'}
        initialValues={row}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ handleSubmit, handleChange, handleBlur, dirty, setErrors }) => (
          <Form onBlur={() => dirty && handleSubmit()}>
            <TextField name="nr" label="Nr." type="number" />
            <Field
              name="flurname"
              label="Flurname"
              type="text"
              popover="Dieses Feld möglichst immer ausfüllen"
              component={TextFieldWithInfo}
            />
            <Field
              apJahr={apJahr}
              treeName={treeName}
              showFilter={showFilter}
              component={Status}
            />
            <Checkbox2States
              name="statusUnklar"
              label="Status unklar"
              handleSubmit={handleSubmit}
            />
            <TextField
              name="statusUnklarGrund"
              label="Begründung"
              type="text"
              multiLine
            />
            <Checkbox2States
              name="apberRelevant"
              label="Für AP-Bericht relevant"
              handleSubmit={handleSubmit}
            />
            {errorLists ? (
              <div>errorLists.message</div>
            ) : (
              <RadioButtonGroupWithInfo
                name="apberRelevantGrund"
                dataSource={get(
                  dataLists,
                  'allTpopApberrelevantGrundWertes.nodes',
                  [],
                )}
                loading={loadingLists}
                popover={TpopAbBerRelevantInfoPopover}
                label="Grund für AP-Bericht (Nicht-)Relevanz"
                handleSubmit={handleSubmit}
              />
            )}
            {!showFilter && (
              <Coordinates row={row} refetchForm={refetchTpop} table="tpop" />
            )}
            {errorLists ? (
              <div>errorLists.message</div>
            ) : (
              <Field
                name="gemeinde"
                label="Gemeinde"
                options={get(dataLists, 'allChGemeindes.nodes', [])}
                loading={loadingLists}
                showLocate={!showFilter}
                onClickLocate={async (setStateValue) => {
                  if (!row.lv95X) {
                    return setErrors({
                      gemeinde: 'Es fehlen Koordinaten',
                    })
                  }
                  const geojson = get(row, 'geomPoint.geojson')
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
                          allChGemeindes(
                            filter: {
                              wkbGeometry: { containsProperly: {type: "${geojsonParsed.type}", coordinates: [${geojsonParsed.coordinates}]} }
                            }
                          ) {
                            nodes {
                              name
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
                  const gemeinde = get(
                    result,
                    'data.allChGemeindes.nodes[0].name',
                    '',
                  )
                  // keep following method in case table ch_gemeinden is removed again
                  /*const gemeinde = await getGemeindeForKoord({
                    lv95X: row.lv95X,
                    lv95Y: row.lv95Y,
                    store,
                  })*/
                  if (gemeinde) {
                    const fakeEvent = {
                      target: { value: gemeinde, name: 'gemeinde' },
                    }
                    handleChange(fakeEvent)
                    handleBlur(fakeEvent)
                    setTimeout(() => handleSubmit())
                  }
                }}
                component={SelectCreatable}
              />
            )}
            <TextField name="radius" label="Radius (m)" type="number" />
            <TextField name="hoehe" label="Höhe (m.ü.M.)" type="number" />
            <TextField
              name="exposition"
              label="Exposition, Besonnung"
              type="text"
            />
            <TextField name="klima" label="Klima" type="text" />
            <TextField name="neigung" label="Hangneigung" type="text" />
            <TextField
              name="beschreibung"
              label="Beschreibung"
              type="text"
              multiline
            />
            <TextField name="katasterNr" label="Kataster-Nr." type="text" />
            <TextField name="eigentuemer" label="EigentümerIn" type="text" />
            <TextField name="kontakt" label="Kontakt vor Ort" type="text" />
            <TextField name="nutzungszone" label="Nutzungszone" type="text" />
            <TextField
              name="bewirtschafter"
              label="BewirtschafterIn"
              type="text"
            />
            <TextField
              name="bewirtschaftung"
              label="Bewirtschaftung"
              type="text"
            />
            <MdField name="bemerkungen" label="Bemerkungen" />
          </Form>
        )}
      </Formik>
    </FormContainer>
  )
}

export default observer(Tpop)
