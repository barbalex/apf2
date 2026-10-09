import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { Menu } from './Menu.tsx'
import { query } from './query.ts'
import { TpopfeldkontrForm, type TpopfeldkontrRow } from './Form.tsx'

import type {
  TpopkontrId,
  TpopId,
  AdresseId,
  TpopEntwicklungWerteCode,
} from '../../../../models/apflora/index.ts'

interface TpopfeldkontrQueryResult {
  tpopkontrById?: {
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
    lrDelarze?: string | null
    flaeche?: number | null
    lrUmgebungDelarze?: string | null
    vegetationstyp?: string | null
    konkurrenz?: string | null
    moosschicht?: string | null
    krautschicht?: string | null
    strauchschicht?: string | null
    baumschicht?: string | null
    idealbiotopUebereinstimmung?: number | null
    handlungsbedarf?: string | null
    gefaehrdung?: string | null
    bearbeiter?: AdresseId | null
    jungpflanzenVorhanden?: boolean | null
    apberNichtRelevant?: boolean | null
    apberNichtRelevantGrund?: string | null
    changedBy?: string | null
  } | null
  allTpopkontrIdbiotuebereinstWertes?: {
    nodes: {
      value: number
      label: string | null
    }[]
  } | null
  allTpopEntwicklungWertes?: {
    nodes: {
      value: TpopEntwicklungWerteCode
      label: string | null
    }[]
  } | null
  allAeLrDelarzes?: {
    nodes: {
      id: string
      label: string | null
      einheit: string | null
    }[]
  } | null
  allAdresses?: {
    nodes: {
      value: AdresseId
      label: string | null
    }[]
  } | null
}

export const Component = () => {
  const { tpopkontrId } = useParams()
  const apolloClient = useApolloClient()

  // suspense is still honoured by useQuery at runtime but is no longer part
  // of its option types; building the options outside the call keeps the
  // excess property check from complaining about it
  const tpopfeldkontrQueryOptions = {
    queryKey: ['tpopfeldkontr', tpopkontrId],
    queryFn: async () => {
      const result = await apolloClient.query<TpopfeldkontrQueryResult>({
        query,
        variables: { id: tpopkontrId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  }
  const { data } = useQuery(tpopfeldkontrQueryOptions)

  const row = (data?.tpopkontrById ?? {}) as TpopfeldkontrRow

  return (
    <ErrorBoundary>
      <FormTitle
        title="Feld-Kontrolle"
        MenuBarComponent={Menu}
        menuBarProps={{ row }}
      />
      <TpopfeldkontrForm
        row={row}
        data={data ?? {}}
      />
    </ErrorBoundary>
  )
}
