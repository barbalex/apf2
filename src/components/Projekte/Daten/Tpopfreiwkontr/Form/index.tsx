import { useState } from 'react'
import { sortBy } from 'es-toolkit'
import { gql as dynamicGql } from '../../../../../apolloGql.ts'
import { useApolloClient } from '@apollo/client/react'
import { jwtDecode } from 'jwt-decode'
import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import type { ApId } from '../../../../../models/apflora/Ap.ts'
import type { TpopkontrId } from '../../../../../models/apflora/Tpopkontr.ts'
import type { TpopkontrzaehlId } from '../../../../../models/apflora/Tpopkontrzaehl.ts'
import type { AdresseId } from '../../../../../models/apflora/Adresse.ts'

import { StringToCopyOnlyButton } from '../../../../shared/StringToCopyOnlyButton.tsx'
import { Title } from './Title.tsx'
import { Headdata } from './Headdata/index.tsx'
import { Besttime } from './Besttime.tsx'
import { DateField } from './Date.tsx'
import { Map } from './Map.tsx'
import { Cover } from './Cover.tsx'
import { More } from './More.tsx'
import { Danger } from './Danger.tsx'
import { Remarks } from './Remarks.tsx'
import { EkfRemarks } from './EkfRemarks.tsx'
import { Count } from './Count/index.tsx'
import { Verification } from './Verification.tsx'
import { Image } from './Image.tsx'
import { ifIsNumericAsNumber } from '../../../../../modules/ifIsNumericAsNumber.ts'
import {
  userNameAtom,
  isPrintAtom,
  userTokenAtom,
} from '../../../../../store/index.ts'
import {
  adresse as adresseFragment,
  pop as popFragment,
  tpop as tpopFragment,
  tpopfreiwkontr as tpopfreiwkontrFragment,
  tpopkontrzaehlEinheitWerte as tpopkontrzaehlEinheitWerteFragment,
} from '../../../../shared/fragments.ts'

/** node of tpopkontrzaehl_einheit_werte, as used in the count selects */
export interface ZaehleinheitWerteNode {
  id?: string
  code: number
  text: string
}

/** ekzaehleinheit, joined with its tpopkontrzaehlEinheitWerte */
export interface EkzaehleinheitNode {
  tpopkontrzaehlEinheitWerteByZaehleinheitId: ZaehleinheitWerteNode | null
  sort: number | null
}

/** node of tpopkontrzaehl (a count) */
export interface TpopkontrzaehlNode {
  id: TpopkontrzaehlId
  anzahl: number | null
  einheit: number | null
}

export interface TpopfreiwkontrApRow {
  id?: ApId
  ekfBeobachtungszeitpunkt?: string | null
  aeTaxonomyByArtId?: {
    artname: string | null
  } | null
  ekzaehleinheitsByApId?: {
    nodes: EkzaehleinheitNode[]
  } | null
}

export interface TpopfreiwkontrPopRow {
  nr: number | null
  name: string | null
  apId: ApId
  apByApId: TpopfreiwkontrApRow | null
}

export interface TpopfreiwkontrTpopRow {
  nr: number | null
  flurname: string | null
  lv95X: number | null
  lv95Y: number | null
  status: number | null
  popByPopId: TpopfreiwkontrPopRow | null
}

/** the tpopkontr row, built from the TpopfreiwkontrFields fragment */
export interface TpopkontrRow {
  id: TpopkontrId
  datum: string | null
  jahr: number | null
  bemerkungen: string | null
  ekfBemerkungen: string | null
  flaecheUeberprueft: number | null
  deckungVegetation: number | null
  deckungNackterBoden: number | null
  deckungApArt: number | null
  vegetationshoeheMaximum: number | null
  vegetationshoeheMittel: number | null
  gefaehrdung: string | null
  bearbeiter: AdresseId | null
  planVorhanden: boolean | null
  jungpflanzenVorhanden: boolean | null
  apberNichtRelevant: boolean | null
  apberNichtRelevantGrund: string | null
  tpopByTpopId: TpopfreiwkontrTpopRow | null
  tpopkontrzaehlsByTpopkontrId?: {
    nodes: TpopkontrzaehlNode[]
  } | null
  adresseByBearbeiter?: {
    usersByAdresseId: {
      totalCount: number
    }
  } | null
}

export interface TpopkontrQueryResult {
  tpopkontrById: TpopkontrRow | null
}

/** fake events are built for radio buttons and selects */
export interface TpopkontrSaveToDbEvent {
  target: {
    name: string
    value: string | number | boolean | null
  }
}

export type TpopkontrSaveToDb = (
  event: TpopkontrSaveToDbEvent,
) => void | Promise<void>

interface FormProps {
  data: TpopkontrQueryResult | undefined
  refetch: () => void
  row: Partial<TpopkontrRow>
  apId: string
}

import styles from './index.module.css'

const fieldTypes: Record<string, string> = {
  typ: 'String',
  datum: 'Date',
  jahr: 'Int',
  bemerkungen: 'String',
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
  ekfBemerkungen: 'String',
}

export const Form = ({ data, refetch, row, apId }: FormProps) => {
  const isPrint = useAtomValue(isPrintAtom)
  const userName = useAtomValue(userNameAtom)
  const token = useAtomValue(userTokenAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [errors, setErrors] = useState<Record<string, string>>({})
  // reset errors when the row changes
  const [errorsRowId, setErrorsRowId] = useState(row.id)
  if (errorsRowId !== row.id) {
    setErrorsRowId(row.id)
    setErrors({})
  }

  const role = token ? jwtDecode<{ role?: string }>(token)?.role : null

  const ekzaehleinheitsOriginal =
    data?.tpopkontrById?.tpopByTpopId?.popByPopId?.apByApId
      ?.ekzaehleinheitsByApId?.nodes ?? []
  const ekzaehleinheits = ekzaehleinheitsOriginal
    .map(
      (n) =>
        n?.tpopkontrzaehlEinheitWerteByZaehleinheitId ??
        // empty object for ekzaehleinheit without zaehleinheit_id
        ({} as ZaehleinheitWerteNode),
    )
    // remove null values stemming from efkzaehleinheit without zaehleinheit_id
    .filter((n) => n !== null)
  const zaehls = data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
  const zaehlsSorted = sortBy(zaehls, [
    (z) => {
      const ekzaehleinheitOriginal = ekzaehleinheitsOriginal.find(
        (e) =>
          e.tpopkontrzaehlEinheitWerteByZaehleinheitId?.code === z.einheit,
      )
      if (!ekzaehleinheitOriginal) return 999
      return ekzaehleinheitOriginal.sort || 999
    },
  ])
  const zaehls1 = zaehlsSorted[0]
  const zaehls2 = zaehlsSorted[1]
  const zaehls3 = zaehlsSorted[2]
  const zaehl1WasAttributed =
    zaehls1 && (zaehls1.anzahl || zaehls1.anzahl === 0 || zaehls1.einheit)
  const zaehl2ShowNew =
    zaehl1WasAttributed && !zaehls2 && ekzaehleinheits.length > 1
  const zaehl1ShowEmpty =
    ekzaehleinheits.length === 0 && zaehlsSorted.length === 0
  const zaehl2ShowEmpty =
    (!zaehl1WasAttributed && !zaehls2) || ekzaehleinheits.length < 2
  const zaehl2WasAttributed =
    zaehl1WasAttributed &&
    zaehls2 &&
    (zaehls2.anzahl || zaehls2.anzahl === 0 || zaehls2.einheit)
  const zaehl3ShowNew =
    zaehl2WasAttributed && !zaehls3 && ekzaehleinheits.length > 2
  const zaehl3ShowEmpty =
    (!zaehl2WasAttributed && !zaehls3) || ekzaehleinheits.length < 3
  const einheitsUsed = zaehlsSorted
    .filter((n) => !!n.einheit)
    .map((n) => n.einheit)
  const isFreiwillig = role === 'apflora_freiwillig'

  const artname =
    row?.tpopByTpopId?.popByPopId?.apByApId?.aeTaxonomyByArtId?.artname ?? ''
  const pop = row?.tpopByTpopId?.popByPopId ?? {}
  const tpop = row?.tpopByTpopId ?? {}
  const { ekfBemerkungen } = row

  const saveToDb = async (event: TpopkontrSaveToDbEvent) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)
    /**
     * enable passing two values
     * with same update
     */
    const variables: Record<
      string,
      string | number | boolean | null | undefined
    > = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    let field2: string | undefined
    if (field === 'datum') field2 = 'jahr'
    let value2: string | number | boolean | null | undefined
    if (field === 'datum') {
      // this broke 13.2.2019
      // value2 = !!value ? +format(new Date(value), 'yyyy') : null
      // value can be null so check if substring method exists
      value2 = value && typeof value === 'string' ? +value.substring(0, 4) : value
    }
    if (field2) variables[field2] = value2
    try {
      await apolloClient.mutate({
        mutation: dynamicGql`
            mutation updateTpopkontrForEkf(
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
                  ...TpopfreiwkontrFields
                  adresseByBearbeiter {
                    ...AdresseFields
                    usersByAdresseId {
                      totalCount
                    }
                  }
                  tpopByTpopId {
                    ...TpopFields
                    popByPopId {
                      ...PopFields
                      apByApId {
                        id
                        ekzaehleinheitsByApId {
                          nodes {
                            id
                            tpopkontrzaehlEinheitWerteByZaehleinheitId {
                              ...TpopkontrzaehlEinheitWerteFields
                            }
                          }
                        }
                      }
                    }
                  }
                  tpopkontrzaehlsByTpopkontrId {
                    nodes {
                      id
                      anzahl
                      einheit
                    }
                  }
                }
              }
            }
            ${adresseFragment}
            ${popFragment}
            ${tpopFragment}
            ${tpopfreiwkontrFragment}
            ${tpopkontrzaehlEinheitWerteFragment}
          `,
        variables,
      })
    } catch (error) {
      return setErrors({ [field]: (error as Error).message })
    }
    setErrors({})
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfreiwkontr`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`TpopkontrQuery`],
    })
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.gridContainer}>
        <Title row={row} />
        <Headdata
          pop={pop}
          tpop={tpop}
          row={row}
        />
        <Besttime row={row} />
        <DateField
          saveToDb={saveToDb}
          row={row}
          errors={errors}
        />
        <Map
          saveToDb={saveToDb}
          row={row}
          errors={errors}
        />
        <Image
          key={apId}
          apId={apId}
          artname={artname}
        />
        {zaehls1 && (
          <Count
            key={zaehls1.id}
            id={zaehls1.id}
            tpopkontrId={row.id}
            nr="1"
            refetch={refetch}
            einheitsUsed={einheitsUsed}
            ekzaehleinheits={ekzaehleinheits}
            ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
          />
        )}
        {zaehl1ShowEmpty && (
          <div className={styles.countHint}>
            Sie müssen auf Ebene Art EK-Zähleinheiten definieren, um hier
            Zählungen erfassen zu können.
          </div>
        )}
        {zaehls2 && (
          <Count
            key={zaehls2.id}
            id={zaehls2.id}
            tpopkontrId={row.id}
            nr="2"
            refetch={refetch}
            einheitsUsed={einheitsUsed}
            ekzaehleinheits={ekzaehleinheits}
            ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
          />
        )}
        {zaehl2ShowNew && (
          <Count
            id={null}
            tpopkontrId={row.id}
            nr="2"
            showNew
            refetch={refetch}
            einheitsUsed={einheitsUsed}
            ekzaehleinheits={ekzaehleinheits}
            ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
          />
        )}
        {zaehl2ShowEmpty && !zaehl1ShowEmpty && (
          <Count
            id={null}
            tpopkontrId={row.id}
            nr="2"
            showEmpty
            showNew
            refetch={refetch}
            einheitsUsed={einheitsUsed}
            ekzaehleinheits={ekzaehleinheits}
            ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
          />
        )}
        {zaehls3 && (
          <Count
            key={zaehls3.id}
            id={zaehls3.id}
            tpopkontrId={row.id}
            nr="3"
            refetch={refetch}
            einheitsUsed={einheitsUsed}
            ekzaehleinheits={ekzaehleinheits}
            ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
          />
        )}
        {zaehl3ShowNew && (
          <Count
            id={null}
            tpopkontrId={row.id}
            nr="3"
            showNew
            refetch={refetch}
            einheitsUsed={einheitsUsed}
            ekzaehleinheits={ekzaehleinheits}
            ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
          />
        )}
        {zaehl3ShowEmpty && !zaehl2ShowEmpty && (
          <Count
            id={null}
            tpopkontrId={row.id}
            nr="3"
            showEmpty
            showNew
            refetch={refetch}
            einheitsUsed={einheitsUsed}
            ekzaehleinheits={ekzaehleinheits}
            ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
          />
        )}
        <Cover
          saveToDb={saveToDb}
          row={row}
          errors={errors}
        />
        <More
          saveToDb={saveToDb}
          row={row}
          errors={errors}
        />
        <Danger
          saveToDb={saveToDb}
          row={row}
          errors={errors}
        />
        <Remarks
          saveToDb={saveToDb}
          row={row}
          errors={errors}
        />
        {((isPrint && ekfBemerkungen) || !isPrint) && (
          <EkfRemarks
            saveToDb={saveToDb}
            row={row}
            errors={errors}
          />
        )}
        {/* Files section is disabled:
            {!isPrint && <Files row={row} />} */}
        {!isPrint && !isFreiwillig && (
          <Verification
            saveToDb={saveToDb}
            row={row}
            errors={errors}
          />
        )}
      </div>
      {!isPrint && !isFreiwillig && (
        <StringToCopyOnlyButton
          text={row.id}
          label="GUID"
        />
      )}
      {!isPrint && <div style={{ height: '64px' }} />}
    </div>
  )
}
