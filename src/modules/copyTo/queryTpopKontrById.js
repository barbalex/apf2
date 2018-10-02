import gql from 'graphql-tag'

export default gql`
  query Query($id: UUID!) {
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
      bearbeiter
      planVorhanden
      jungpflanzenVorhanden
    }
  }
`
