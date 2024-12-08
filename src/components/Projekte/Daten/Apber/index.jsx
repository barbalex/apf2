import { memo, useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.jsx'
import { Select } from '../../../shared/Select.jsx'
import { DateField } from '../../../shared/Date.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { constants } from '../../../../modules/constants.js'
import { query } from './query.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { apber } from '../../../shared/fragments.js'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Menu } from './Menu.jsx'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  flex-grow: 1;
  padding: 10px;
  column-width: ${constants.columnWidth}px;
`

const veraenGegenVorjahrWerte = [
  { value: '+', label: '+' },
  { value: '-', label: '–' },
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

export const Component = memo(
  observer(() => {
    const { apberId } = useParams()

    const store = useContext(MobxContext)
    const client = useApolloClient()
    const queryClient = useQueryClient()

    const [fieldErrors, setFieldErrors] = useState({})

    const { data, loading, error } = useQuery(query, {
      variables: {
        id: apberId,
      },
    })

    const row = useMemo(() => data?.apberById ?? {}, [data?.apberById])

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
          queryClient.invalidateQueries({ queryKey: [`treeApbers`] })
        }
      },
      [client, queryClient, row.id, store.user.name],
    )

    if (loading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <ErrorBoundary>
        <Container>
          <FormTitle
            title="AP-Bericht"
            menuBar={<Menu />}
          />
          <FormContainer>
            <TextField
              name="jahr"
              label="Jahr"
              type="number"
              value={row.jahr}
              saveToDb={saveToDb}
              error={fieldErrors.jahr}
            />
            <MarkdownField
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
            <MarkdownField
              name="apberAnalyse"
              label="Analyse"
              value={row.apberAnalyse}
              saveToDb={saveToDb}
              error={fieldErrors.apberAnalyse}
            />
            <MarkdownField
              name="konsequenzenUmsetzung"
              label="Konsequenzen für die Umsetzung"
              value={row.konsequenzenUmsetzung}
              saveToDb={saveToDb}
              error={fieldErrors.konsequenzenUmsetzung}
            />
            <MarkdownField
              name="konsequenzenErfolgskontrolle"
              label="Konsequenzen für die Erfolgskontrolle"
              value={row.konsequenzenErfolgskontrolle}
              saveToDb={saveToDb}
              error={fieldErrors.konsequenzenErfolgskontrolle}
            />
            <MarkdownField
              name="biotopeNeue"
              label="A. Grundmengen: Bemerkungen/Folgerungen für nächstes Jahr: neue Biotope"
              value={row.biotopeNeue}
              saveToDb={saveToDb}
              error={fieldErrors.biotopeNeue}
            />
            <MarkdownField
              name="biotopeOptimieren"
              label="B. Bestandesentwicklung: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Biotope"
              value={row.biotopeOptimieren}
              saveToDb={saveToDb}
              error={fieldErrors.biotopeOptimieren}
            />
            <MarkdownField
              name="massnahmenApBearb"
              label="C. Zwischenbilanz zur Wirkung von Massnahmen: Weitere Aktivitäten der Art-Verantwortlichen"
              value={row.massnahmenApBearb}
              saveToDb={saveToDb}
              error={fieldErrors.massnahmenApBearb}
            />
            <MarkdownField
              name="massnahmenPlanungVsAusfuehrung"
              label="C. Zwischenbilanz zur Wirkung von Massnahmen: Vergleich Ausführung/Planung"
              value={row.massnahmenPlanungVsAusfuehrung}
              saveToDb={saveToDb}
              error={fieldErrors.massnahmenPlanungVsAusfuehrung}
            />
            <MarkdownField
              name="massnahmenOptimieren"
              label="C. Zwischenbilanz zur Wirkung von Massnahmen: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Massnahmen"
              value={row.massnahmenOptimieren}
              saveToDb={saveToDb}
              error={fieldErrors.massnahmenOptimieren}
            />
            <MarkdownField
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
        </Container>
      </ErrorBoundary>
    )
  }),
)
