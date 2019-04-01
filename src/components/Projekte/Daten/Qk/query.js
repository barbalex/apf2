import gql from 'graphql-tag'

import { aeEigenschaften, pop, projekt, ziel } from '../../../shared/fragments'

export default gql`
  query QkQuery(
    $berichtjahr: Int
    $isBerichtjahr: Boolean!
    $projId: UUID!
    $apId: UUID!
  ) {
    projektById(id: $projId) {
      ...ProjektFields
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId {
            nodes {
              id
              tpopsByPopId(
                filter: { x: { isNull: false }, y: { isNull: false } }
              ) {
                nodes {
                  id
                  nr
                  flurname
                  x
                  y
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
    zielOhneJahr: projektById(id: $projId) {
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
    zielOhneTyp: projektById(id: $projId) {
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
    zielOhneZiel: projektById(id: $projId) {
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
    zielberOhneJahr: projektById(id: $projId) {
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
    zielberOhneEntwicklung: projektById(id: $projId) {
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
    erfkritOhneBeurteilung: projektById(id: $projId) {
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
    erfkritOhneKriterien: projektById(id: $projId) {
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
    apberOhneJahr: projektById(id: $projId) {
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
    apberOhneVergleichVorjahrGesamtziel: projektById(id: $projId) {
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
    apberOhneBeurteilung: projektById(id: $projId) {
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
    assozartOhneArt: projektById(id: $projId) {
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
    popOhneNr: projektById(id: $projId) {
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
    popOhneName: projektById(id: $projId) {
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
    popOhneStatus: projektById(id: $projId) {
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
    popOhneBekanntSeit: projektById(id: $projId) {
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
    popOhneKoord: projektById(id: $projId) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(
            filter: { or: [{ x: { isNull: true } }, { y: { isNull: true } }] }
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
    # need to filter totalCount = 0 from this result
    popOhneTpop: projektById(id: $projId) {
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
    popMitStatusUnklarOhneBegruendung: projektById(id: $projId) {
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
    ) {
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
    ) {
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
    ) @include(if: $isBerichtjahr) {
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
    ) @include(if: $isBerichtjahr) {
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
    ) @include(if: $isBerichtjahr) {
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
    ) @include(if: $isBerichtjahr) {
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
    ) @include(if: $isBerichtjahr) {
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
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatus300TpopStatusAnders: allVQPopStatus300Tpopstatusanders(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatus201TpopStatusUnzulaessig: allVQPopStatus201Tpopstatusunzulaessigs(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatus202TpopStatusAnders: allVQPopStatus202Tpopstatusanders(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatus200TpopStatusUnzulaessig: allVQPopStatus200Tpopstatusunzulaessigs(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatus101TpopStatusAnders: allVQPopStatus101Tpopstatusanders(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenLetzterPopberZunehmend: allVQPopStatuserloschenletzterpopberzunehmends(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenLetzterPopberStabil: allVQPopStatuserloschenletzterpopberstabils(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenLetzterPopberAbnehmend: allVQPopStatuserloschenletzterpopberabnehmends(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenLetzterPopberUnsicher: allVQPopStatuserloschenletzterpopberunsichers(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
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
    ) @include(if: $isBerichtjahr) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popKoordEntsprechenKeinerTpop: allVQPopKoordentsprechenkeinertpops(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusAnsaatversuchTpopAktuell: allVQPopStatusansaatversuchmitaktuellentpops(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusAnsaatversuchAlleTpopErloschen: allVQPopStatusansaatversuchalletpoperloschens(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusAnsaatversuchMitTpopUrspruenglichErloschen: allVQPopStatusansaatversuchmittpopursprerloschens(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenMitTpopAktuell: allVQPopStatuserloschenmittpopaktuells(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenMitTpopAnsaatversuch: allVQPopStatuserloschenmittpopansaatversuches(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusAngesiedeltMitTpopUrspruenglich: allVQPopStatusangesiedeltmittpopurspruengliches(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusAktuellLetzterPopberErloschen: allVQPopStatusaktuellletzterpopbererloschens(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenLetzterPopberAktuell: allVQPopStatuserloschenletzterpopberaktuells(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popStatusErloschenLetzterPopberErloschenMitAnsiedlung: allVQPopStatuserloschenletzterpopbererloschenmitansiedlungs(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        id
        nr
      }
    }
    popberOhneJahr: projektById(id: $projId) {
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
    popberOhneEntwicklung: projektById(id: $projId) {
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
    popmassnberOhneJahr: projektById(id: $projId) {
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
    popmassnberOhneEntwicklung: projektById(id: $projId) {
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
    ) @include(if: $isBerichtjahr) {
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
    ) @include(if: $isBerichtjahr) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopBekanntSeitJuengerAlsAeltesteBeob: allVQTpopBekanntseitJuengerAlsAeltesteBeobs(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
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
    ) {
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
    ) {
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
    ) {
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
    ) {
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
    ) {
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
    ) {
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
    ) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopOhneNr: projektById(id: $projId) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId {
            nodes {
              id
              tpopsByPopId(filter: { nr: { isNull: true } }) {
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
    tpopOhneFlurname: projektById(id: $projId) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId {
            nodes {
              id
              tpopsByPopId(filter: { flurname: { isNull: true } }) {
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
    tpopOhneStatus: projektById(id: $projId) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId {
            nodes {
              id
              tpopsByPopId(filter: { status: { isNull: true } }) {
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
    tpopOhneBekanntSeit: projektById(id: $projId) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId {
            nodes {
              id
              tpopsByPopId(filter: { bekanntSeit: { isNull: true } }) {
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
    tpopOhneApberRelevant: projektById(id: $projId) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId {
            nodes {
              id
              tpopsByPopId(filter: { apberRelevant: { isNull: true } }) {
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
    tpopOhneKoord: projektById(id: $projId) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId {
            nodes {
              id
              tpopsByPopId(
                filter: {
                  or: [{ x: { isNull: true } }, { y: { isNull: true } }]
                }
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
    tpopStatusPotentiellApberrelevant: projektById(id: $projId) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId {
            nodes {
              id
              tpopsByPopId(
                filter: {
                  status: { equalTo: 300 }
                  apberRelevant: { equalTo: 1 }
                }
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
    tpopErloschenUndRelevantLetzteBeobVor1950: allVQTpopErloschenundrelevantaberletztebeobvor1950S(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopStatusUnklarOhneBegruendung: projektById(id: $projId) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId {
            nodes {
              id
              tpopsByPopId(
                filter: {
                  statusUnklar: { equalTo: true }
                  statusUnklarGrund: { isNull: true }
                }
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
    tpopPopnrTponrMehrdeutig: allVQTpopPopnrtpopnrmehrdeutigs(
      filter: { projId: { equalTo: $projId }, apId: { equalTo: $apId } }
    ) {
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
    ) {
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
    ) {
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
    ) {
      nodes {
        projId
        apId
        popId
        popNr
        id
        nr
      }
    }
    tpopberOhneJahr: projektById(id: $projId) {
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
                  tpopbersByTpopId(filter: { jahr: { isNull: true } }) {
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
    tpopberOhneEntwicklung: projektById(id: $projId) {
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
                  tpopbersByTpopId(filter: { entwicklung: { isNull: true } }) {
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
    tpopmassnOhneJahr: projektById(id: $projId) {
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
                  tpopmassnsByTpopId(filter: { jahr: { isNull: true } }) {
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
    tpopmassnOhneBearb: projektById(id: $projId) {
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
                  tpopmassnsByTpopId(
                    filter: {
                      bearbeiter: { isNull: true }
                      jahr: { equalTo: $berichtjahr }
                    }
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
    tpopmassnOhneTyp: projektById(id: $projId) {
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
                  tpopmassnsByTpopId(
                    filter: {
                      typ: { isNull: true }
                      jahr: { equalTo: $berichtjahr }
                    }
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
    tpopmassnberOhneJahr: projektById(id: $projId) {
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
                  tpopmassnbersByTpopId(filter: { jahr: { isNull: true } }) {
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
    tpopmassnberOhneBeurteilung: projektById(id: $projId) {
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
                  tpopmassnbersByTpopId(
                    filter: {
                      beurteilung: { isNull: true }
                      jahr: { equalTo: $berichtjahr }
                    }
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
    tpopfeldkontrOhneJahr: projektById(id: $projId) {
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
                      jahr: { isNull: true }
                      typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
                    }
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
    tpopfreiwkontrOhneJahr: projektById(id: $projId) {
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
                      jahr: { isNull: true }
                      typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
                    }
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
    tpopfeldkontrOhneBearb: projektById(id: $projId) {
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
                      bearbeiter: { isNull: true }
                      typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
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
    tpopfreiwkontrOhneBearb: projektById(id: $projId) {
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
                      bearbeiter: { isNull: true }
                      typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
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
    tpopfeldkontrOhneZaehlung: projektById(id: $projId) {
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
                      typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
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
    tpopfreiwkontrOhneZaehlung: projektById(id: $projId) {
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
    freiwkontrzaehlungOhneEinheit: projektById(id: $projId) {
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
                      tpopkontrzaehlsByTpopkontrId(
                        filter: { einheit: { isNull: true } }
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
    feldkontrzaehlungOhneEinheit: projektById(id: $projId) {
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
                      typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
                  ) {
                    nodes {
                      id
                      jahr
                      tpopkontrzaehlsByTpopkontrId(
                        filter: { einheit: { isNull: true } }
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
    freiwkontrzaehlungOhneMethode: projektById(id: $projId) {
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
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    feldkontrzaehlungOhneMethode: projektById(id: $projId) {
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
                      typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
                  ) {
                    nodes {
                      id
                      jahr
                      tpopkontrzaehlsByTpopkontrId(
                        filter: { methode: { isNull: true } }
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
    freiwkontrzaehlungOhneAnzahl: projektById(id: $projId) {
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
    feldkontrzaehlungOhneAnzahl: projektById(id: $projId) {
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
                      typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
                      jahr: { equalTo: $berichtjahr }
                    }
                  ) {
                    nodes {
                      id
                      jahr
                      tpopkontrzaehlsByTpopkontrId(
                        filter: { anzahl: { isNull: true } }
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
  ${aeEigenschaften}
  ${pop}
  ${projekt}
  ${ziel}
`
