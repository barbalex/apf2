import get from 'lodash/get'
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
  const from = get(dataFrom, 'tpopkontrById')
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
      flaeche: get(from, 'flaeche', null),
      lrDelarze: get(from, 'lrDelarze', null),
      lrUmgebungDelarze: get(from, 'lrUmgebungDelarze', null),
      vegetationstyp: get(from, 'vegetationstyp', null),
      konkurrenz: get(from, 'konkurrenz', null),
      moosschicht: get(from, 'moosschicht', null),
      krautschicht: get(from, 'krautschicht', null),
      strauchschicht: get(from, 'strauchschicht', null),
      baumschicht: get(from, 'baumschicht', null),
      handlungsbedarf: get(from, 'handlungsbedarf', null),
      idealbiotopUebereinstimmung: get(
        from,
        'idealbiotopUebereinstimmung',
        null,
      ),
    },
  })
}

export default copyBiotopTo
