import { graphql } from '../../../../../gql/index.ts'

export const query = graphql(`
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
            filter: { typ: { notEqualTo: "Freiwilligen-Kontrolle" } }
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
            filter: { typ: { equalTo: "Freiwilligen-Kontrolle" } }
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
`)
