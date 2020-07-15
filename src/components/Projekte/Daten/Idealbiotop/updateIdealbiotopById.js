import { gql } from '@apollo/client'

import { idealbiotop } from '../../../shared/fragments'

export default gql`
  mutation updateIdealbiotop(
    $id: UUID!
    $apId: UUID
    $erstelldatum: Date
    $hoehenlage: String
    $region: String
    $exposition: String
    $besonnung: String
    $hangneigung: String
    $bodenTyp: String
    $bodenKalkgehalt: String
    $bodenDurchlaessigkeit: String
    $bodenHumus: String
    $bodenNaehrstoffgehalt: String
    $wasserhaushalt: String
    $konkurrenz: String
    $moosschicht: String
    $krautschicht: String
    $strauchschicht: String
    $baumschicht: String
    $bemerkungen: String
    $changedBy: String
  ) {
    updateIdealbiotopById(
      input: {
        id: $id
        idealbiotopPatch: {
          id: $id
          apId: $apId
          erstelldatum: $erstelldatum
          hoehenlage: $hoehenlage
          region: $region
          exposition: $exposition
          besonnung: $besonnung
          hangneigung: $hangneigung
          bodenTyp: $bodenTyp
          bodenKalkgehalt: $bodenKalkgehalt
          bodenDurchlaessigkeit: $bodenDurchlaessigkeit
          bodenHumus: $bodenHumus
          bodenNaehrstoffgehalt: $bodenNaehrstoffgehalt
          wasserhaushalt: $wasserhaushalt
          konkurrenz: $konkurrenz
          moosschicht: $moosschicht
          krautschicht: $krautschicht
          strauchschicht: $strauchschicht
          baumschicht: $baumschicht
          bemerkungen: $bemerkungen
          changedBy: $changedBy
        }
      }
    ) {
      idealbiotop {
        ...IdealbiotopFields
      }
    }
  }
  ${idealbiotop}
`
