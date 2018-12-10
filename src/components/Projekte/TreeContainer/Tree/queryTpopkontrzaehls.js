import gql from 'graphql-tag'

export default gql`
  query TpopkontrzaehlsQuery($tpopkontr: [UUID!], $isTpopkontr: Boolean!) {
    allTpopkontrzaehls(filter: { tpopkontrId: { in: $tpopkontr } })
      @include(if: $isTpopkontr) {
      nodes {
        id
        tpopkontrId
        anzahl
        tpopkontrzaehlEinheitWerteByEinheit {
          id
          text
        }
        tpopkontrzaehlMethodeWerteByMethode {
          id
          text
        }
      }
    }
  }
`
