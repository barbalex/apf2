import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client/react'
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

import { container, formContainer } from './index.module.css'

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

export const Component = observer(() => {
  const { apberId } = useParams()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id: apberId,
    },
  })

  const row = data?.apberById ?? {}

  const saveToDb = async (event) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: store.user.name,
    }
    try {
      await apolloClient.mutate({
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
      tsQueryClient.invalidateQueries({ queryKey: [`treeApber`] })
    }
  }

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={container}>
        <FormTitle
          title="AP-Bericht"
          MenuBarComponent={Menu}
        />
        <div
          className={formContainer}
          style={{ columnWidth: constants.columnWidth }}
        >
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
          <Select
            name="beurteilung"
            label="Beurteilung"
            options={data?.allApErfkritWertes?.nodes ?? []}
            loading={loading}
            value={row.beurteilung}
            saveToDb={saveToDb}
            error={fieldErrors.beurteilung}
          />
          <Select
            name="veraenderungZumVorjahr"
            label="Veränderung zum Vorjahr"
            options={veraenGegenVorjahrWerte}
            loading={false}
            value={row.veraenderungZumVorjahr}
            saveToDb={saveToDb}
            error={fieldErrors.veraenderungZumVorjahr}
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
        </div>
      </div>
    </ErrorBoundary>
  )
})
