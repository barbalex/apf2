import gql from 'graphql-tag'

export default gql`
  mutation updateAp(
    $id: UUID!
    $bearbeitung: Int
    $startJahr: Int
    $umsetzung: Int
    $artId: UUID
    $bearbeiter: UUID
    $ekfBeobachtungszeitpunkt: String
    $projId: UUID
    $changedBy: String
  ) {
    updateApById(
      input: {
        id: $id
        apPatch: {
          id: $id
          bearbeitung: $bearbeitung
          startJahr: $startJahr
          umsetzung: $umsetzung
          artId: $artId
          bearbeiter: $bearbeiter
          ekfBeobachtungszeitpunkt: $ekfBeobachtungszeitpunkt
          projId: $projId
          changedBy: $changedBy
        }
      }
    ) {
      ap {
        id
        bearbeitung
        startJahr
        umsetzung
        artId
        bearbeiter
        ekfBeobachtungszeitpunkt
        adresseByBearbeiter {
          id
          name
        }
        projId
        changedBy
        aeEigenschaftenByArtId {
          id
          artname
          artwert
        }
      }
    }
  }
`
