import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { gql as dynamicGql } from '../apolloGql.ts'
import type { TpopfeldkontrFieldsFragment } from '../gql/graphql.ts'

import { tpopfeldkontr } from '../components/shared/fragments.ts'
import { store, apolloClientAtom, copyingBiotopAtom } from '../store/index.ts'

export const copyBiotopTo = async ({ id }: { id: string }) => {
  const apolloClient = store.get(apolloClientAtom)!
  const copyingBiotop = store.get(copyingBiotopAtom)
  // fetch previous id from copyingBiotop
  const previousId = copyingBiotop.id
  const { data: dataFrom } = await apolloClient.query({
    query: dynamicGql`
      query tpopkontrByIdForCopyBiotopToQuery($id: UUID!) {
        tpopkontrById(id: $id) {
          ...TpopfeldkontrFields
        }
      }
      ${tpopfeldkontr}
    ` as unknown as TypedDocumentNode<
      { tpopkontrById?: TpopfeldkontrFieldsFragment | null },
      Record<string, unknown>
    >,
    variables: { id: previousId },
  })
  const from = dataFrom?.tpopkontrById
  await apolloClient.mutate({
    mutation: dynamicGql`
      mutation updateTpopkontrForCopyBiotopTo(
        $id: UUID!
        $flaeche: Int
        $lrDelarze: String
        $lrUmgebungDelarze: String
        $vegetationstyp: String
        $konkurrenz: String
        $moosschicht: String
        $krautschicht: String
        $strauchschicht: String
        $baumschicht: String
        $handlungsbedarf: String
        $idealbiotopUebereinstimmung: Int
      ) {
        updateTpopkontrById(
          input: {
            id: $id
            tpopkontrPatch: {
              id: $id
              flaeche: $flaeche
              lrDelarze: $lrDelarze
              lrUmgebungDelarze: $lrUmgebungDelarze
              vegetationstyp: $vegetationstyp
              konkurrenz: $konkurrenz
              moosschicht: $moosschicht
              krautschicht: $krautschicht
              strauchschicht: $strauchschicht
              baumschicht: $baumschicht
              handlungsbedarf: $handlungsbedarf
              idealbiotopUebereinstimmung: $idealbiotopUebereinstimmung
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
    variables: {
      id,
      flaeche: from?.flaeche ?? null,
      lrDelarze: from?.lrDelarze ?? null,
      lrUmgebungDelarze: from?.lrUmgebungDelarze ?? null,
      vegetationstyp: from?.vegetationstyp ?? null,
      konkurrenz: from?.konkurrenz ?? null,
      moosschicht: from?.moosschicht ?? null,
      krautschicht: from?.krautschicht ?? null,
      strauchschicht: from?.strauchschicht ?? null,
      baumschicht: from?.baumschicht ?? null,
      handlungsbedarf: from?.handlungsbedarf ?? null,
      idealbiotopUebereinstimmung: from?.idealbiotopUebereinstimmung ?? null,
    },
  })
}
