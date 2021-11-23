import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery, useApolloClient, gql } from '@apollo/client'
import { Formik, Form } from 'formik'
import { withResizeDetector } from 'react-resize-detector'
import SimpleBar from 'simplebar-react'

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

const Container = styled.div`
  height: 100%;
  padding: 0 10px;
  ${(props) =>
    props['data-column-width'] &&
    `column-width: ${props['data-column-width']}px;`}
`

const Tpop = ({
  showFilter,
  onSubmit,
  row,
  apJahr,
  refetchTpop,
  width = 1000,
}) => {
  const store = useContext(storeContext)
  const client = useApolloClient()

  const { enqueNotification } = store

  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  const columnWidth =
    width > 2 * constants.columnWidth ? constants.columnWidth : undefined

  if (!row) return null

  return (
    <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
      <Container data-column-width={columnWidth}>
        <Formik
          key={showFilter ? row : row ? row.id : 'tpop'}
          initialValues={row}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ handleSubmit, handleChange, handleBlur, dirty, setErrors }) => (
            <Form onBlur={() => dirty && handleSubmit()}>
              <TextField
                name="nr"
                label="Nr."
                type="number"
                handleSubmit={handleSubmit}
              />
              <TextFieldWithInfo
                name="flurname"
                label="Flurname"
                type="text"
                popover="Dieses Feld möglichst immer ausfüllen"
                handleSubmit={handleSubmit}
              />
              <Status
                apJahr={apJahr}
                showFilter={showFilter}
                handleSubmit={handleSubmit}
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
                handleSubmit={handleSubmit}
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
                  dataSource={
                    dataLists?.allTpopApberrelevantGrundWertes?.nodes ?? []
                  }
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
                <SelectCreatable
                  name="gemeinde"
                  label="Gemeinde"
                  options={dataLists?.allChGemeindes?.nodes ?? []}
                  loading={loadingLists}
                  showLocate={!showFilter}
                  onClickLocate={async () => {
                    if (!row.lv95X) {
                      return setErrors({
                        gemeinde: 'Es fehlen Koordinaten',
                      })
                    }
                    const geojson = row?.geomPoint?.geojson
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
                              # apollo wants an id for its cache
                              id: objectid
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
                    const gemeinde =
                      result?.data?.allChGemeindes?.nodes?.[0]?.name ?? ''
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
                  handleSubmit={handleSubmit}
                />
              )}
              <TextField
                name="radius"
                label="Radius (m)"
                type="number"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="hoehe"
                label="Höhe (m.ü.M.)"
                type="number"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="exposition"
                label="Exposition, Besonnung"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="klima"
                label="Klima"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="neigung"
                label="Hangneigung"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="bodenTyp"
                label="Boden: Typ"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="bodenKalkgehalt"
                label="Boden: Kalkgehalt"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="bodenDurchlaessigkeit"
                label="Boden: Durchlässigkeit"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="bodenHumus"
                label="Boden: Humusgehalt"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="bodenNaehrstoffgehalt"
                label="Boden: Nährstoffgehalt"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="bodenAbtrag"
                label="Boden: Abtrag"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="wasserhaushalt"
                label="Boden: Wasserhaushalt"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="beschreibung"
                label="Beschreibung"
                type="text"
                multiline
                handleSubmit={handleSubmit}
              />
              <TextField
                name="katasterNr"
                label="Kataster-Nr."
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="eigentuemer"
                label="EigentümerIn"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="kontakt"
                label="Kontakt vor Ort"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="nutzungszone"
                label="Nutzungszone"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="bewirtschafter"
                label="BewirtschafterIn"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="bewirtschaftung"
                label="Bewirtschaftung"
                type="text"
                handleSubmit={handleSubmit}
              />
              <MdField name="bemerkungen" label="Bemerkungen" />
            </Form>
          )}
        </Formik>
      </Container>
    </SimpleBar>
  )
}

export default withResizeDetector(observer(Tpop))
