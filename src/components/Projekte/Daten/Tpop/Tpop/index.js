import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery, useApolloClient, gql } from '@apollo/client'
import { Formik, Form } from 'formik'
import { withResizeDetector } from 'react-resize-detector'
import SimpleBar from 'simplebar-react'

import TextFieldFormik from '../../../../shared/TextFieldFormik'
import TextField from '../../../../shared/TextField'
import TextFieldWithInfo from '../../../../shared/TextFieldWithInfo'
import MdField from '../../../../shared/MarkdownFieldFormik'
import Status from '../../../../shared/Status'
import SelectCreatable from '../../../../shared/SelectCreatableGemeinde'
import Checkbox2States from '../../../../shared/Checkbox2States'
import RadioButtonGroupWithInfo from '../../../../shared/RadioButtonGroupWithInfo'
import TpopAbBerRelevantInfoPopover from '../../TpopAbBerRelevantInfoPopover'
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
  saveToDb,
  fieldErrors,
  row,
  apJahr,
  refetchTpop,
  width = 1000,
}) => {
  const store = useContext(storeContext)
  const client = useApolloClient()

  console.log('Tpop rendering')

  const { enqueNotification } = store

  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(gql`
    query TpopListsQueryForTpop {
      allTpopApberrelevantGrundWertes(
        orderBy: SORT_ASC
        filter: { code: { isNull: false } }
      ) {
        nodes {
          value: code
          label: text
        }
      }
      allChGemeindes(orderBy: NAME_ASC) {
        nodes {
          value: name
          label: name
        }
      }
    }
  `)

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
                value={row.nr}
                saveToDb={saveToDb}
                error={fieldErrors.nr}
              />
              <TextFieldWithInfo
                name="flurname"
                label="Flurname"
                type="text"
                value={row.flurname}
                saveToDb={saveToDb}
                popover="Dieses Feld möglichst immer ausfüllen"
                error={fieldErrors.flurname}
              />
              <Status
                apJahr={apJahr}
                showFilter={showFilter}
                handleSubmit={handleSubmit}
              />
              <Checkbox2States
                name="statusUnklar"
                label="Status unklar"
                saveToDb={saveToDb}
              />
              <TextField
                name="statusUnklarGrund"
                label="Begründung"
                type="text"
                value={row.statusUnklarGrund}
                saveToDb={saveToDb}
                multiLine
                error={fieldErrors.statusUnklarGrund}
              />
              <Checkbox2States
                name="apberRelevant"
                label="Für AP-Bericht relevant"
                saveToDb={saveToDb}
              />
              {errorLists ? (
                <div>errorLists.message</div>
              ) : (
                <RadioButtonGroupWithInfo
                  name="apberRelevantGrund"
                  dataSource={
                    dataLists?.allTpopApberrelevantGrundWertes?.nodes ?? []
                  }
                  popover={TpopAbBerRelevantInfoPopover}
                  label="Grund für AP-Bericht (Nicht-)Relevanz"
                  value={row.apberRelevantGrund}
                  saveToDb={saveToDb}
                  error={fieldErrors.apberRelevantGrund}
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
                  saveToDb={saveToDb}
                />
              )}
              <TextField
                name="radius"
                label="Radius (m)"
                type="number"
                value={row.radius}
                saveToDb={saveToDb}
                error={fieldErrors.radius}
              />
              <TextField
                name="hoehe"
                label="Höhe (m.ü.M.)"
                type="number"
                value={row.hoehe}
                saveToDb={saveToDb}
                error={fieldErrors.hoehe}
              />
              <TextField
                name="exposition"
                label="Exposition, Besonnung"
                type="text"
                value={row.exposition}
                saveToDb={saveToDb}
                error={fieldErrors.exposition}
              />
              <TextField
                name="klima"
                label="Klima"
                type="text"
                value={row.klima}
                saveToDb={saveToDb}
                error={fieldErrors.klima}
              />
              <TextField
                name="neigung"
                label="Hangneigung"
                type="text"
                value={row.neigung}
                saveToDb={saveToDb}
                error={fieldErrors.neigung}
              />
              <TextFieldFormik
                name="bodenTyp"
                label="Boden: Typ"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="bodenTyp"
                label="Boden: Typ"
                type="text"
                value={row.bodenTyp}
                saveToDb={saveToDb}
                error={fieldErrors.bodenTyp}
              />
              <TextFieldFormik
                name="bodenKalkgehalt"
                label="Boden: Kalkgehalt"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="nr"
                label="Nr."
                type="number"
                value={row.nr}
                saveToDb={saveToDb}
                error={fieldErrors.nr}
              />
              <TextFieldFormik
                name="bodenDurchlaessigkeit"
                label="Boden: Durchlässigkeit"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="nr"
                label="Nr."
                type="number"
                value={row.nr}
                saveToDb={saveToDb}
                error={fieldErrors.nr}
              />
              <TextFieldFormik
                name="bodenHumus"
                label="Boden: Humusgehalt"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="nr"
                label="Nr."
                type="number"
                value={row.nr}
                saveToDb={saveToDb}
                error={fieldErrors.nr}
              />
              <TextFieldFormik
                name="bodenNaehrstoffgehalt"
                label="Boden: Nährstoffgehalt"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="nr"
                label="Nr."
                type="number"
                value={row.nr}
                saveToDb={saveToDb}
                error={fieldErrors.nr}
              />
              <TextFieldFormik
                name="bodenAbtrag"
                label="Boden: Abtrag"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="nr"
                label="Nr."
                type="number"
                value={row.nr}
                saveToDb={saveToDb}
                error={fieldErrors.nr}
              />
              <TextFieldFormik
                name="wasserhaushalt"
                label="Boden: Wasserhaushalt"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="nr"
                label="Nr."
                type="number"
                value={row.nr}
                saveToDb={saveToDb}
                error={fieldErrors.nr}
              />
              <TextFieldFormik
                name="beschreibung"
                label="Beschreibung"
                type="text"
                multiline
                handleSubmit={handleSubmit}
              />
              <TextField
                name="nr"
                label="Nr."
                type="number"
                value={row.nr}
                saveToDb={saveToDb}
                error={fieldErrors.nr}
              />
              <TextFieldFormik
                name="katasterNr"
                label="Kataster-Nr."
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="nr"
                label="Nr."
                type="number"
                value={row.nr}
                saveToDb={saveToDb}
                error={fieldErrors.nr}
              />
              <TextFieldFormik
                name="eigentuemer"
                label="EigentümerIn"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="nr"
                label="Nr."
                type="number"
                value={row.nr}
                saveToDb={saveToDb}
                error={fieldErrors.nr}
              />
              <TextFieldFormik
                name="kontakt"
                label="Kontakt vor Ort"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="nr"
                label="Nr."
                type="number"
                value={row.nr}
                saveToDb={saveToDb}
                error={fieldErrors.nr}
              />
              <TextFieldFormik
                name="nutzungszone"
                label="Nutzungszone"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="nr"
                label="Nr."
                type="number"
                value={row.nr}
                saveToDb={saveToDb}
                error={fieldErrors.nr}
              />
              <TextFieldFormik
                name="bewirtschafter"
                label="BewirtschafterIn"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="nr"
                label="Nr."
                type="number"
                value={row.nr}
                saveToDb={saveToDb}
                error={fieldErrors.nr}
              />
              <TextFieldFormik
                name="bewirtschaftung"
                label="Bewirtschaftung"
                type="text"
                handleSubmit={handleSubmit}
              />
              <TextField
                name="nr"
                label="Nr."
                type="number"
                value={row.nr}
                saveToDb={saveToDb}
                error={fieldErrors.nr}
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
