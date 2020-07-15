import React, { useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery, useApolloClient } from '@apollo/client'
import { Formik, Form, Field } from 'formik'
import gql from 'graphql-tag'

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
            <Field name="nr" label="Nr." type="number" component={TextField} />
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
            <Field
              name="statusUnklar"
              label="Status unklar"
              component={Checkbox2States}
            />
            <Field
              name="statusUnklarGrund"
              label="Begründung"
              type="text"
              multiLine
              component={TextField}
            />
            <Field
              name="apberRelevant"
              label="Für AP-Bericht relevant"
              component={Checkbox2States}
            />
            {errorLists ? (
              <div>errorLists.message</div>
            ) : (
              <Field
                name="apberRelevantGrund"
                dataSource={get(
                  dataLists,
                  'allTpopApberrelevantGrundWertes.nodes',
                  [],
                )}
                loading={loadingLists}
                popover={TpopAbBerRelevantInfoPopover}
                label="Grund für AP-Bericht (Nicht-)Relevanz"
                component={RadioButtonGroupWithInfo}
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
            <Field
              name="radius"
              label="Radius (m)"
              type="number"
              component={TextField}
            />
            <Field
              name="hoehe"
              label="Höhe (m.ü.M.)"
              type="number"
              component={TextField}
            />
            <Field
              name="exposition"
              label="Exposition, Besonnung"
              type="text"
              component={TextField}
            />
            <Field
              name="klima"
              label="Klima"
              type="text"
              component={TextField}
            />
            <Field
              name="neigung"
              label="Hangneigung"
              type="text"
              component={TextField}
            />
            <Field
              name="beschreibung"
              label="Beschreibung"
              type="text"
              multiline
              component={TextField}
            />
            <Field
              name="katasterNr"
              label="Kataster-Nr."
              type="text"
              component={TextField}
            />
            <Field
              name="eigentuemer"
              label="EigentümerIn"
              type="text"
              component={TextField}
            />
            <Field
              name="kontakt"
              label="Kontakt vor Ort"
              type="text"
              component={TextField}
            />
            <Field
              name="nutzungszone"
              label="Nutzungszone"
              type="text"
              component={TextField}
            />
            <Field
              name="bewirtschafter"
              label="BewirtschafterIn"
              type="text"
              component={TextField}
            />
            <Field
              name="bewirtschaftung"
              label="Bewirtschaftung"
              type="text"
              component={TextField}
            />
            <Field name="bemerkungen" label="Bemerkungen" component={MdField} />
          </Form>
        )}
      </Formik>
    </FormContainer>
  )
}

export default observer(Tpop)
