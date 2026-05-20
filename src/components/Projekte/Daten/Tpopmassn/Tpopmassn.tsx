import { useState, type ChangeEvent } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.tsx'
import { Select } from '../../../shared/Select.tsx'
import { SelectLoadingOptionsTypable } from '../../../shared/SelectLoadingOptionsTypable.tsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.tsx'
import { DateField } from '../../../shared/Date.tsx'
import { StringToCopy } from '../../../shared/StringToCopy.tsx'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { queryAeTaxonomies } from './queryAeTaxonomies.ts'
import { userNameAtom } from '../../../../store/index.ts'
import { exists } from '../../../../modules/exists.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { query } from './query.ts'
import { Menu } from './Menu.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type { TpopmassnId } from '../../../../models/apflora/TpopmassnId.ts'
import type { TpopId } from '../../../../models/apflora/TpopId.ts'
import type { ApId } from '../../../../models/apflora/ApId.ts'
import type { AdresseId } from '../../../../models/apflora/AdresseId.ts'
import type { TpopmassnTypWerteCode } from '../../../../models/apflora/TpopmassnTypWerteCode.ts'
import type { TpopkontrzaehlEinheitWerteCode } from '../../../../models/apflora/TpopkontrzaehlEinheitWerteCode.ts'

interface TpopmassnQueryResult {
  tpopmassnById: {
    id: TpopmassnId
    label: string
    typ: TpopmassnTypWerteCode | null
    tpopmassnTypWerteByTyp: {
      id: string
      anpflanzung: boolean | null
    } | null
    beschreibung: string | null
    jahr: number | null
    datum: string | null
    bemerkungen: string | null
    planBezeichnung: string | null
    flaeche: number | null
    markierung: string | null
    anzTriebe: number | null
    anzPflanzen: number | null
    anzPflanzstellen: number | null
    zieleinheitEinheit: TpopkontrzaehlEinheitWerteCode | null
    zieleinheitAnzahl: number | null
    wirtspflanze: string | null
    herkunftPop: string | null
    sammeldatum: string | null
    vonAnzahlIndividuen: number | null
    form: string | null
    pflanzanordnung: string | null
    tpopId: TpopId
    bearbeiter: AdresseId | null
    planVorhanden: boolean | null
    changedBy: string | null
    tpopByTpopId: {
      id: TpopId
      popByPopId: {
        id: string
        apByApId: {
          id: ApId
          ekzaehleinheitsByApId: {
            nodes: Array<{
              id: string
              zielrelevant: boolean | null
              notMassnCountUnit: boolean | null
            }>
          }
        }
      }
    }
  } | null
  allAdresses: {
    nodes: Array<{
      id: string
      value: AdresseId
      label: string
    }>
  }
  allTpopmassnTypWertes: {
    nodes: Array<{
      id: string
      value: TpopmassnTypWerteCode
      label: string
      historic: boolean | null
    }>
  }
  allTpopkontrzaehlEinheitWertes: {
    nodes: Array<{
      id: string
      value: TpopkontrzaehlEinheitWerteCode
      label: string
      historic: boolean | null
    }>
  }
}

interface ComponentProps {
  showFilter?: boolean
}

import styles from './Tpopmassn.module.css'

const fieldTypes = {
  typ: 'Int',
  beschreibung: 'String',
  jahr: 'Int',
  datum: 'Date',
  bemerkungen: 'String',
  planBezeichnung: 'String',
  flaeche: 'Float',
  markierung: 'String',
  anzTriebe: 'Int',
  anzPflanzen: 'Int',
  anzPflanzstellen: 'Int',
  zieleinheitEinheit: 'Int',
  zieleinheitAnzahl: 'Int',
  wirtspflanze: 'String',
  herkunftPop: 'String',
  sammeldatum: 'String',
  vonAnzahlIndividuen: 'Int',
  form: 'String',
  pflanzanordnung: 'String',
  tpopId: 'UUID',
  bearbeiter: 'UUID',
  planVorhanden: 'Boolean',
}

export const Component = ({ showFilter = false }: ComponentProps) => {
  const { tpopmassnId, apId } = useParams()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useQuery<TpopmassnQueryResult>({
    queryKey: ['tpopmassn', tpopmassnId],
    queryFn: async () => {
      const result = await apolloClient.query<TpopmassnQueryResult>({
        query,
        variables: { id: tpopmassnId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const notMassnCountUnit =
    data?.tpopmassnById?.tpopByTpopId?.popByPopId?.apByApId
      ?.ekzaehleinheitsByApId?.nodes?.[0]?.notMassnCountUnit

  const row = data?.tpopmassnById ?? {}

  const isAnpflanzung = row?.tpopmassnTypWerteByTyp?.anpflanzung
  const userName = useAtomValue(userNameAtom)

  const saveToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    if (field === 'jahr') {
      variables.datum = null
    }
    if (field === 'datum') {
      variables.jahr = value && value.substring ? +value.substring(0, 4) : value
    }
    if (field === 'typ') {
      // IF typ is anpflanzung
      // have to set zieleinheit_einheit to
      // ekzaehleinheit with zielrelevant = true
      let zieleinheitIdResult
      try {
        zieleinheitIdResult = await apolloClient.query({
          query: gql`
            query tpopmassnZieleinheitQuery1($apId: UUID!, $typ: Int!) {
              allTpopmassnTypWertes(filter: { code: { equalTo: $typ } }) {
                nodes {
                  id
                  anpflanzung
                }
              }
              allEkzaehleinheits(
                filter: {
                  zielrelevant: { equalTo: true }
                  apId: { equalTo: $apId }
                }
              ) {
                nodes {
                  id
                  tpopkontrzaehlEinheitWerteByZaehleinheitId {
                    id
                    code
                    correspondsToMassnAnzTriebe
                    correspondsToMassnAnzPflanzen
                  }
                }
              }
            }
          `,
          variables: { apId, typ: value ?? 1 },
        })
      } catch (error) {
        return setFieldErrors((prev) => ({
          ...prev,
          [field]: (error as Error).message,
        }))
      }
      const isAnpflanzung =
        zieleinheitIdResult?.data?.allTpopmassnTypWertes?.nodes?.[0]
          ?.anpflanzung
      const zieleinheit =
        zieleinheitIdResult?.data?.allEkzaehleinheits?.nodes?.[0]
          ?.tpopkontrzaehlEinheitWerteByZaehleinheitId
      const zieleinheitCode = zieleinheit?.code
      if (isAnpflanzung && zieleinheitCode) {
        variables.zieleinheitEinheit = zieleinheitCode
        if (!notMassnCountUnit && zieleinheit?.correspondsToMassnAnzTriebe) {
          variables.zieleinheitAnzahl = row.anzTriebe
        }
        if (!notMassnCountUnit && zieleinheit?.correspondsToMassnAnzPflanzen) {
          variables.zieleinheitAnzahl = row.anzPflanzen
        }
      }
    }
    if (!notMassnCountUnit && field === 'anzTriebe') {
      // IF zieleinheit corresponds to Anzahl Triebe
      // have to set zieleinheitAnzahl to anzTriebe
      let zieleinheitIdResult
      try {
        zieleinheitIdResult = await apolloClient.query({
          query: gql`
            query tpopmassnZieleinheitQuery2($apId: UUID!, $typ: Int!) {
              allTpopmassnTypWertes(filter: { code: { equalTo: $typ } }) {
                nodes {
                  id
                  anpflanzung
                }
              }
              allEkzaehleinheits(
                filter: {
                  zielrelevant: { equalTo: true }
                  apId: { equalTo: $apId }
                }
              ) {
                nodes {
                  id
                  tpopkontrzaehlEinheitWerteByZaehleinheitId {
                    id
                    correspondsToMassnAnzTriebe
                  }
                }
              }
            }
          `,
          variables: { apId, typ: row.typ ?? 1 },
        })
      } catch (error) {
        return setFieldErrors((prev) => ({
          ...prev,
          [field]: error.message,
        }))
      }
      const isAnpflanzung =
        zieleinheitIdResult?.data?.allTpopmassnTypWertes?.nodes?.[0]
          ?.anpflanzung
      const zieleinheit =
        zieleinheitIdResult?.data?.allEkzaehleinheits?.nodes?.[0]
          ?.tpopkontrzaehlEinheitWerteByZaehleinheitId
      if (isAnpflanzung && zieleinheit?.correspondsToMassnAnzTriebe) {
        variables.zieleinheitAnzahl = exists(value) ? value : null
      }
    }
    if (!notMassnCountUnit && field === 'anzPflanzen') {
      // IF zieleinheit corresponds to Anzahl Triebe
      // have to set zieleinheitAnzahl to anzPflanzen
      let zieleinheitIdResult
      try {
        zieleinheitIdResult = await apolloClient.query({
          query: gql`
            query tpopmassnZieleinheitQuery3($apId: UUID!, $typ: Int!) {
              allTpopmassnTypWertes(filter: { code: { equalTo: $typ } }) {
                nodes {
                  id
                  anpflanzung
                }
              }
              allEkzaehleinheits(
                filter: {
                  zielrelevant: { equalTo: true }
                  apId: { equalTo: $apId }
                }
              ) {
                nodes {
                  id
                  tpopkontrzaehlEinheitWerteByZaehleinheitId {
                    id
                    correspondsToMassnAnzPflanzen
                  }
                }
              }
            }
          `,
          variables: { apId, typ: row.typ ?? 1 },
        })
      } catch (error) {
        return setFieldErrors((prev) => ({
          ...prev,
          [field]: error.message,
        }))
      }
      const isAnpflanzung =
        zieleinheitIdResult?.data?.allTpopmassnTypWertes?.nodes?.[0]
          ?.anpflanzung
      const zieleinheit =
        zieleinheitIdResult?.data?.allEkzaehleinheits?.nodes?.[0]
          ?.tpopkontrzaehlEinheitWerteByZaehleinheitId
      if (isAnpflanzung && zieleinheit?.correspondsToMassnAnzPflanzen) {
        variables.zieleinheitAnzahl = exists(value) ? value : null
      }
    }
    try {
      await apolloClient.mutate({
        mutation: gql`
            mutation updateTpopmassn(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              ${field === 'jahr' ? '$datum: Date' : ''}
              ${field === 'datum' ? '$jahr: Int' : ''}
              ${field === 'typ' ? '$zieleinheitEinheit: Int' : ''}
              ${
                ['typ', 'anzTriebe', 'anzPflanzen'].includes(field) ?
                  '$zieleinheitAnzahl: Int'
                : ''
              }
              $changedBy: String
            ) {
              updateTpopmassnById(
                input: {
                  id: $id
                  tpopmassnPatch: {
                    ${field}: $${field}
                    ${field === 'jahr' ? 'datum: $datum' : ''}
                    ${field === 'datum' ? 'jahr: $jahr' : ''}
                    ${
                      field === 'typ' ?
                        'zieleinheitEinheit: $zieleinheitEinheit'
                      : ''
                    }
                    ${
                      ['typ', 'anzTriebe', 'anzPflanzen'].includes(field) ?
                        'zieleinheitAnzahl: $zieleinheitAnzahl'
                      : ''
                    }
                    changedBy: $changedBy
                  }
                }
              ) {
                tpopmassn {
                  id
                  label
                  typ
                  tpopmassnTypWerteByTyp {
                    id
                    anpflanzung
                  }
                  beschreibung
                  jahr
                  datum
                  bemerkungen
                  planBezeichnung
                  flaeche
                  markierung
                  anzTriebe
                  anzPflanzen
                  anzPflanzstellen
                  zieleinheitEinheit
                  zieleinheitAnzahl
                  wirtspflanze
                  herkunftPop
                  sammeldatum
                  vonAnzahlIndividuen
                  form
                  pflanzanordnung
                  tpopId
                  bearbeiter
                  planVorhanden
                  changedBy
                }
              }
            }
          `,
        variables,
      })
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // invalidate tpopmassn query
    tsQueryClient.invalidateQueries({ queryKey: ['tpopmassn', tpopmassnId] })
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    if (
      [
        'jahr',
        'datum',
        'typ',
        'anzTriebe',
        'anzPflanzen',
        'anzPflanzstellen',
      ].includes(field)
    ) {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeTpopmassn`],
      })
    }
  }

  return (
    <ErrorBoundary>
      <FormTitle
        title="Massnahme"
        MenuBarComponent={Menu}
        menuBarProps={{ row }}
      />
      <div className={styles.container}>
        <TextField
          name="jahr"
          label="Jahr"
          type="number"
          value={row.jahr}
          saveToDb={saveToDb}
          error={fieldErrors.jahr}
        />
        <DateField
          name="datum"
          label="Datum"
          value={row.datum}
          saveToDb={saveToDb}
          error={fieldErrors.datum}
        />
        <RadioButtonGroup
          name="typ"
          label="Typ"
          dataSource={data?.allTpopmassnTypWertes?.nodes ?? []}
          loading={false}
          value={row.typ}
          saveToDb={saveToDb}
          error={fieldErrors.typ}
        />
        <TextField
          name="beschreibung"
          label="Massnahme"
          type="text"
          value={row.beschreibung}
          saveToDb={saveToDb}
          error={fieldErrors.beschreibung}
        />
        <Select
          key={`${tpopmassnId}bearbeiter`}
          name="bearbeiter"
          label="BearbeiterIn"
          value={row.bearbeiter}
          options={data?.allAdresses?.nodes ?? []}
          loading={false}
          saveToDb={saveToDb}
          error={fieldErrors.bearbeiter}
        />
        <MarkdownField
          name="bemerkungen"
          label="Bemerkungen"
          value={row.bemerkungen}
          saveToDb={saveToDb}
          error={fieldErrors.bemerkungen}
        />
        <Checkbox2States
          name="planVorhanden"
          label="Plan vorhanden"
          value={row.planVorhanden}
          saveToDb={saveToDb}
          error={fieldErrors.planVorhanden}
        />
        <TextField
          name="planBezeichnung"
          label="Plan Bezeichnung"
          type="text"
          value={row.planBezeichnung}
          saveToDb={saveToDb}
          error={fieldErrors.planBezeichnung}
        />
        <TextField
          name="flaeche"
          label="Fläche (m2)"
          type="number"
          value={row.flaeche}
          saveToDb={saveToDb}
          error={fieldErrors.flaeche}
        />
        <TextField
          name="form"
          label="Form der Ansiedlung"
          type="text"
          value={row.form}
          saveToDb={saveToDb}
          error={fieldErrors.form}
        />
        <TextField
          name="pflanzanordnung"
          label="Pflanzanordnung"
          type="text"
          value={row.pflanzanordnung}
          saveToDb={saveToDb}
          error={fieldErrors.pflanzanordnung}
        />
        <TextField
          name="markierung"
          label="Markierung"
          type="text"
          value={row.markierung}
          saveToDb={saveToDb}
          error={fieldErrors.markierung}
        />
        <TextField
          name="anzTriebe"
          label="Anzahl Triebe"
          type="number"
          value={row.anzTriebe}
          saveToDb={saveToDb}
          error={fieldErrors.anzTriebe}
        />
        <TextField
          name="anzPflanzen"
          label="Anzahl Pflanzen"
          type="number"
          value={row.anzPflanzen}
          saveToDb={saveToDb}
          error={fieldErrors.anzPflanzen}
        />
        <TextField
          name="anzPflanzstellen"
          label="Anzahl Pflanzstellen"
          type="number"
          value={row.anzPflanzstellen}
          saveToDb={saveToDb}
          error={fieldErrors.anzPflanzstellen}
        />
        {isAnpflanzung && (
          <>
            <Select
              key={`${tpopmassnId}zieleinheitEinheit`}
              name="zieleinheitEinheit"
              label="Ziel-Einheit: Einheit (wird automatisch gesetzt)"
              value={row.zieleinheitEinheit}
              options={data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []}
              loading={false}
              saveToDb={saveToDb}
              error={fieldErrors.zieleinheitEinheit}
            />
            <TextField
              name="zieleinheitAnzahl"
              label={
                notMassnCountUnit === true ?
                  'Ziel-Einheit: Anzahl'
                : 'Ziel-Einheit: Anzahl (wird automatisch gesetzt)'
              }
              type="number"
              value={row.zieleinheitAnzahl}
              saveToDb={saveToDb}
              error={fieldErrors.zieleinheitAnzahl}
            />
          </>
        )}
        <SelectLoadingOptionsTypable
          key={`${tpopmassnId}${!!row.wirtspflanze}`}
          label="Wirtspflanze"
          row={row}
          query={queryAeTaxonomies}
          queryNodesName="allAeTaxonomies"
          saveToDb={saveToDb}
          error={fieldErrors.wirtspflanze}
        />
        <TextField
          name="herkunftPop"
          label="Herkunftspopulation"
          type="text"
          value={row.herkunftPop}
          saveToDb={saveToDb}
          error={fieldErrors.herkunftPop}
        />
        <TextField
          name="sammeldatum"
          label="Sammeldatum"
          type="text"
          value={row.sammeldatum}
          saveToDb={saveToDb}
          error={fieldErrors.sammeldatum}
        />
        <TextField
          name="vonAnzahlIndividuen"
          label="Anzahl besammelte Individuen der Herkunftspopulation"
          type="number"
          value={row.vonAnzahlIndividuen}
          saveToDb={saveToDb}
          error={fieldErrors.vonAnzahlIndividuen}
        />
        {!showFilter && (
          <StringToCopy
            text={row.id}
            label="id"
          />
        )}
      </div>
    </ErrorBoundary>
  )
}
