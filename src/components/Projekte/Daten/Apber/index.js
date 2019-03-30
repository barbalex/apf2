// @flow
import React, { useEffect, useState, useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import Select from '../../../shared/Select'
import DateFieldWithPicker from '../../../shared/DateFieldWithPicker'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import updateApberByIdGql from './updateApberById'
import query from './query'
import queryAdresses from './queryAdresses'
import queryApErfkritWertes from './queryApErfkritWertes'
import mobxStoreContext from '../../../../mobxStoreContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding: 10px;
  height: 100%;
  column-width: ${props =>
    props.width > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const Apber = ({
  dimensions = { width: 380 },
  treeName,
}: {
  dimensions: Object,
  treeName: string,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const client = useApolloClient()
  const [errors, setErrors] = useState({})
  const { activeNodeArray } = mobxStore[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 5
          ? activeNodeArray[5]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const {
    data: dataAdresses,
    loading: loadingAdresses,
    error: errorAdresses,
  } = useQuery(queryAdresses)
  const {
    data: dataApErfkritWertes,
    loading: loadingApErfkritWertes,
    error: errorApErfkritWertes,
  } = useQuery(queryApErfkritWertes)

  const row = get(data, 'apberById', {})

  useEffect(() => {
    setErrors({})
  }, [row])

  const saveToDb = useCallback(async event => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)
    const row = get(data, 'apberById', {})
    try {
      await client.mutate({
        mutation: updateApberByIdGql,
        variables: {
          id: row.id,
          [field]: value,
          changedBy: mobxStore.user.name,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateApberById: {
            apber: {
              id: row.id,
              jahr: field === 'jahr' ? value : row.jahr,
              situation: field === 'situation' ? value : row.situation,
              vergleichVorjahrGesamtziel:
                field === 'vergleichVorjahrGesamtziel'
                  ? value
                  : row.vergleichVorjahrGesamtziel,
              beurteilung: field === 'beurteilung' ? value : row.beurteilung,
              veraenderungZumVorjahr:
                field === 'veraenderungZumVorjahr'
                  ? value
                  : row.veraenderungZumVorjahr,
              apberAnalyse: field === 'apberAnalyse' ? value : row.apberAnalyse,
              konsequenzenUmsetzung:
                field === 'konsequenzenUmsetzung'
                  ? value
                  : row.konsequenzenUmsetzung,
              konsequenzenErfolgskontrolle:
                field === 'konsequenzenErfolgskontrolle'
                  ? value
                  : row.konsequenzenErfolgskontrolle,
              biotopeNeue: field === 'biotopeNeue' ? value : row.biotopeNeue,
              biotopeOptimieren:
                field === 'biotopeOptimieren' ? value : row.biotopeOptimieren,
              massnahmenOptimieren:
                field === 'massnahmenOptimieren'
                  ? value
                  : row.massnahmenOptimieren,
              wirkungAufArt:
                field === 'wirkungAufArt' ? value : row.wirkungAufArt,
              datum: field === 'datum' ? value : row.datum,
              massnahmenApBearb:
                field === 'massnahmenApBearb' ? value : row.massnahmenApBearb,
              massnahmenPlanungVsAusfuehrung:
                field === 'massnahmenPlanungVsAusfuehrung'
                  ? value
                  : row.massnahmenPlanungVsAusfuehrung,
              apId: field === 'apId' ? value : row.apId,
              bearbeiter: field === 'bearbeiter' ? value : row.bearbeiter,
              apErfkritWerteByBeurteilung: row.apErfkritWerteByBeurteilung,
              adresseByBearbeiter: row.adresseByBearbeiter,
              __typename: 'Apber',
            },
            __typename: 'Apber',
          },
        },
      })
    } catch (error) {
      return setErrors({ [field]: error.message })
    }
    setErrors({})
  })

  const veraenGegenVorjahrWerte = [
    { value: '+', label: '+' },
    { value: '-', label: '-' },
  ]
  const width = isNaN(dimensions.width) ? 380 : dimensions.width
  let beurteilungWerte = get(
    dataApErfkritWertes,
    'allApErfkritWertes.nodes',
    [],
  )
  beurteilungWerte = sortBy(beurteilungWerte, 'sort')
  beurteilungWerte = beurteilungWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))
  let adressenWerte = get(dataAdresses, 'allAdresses.nodes', [])
  adressenWerte = sortBy(adressenWerte, 'name')
  adressenWerte = adressenWerte.map(el => ({
    value: el.id,
    label: el.name,
  }))

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  if (errorAdresses) return `Fehler: ${errorAdresses.message}`
  if (errorApErfkritWertes) {
    return `Fehler: ${errorApErfkritWertes.message}`
  }

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="AP-Bericht"
          treeName={treeName}
          table="apber"
        />
        <FieldsContainer width={width}>
          <TextField
            key={`${row.id}jahr`}
            name="jahr"
            label="Jahr"
            value={row.jahr}
            type="number"
            saveToDb={saveToDb}
            error={errors.jahr}
          />
          <TextField
            key={`${row.id}vergleichVorjahrGesamtziel`}
            name="vergleichVorjahrGesamtziel"
            label="Vergleich Vorjahr - Gesamtziel"
            value={row.vergleichVorjahrGesamtziel}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.vergleichVorjahrGesamtziel}
          />
          <RadioButtonGroup
            key={`${row.id}beurteilung`}
            name="beurteilung"
            value={row.beurteilung}
            label="Beurteilung"
            dataSource={beurteilungWerte}
            loading={loadingApErfkritWertes}
            saveToDb={saveToDb}
            error={errors.beurteilung}
          />
          <RadioButtonGroup
            key={`${row.id}veraenderungZumVorjahr`}
            name="veraenderungZumVorjahr"
            value={row.veraenderungZumVorjahr}
            label="Veränderung zum Vorjahr"
            dataSource={veraenGegenVorjahrWerte}
            saveToDb={saveToDb}
            error={errors.veraenderungZumVorjahr}
          />
          <TextField
            key={`${row.id}apberAnalyse`}
            name="apberAnalyse"
            label="Analyse"
            value={row.apberAnalyse}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.apberAnalyse}
          />
          <TextField
            key={`${row.id}konsequenzenUmsetzung`}
            name="konsequenzenUmsetzung"
            label="Konsequenzen für die Umsetzung"
            value={row.konsequenzenUmsetzung}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.konsequenzenUmsetzung}
          />
          <TextField
            key={`${row.id}konsequenzenErfolgskontrolle`}
            name="konsequenzenErfolgskontrolle"
            label="Konsequenzen für die Erfolgskontrolle"
            value={row.konsequenzenErfolgskontrolle}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.konsequenzenErfolgskontrolle}
          />
          <TextField
            key={`${row.id}biotopeNeue`}
            name="biotopeNeue"
            label="A. Grundmengen: Bemerkungen/Folgerungen für nächstes Jahr: neue Biotope"
            value={row.biotopeNeue}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.biotopeNeue}
          />
          <TextField
            key={`${row.id}biotopeOptimieren`}
            name="biotopeOptimieren"
            label="B. Bestandesentwicklung: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Biotope"
            value={row.biotopeOptimieren}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.biotopeOptimieren}
          />
          <TextField
            key={`${row.id}massnahmenApBearb`}
            name="massnahmenApBearb"
            label="C. Zwischenbilanz zur Wirkung von Massnahmen: Weitere Aktivitäten der Aktionsplan-Verantwortlichen"
            value={row.massnahmenApBearb}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.massnahmenApBearb}
          />
          <TextField
            key={`${row.id}massnahmenPlanungVsAusfuehrung`}
            name="massnahmenPlanungVsAusfuehrung"
            label="C. Zwischenbilanz zur Wirkung von Massnahmen: Vergleich Ausführung/Planung"
            value={row.massnahmenPlanungVsAusfuehrung}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.massnahmenPlanungVsAusfuehrung}
          />
          <TextField
            key={`${row.id}massnahmenOptimieren`}
            name="massnahmenOptimieren"
            label="C. Zwischenbilanz zur Wirkung von Massnahmen: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Massnahmen"
            value={row.massnahmenOptimieren}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.massnahmenOptimieren}
          />
          <TextField
            key={`${row.id}wirkungAufArt`}
            name="wirkungAufArt"
            label="D. Einschätzung der Wirkung des AP insgesamt auf die Art: Bemerkungen"
            value={row.wirkungAufArt}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.wirkungAufArt}
          />
          <DateFieldWithPicker
            key={`${row.id}datum`}
            name="datum"
            label="Datum"
            value={row.datum}
            saveToDb={saveToDb}
            error={errors.datum}
          />
          <Select
            key={`${row.id}bearbeiter`}
            name="bearbeiter"
            value={row.bearbeiter}
            field="bearbeiter"
            label="BearbeiterIn"
            options={adressenWerte}
            loading={loadingAdresses}
            saveToDb={saveToDb}
            error={errors.bearbeiter}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Apber)
