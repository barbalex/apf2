import gql from 'graphql-tag'

import {
  ap,
  aeEigenschaften,
  pop,
  projekt,
  ziel,
} from '../../../../shared/fragments'

export default gql`
  query QkQuery(
    $berichtjahr: Int
    $notIsBerichtjahr: Boolean!
    $projId: UUID!
    $apId: UUID!
    $apMitApOhneUmsetzung: Boolean!
    $apOhneBearbeitung: Boolean!
    $apOhneVerantwortlich: Boolean!
    $apberOhneBeurteilung: Boolean!
    $apberOhneJahr: Boolean!
    $apberOhneVergleichVorjahrGesamtziel: Boolean!
    $assozartOhneArt: Boolean!
    $erfkritOhneBeurteilung: Boolean!
    $erfkritOhneKriterien: Boolean!
    $feldkontrzaehlungOhneAnzahl: Boolean!
    $feldkontrzaehlungOhneEinheit: Boolean!
    $feldkontrzaehlungOhneMethode: Boolean!
    $freiwkontrzaehlungOhneAnzahl: Boolean!
    $freiwkontrzaehlungOhneEinheit: Boolean!
    $freiwkontrzaehlungOhneMethode: Boolean!
    $popBekanntSeitNichtAeltesteTpop: Boolean!
    $popKoordEntsprechenKeinerTpop: Boolean!
    $popMitBerAbnehmendOhneTpopberAbnehmend: Boolean!
    $popMitBerErloschenOhneTpopberErloschen: Boolean!
    $popMitBerErloschenUndTpopberNichtErloschen: Boolean!
    $popMitBerZunehmendOhneTpopberZunehmend: Boolean!
    $popMitMehrdeutigerNr: Boolean!
    $popMitStatusUnklarOhneBegruendung: Boolean!
    $popOhneBekanntSeit: Boolean!
    $popOhneKoord: Boolean!
    $popOhneName: Boolean!
    $popOhneNr: Boolean!
    $popOhnePopber: Boolean!
    $popOhnePopmassnber: Boolean!
    $popOhneStatus: Boolean!
    $popOhneTpop: Boolean!
    $popOhneTpopMitGleichemStatus: Boolean!
    $popStatus101TpopStatusAnders: Boolean!
    $popStatus200TpopStatusUnzulaessig: Boolean!
    $popStatus201TpopStatusUnzulaessig: Boolean!
    $popStatus202TpopStatusAnders: Boolean!
    $popStatus300TpopStatusAnders: Boolean!
    $popStatusAktuellLetzterPopberErloschen: Boolean!
    $popStatusAngesiedeltMitTpopUrspruenglich: Boolean!
    $popStatusAnsaatversuchAlleTpopErloschen: Boolean!
    $popStatusAnsaatversuchMitTpopUrspruenglichErloschen: Boolean!
    $popStatusAnsaatversuchTpopAktuell: Boolean!
    $popStatusErloschenLetzterPopberAbnehmend: Boolean!
    $popStatusErloschenLetzterPopberAktuell: Boolean!
    $popStatusErloschenLetzterPopberErloschenMitAnsiedlung: Boolean!
    $popStatusErloschenLetzterPopberStabil: Boolean!
    $popStatusErloschenLetzterPopberUnsicher: Boolean!
    $popStatusErloschenLetzterPopberZunehmend: Boolean!
    $popStatusErloschenMitTpopAktuell: Boolean!
    $popStatusErloschenMitTpopAnsaatversuch: Boolean!
    $popberOhneEntwicklung: Boolean!
    $popberOhneJahr: Boolean!
    $popmassnberOhneEntwicklung: Boolean!
    $popmassnberOhneJahr: Boolean!
    $tpopBekanntSeitJuengerAlsAeltesteBeob: Boolean!
    $tpopCountedEinheitMultipleTimesInYear: Boolean!
    $tpopErloschenUndRelevantLetzteBeobVor1950: Boolean!
    $tpopMitStatusAnsaatversuchUndZaehlungMitAnzahl: Boolean!
    $tpopMitStatusPotentiellUndAnsiedlung: Boolean!
    $tpopMitStatusPotentiellUndZaehlungMitAnzahl: Boolean!
    $tpopOhneApberRelevant: Boolean!
    $tpopOhneBekanntSeit: Boolean!
    $tpopOhneFlurname: Boolean!
    $tpopOhneKoord: Boolean!
    $tpopOhneMassnber: Boolean!
    $tpopOhneNr: Boolean!
    $tpopOhneStatus: Boolean!
    $tpopOhneTpopber: Boolean!
    $tpopPopnrTponrMehrdeutig: Boolean!
    $tpopStatusAktuellLetzterTpopberErloschen: Boolean!
    $tpopStatusErloschenLetzterTpopberAbnehmend: Boolean!
    $tpopStatusErloschenLetzterTpopberAktuell: Boolean!
    $tpopStatusErloschenLetzterTpopberErloschenMitAnsiedlung: Boolean!
    $tpopStatusErloschenLetzterTpopberStabil: Boolean!
    $tpopStatusErloschenLetzterTpopberUnsicher: Boolean!
    $tpopStatusErloschenLetzterTpopberZunehmend: Boolean!
    $tpopStatusPotentiellApberrelevant: Boolean!
    $tpopStatusUnklarOhneBegruendung: Boolean!
    $tpopberOhneEntwicklung: Boolean!
    $tpopberOhneJahr: Boolean!
    $tpopfeldkontrOhneBearb: Boolean!
    $tpopfeldkontrOhneJahr: Boolean!
    $tpopfeldkontrOhneZaehlung: Boolean!
    $tpopfreiwkontrOhneBearb: Boolean!
    $tpopfreiwkontrOhneJahr: Boolean!
    $tpopfreiwkontrOhneZaehlung: Boolean!
    $tpopmassnOhneBearb: Boolean!
    $tpopmassnOhneJahr: Boolean!
    $tpopmassnOhneTyp: Boolean!
    $tpopmassnberOhneBeurteilung: Boolean!
    $tpopmassnberOhneJahr: Boolean!
    $zielOhneJahr: Boolean!
    $zielOhneTyp: Boolean!
    $zielOhneZiel: Boolean!
    $zielberOhneEntwicklung: Boolean!
    $zielberOhneJahr: Boolean!
  ) {
    projektById(id: $projId) {
      ...ProjektFields
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId {
            nodes {
              id
              tpopsByPopId(filter: { lv95X: { isNull: false } }) {
                nodes {
                  id
                  nr
                  flurname
                  wgs84Lat
                  wgs84Long
                  apberRelevant
                  popByPopId {
                    ...PopFields
                  }
                }
              }
            }
          }
          aeEigenschaftenByArtId {
            ...AeEigenschaftenFields
          }
        }
      }
    }
    apOhneBearbeitung: projektById(id: $projId)
      @include(if: $apOhneBearbeitung) {
      id
      apsByProjId(
        filter: { id: { equalTo: $apId }, bearbeitung: { isNull: true } }
      ) {
        nodes {
          ...ApFields
        }
      }
    }
    apMitApOhneUmsetzung: projektById(id: $projId)
      @include(if: $apMitApOhneUmsetzung) {
      id
      apsByProjId(
        filter: {
          id: { equalTo: $apId }
          bearbeitung: { lessThan: 4 }
          umsetzung: { isNull: true }
        }
      ) {
        nodes {
          ...ApFields
        }
      }
    }
    apOhneVerantwortlich: projektById(id: $projId)
      @include(if: $apOhneVerantwortlich) {
      id
      apsByProjId(
        filter: { id: { equalTo: $apId }, bearbeiter: { isNull: true } }
      ) {
        nodes {
          ...ApFields
        }
      }
    }
    zielOhneJahr: projektById(id: $projId) @include(if: $zielOhneJahr) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          zielsByApId(
            filter: {
              or: [{ jahr: { equalTo: 1 } }, { jahr: { isNull: true } }]
            }
            orderBy: ID_ASC
          ) {
            nodes {
              ...ZielFields
            }
          }
        }
      }
    }
    zielOhneTyp: projektById(id: $projId) @include(if: $zielOhneTyp) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          zielsByApId(
            filter: { typ: { isNull: true }, jahr: { equalTo: $berichtjahr } }
            orderBy: JAHR_ASC
          ) {
            nodes {
              ...ZielFields
            }
          }
        }
      }
    }
    zielOhneZiel: projektById(id: $projId) @include(if: $zielOhneZiel) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          zielsByApId(
            filter: {
              bezeichnung: { isNull: true }
              jahr: { equalTo: $berichtjahr }
            }
            orderBy: JAHR_ASC
          ) {
            nodes {
              ...ZielFields
            }
          }
        }
      }
    }
    zielberOhneJahr: projektById(id: $projId) @include(if: $zielberOhneJahr) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          zielsByApId(filter: { jahr: { equalTo: $berichtjahr } }) {
            nodes {
              ...ZielFields
              zielbersByZielId(
                filter: { jahr: { isNull: true } }
                orderBy: ID_ASC
              ) {
                nodes {
                  id
                  zielByZielId {
                    id
                    jahr
                  }
                }
              }
            }
          }
        }
      }
    }
    zielberOhneEntwicklung: projektById(id: $projId)
      @include(if: $zielberOhneEntwicklung) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          zielsByApId(filter: { jahr: { equalTo: $berichtjahr } }) {
            nodes {
              ...ZielFields
              zielbersByZielId(
                filter: {
                  erreichung: { isNull: true }
                  jahr: { equalTo: $berichtjahr }
                }
                orderBy: JAHR_ASC
              ) {
                nodes {
                  id
                  jahr
                  zielByZielId {
                    id
                    jahr
                  }
                }
              }
            }
          }
        }
      }
    }
    erfkritOhneBeurteilung: projektById(id: $projId)
      @include(if: $erfkritOhneBeurteilung) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          erfkritsByApId(
            filter: { erfolg: { isNull: true } }
            orderBy: ID_ASC
          ) {
            nodes {
              id
            }
          }
        }
      }
    }
    erfkritOhneKriterien: projektById(id: $projId)
      @include(if: $erfkritOhneKriterien) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          erfkritsByApId(
            filter: { kriterien: { isNull: true } }
            orderBy: ID_ASC
          ) {
            nodes {
              id
            }
          }
        }
      }
    }
    apberOhneJahr: projektById(id: $projId) @include(if: $apberOhneJahr) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          apbersByApId(filter: { jahr: { isNull: true } }, orderBy: ID_ASC) {
            nodes {
              id
            }
          }
        }
      }
    }
    apberOhneVergleichVorjahrGesamtziel: projektById(id: $projId)
      @include(if: $apberOhneVergleichVorjahrGesamtziel) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          apbersByApId(
            filter: {
              vergleichVorjahrGesamtziel: { isNull: true }
              jahr: { equalTo: $berichtjahr }
            }
            orderBy: JAHR_ASC
          ) {
            nodes {
              id
              jahr
            }
          }
        }
      }
    }
    apberOhneBeurteilung: projektById(id: $projId)
      @include(if: $apberOhneBeurteilung) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          apbersByApId(
            filter: {
              beurteilung: { isNull: true }
              jahr: { equalTo: $berichtjahr }
            }
            orderBy: JAHR_ASC
          ) {
            nodes {
              id
              jahr
            }
          }
        }
      }
    }
    assozartOhneArt: projektById(id: $projId) @include(if: $assozartOhneArt) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          assozartsByApId(filter: { aeId: { isNull: true } }, orderBy: ID_ASC) {
            nodes {
              id
            }
          }
        }
      }
    }
    popOhneNr: projektById(id: $projId) @include(if: $popOhneNr) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(filter: { nr: { isNull: true } }, orderBy: NAME_ASC) {
            nodes {
              id
              name
            }
          }
        }
      }
    }
    popOhneName: projektById(id: $projId) @include(if: $popOhneName) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(filter: { name: { isNull: true } }, orderBy: NR_ASC) {
            nodes {
              id
              nr
            }
          }
        }
      }
    }
    popOhneStatus: projektById(id: $projId) @include(if: $popOhneStatus) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(filter: { status: { isNull: true } }, orderBy: NR_ASC) {
            nodes {
              id
              nr
            }
          }
        }
      }
    }
    popOhneBekanntSeit: projektById(id: $projId)
      @include(if: $popOhneBekanntSeit) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(
            filter: { bekanntSeit: { isNull: true } }
            orderBy: NR_ASC
          ) {
            nodes {
              id
              nr
            }
          }
        }
      }
    }
    popOhneKoord: projektById(id: $projId) @include(if: $popOhneKoord) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(filter: { lv95X: { isNull: true } }, orderBy: NR_ASC) {
            nodes {
              id
              nr
            }
          }
        }
      }
    }
    # need to filter totalCount = 0 from this result
    popOhneTpop: projektById(id: $projId) @include(if: $popOhneTpop) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              nr
              tpopsByPopId {
                totalCount
              }
            }
          }
        }
      }
    }
    popMitStatusUnklarOhneBegruendung: projektById(id: $projId)
      @include(if: $popMitStatusUnklarOhneBegruendung) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(
            filter: {
              statusUnklar: { equalTo: true }
              statusUnklarBegruendung: { isNull: true }
            }
            orderBy: NR_ASC
          ) {
            nodes {
              id
              nr
            }
          }
        }
      }
    }
    popBekanntSeitNichtAeltesteTpop: allVQPopBekanntseitNichtAeltestetpops(
      filter: { apId: { equalTo: $apId } }
      orderBy: NR_ASC
    ) @include(if: $popBekanntSeitNichtAeltesteTpop) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popMitMehrdeutigerNr: allVQPopPopnrmehrdeutigs(
      filter: { apId: { equalTo: $apId } }
      orderBy: NR_ASC
    ) @include(if: $popMitMehrdeutigerNr) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popOhnePopber: qPopOhnePopber(
      berichtjahr: $berichtjahr
      apid: $apId
      projid: $projId
    ) @include(if: $popOhnePopber) @skip(if: $notIsBerichtjahr) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    # Bericht-Stati kontrollieren
    popMitBerZunehmendOhneTpopberZunehmend: allVQPopMitBerZunehmendOhneTpopberZunehmends(
      filter: {
        projId: { equalTo: $projId }
        apId: { equalTo: $apId }
        berichtjahr: { equalTo: $berichtjahr }
      }
    )
      @include(if: $popMitBerZunehmendOhneTpopberZunehmend)
      @skip(if: $notIsBerichtjahr) {
      nodes {
        projId
        apId
        id
        nr
        berichtjahr
      }
    }
    popMitBerAbnehmendOhneTpopberAbnehmend: allVQPopMitBerAbnehmendOhneTpopberAbnehmends(
      filter: {
        projId: { equalTo: $projId }
        apId: { equalTo: $apId }
        berichtjahr: { equalTo: $berichtjahr }
      }
    )
      @include(if: $popMitBerAbnehmendOhneTpopberAbnehmend)
      @skip(if: $notIsBerichtjahr) {
      nodes {
        projId
        apId
        id
        nr
        berichtjahr
      }
    }
    popMitBerErloschenOhneTpopberErloschen: allVQPopMitBerErloschenOhneTpopberErloschens(
      filter: {
        projId: { equalTo: $projId }
        apId: { equalTo: $apId }
        berichtjahr: { equalTo: $berichtjahr }
      }
    )
      @include(if: $popMitBerErloschenOhneTpopberErloschen)
      @skip(if: $notIsBerichtjahr) {
      nodes {
        projId
        apId
        id
        nr
        berichtjahr
      }
    }
    popMitBerErloschenUndTpopberNichtErloschen: allVQPopMitBerErloschenUndTpopberNichtErloschens(
      filter: {
        projId: { equalTo: $projId }
        apId: { equalTo: $apId }
        berichtjahr: { equalTo: $berichtjahr }
      }
    )
      @include(if: $popMitBerErloschenUndTpopberNichtErloschen)
      @skip(if: $notIsBerichtjahr) {
      nodes {
        projId
        apId
        id
        nr
        berichtjahr
      }
    }
    popOhneTpopMitGleichemStatus: allVQPopOhnetpopmitgleichemstatuses(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popOhneTpopMitGleichemStatus) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatus300TpopStatusAnders: allVQPopStatus300Tpopstatusanders(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatus300TpopStatusAnders) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatus201TpopStatusUnzulaessig: allVQPopStatus201Tpopstatusunzulaessigs(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatus201TpopStatusUnzulaessig) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatus202TpopStatusAnders: allVQPopStatus202Tpopstatusanders(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatus202TpopStatusAnders) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatus200TpopStatusUnzulaessig: allVQPopStatus200Tpopstatusunzulaessigs(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatus200TpopStatusUnzulaessig) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatus101TpopStatusAnders: allVQPopStatus101Tpopstatusanders(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatus101TpopStatusAnders) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenLetzterPopberZunehmend: allVQPopStatuserloschenletzterpopberzunehmends(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatusErloschenLetzterPopberZunehmend) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenLetzterPopberStabil: allVQPopStatuserloschenletzterpopberstabils(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatusErloschenLetzterPopberStabil) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenLetzterPopberAbnehmend: allVQPopStatuserloschenletzterpopberabnehmends(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatusErloschenLetzterPopberAbnehmend) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenLetzterPopberUnsicher: allVQPopStatuserloschenletzterpopberunsichers(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatusErloschenLetzterPopberUnsicher) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popOhnePopmassnber: qPopOhnePopmassnber(
      berichtjahr: $berichtjahr
      apid: $apId
      projid: $projId
    ) @include(if: $popOhnePopmassnber) @skip(if: $notIsBerichtjahr) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popKoordEntsprechenKeinerTpop: allVQPopKoordentsprechenkeinertpops(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popKoordEntsprechenKeinerTpop) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusAnsaatversuchTpopAktuell: allVQPopStatusansaatversuchmitaktuellentpops(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatusAnsaatversuchTpopAktuell) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusAnsaatversuchAlleTpopErloschen: allVQPopStatusansaatversuchalletpoperloschens(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatusAnsaatversuchAlleTpopErloschen) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusAnsaatversuchMitTpopUrspruenglichErloschen: allVQPopStatusansaatversuchmittpopursprerloschens(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatusAnsaatversuchMitTpopUrspruenglichErloschen) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenMitTpopAktuell: allVQPopStatuserloschenmittpopaktuells(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatusErloschenMitTpopAktuell) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenMitTpopAnsaatversuch: allVQPopStatuserloschenmittpopansaatversuches(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatusErloschenMitTpopAnsaatversuch) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusAngesiedeltMitTpopUrspruenglich: allVQPopStatusangesiedeltmittpopurspruengliches(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatusAngesiedeltMitTpopUrspruenglich) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusAktuellLetzterPopberErloschen: allVQPopStatusaktuellletzterpopbererloschens(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatusAktuellLetzterPopberErloschen) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenLetzterPopberAktuell: allVQPopStatuserloschenletzterpopberaktuells(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatusErloschenLetzterPopberAktuell) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenLetzterPopberErloschenMitAnsiedlung: allVQPopStatuserloschenletzterpopbererloschenmitansiedlungs(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $popStatusErloschenLetzterPopberErloschenMitAnsiedlung) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popberOhneJahr: projektById(id: $projId) @include(if: $popberOhneJahr) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              popbersByPopId(
                filter: { jahr: { isNull: true } }
                orderBy: ID_ASC
              ) {
                nodes {
                  id
                  popByPopId {
                    id
                    nr
                  }
                }
              }
            }
          }
        }
      }
    }
    popberOhneEntwicklung: projektById(id: $projId)
      @include(if: $popberOhneEntwicklung) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              popbersByPopId(
                filter: {
                  entwicklung: { isNull: true }
                  jahr: { equalTo: $berichtjahr }
                }
                orderBy: JAHR_ASC
              ) {
                nodes {
                  id
                  jahr
                  popByPopId {
                    id
                    nr
                  }
                }
              }
            }
          }
        }
      }
    }
    popmassnberOhneJahr: projektById(id: $projId)
      @include(if: $popmassnberOhneJahr) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              popmassnbersByPopId(
                filter: { jahr: { isNull: true } }
                orderBy: ID_ASC
              ) {
                nodes {
                  id
                  popByPopId {
                    id
                    nr
                  }
                }
              }
            }
          }
        }
      }
    }
    popmassnberOhneEntwicklung: projektById(id: $projId)
      @include(if: $popmassnberOhneEntwicklung) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              popmassnbersByPopId(
                filter: {
                  beurteilung: { isNull: true }
                  jahr: { equalTo: $berichtjahr }
                }
                orderBy: JAHR_ASC
              ) {
                nodes {
                  id
                  jahr
                  popByPopId {
                    id
                    nr
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopOhneTpopber: qTpopOhneTpopber(
      berichtjahr: $berichtjahr
      apid: $apId
      projid: $projId
    ) @include(if: $tpopOhneTpopber) @skip(if: $notIsBerichtjahr) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopOhneMassnber: qTpopOhneMassnber(
      berichtjahr: $berichtjahr
      apid: $apId
      projid: $projId
    ) @include(if: $tpopOhneMassnber) @skip(if: $notIsBerichtjahr) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopCountedEinheitMultipleTimesInYear: qTpopCountedEinheitMultipleTimesInYear(
      berichtjahr: $berichtjahr
      apid: $apId
      projid: $projId
    )
      @include(if: $tpopCountedEinheitMultipleTimesInYear)
      @skip(if: $notIsBerichtjahr) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
        einheit
        anzahl
      }
    }
    tpopBekanntSeitJuengerAlsAeltesteBeob: allVQTpopBekanntseitJuengerAlsAeltesteBeobs(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $tpopBekanntSeitJuengerAlsAeltesteBeob) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopStatusAktuellLetzterTpopberErloschen: allVQTpopStatusaktuellletztertpopbererloschens(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $tpopStatusAktuellLetzterTpopberErloschen) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopStatusErloschenLetzterTpopberStabil: allVQTpopStatuserloschenletztertpopberstabils(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $tpopStatusErloschenLetzterTpopberStabil) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopStatusErloschenLetzterTpopberAbnehmend: allVQTpopStatuserloschenletztertpopberabnehmends(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $tpopStatusErloschenLetzterTpopberAbnehmend) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopStatusErloschenLetzterTpopberUnsicher: allVQTpopStatuserloschenletztertpopberunsichers(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $tpopStatusErloschenLetzterTpopberUnsicher) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopStatusErloschenLetzterTpopberZunehmend: allVQTpopStatuserloschenletztertpopberzunehmends(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $tpopStatusErloschenLetzterTpopberZunehmend) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopStatusErloschenLetzterTpopberAktuell: allVQTpopStatuserloschenletzterpopberaktuells(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $tpopStatusErloschenLetzterTpopberAktuell) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopStatusErloschenLetzterTpopberErloschenMitAnsiedlung: allVQTpopStatuserloschenletztertpopbererloschenmitansiedlungs(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $tpopStatusErloschenLetzterTpopberErloschenMitAnsiedlung) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopOhneNr: projektById(id: $projId) @include(if: $tpopOhneNr) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(filter: { nr: { isNull: true } }, orderBy: ID_ASC) {
                nodes {
                  id
                  popByPopId {
                    id
                    nr
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopOhneFlurname: projektById(id: $projId) @include(if: $tpopOhneFlurname) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(
                filter: { flurname: { isNull: true } }
                orderBy: NR_ASC
              ) {
                nodes {
                  id
                  nr
                  popByPopId {
                    id
                    nr
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopOhneStatus: projektById(id: $projId) @include(if: $tpopOhneStatus) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(
                filter: { status: { isNull: true } }
                orderBy: NR_ASC
              ) {
                nodes {
                  id
                  nr
                  popByPopId {
                    id
                    nr
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopOhneBekanntSeit: projektById(id: $projId)
      @include(if: $tpopOhneBekanntSeit) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(
                filter: { bekanntSeit: { isNull: true } }
                orderBy: NR_ASC
              ) {
                nodes {
                  id
                  nr
                  popByPopId {
                    id
                    nr
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopOhneApberRelevant: projektById(id: $projId)
      @include(if: $tpopOhneApberRelevant) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(
                filter: { apberRelevant: { isNull: true } }
                orderBy: NR_ASC
              ) {
                nodes {
                  id
                  nr
                  popByPopId {
                    id
                    nr
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopOhneKoord: projektById(id: $projId) @include(if: $tpopOhneKoord) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(
                filter: { lv95X: { isNull: true } }
                orderBy: NR_ASC
              ) {
                nodes {
                  id
                  nr
                  popByPopId {
                    id
                    nr
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopStatusPotentiellApberrelevant: projektById(id: $projId)
      @include(if: $tpopStatusPotentiellApberrelevant) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(
                filter: {
                  status: { equalTo: 300 }
                  apberRelevant: { equalTo: true }
                }
                orderBy: NR_ASC
              ) {
                nodes {
                  id
                  nr
                  popByPopId {
                    id
                    nr
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopErloschenUndRelevantLetzteBeobVor1950: allVQTpopErloschenundrelevantaberletztebeobvor1950S(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $tpopErloschenUndRelevantLetzteBeobVor1950) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopStatusUnklarOhneBegruendung: projektById(id: $projId)
      @include(if: $tpopStatusUnklarOhneBegruendung) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(
                filter: {
                  statusUnklar: { equalTo: true }
                  statusUnklarGrund: { isNull: true }
                }
                orderBy: NR_ASC
              ) {
                nodes {
                  id
                  nr
                  popByPopId {
                    id
                    nr
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopPopnrTponrMehrdeutig: allVQTpopPopnrtpopnrmehrdeutigs(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $tpopPopnrTponrMehrdeutig) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopMitStatusAnsaatversuchUndZaehlungMitAnzahl: allVQTpopMitstatusansaatversuchundzaehlungmitanzahls(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $tpopMitStatusAnsaatversuchUndZaehlungMitAnzahl) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopMitStatusPotentiellUndZaehlungMitAnzahl: allVQTpopMitstatuspotentiellundzaehlungmitanzahls(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $tpopMitStatusPotentiellUndZaehlungMitAnzahl) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopMitStatusPotentiellUndAnsiedlung: allVQTpopMitstatuspotentiellundmassnansiedlungs(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) @include(if: $tpopMitStatusPotentiellUndAnsiedlung) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopberOhneJahr: projektById(id: $projId) @include(if: $tpopberOhneJahr) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopbersByTpopId(
                    filter: { jahr: { isNull: true } }
                    orderBy: ID_ASC
                  ) {
                    nodes {
                      id
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopberOhneEntwicklung: projektById(id: $projId)
      @include(if: $tpopberOhneEntwicklung) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopbersByTpopId(
                    filter: { entwicklung: { isNull: true } }
                    orderBy: JAHR_ASC
                  ) {
                    nodes {
                      id
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopmassnOhneJahr: projektById(id: $projId)
      @include(if: $tpopmassnOhneJahr) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopmassnsByTpopId(
                    filter: { jahr: { isNull: true } }
                    orderBy: ID_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopmassnOhneBearb: projektById(id: $projId)
      @include(if: $tpopmassnOhneBearb) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopmassnsByTpopId(
                    filter: {
                      bearbeiter: { isNull: true }
                      jahr: { equalTo: $berichtjahr }
                    }
                    orderBy: JAHR_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopmassnOhneTyp: projektById(id: $projId) @include(if: $tpopmassnOhneTyp) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopmassnsByTpopId(
                    filter: {
                      typ: { isNull: true }
                      jahr: { equalTo: $berichtjahr }
                    }
                    orderBy: JAHR_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopmassnberOhneJahr: projektById(id: $projId)
      @include(if: $tpopmassnberOhneJahr) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopmassnbersByTpopId(
                    filter: { jahr: { isNull: true } }
                    orderBy: ID_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopmassnberOhneBeurteilung: projektById(id: $projId)
      @include(if: $tpopmassnberOhneBeurteilung) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopmassnbersByTpopId(
                    filter: {
                      beurteilung: { isNull: true }
                      jahr: { equalTo: $berichtjahr }
                    }
                    orderBy: JAHR_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopfeldkontrOhneJahr: projektById(id: $projId)
      @include(if: $tpopfeldkontrOhneJahr) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopkontrsByTpopId(
                    filter: {
                      jahr: { isNull: true }
                      typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
                    }
                    orderBy: ID_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopfreiwkontrOhneJahr: projektById(id: $projId)
      @include(if: $tpopfreiwkontrOhneJahr) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopkontrsByTpopId(
                    filter: {
                      jahr: { isNull: true }
                      typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
                    }
                    orderBy: ID_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopfeldkontrOhneBearb: projektById(id: $projId)
      @include(if: $tpopfeldkontrOhneBearb) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopkontrsByTpopId(
                    filter: {
                      bearbeiter: { isNull: true }
                      typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
                    orderBy: JAHR_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopfreiwkontrOhneBearb: projektById(id: $projId)
      @include(if: $tpopfreiwkontrOhneBearb) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopkontrsByTpopId(
                    filter: {
                      bearbeiter: { isNull: true }
                      typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
                    orderBy: JAHR_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopfeldkontrOhneZaehlung: projektById(id: $projId)
      @include(if: $tpopfeldkontrOhneZaehlung) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopkontrsByTpopId(
                    filter: {
                      typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
                    orderBy: JAHR_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopkontrzaehlsByTpopkontrId {
                        totalCount
                      }
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    tpopfreiwkontrOhneZaehlung: projektById(id: $projId)
      @include(if: $tpopfreiwkontrOhneZaehlung) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopkontrsByTpopId(
                    filter: {
                      typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
                    orderBy: JAHR_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopkontrzaehlsByTpopkontrId {
                        totalCount
                      }
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    freiwkontrzaehlungOhneEinheit: projektById(id: $projId)
      @include(if: $freiwkontrzaehlungOhneEinheit) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopkontrsByTpopId(
                    filter: {
                      typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
                    orderBy: JAHR_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopkontrzaehlsByTpopkontrId(
                        filter: { einheit: { isNull: true } }
                        orderBy: ID_ASC
                      ) {
                        nodes {
                          id
                          tpopkontrByTpopkontrId {
                            id
                            jahr
                            tpopByTpopId {
                              id
                              nr
                              popByPopId {
                                id
                                nr
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    feldkontrzaehlungOhneEinheit: projektById(id: $projId)
      @include(if: $feldkontrzaehlungOhneEinheit) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopkontrsByTpopId(
                    filter: {
                      typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
                    orderBy: JAHR_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopkontrzaehlsByTpopkontrId(
                        filter: { einheit: { isNull: true } }
                        orderBy: ID_ASC
                      ) {
                        nodes {
                          id
                          tpopkontrByTpopkontrId {
                            id
                            jahr
                            tpopByTpopId {
                              id
                              nr
                              popByPopId {
                                id
                                nr
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    freiwkontrzaehlungOhneMethode: projektById(id: $projId)
      @include(if: $freiwkontrzaehlungOhneMethode) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId {
            nodes {
              id
              tpopsByPopId {
                nodes {
                  id
                  tpopkontrsByTpopId(
                    filter: {
                      typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
                  ) {
                    nodes {
                      id
                      jahr
                      zaehlungenOhneMethode: tpopkontrzaehlsByTpopkontrId(
                        filter: { methode: { isNull: true } }
                      ) {
                        nodes {
                          id
                        }
                      }
                      zaehlungenMitMethode: tpopkontrzaehlsByTpopkontrId(
                        filter: { methode: { isNull: false } }
                      ) {
                        nodes {
                          id
                        }
                      }
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    feldkontrzaehlungOhneMethode: projektById(id: $projId)
      @include(if: $feldkontrzaehlungOhneMethode) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopkontrsByTpopId(
                    filter: {
                      typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
                    orderBy: JAHR_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopkontrzaehlsByTpopkontrId(
                        filter: { methode: { isNull: true } }
                        orderBy: ID_ASC
                      ) {
                        nodes {
                          id
                          tpopkontrByTpopkontrId {
                            id
                            jahr
                            tpopByTpopId {
                              id
                              nr
                              popByPopId {
                                id
                                nr
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    freiwkontrzaehlungOhneAnzahl: projektById(id: $projId)
      @include(if: $freiwkontrzaehlungOhneAnzahl) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId {
            nodes {
              id
              tpopsByPopId {
                nodes {
                  id
                  tpopkontrsByTpopId(
                    filter: {
                      typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
                  ) {
                    nodes {
                      id
                      jahr
                      zaehlungenOhneAnzahl: tpopkontrzaehlsByTpopkontrId(
                        filter: { anzahl: { isNull: true } }
                      ) {
                        nodes {
                          id
                        }
                      }
                      zaehlungenMitAnzahl: tpopkontrzaehlsByTpopkontrId(
                        filter: { anzahl: { isNull: false } }
                      ) {
                        nodes {
                          id
                        }
                      }
                      tpopByTpopId {
                        id
                        nr
                        popByPopId {
                          id
                          nr
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    feldkontrzaehlungOhneAnzahl: projektById(id: $projId)
      @include(if: $feldkontrzaehlungOhneAnzahl) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(orderBy: NR_ASC) {
            nodes {
              id
              tpopsByPopId(orderBy: NR_ASC) {
                nodes {
                  id
                  tpopkontrsByTpopId(
                    filter: {
                      typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
                    orderBy: JAHR_ASC
                  ) {
                    nodes {
                      id
                      jahr
                      tpopkontrzaehlsByTpopkontrId(
                        filter: { anzahl: { isNull: true } }
                        orderBy: ID_ASC
                      ) {
                        nodes {
                          id
                          tpopkontrByTpopkontrId {
                            id
                            jahr
                            tpopByTpopId {
                              id
                              nr
                              popByPopId {
                                id
                                nr
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${ap}
  ${aeEigenschaften}
  ${pop}
  ${projekt}
  ${ziel}
`
