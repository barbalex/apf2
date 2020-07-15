import { gql } from '@apollo/client'

export default gql`
  query treeContainerOpenLowerNodesQuery($id: UUID!) {
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
