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
  const { data: dataFrom } = await client.query({
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
  const from = get(dataFrom, 'tpopkontrById')
  await client.mutate({
    mutation: gql`
      mutation updateTpopkontr(
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
        $bodenTyp: String
        $bodenKalkgehalt: String
        $bodenDurchlaessigkeit: String
        $bodenHumus: String
        $bodenNaehrstoffgehalt: String
        $bodenAbtrag: String
        $wasserhaushalt: String
        $handlungsbedarf: String
        $idealbiotopUebereinstimmung: Int
      ) {
        updateTpopkontrById(
          input: {
            id: $id,
            tpopkontrPatch: {
              id: $id,
              flaeche: $flaeche
              lrDelarze: $lrDelarze
              lrUmgebungDelarze: $lrUmgebungDelarze
              vegetationstyp: $vegetationstyp
              konkurrenz: $konkurrenz
              moosschicht: $moosschicht
              krautschicht: $krautschicht
              strauchschicht: $strauchschicht
              baumschicht: $baumschicht
              bodenTyp: $bodenTyp
              bodenKalkgehalt: $bodenKalkgehalt
              bodenDurchlaessigkeit: $bodenDurchlaessigkeit
              bodenHumus: $bodenHumus
              bodenNaehrstoffgehalt: $bodenNaehrstoffgehalt
              bodenAbtrag: $bodenAbtrag
              wasserhaushalt: $wasserhaushalt
              handlungsbedarf: $handlungsbedarf
              idealbiotopUebereinstimmung: $idealbiotopUebereinstimmung
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
      bodenTyp: get(from, 'bodenTyp', null),
      bodenKalkgehalt: get(from, 'bodenKalkgehalt', null),
      bodenDurchlaessigkeit: get(from, 'bodenDurchlaessigkeit', null),
      bodenHumus: get(from, 'bodenHumus', null),
      bodenNaehrstoffgehalt: get(from, 'bodenNaehrstoffgehalt', null),
      bodenAbtrag: get(from, 'bodenAbtrag', null),
      wasserhaushalt: get(from, 'wasserhaushalt', null),
      handlungsbedarf: get(from, 'handlungsbedarf', null),
      idealbiotopUebereinstimmung: get(from, 'idealbiotopUebereinstimmung', null),
    }
  })
  
}
