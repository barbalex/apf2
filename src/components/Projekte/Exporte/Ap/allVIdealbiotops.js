import gql from 'graphql-tag'

export default gql`
  query viewIdealbiotops {
    allVIdealbiotops {
      nodes {
        ap_id: apId
        artname
        ap_bearbeitung: apBearbeitung
        ap_start_jahr: apStartJahr
        ap_umsetzung: apUmsetzung
        ap_bearbeiter: apBearbeiter
        erstelldatum
        hoehenlage
        region
        exposition
        besonnung
        hangneigung
        boden_typ: bodenTyp
        boden_kalkgehalt: bodenKalkgehalt
        boden_durchlaessigkeit: bodenDurchlaessigkeit
        boden_humus: bodenHumus
        boden_naehrstoffgehalt: bodenNaehrstoffgehalt
        wasserhaushalt
        konkurrenz
        moosschicht
        krautschicht
        strauchschicht
        baumschicht
        bemerkungen
        changed
        changed_by: changedBy
      }
    }
  }
`
