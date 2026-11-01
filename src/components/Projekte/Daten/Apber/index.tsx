import { apiFetch } from '../../../../modules/api.ts'
import { apberSelect } from '../../../../modules/selects.ts'
import type { SaveToDbEvent } from '../../../shared/types.ts'
import { useState } from 'react'
import {
  useQuery,
  type UseQueryOptions,
  useQueryClient,
} from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../shared/TextField.tsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.tsx'
import { Select } from '../../../shared/Select.tsx'
import { DateField } from '../../../shared/Date.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { veraenderungZumVorjahr } from '../../../../modules/veraenderungZumVorjahr.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Menu } from './Menu.tsx'

import type { ApberId } from '../../../../models/apflora/Apber.ts'
import type { ApId } from '../../../../models/apflora/Ap.ts'
import type { AdresseId } from '../../../../models/apflora/Adresse.ts'

import styles from './index.module.css'
import { apiUpdateByVariables } from '../../../../modules/api.ts'

interface ApberQueryResult {
  apberById: {
    id: ApberId
    label: string | null
    jahr: number | null
    situation: string | null
    vergleichVorjahrGesamtziel: string | null
    beurteilung: number | null
    apberAnalyse: string | null
    konsequenzenUmsetzung: string | null
    konsequenzenErfolgskontrolle: string | null
    biotopeNeue: string | null
    biotopeOptimieren: string | null
    massnahmenOptimieren: string | null
    wirkungAufArt: string | null
    datum: string | null
    massnahmenApBearb: string | null
    massnahmenPlanungVsAusfuehrung: string | null
    apId: ApId | null
    bearbeiter: AdresseId | null
    changedBy: string | null
    apByApId: {
      apbersByApId: {
        nodes: {
          jahr: number | null
          beurteilung: number | null
        }[]
      } | null
    } | null
  }
  allAdresses: {
    nodes: {
      value: AdresseId
      label: string | null
    }[]
  }
  allApErfkritWertes: {
    nodes: {
      value: number
      label: string | null
      sort: number | null
    }[]
  }
}

// react-query v5 omitted suspense from the public useQuery options
// although it is still honored at runtime
type ApberUseQueryOptions = UseQueryOptions<
  {
    apberById: NonNullable<ApberQueryResult['apberById']> | null
    allAdresses: {
      nodes: NonNullable<ApberQueryResult['allAdresses']>['nodes']
    }
    allApErfkritWertes: {
      nodes: NonNullable<ApberQueryResult['allApErfkritWertes']>['nodes']
    }
  },
  Error
> & {
  suspense: boolean
}

export const apberQueryOptions = (id: string | undefined) => ({
  queryKey: ['apber', id],
  queryFn: async () => {
    const [rows, adressesOpts, aperfkritwertesOpts] = await Promise.all([
      apiFetch<NonNullable<ApberQueryResult['apberById']>[]>(
        `/v_apber?id=eq.${id}&select=${apberSelect},apByApId:ap_by_ap_id`,
      ),
      apiFetch<NonNullable<ApberQueryResult['allAdresses']>['nodes']>(
        `/adresse?order=name.asc&select=value:id,label:name`,
      ),
      apiFetch<NonNullable<ApberQueryResult['allApErfkritWertes']>['nodes']>(
        `/ap_erfkrit_werte?order=sort.asc&select=value:code,label:text,sort`,
      ),
    ])
    return {
      apberById: rows?.[0] ?? null,
      allAdresses: { nodes: adressesOpts ?? [] },
      allApErfkritWertes: { nodes: aperfkritwertesOpts ?? [] },
    }
  },
})

export const Component = () => {
  const { apberId } = useParams<{ apberId: string }>()

  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const queryOptions: ApberUseQueryOptions = {
    ...apberQueryOptions(apberId),
    suspense: true,
  }

  const { data, refetch } = useQuery(queryOptions)

  const row = data?.apberById

  const sortsByCode = new Map(
    (data?.allApErfkritWertes?.nodes ?? []).map((w) => [w.value, w.sort]),
  )
  const jahr = row?.jahr
  const beurteilungVorjahr =
    jahr == null ? null : (
      ((row?.apByApId?.apbersByApId?.nodes ?? []).find(
        (apber) => apber.jahr === jahr - 1,
      )?.beurteilung ?? null)
    )
  const veraenderung = veraenderungZumVorjahr({
    beurteilung: row?.beurteilung,
    beurteilungVorjahr,
    sortsByCode,
  })

  const saveToDb = async (event: SaveToDbEvent) => {
    const field = event.target.name ?? ''
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row?.id,
      [field]: value,
      changedBy: userName,
    }
    try {
      await apiUpdateByVariables('apber', variables)
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
    void refetch()
    if (field === 'jahr') {
      void tsQueryClient.invalidateQueries({ queryKey: [`treeApber`] })
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
            value={row?.jahr}
            saveToDb={saveToDb}
            error={fieldErrors.jahr}
          />
          <fieldset className={styles.koordinationsstelleGroup}>
            <legend className={styles.koordinationsstelleLegend}>
              Wird durch die Koordinationsstelle nachgeführt
            </legend>
            <MarkdownField
              name="vergleichVorjahrGesamtziel"
              label="Vergleich Vorjahr - Gesamtziel"
              value={row?.vergleichVorjahrGesamtziel}
              saveToDb={saveToDb}
              error={fieldErrors.vergleichVorjahrGesamtziel}
            />
            <Select
              key={`${apberId}beurteilung`}
              name="beurteilung"
              label="Beurteilung"
              options={data?.allApErfkritWertes?.nodes ?? []}
              value={row?.beurteilung ?? null}
              saveToDb={(event) => void saveToDb(event)}
              error={fieldErrors.beurteilung ?? ''}
            />
            <TextField
              name="veraenderungZumVorjahr"
              label="Veränderung zum Vorjahr"
              value={veraenderung ?? ''}
              disabled
              saveToDb={() => {
                // computed value, cannot be saved
              }}
              helperText="Berechnet aus den Beurteilungen dieses und des Vorjahres"
            />
          </fieldset>
          <MarkdownField
            name="apberAnalyse"
            label="Analyse"
            value={row?.apberAnalyse}
            saveToDb={saveToDb}
            error={fieldErrors.apberAnalyse}
          />
          <MarkdownField
            name="konsequenzenUmsetzung"
            label="Konsequenzen für die Umsetzung"
            value={row?.konsequenzenUmsetzung}
            saveToDb={saveToDb}
            error={fieldErrors.konsequenzenUmsetzung}
          />
          <MarkdownField
            name="konsequenzenErfolgskontrolle"
            label="Konsequenzen für die Erfolgskontrolle"
            value={row?.konsequenzenErfolgskontrolle}
            saveToDb={saveToDb}
            error={fieldErrors.konsequenzenErfolgskontrolle}
          />
          <MarkdownField
            name="biotopeNeue"
            label="A. Grundmengen: Bemerkungen/Folgerungen für nächstes Jahr: neue Biotope"
            value={row?.biotopeNeue}
            saveToDb={saveToDb}
            error={fieldErrors.biotopeNeue}
          />
          <MarkdownField
            name="biotopeOptimieren"
            label="B. Bestandesentwicklung: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Biotope"
            value={row?.biotopeOptimieren}
            saveToDb={saveToDb}
            error={fieldErrors.biotopeOptimieren}
          />
          <MarkdownField
            name="massnahmenApBearb"
            label="C. Zwischenbilanz zur Wirkung von Massnahmen: Weitere Aktivitäten der Art-Verantwortlichen"
            value={row?.massnahmenApBearb}
            saveToDb={saveToDb}
            error={fieldErrors.massnahmenApBearb}
          />
          <MarkdownField
            name="massnahmenPlanungVsAusfuehrung"
            label="C. Zwischenbilanz zur Wirkung von Massnahmen: Vergleich Ausführung/Planung"
            value={row?.massnahmenPlanungVsAusfuehrung}
            saveToDb={saveToDb}
            error={fieldErrors.massnahmenPlanungVsAusfuehrung}
          />
          <MarkdownField
            name="massnahmenOptimieren"
            label="C. Zwischenbilanz zur Wirkung von Massnahmen: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Massnahmen"
            value={row?.massnahmenOptimieren}
            saveToDb={saveToDb}
            error={fieldErrors.massnahmenOptimieren}
          />
          <MarkdownField
            name="wirkungAufArt"
            label="D. Einschätzung der Wirkung des AP insgesamt auf die Art: Bemerkungen"
            value={row?.wirkungAufArt}
            saveToDb={saveToDb}
            error={fieldErrors.wirkungAufArt}
          />
          <DateField
            name="datum"
            label="Datum"
            value={row?.datum}
            saveToDb={saveToDb}
            error={fieldErrors.datum}
          />
          <Select
            key={`${apberId}apId`}
            name="bearbeiter"
            label="BearbeiterIn"
            options={data?.allAdresses?.nodes ?? []}
            value={row?.bearbeiter ?? null}
            saveToDb={(event) => void saveToDb(event)}
            error={fieldErrors.bearbeiter ?? ''}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
