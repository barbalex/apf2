import gql from 'graphql-tag'

export default gql`
  query Query($id: UUID!) {
    tpopById(id: $id) {
      id
      nr
      gemeinde
      flurname
      x
      y
      radius
      hoehe
      exposition
      klima
      neigung
      beschreibung
      katasterNr
      status
      statusUnklarGrund
      apberRelevant
      bekanntSeit
      eigentuemer
      kontakt
      nutzungszone
      bewirtschafter
      kontrollfrequenz
      kontrollfrequenzFreiwillige
      bemerkungen
      statusUnklar
    }
  }
`
