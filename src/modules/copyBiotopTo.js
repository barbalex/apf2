import { gql } from '@apollo/client'

import { tpopfeldkontr } from '../components/shared/fragments'

const copyBiotopTo = async ({ id, client, copyingBiotop }) => {
  // fetch previous id from copyingBiotop
  const previousId = copyingBiotop.id
  const { data: dataFrom } = await client.query({
    query: gql`
      query tpopkontrByIdForCopyBiotopToQuery($id: UUID!) {
        tpopkontrById(id: $id) {
          ...TpopfeldkontrFields
        }
      }
      ${tpopfeldkontr}
    `,
    variables: { id: previousId },
  })
  const from = dataFrom?.tpopkontrById
  await client.mutate({
    mutation: gql`
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

export default copyBiotopTo
