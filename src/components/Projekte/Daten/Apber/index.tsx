import { useState, type ChangeEvent } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { gql } from '@apollo/client'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.tsx'
import { Select } from '../../../shared/Select.tsx'
import { DateField } from '../../../shared/Date.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { apber } from '../../../shared/fragments.ts'
import { Menu } from './Menu.tsx'

import type Apber from '../../../../models/apflora/Apber.ts'
import type { AdresseId } from '../../../../models/apflora/Adresse.ts'
import type { ApErfkritWerteCode } from '../../../../models/apflora/ApErfkritWerte.ts'

import styles from './index.module.css'

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

interface ApberQueryResult {
  apberById: Apber
  allAdresses: {
    nodes: Array<{
      value: AdresseId
      label: string
    }>
  }
  allApErfkritWertes: {
    nodes: Array<{
      value: ApErfkritWerteCode
      label: string
    }>
  }
}

export const Component = () => {
  const { apberId } = useParams<{ apberId: string }>()

  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useQuery({
    queryKey: ['apber', apberId],
    queryFn: async () => {
      const result = await apolloClient.query<ApberQueryResult>({
        query,
        variables: {
          id: apberId,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const row = data?.data?.apberById ?? {}

  const saveToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    try {
      await apolloClient.mutate<any>({
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
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    // Invalidate query to refetch data
    tsQueryClient.invalidateQueries({
      queryKey: ['apber', apberId],
    })
    if (field === 'jahr') {
      tsQueryClient.invalidateQueries({ queryKey: [`treeApber`] })
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="AP-Bericht"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
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
            key={`${apberId}beurteilung`}
            name="beurteilung"
            label="Beurteilung"
            options={data?.data?.allApErfkritWertes?.nodes ?? []}
            value={row.beurteilung}
            saveToDb={saveToDb}
            error={fieldErrors.beurteilung}
          />
          <Select
            key={`${apberId}veraenderungZumVorjahr`}
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
            key={`${apberId}apId`}
            name="bearbeiter"
            label="BearbeiterIn"
            options={data?.data?.allAdresses?.nodes ?? []}
            value={row.bearbeiter}
            saveToDb={saveToDb}
            error={fieldErrors.bearbeiter}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
