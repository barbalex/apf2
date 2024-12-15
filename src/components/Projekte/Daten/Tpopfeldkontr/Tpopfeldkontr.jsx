import { memo, useState, useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useParams, useOutletContext } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.jsx'
import { Select } from '../../../shared/Select.jsx'
import { JesNo } from '../../../shared/JesNo.jsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.jsx'
import { RadioButtonGroupWithInfo } from '../../../shared/RadioButtonGroupWithInfo.jsx'
import { DateField } from '../../../shared/Date.jsx'
import { StringToCopy } from '../../../shared/StringToCopy.jsx'
import { TpopfeldkontrentwicklungPopover } from '../TpopfeldkontrentwicklungPopover.jsx'
import { constants } from '../../../../modules/constants.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { tpopfeldkontr } from '../../../shared/fragments.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { Menu } from './Menu.jsx'
import { query } from './query.js'

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 10px;
  height: 100%;
  column-width: ${constants.columnWidth}px;
`
export const Section = styled.div`
  padding-top: 20px;
  padding-bottom: 5px;
  font-weight: bold;
  break-after: avoid;
  &:after {
    content: ':';
  }
`

export const fieldTypes = {
  typ: 'String',
  datum: 'Date',
  jahr: 'Int',
  vitalitaet: 'String',
  ueberlebensrate: 'Int',
  entwicklung: 'Int',
  ursachen: 'String',
  erfolgsbeurteilung: 'String',
  umsetzungAendern: 'String',
  kontrolleAendern: 'String',
  bemerkungen: 'String',
  lrDelarze: 'String',
  flaeche: 'Int',
  lrUmgebungDelarze: 'String',
  vegetationstyp: 'String',
  konkurrenz: 'String',
  moosschicht: 'String',
  krautschicht: 'String',
  strauchschicht: 'String',
  baumschicht: 'String',
  bodenTyp: 'String',
  bodenKalkgehalt: 'String',
  bodenDurchlaessigkeit: 'String',
  bodenHumus: 'String',
  bodenNaehrstoffgehalt: 'String',
  bodenAbtrag: 'String',
  idealbiotopUebereinstimmung: 'Int',
  handlungsbedarf: 'String',
  flaecheUeberprueft: 'Int',
  deckungVegetation: 'Int',
  deckungNackterBoden: 'Int',
  deckungApArt: 'Int',
  vegetationshoeheMaximum: 'Int',
  vegetationshoeheMittel: 'Int',
  gefaehrdung: 'String',
  tpopId: 'UUID',
  bearbeiter: 'UUID',
  planVorhanden: 'Boolean',
  jungpflanzenVorhanden: 'Boolean',
  apberNichtRelevant: 'Boolean',
  apberNichtRelevantGrund: 'String',
}

const tpopkontrTypWerte = [
  {
    value: 'Ausgangszustand',
    label: 'Ausgangszustand',
  },
  {
    value: 'Zwischenbeurteilung',
    label: 'Zwischenbeurteilung',
  },
]

export const Component = memo(
  observer(() => {
    const { tpopkontrId } = useParams()

    const { data, loading, error } = useQuery(query, {
      variables: { id: tpopkontrId },
    })

    const row = data?.tpopkontrById ?? {}

    const client = useApolloClient()
    const queryClient = useQueryClient()
    const store = useContext(MobxContext)

    const [fieldErrors, setFieldErrors] = useState({})

    const saveToDb = useCallback(
      async (event) => {
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
          // value can be null so check if substring method exists
          const newJahr =
            value && value.substring ? +value.substring(0, 4) : value
          variables.jahr = newJahr
        }
        try {
          await client.mutate({
            mutation: gql`
              mutation updateTpopkontrForEk(
                $id: UUID!
                $${field}: ${fieldTypes[field]}
                ${field === 'jahr' ? '$datum: Date' : ''}
                ${field === 'datum' ? '$jahr: Int' : ''}
                $changedBy: String
              ) {
                updateTpopkontrById(
                  input: {
                    id: $id
                    tpopkontrPatch: {
                      ${field}: $${field}
                      ${field === 'jahr' ? 'datum: $datum' : ''}
                      ${field === 'datum' ? 'jahr: $jahr' : ''}
                      changedBy: $changedBy
                    }
                  }
                ) {
                  tpopkontr {
                    ...TpopfeldkontrFields
                  }
                }
              }
              ${tpopfeldkontr}
            `,
            variables,
          })
        } catch (error) {
          return setFieldErrors({ [field]: error.message })
        }
        setFieldErrors({})
        if (['jahr', 'datum', 'typ'].includes(field)) {
          queryClient.invalidateQueries({
            queryKey: [`treeTpopfeldkontr`],
          })
        }
      },
      [client, queryClient, row.id, store.user.name],
    )

    if (error) return <Error error={error} />

    if (loading) return <Spinner />

    return (
      <ErrorBoundary>
        <FormTitle
          title="Feld-Kontrolle"
          menuBar={loading ? null : <Menu row={row} />}
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
          <DateField
            name="datum"
            label="Datum"
            value={row.datum}
            saveToDb={saveToDb}
            error={fieldErrors.datum}
          />
          <RadioButtonGroup
            name="typ"
            label="Kontrolltyp"
            dataSource={tpopkontrTypWerte}
            value={row.typ}
            saveToDb={saveToDb}
            error={fieldErrors.typ}
          />
          <Select
            name="bearbeiter"
            label="BearbeiterIn"
            options={data?.allAdresses?.nodes ?? []}
            loading={false}
            value={row.bearbeiter}
            saveToDb={saveToDb}
            error={fieldErrors.bearbeiter}
          />
          <JesNo
            name="jungpflanzenVorhanden"
            label="Jungpflanzen vorhanden"
            value={row.jungpflanzenVorhanden}
            saveToDb={saveToDb}
            error={fieldErrors.jungpflanzenVorhanden}
          />
          <TextField
            name="vitalitaet"
            label="Vitalität"
            type="text"
            value={row.vitalitaet}
            saveToDb={saveToDb}
            error={fieldErrors.vitalitaet}
          />
          <TextField
            name="ueberlebensrate"
            label="Überlebensrate (in Prozent)"
            type="number"
            value={row.ueberlebensrate}
            saveToDb={saveToDb}
            error={fieldErrors.ueberlebensrate}
          />
          <RadioButtonGroupWithInfo
            name="entwicklung"
            label="Entwicklung"
            dataSource={data?.allTpopEntwicklungWertes?.nodes ?? []}
            loading={false}
            popover={TpopfeldkontrentwicklungPopover}
            value={row.entwicklung}
            saveToDb={saveToDb}
            error={fieldErrors.entwicklung}
          />
          <TextField
            name="ursachen"
            label="Ursachen"
            hintText="Standort: ..., Klima: ..., anderes: ..."
            type="text"
            multiLine
            value={row.ursachen}
            saveToDb={saveToDb}
            error={fieldErrors.ursachen}
          />
          <TextField
            name="gefaehrdung"
            label="Gefährdung"
            type="text"
            multiLine
            value={row.gefaehrdung}
            saveToDb={saveToDb}
            error={fieldErrors.gefaehrdung}
          />
          <TextField
            name="erfolgsbeurteilung"
            label="Erfolgsbeurteilung"
            type="text"
            multiLine
            value={row.erfolgsbeurteilung}
            saveToDb={saveToDb}
            error={fieldErrors.erfolgsbeurteilung}
          />
          <TextField
            name="umsetzungAendern"
            label="Änderungs-Vorschläge Umsetzung"
            type="text"
            multiLine
            value={row.umsetzungAendern}
            saveToDb={saveToDb}
            error={fieldErrors.umsetzungAendern}
          />
          <TextField
            name="kontrolleAendern"
            label="Änderungs-Vorschläge Kontrolle"
            type="text"
            multiLine
            value={row.kontrolleAendern}
            saveToDb={saveToDb}
            error={fieldErrors.kontrolleAendern}
          />
          <MarkdownField
            name="bemerkungen"
            label="Bemerkungen"
            value={row.bemerkungen}
            saveToDb={saveToDb}
            error={fieldErrors.bemerkungen}
          />
          <Checkbox2States
            name="apberNichtRelevant"
            label="Im Jahresbericht nicht berücksichtigen"
            value={row.apberNichtRelevant}
            saveToDb={saveToDb}
            error={fieldErrors.apberNichtRelevant}
          />
          <TextField
            name="apberNichtRelevantGrund"
            label="Wieso im Jahresbericht nicht berücksichtigen?"
            type="text"
            multiLine
            value={row.apberNichtRelevantGrund}
            saveToDb={saveToDb}
            error={fieldErrors.apberNichtRelevantGrund}
          />
          <StringToCopy
            text={row.id}
            label="id"
          />
        </FormContainer>
      </ErrorBoundary>
    )
  }),
)
