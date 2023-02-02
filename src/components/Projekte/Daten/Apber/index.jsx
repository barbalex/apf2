import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useResizeDetector } from 'react-resize-detector'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import MdField from '../../../shared/MarkdownField'
import Select from '../../../shared/Select'
import DateField from '../../../shared/Date'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import query from './query'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { apber } from '../../../shared/fragments'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
`
const FormContainer = styled.div`
  padding: 10px;
  ${(props) =>
    props['data-column-width'] &&
    `column-width: ${props['data-column-width']}px;`}
`

const veraenGegenVorjahrWerte = [
  { value: '+', label: '+' },
  { value: '-', label: '-' },
]

const fieldTypes = {
  jahr: 'Int',
  situation: 'String',
  vergleichVorjahrGesamtziel: 'String',
  beurteilung: 'Int',
  veraenderungZumVorjahr: 'String',
  apberAnalyse: 'String',
  konsequenzenUmsetzung: 'String',
  konsequenzenErfolgskontrolle: 'String',
  biotopeNeue: 'String',
  biotopeOptimieren: 'String',
  massnahmenOptimieren: 'String',
  wirkungAufArt: 'String',
  datum: 'Date',
  massnahmenApBearb: 'String',
  massnahmenPlanungVsAusfuehrung: 'String',
  apId: 'UUID',
  bearbeiter: 'UUID',
}

const Apber = () => {
  const { apberId } = useParams()

  const store = useContext(storeContext)
  const client = useApolloClient()
  const queryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id: apberId,
    },
  })

  const row = useMemo(() => data?.apberById ?? {}, [data?.apberById])

  const { width = 500, ref: resizeRef } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 100,
    refreshOptions: { leading: true },
  })

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

      const variables = {
        id: row.id,
        [field]: value,
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateApber(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateApberById(
                input: {
                  id: $id
                  apberPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                apber {
                  ...ApberFields
                }
              }
            }
            ${apber}
          `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
      if (field === 'jahr') {
        queryClient.invalidateQueries({ queryKey: [`apberQuery`] })
      }
      store.queryClient.invalidateQueries({
        queryKey: [`treeApber`],
      })
    },
    [client, queryClient, row.id, store.queryClient, store.user.name],
  )

  const columnWidth =
    width > 2 * constants.columnWidth ? constants.columnWidth : undefined

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container ref={resizeRef}>
        <FormTitle title="AP-Bericht" />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FormContainer data-column-width={columnWidth}>
              <TextField
                name="jahr"
                label="Jahr"
                type="number"
                value={row.jahr}
                saveToDb={saveToDb}
                error={fieldErrors.jahr}
              />
              <MdField
                name="vergleichVorjahrGesamtziel"
                label="Vergleich Vorjahr - Gesamtziel"
                value={row.vergleichVorjahrGesamtziel}
                saveToDb={saveToDb}
                error={fieldErrors.vergleichVorjahrGesamtziel}
              />
              <RadioButtonGroup
                name="beurteilung"
                label="Beurteilung"
                dataSource={data?.allApErfkritWertes?.nodes ?? []}
                loading={loading}
                value={row.beurteilung}
                saveToDb={saveToDb}
                error={fieldErrors.beurteilung}
              />
              <RadioButtonGroup
                name="veraenderungZumVorjahr"
                label="Veränderung zum Vorjahr"
                dataSource={veraenGegenVorjahrWerte}
                value={row.veraenderungZumVorjahr}
                saveToDb={saveToDb}
                error={fieldErrors.beurteilung}
              />
              <MdField
                name="apberAnalyse"
                label="Analyse"
                value={row.apberAnalyse}
                saveToDb={saveToDb}
                error={fieldErrors.apberAnalyse}
              />
              <MdField
                name="konsequenzenUmsetzung"
                label="Konsequenzen für die Umsetzung"
                value={row.konsequenzenUmsetzung}
                saveToDb={saveToDb}
                error={fieldErrors.konsequenzenUmsetzung}
              />
              <MdField
                name="konsequenzenErfolgskontrolle"
                label="Konsequenzen für die Erfolgskontrolle"
                value={row.konsequenzenErfolgskontrolle}
                saveToDb={saveToDb}
                error={fieldErrors.konsequenzenErfolgskontrolle}
              />
              <MdField
                name="biotopeNeue"
                label="A. Grundmengen: Bemerkungen/Folgerungen für nächstes Jahr: neue Biotope"
                value={row.biotopeNeue}
                saveToDb={saveToDb}
                error={fieldErrors.biotopeNeue}
              />
              <MdField
                name="biotopeOptimieren"
                label="B. Bestandesentwicklung: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Biotope"
                value={row.biotopeOptimieren}
                saveToDb={saveToDb}
                error={fieldErrors.biotopeOptimieren}
              />
              <MdField
                name="massnahmenApBearb"
                label="C. Zwischenbilanz zur Wirkung von Massnahmen: Weitere Aktivitäten der Art-Verantwortlichen"
                value={row.massnahmenApBearb}
                saveToDb={saveToDb}
                error={fieldErrors.massnahmenApBearb}
              />
              <MdField
                name="massnahmenPlanungVsAusfuehrung"
                label="C. Zwischenbilanz zur Wirkung von Massnahmen: Vergleich Ausführung/Planung"
                value={row.massnahmenPlanungVsAusfuehrung}
                saveToDb={saveToDb}
                error={fieldErrors.massnahmenPlanungVsAusfuehrung}
              />
              <MdField
                name="massnahmenOptimieren"
                label="C. Zwischenbilanz zur Wirkung von Massnahmen: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Massnahmen"
                value={row.massnahmenOptimieren}
                saveToDb={saveToDb}
                error={fieldErrors.massnahmenOptimieren}
              />
              <MdField
                name="wirkungAufArt"
                label="D. Einschätzung der Wirkung des AP insgesamt auf die Art: Bemerkungen"
                value={row.wirkungAufArt}
                saveToDb={saveToDb}
                error={fieldErrors.wirkungAufArt}
              />
              <DateField
                name="datum"
                label="Datum"
                value={row.datum}
                saveToDb={saveToDb}
                error={fieldErrors.datum}
              />
              <Select
                name="bearbeiter"
                label="BearbeiterIn"
                options={data?.allAdresses?.nodes ?? []}
                loading={loading}
                value={row.bearbeiter}
                saveToDb={saveToDb}
                error={fieldErrors.bearbeiter}
              />
            </FormContainer>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Apber)
