import { gql } from '@apollo/client'

export default gql`
  query tpopFolderOpenLowerNodesQuery($id: UUID!) {
    popById(id: $id) {
      id
      tpopsByPopId {
        nodes {
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
              tpopkontrzaehlsByTpopkontrId {
                nodes {
                  id
                }
              }
            }
          }
          tpopfreiwkontrs: tpopkontrsByTpopId(
            filter: { typ: { equalTo: "Freiwilligen-Erfolgskontrolle" } }
          ) {
            nodes {
              id
              tpopkontrzaehlsByTpopkontrId {
                nodes {
                  id
                }
              }
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
      popbersByPopId {
        nodes {
          id
        }
      }
      popmassnbersByPopId {
        nodes {
          id
        }
      }
    }
  }
`
