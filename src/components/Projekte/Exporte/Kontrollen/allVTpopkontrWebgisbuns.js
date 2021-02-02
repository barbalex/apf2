import { gql } from '@apollo/client'

export default gql`
  query viewTpopkontrWebgisbuns {
    allVTpopkontrWebgisbuns {
      nodes {
        APARTID: apartid
        APART: apart
        POPGUID: popguid
        POPNR: popnr
        TPOPGUID: tpopguid
        TPOPNR: tpopnr
        TPOPSTATUS: tpopstatus
        tpopapberrelevant: tPopApberRelevant
        tpopapberrelevantgrund: tPopApberRelevantGrund
        KONTRGUID: kontrguid
        KONTRJAHR: kontrjahr
        KONTRDAT: kontrdat
        KONTRTYP: kontrtyp
        KONTRBEARBEITER: kontrbearbeiter
        KONTRUEBERLEBENSRATE: kontrueberlebensrate
        KONTRVITALITAET: kontrvitalitaet
        KONTRENTWICKLUNG: kontrentwicklung
        KONTRURSACHEN: kontrursachen
        KONTRERFOLGBEURTEIL: kontrerfolgbeurteil
        KONTRAENDUMSETZUNG: kontraendumsetzung
        KONTRAENDKONTROLLE: kontraendkontrolle
        KONTR_X: kontrX
        KONTR_Y: kontrY
        KONTRBEMERKUNGEN: kontrbemerkungen
        KONTRLRMDELARZE: kontrlrmdelarze
        KONTRDELARZEANGRENZ: kontrdelarzeangrenz
        KONTRVEGTYP: kontrvegtyp
        KONTRKONKURRENZ: kontrkonkurrenz
        KONTRMOOSE: kontrmoose
        KONTRKRAUTSCHICHT: kontrkrautschicht
        KONTRSTRAUCHSCHICHT: kontrstrauchschicht
        KONTRBAUMSCHICHT: kontrbaumschicht
        KONTRUEBEREINSTIMMUNIDEAL: kontruebereinstimmunideal
        KONTRHANDLUNGSBEDARF: kontrhandlungsbedarf
        KONTRUEBERPRUFTFLAECHE: kontrueberpruftflaeche
        KONTRFLAECHETPOP: kontrflaechetpop
        KONTRAUFPLAN: kontraufplan
        KONTRDECKUNGVEG: kontrdeckungveg
        KONTRDECKUNGBODEN: kontrdeckungboden
        KONTRDECKUNGART: kontrdeckungart
        KONTRJUNGEPLANZEN: kontrjungeplanzen
        KONTRMAXHOEHEVEG: kontrmaxhoeheveg
        KONTRMITTELHOEHEVEG: kontrmittelhoeheveg
        KONTRGEFAEHRDUNG: kontrgefaehrdung
        KONTRCHANGEDAT: kontrchangedat
        KONTRCHANGEBY: kontrchangeby
        ZAEHLEINHEITEN: zaehleinheiten
        ANZAHLEN: anzahlen
        METHODEN: methoden
      }
    }
  }
`
