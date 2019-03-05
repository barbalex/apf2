import gql from 'graphql-tag'

import { adresse } from '../../../shared/fragments'

export default gql`
  query tpopkontrByIdQuery($id: UUID!, $showFilter: Boolean!) {
    tpopkontrById(id: $id) {
      id
      typ
      datum
      jahr
      jungpflanzenAnzahl
      vitalitaet
      ueberlebensrate
      entwicklung
      ursachen
      erfolgsbeurteilung
      umsetzungAendern
      kontrolleAendern
      bemerkungen
      lrDelarze
      flaeche
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
      idealbiotopUebereinstimmung
      handlungsbedarf
      flaecheUeberprueft
      deckungVegetation
      deckungNackterBoden
      deckungApArt
      vegetationshoeheMaximum
      vegetationshoeheMittel
      gefaehrdung
      tpopId
      bearbeiter
      adresseByBearbeiter {
        ...AdresseFields
      }
      planVorhanden
      jungpflanzenVorhanden
      tpopByTpopId {
        id
        popByPopId {
          id
          apId
        }
      }
    }
    allTpopkontrs(
      filter: {
        or: [
          { typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" } }
          { typ: { isNull: true } }
        ]
      }
    ) @include(if: $showFilter) {
      nodes {
        id
        typ
        datum
        jahr
        jungpflanzenAnzahl
        vitalitaet
        ueberlebensrate
        entwicklung
        ursachen
        erfolgsbeurteilung
        umsetzungAendern
        kontrolleAendern
        bemerkungen
        lrDelarze
        flaeche
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
        idealbiotopUebereinstimmung
        handlungsbedarf
        flaecheUeberprueft
        deckungVegetation
        deckungNackterBoden
        deckungApArt
        vegetationshoeheMaximum
        vegetationshoeheMittel
        gefaehrdung
        tpopId
        bearbeiter
        planVorhanden
        jungpflanzenVorhanden
      }
    }
    allTpopkontrIdbiotuebereinstWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
    allTpopEntwicklungWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
    allAeLrdelarzes {
      nodes {
        id
        label
        einheit
        sort
      }
    }
  }
  ${adresse}
`
