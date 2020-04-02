import gql from 'graphql-tag'

export default gql`
  query EkplanmenuTpopQuery(
    $tpopId: UUID!
    $jahr: Int
    $showEk: Boolean!
    $showEkf: Boolean!
    $showMassn: Boolean!
  ) {
    tpopById(id: $tpopId) {
      id
      eks: tpopkontrsByTpopId(
        filter: {
          jahr: { equalTo: $jahr }
          typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
        }
        orderBy: DATUM_ASC
      ) @include(if: $showEk) {
        nodes {
          id
          datum
          typ
          adresseByBearbeiter {
            id
            name
          }
          tpopkontrzaehlsByTpopkontrId {
            nodes {
              id
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
      }
      ekfs: tpopkontrsByTpopId(
        filter: {
          jahr: { equalTo: $jahr }
          typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
        }
        orderBy: DATUM_ASC
      ) @include(if: $showEkf) {
        nodes {
          id
          datum
          typ
          adresseByBearbeiter {
            id
            name
          }
          tpopkontrzaehlsByTpopkontrId {
            nodes {
              id
              einheit
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
      }
      massns: tpopmassnsByTpopId(
        filter: {
          jahr: { equalTo: $jahr }
          tpopmassnTypWerteByTyp: { ansiedlung: { equalTo: true } }
        }
        orderBy: DATUM_ASC
      ) @include(if: $showMassn) {
        nodes {
          id
          datum
          tpopmassnTypWerteByTyp {
            id
            text
          }
          beschreibung
          anzTriebe
          anzPflanzen
          zieleinheitAnzahl
          tpopkontrzaehlEinheitWerteByZieleinheitEinheit {
            id
            text
          }
          bemerkungen
          adresseByBearbeiter {
            id
            name
          }
        }
      }
      popByPopId {
        id
        apByApId {
          id
          projId
        }
      }
    }
  }
`
