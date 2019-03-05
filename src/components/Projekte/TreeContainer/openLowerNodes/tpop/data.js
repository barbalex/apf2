import gql from 'graphql-tag'

export default gql`
  query Query($id: UUID!) {
    tpopById(id: $id) {
      id
      tpopmassnsByTpopId {
        nodes {
          id
        }
      }
      tpopmassnbersByTpopId {
        nodes {
          id
        }
      }
      tpopfeldkontrs: tpopkontrsByTpopId(
        filter: { typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" } }
      ) {
        nodes {
          id
        }
      }
      tpopfreiwkontrs: tpopkontrsByTpopId(
        filter: { typ: { equalTo: "Freiwilligen-Erfolgskontrolle" } }
      ) {
        nodes {
          id
        }
      }
      tpopbersByTpopId {
        nodes {
          id
        }
      }
      beobsByTpopId {
        nodes {
          id
        }
      }
    }
  }
`
