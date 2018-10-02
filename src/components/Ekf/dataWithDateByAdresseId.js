import gql from 'graphql-tag'

export default gql`
  query ekfDataQuery($id: UUID!, $jahr: Int!) {
    adresseById(id: $id) {
      id
      tpopkontrsByBearbeiter(
        filter: {
          typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
          jahr: { equalTo: $jahr }
        }
      ) {
        nodes {
          id
          datum
          tpopByTpopId {
            id
            nr
            flurname
            gemeinde
            popByPopId {
              id
              nr
              name
              apByApId {
                id
                aeEigenschaftenByArtId {
                  id
                  artname
                }
                projektByProjId {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`
