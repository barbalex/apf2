// @flow
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

export default graphql(
  gql`
    query tpopkontrByIdQuery($id: UUID!) {
      tpopkontrById(id: $id) {
        id
        typ
        datum
        jahr
        bemerkungen
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
          id
          name
        }
        planVorhanden
        jungpflanzenVorhanden
        tpopByTpopId {
          id
          nr
          flurname
          x
          y
          status
          popByPopId {
            id
            apId
            nr
            name
            apByApId {
              id
              ekfzaehleinheitsByApId {
                nodes {
                  id
                  tpopkontrzaehlEinheitWerteByZaehleinheitId {
                    id
                    code
                    text
                  }
                }
              }
            }
          }
        }
        tpopkontrzaehlsByTpopkontrId {
          nodes {
            id
            anzahl
            einheit
          }
        }
      }
      allTpopkontrzaehlEinheitWertes {
        nodes {
          id
          code
          text
          sort
        }
      }
      allAdresses {
        nodes {
          id
          name
        }
      }
    }
  `,
  {
    options: ({ id }) => ({
      variables: {
        id,
      },
    }),
  }
)
