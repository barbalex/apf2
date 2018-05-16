// @flow
import get from 'lodash/get'
import gql from "graphql-tag"

import biotopFields from './biotopFields'

export default async ({ id, client }:{ id: String, client: Object }): Promise<void> => {
  // fetch previous id from copyingBiotop
  const { data: data1 } = await client.query({
    query: gql`
      query myquery {
        copyingBiotop @client {
          id
        }
      }`
  })
  const previousId = get(data1, 'copyingBiotop.id')
  const { data: data2 } = await client.query({
    query: gql`
      query myquery($id: UUID!) {
        tpopkontrById(id: $id) {
          id
          flaeche
          lrDelarze
          lrUmgebungDelarze
          vegetationstyp
          konkurrenz
          moosschicht
          krautschicht
          strauchschicht
          baumschicht
          bodenTyp
          bodenKalkgehalt
          bodenDurchlaessigkeit
          bodenHumus
          bodenNaehrstoffgehalt
          bodenAbtrag
          wasserhaushalt
          handlungsbedarf
          idealbiotopUebereinstimmung
        }
      }
    `,
    variables: { id: previousId }
  })
  const kontrToCopy = get(data2, 'tpopkontrById')
  console.log('copyBiotopTo:', {previousId, data1, id, client, kontrToCopy})
  // TODO: update ziel id
  await client.mutate({
    mutation: gql`
      mutation updateTpopkontr($id: UUID!) {
        updateTpopkontrById(
          input: {
            id: $id,
            tpopkontrPatch: {
              id: $id,
              apId: $apId,
              artId: $artId
            } 
          }
        ) {
          tpopkontr {
            id
            flaeche
            lrDelarze
            lrUmgebungDelarze
            vegetationstyp
            konkurrenz
            moosschicht
            krautschicht
            strauchschicht
            baumschicht
            bodenTyp
            bodenKalkgehalt
            bodenDurchlaessigkeit
            bodenHumus
            bodenNaehrstoffgehalt
            bodenAbtrag
            wasserhaushalt
            handlungsbedarf
            idealbiotopUebereinstimmung
          }
        }
      }
    `
  })
  
}
