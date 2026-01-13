import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.jsx'
import { Select } from '../../../shared/Select.jsx'
import { SelectLoadingOptionsTypable } from '../../../shared/SelectLoadingOptionsTypable.jsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.jsx'
import { DateField } from '../../../shared/Date.jsx'
import { StringToCopy } from '../../../shared/StringToCopy.jsx'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { queryAeTaxonomies } from './queryAeTaxonomies.js'
import { MobxContext } from '../../../../mobxContext.js'
import { exists } from '../../../../modules/exists.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { query } from './query.js'
import { Menu } from './Menu.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

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

export const Component = observer(({ showFilter = false }) => {
  const { tpopmassnId, apId } = useParams()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const store = useContext(MobxContext)

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: { id: tpopmassnId },
  })

  const notMassnCountUnit =
    data?.tpopmassnById?.tpopByTpopId?.popByPopId?.apByApId
      ?.ekzaehleinheitsByApId?.nodes?.[0]?.notMassnCountUnit

  const row = data?.tpopmassnById ?? {}

  const isAnpflanzung = row?.tpopmassnTypWerteByTyp?.anpflanzung

  const saveToDb = async (event) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: store.user.name,
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
        return setFieldErrors({ [field]: error.message })
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
        return setFieldErrors({ [field]: error.message })
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
        return setFieldErrors({ [field]: error.message })
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
      return setFieldErrors({ [field]: error.message })
    }
    setFieldErrors({})
    if (['jahr', 'datum', 'typ'].includes(field)) {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeTpopmassn`],
      })
    }
  }

  if (error) return <Error error={error} />

  if (loading) return <Spinner />

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
          key={`${row?.id}bearbeiter`}
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
              key={`${row?.id}zieleinheitEinheit`}
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
})
