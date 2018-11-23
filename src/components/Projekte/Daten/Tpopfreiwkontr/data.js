// @flow
import gql from 'graphql-tag'

export default gql`
  query tpopkontrByIdQuery($id: UUID!) {
    tpopkontrById(id: $id) {
      id
      typ
      ekfVerifiziert
      ekfBemerkungen
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
        usersByAdresseId {
          totalCount
        }
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
            ekfBeobachtungszeitpunkt
            aeEigenschaftenByArtId {
              id
              artname
            }
            ekfzaehleinheitsByApId {
              nodes {
                id
                tpopkontrzaehlEinheitWerteByZaehleinheitId {
                  id
                  code
                  text
                  sort
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
  }
`
