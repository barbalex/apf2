import { useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.tsx'
import { Select } from '../../../shared/Select.tsx'
import { JesNo } from '../../../shared/JesNo.tsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.tsx'
import { RadioButtonGroupWithInfo } from '../../../shared/RadioButtonGroupWithInfo.tsx'
import { DateField } from '../../../shared/Date.tsx'
import { StringToCopy } from '../../../shared/StringToCopy.tsx'
import { TpopfeldkontrentwicklungPopover } from '../../../shared/TpopfeldkontrentwicklungPopover.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { tpopfeldkontr } from '../../../shared/fragments.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import type {
  TpopkontrId,
  TpopId,
  AdresseId,
  TpopEntwicklungWerteCode,
  TpopkontrIdbiotuebereinstWerteCode,
} from '../../../../generated/apflora/models.ts'

import styles from './Form.module.css'

interface TpopfeldkontrRow {
  id: TpopkontrId
  tpopId: TpopId
  typ?: string | null
  datum?: string | null
  jahr?: number | null
  vitalitaet?: string | null
  ueberlebensrate?: number | null
  entwicklung?: TpopEntwicklungWerteCode | null
  ursachen?: string | null
  erfolgsbeurteilung?: string | null
  umsetzungAendern?: string | null
  kontrolleAendern?: string | null
  bemerkungen?: string | null
  bearbeiter?: AdresseId | null
  jungpflanzenVorhanden?: boolean | null
  gefaehrdung?: string | null
  apberNichtRelevant?: boolean | null
  apberNichtRelevantGrund?: string | null
}

interface TpopfeldkontrFormData {
  allTpopEntwicklungWertes?: {
    nodes: {
      value: TpopEntwicklungWerteCode
      label?: string | null
    }[]
  } | null
  allAdresses?: {
    nodes: {
      value: AdresseId
      label?: string | null
    }[]
  } | null
}

interface TpopfeldkontrFormProps {
  row: TpopfeldkontrRow
  data: TpopfeldkontrFormData
}

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

export const TpopfeldkontrForm = ({ row, data }: TpopfeldkontrFormProps) => {
  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const saveToDb = async (event) => {
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
      // value can be null so check if substring method exists
      const newJahr = value && value.substring ? +value.substring(0, 4) : value
      variables.jahr = newJahr
    }
    try {
      await apolloClient.mutate({
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
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // invalidate tpopfeldkontr query
    tsQueryClient.invalidateQueries({ queryKey: ['tpopfeldkontr', row.id] })
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    if (['jahr', 'datum', 'typ'].includes(field)) {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeTpopfeldkontr`],
      })
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.formContainer}>
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
          key={`${row?.id}bearbeiter`}
          name="bearbeiter"
          label="BearbeiterIn"
          options={data.allAdresses?.nodes ?? []}
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
          dataSource={data.allTpopEntwicklungWertes?.nodes ?? []}
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
      </div>
    </ErrorBoundary>
  )
}
