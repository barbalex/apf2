import get from 'lodash/get'
import flatten from 'lodash/flatten'
import sortBy from 'lodash/sortBy'

import isPointInsidePolygon from './isPointInsidePolygon'
import ktZh from './ktZh.json'

export default ({ data, berichtjahr, projId, apId }) => ({
  tpopsOutsideZh:()=> {
    const projId = get(data, 'tpopsOutsideZh.projId')
    const apId = get(data, 'tpopsOutsideZh.apsByProjId.nodes[0].id')
    const pops = get(
      data,
      'tpopsOutsideZh.apsByProjId.nodes[0].popsByApId.nodes',
      [],
    )
    const tpops = flatten(pops.map(p => get(p, 'tpopsByPopId.nodes', [])))

  
    // kontrolliere die Relevanz ausserkantonaler Tpop
    let tpopsOutsideZh = tpops.filter(
      tpop =>
        tpop.apberRelevant &&
        !!tpop.wgs84Lat &&
        !isPointInsidePolygon(ktZh, tpop.wgs84Lat, tpop.wgs84Long),
    )
    tpopsOutsideZh = sortBy(tpopsOutsideZh, n => [get(n, 'popByPopId.nr'), n.nr])

    return tpopsOutsideZh.map(tpop => ({
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          get(tpop, 'popByPopId.nr'),
          'Teil-Populationen',
          tpop.id,
        ],
        text: `Population: ${get(tpop, 'popByPopId.nr') ||
          get(tpop, 'popByPopId.id')}, Teil-Population: ${tpop.nr || tpop.id}`,
      }))
  },
  apOhneBearbeitung: () => (get(data, 'apOhneBearbeitung.apsByProjId.nodes') || []).map(
      n => ({
        url: ['Projekte', projId, 'Aktionspläne', apId],
        text: `Feld "Aktionsplan" ist leer`,
      })),
  apMitApOhneUmsetzung: () => (get(data, 'apMitApOhneUmsetzung.apsByProjId.nodes') || []).map(
      n => ({
        url: ['Projekte', projId, 'Aktionspläne', apId],
        text: `Feld "Umsetzung" ist leer`,
      }),
    ),
  apOhneVerantwortlich: () => (get(data, 'apOhneVerantwortlich.apsByProjId.nodes') || []).map(
      n => ({
        url: ['Projekte', projId, 'Aktionspläne', apId],
        text: `Feld "Verantwortlich" ist leer`,
      }),
    ),
  zielOhneJahr: () => get(
      data,
      'zielOhneJahr.apsByProjId.nodes[0].zielsByApId.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'AP-Ziele',
        n.jahr,
        n.id,
      ],
      text: `Ziel: ${n.id}`,
    })),
  zielOhneTyp: () => get(
      data,
      'zielOhneTyp.apsByProjId.nodes[0].zielsByApId.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'AP-Ziele',
        n.jahr,
        n.id,
      ],
      text: `Ziel: ${n.jahr || n.id}`,
    })),
  zielOhneZiel: () => get(
      data,
      'zielOhneZiel.apsByProjId.nodes[0].zielsByApId.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'AP-Ziele',
        n.jahr,
        n.id,
      ],
      text: `Ziel: ${n.jahr || n.id}`,
    })),
  zielberOhneJahr: () => {
      const zielNodes = get(
        data,
        'zielberOhneJahr.apsByProjId.nodes[0].zielsByApId.nodes',
        [],
      )
      const zielberNodes = flatten(
        zielNodes.map(n => get(n, 'zielbersByZielId.nodes', [])),
      )
      return zielberNodes.map(n => {
        const zielId = get(n, 'zielByZielId.id')
        const zielJahr = get(n, 'zielByZielId.jahr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'AP-Ziele',
            get(n, 'zielByZielId.jahr'),
            zielId,
            'Berichte',
            n.id,
          ],
          text: `Ziel: ${zielJahr || zielId}, Bericht: ${n.id}`,
        }
      })
    },
  zielberOhneEntwicklung: () => {
      const zielNodes = get(
        data,
        'zielberOhneEntwicklung.apsByProjId.nodes[0].zielsByApId.nodes',
        [],
      )
      const zielberNodes = flatten(
        zielNodes.map(n => get(n, 'zielbersByZielId.nodes', [])),
      )
      return zielberNodes.map(n => {
        const zielId = get(n, 'zielByZielId.id')
        const zielJahr = get(n, 'zielByZielId.jahr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'AP-Ziele',
            get(n, 'zielByZielId.jahr'),
            zielId,
            'Berichte',
            n.id,
          ],
          text: `Ziel: ${zielJahr || zielId}, Bericht: ${n.jahr || n.id}`,
        }
      })
    },
  erfkritOhneBeurteilung: () => get(
      data,
      'erfkritOhneBeurteilung.apsByProjId.nodes[0].erfkritsByApId.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'AP-Erfolgskriterien',
        n.id,
      ],
      text: `Erfolgskriterium: ${n.id}`,
    })),
  erfkritOhneKriterien: () => get(
      data,
      'erfkritOhneKriterien.apsByProjId.nodes[0].erfkritsByApId.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'AP-Erfolgskriterien',
        n.id,
      ],
      text: `Erfolgskriterium: ${n.id}`,
    })),
  apberOhneJahr: () => get(
      data,
      'apberOhneJahr.apsByProjId.nodes[0].apbersByApId.nodes',
      [],
    ).map(n => ({
      url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte', n.id],
      text: `AP-Bericht: ${n.id}`,
    })),
  apberOhneVergleichVorjahrGesamtziel: () => get(
      data,
      'apberOhneVergleichVorjahrGesamtziel.apsByProjId.nodes[0].apbersByApId.nodes',
      [],
    ).map(n => ({
      url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte', n.id],
      text: `AP-Bericht: ${n.jahr || n.id}`,
    })),
  apberOhneBeurteilung: () => get(
      data,
      'apberOhneBeurteilung.apsByProjId.nodes[0].apbersByApId.nodes',
      [],
    ).map(n => ({
      url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte', n.id],
      text: `AP-Bericht: ${n.jahr || n.id}`,
    })),
  assozartOhneArt: () => get(
      data,
      'assozartOhneArt.apsByProjId.nodes[0].assozartsByApId.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'assoziierte-Arten',
        n.id,
      ],
      text: `Assoziierte Art: ${n.id}`,
    })),
  popOhneNr: () => get(
      data,
      'popOhneNr.apsByProjId.nodes[0].popsByApId.nodes',
      [],
    ).map(n => ({
      url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
      text: `Population: ${n.name || n.id}`,
    })),
  popOhneName: () => get(
      data,
      'popOhneName.apsByProjId.nodes[0].popsByApId.nodes',
      [],
    ).map(n => ({
      url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
      text: `Population: ${n.nr || n.id}`,
    })),
  popOhneStatus: () => get(
      data,
      'popOhneStatus.apsByProjId.nodes[0].popsByApId.nodes',
      [],
    ).map(n => ({
      url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
      text: `Population: ${n.nr || n.id}`,
    })),
  popOhneBekanntSeit: () => get(
      data,
      'popOhneBekanntSeit.apsByProjId.nodes[0].popsByApId.nodes',
      [],
    ).map(n => ({
      url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
      text: `Population: ${n.nr || n.id}`,
    })),
  popOhneKoord: () => get(
      data,
      'popOhneKoord.apsByProjId.nodes[0].popsByApId.nodes',
      [],
    ).map(n => ({
      url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
      text: `Population: ${n.nr || n.id}`,
    })),
  popOhneTpop: () => get(
      data,
      'popOhneTpop.apsByProjId.nodes[0].popsByApId.nodes',
      [],
    )
      .filter(n => get(n, 'tpopsByPopId.totalCount') === 0)
      .map(n => ({
        url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
        text: `Population: ${n.nr || n.id}`,
      })),
  popMitStatusUnklarOhneBegruendung: () => get(
      data,
      'popMitStatusUnklarOhneBegruendung.apsByProjId.nodes[0].popsByApId.nodes',
      [],
    ).map(n => ({
      url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
      text: `Population: ${n.nr || n.id}`,
    })),
  popBekanntSeitNichtAeltesteTpop: () => get(data, 'popBekanntSeitNichtAeltesteTpop.nodes', []).map(
      n => ({
        url: [
          'Projekte',
          n.projId,
          'Aktionspläne',
          n.apId,
          'Populationen',
          n.id,
        ],
        text: `Population: ${n.nr || n.id}`,
      }),
    ),
  popMitMehrdeutigerNr: () => get(data, 'popMitMehrdeutigerNr.nodes', []).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popOhnePopber: () => get(data, 'popOhnePopber.nodes', []).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popMitBerZunehmendOhneTpopberZunehmend: () => get(
      data,
      'popMitBerZunehmendOhneTpopberZunehmend.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popMitBerAbnehmendOhneTpopberAbnehmend: () => get(
      data,
      'popMitBerAbnehmendOhneTpopberAbnehmend.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popMitBerErloschenOhneTpopberErloschen: () => get(
      data,
      'popMitBerErloschenOhneTpopberErloschen.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popMitBerErloschenUndTpopberNichtErloschen: () => get(
      data,
      'popMitBerErloschenUndTpopberNichtErloschen.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popOhneTpopMitGleichemStatus: () => get(data, 'popOhneTpopMitGleichemStatus.nodes', []).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popStatus300TpopStatusAnders: () => get(data, 'popStatus300TpopStatusAnders.nodes', []).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popStatus201TpopStatusUnzulaessig: () => get(data, 'popStatus201TpopStatusUnzulaessig.nodes', []).map(
      n => ({
        url: [
          'Projekte',
          n.projId,
          'Aktionspläne',
          n.apId,
          'Populationen',
          n.id,
        ],
        text: `Population: ${n.nr || n.id}`,
      }),
    ),
  popStatus202TpopStatusAnders: () => get(data, 'popStatus202TpopStatusAnders.nodes', []).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popStatus200TpopStatusUnzulaessig: () => get(data, 'popStatus200TpopStatusUnzulaessig.nodes', []).map(
      n => ({
        url: [
          'Projekte',
          n.projId,
          'Aktionspläne',
          n.apId,
          'Populationen',
          n.id,
        ],
        text: `Population: ${n.nr || n.id}`,
      }),
    ),
  popStatus101TpopStatusAnders: () => get(data, 'popStatus101TpopStatusAnders.nodes', []).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popStatusErloschenLetzterPopberZunehmend: () => get(
      data,
      'popStatusErloschenLetzterPopberZunehmend.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popStatusErloschenLetzterPopberStabil: () => get(
      data,
      'popStatusErloschenLetzterPopberStabil.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popStatusErloschenLetzterPopberAbnehmend: () => get(
      data,
      'popStatusErloschenLetzterPopberAbnehmend.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popStatusErloschenLetzterPopberUnsicher: () => get(
      data,
      'popStatusErloschenLetzterPopberUnsicher.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popOhnePopmassnber: () => get(data, 'popOhnePopmassnber.nodes', []).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popKoordEntsprechenKeinerTpop: () => get(data, 'popKoordEntsprechenKeinerTpop.nodes', []).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popStatusAnsaatversuchTpopAktuell: () => get(data, 'popStatusAnsaatversuchTpopAktuell.nodes', []).map(
      n => ({
        url: [
          'Projekte',
          n.projId,
          'Aktionspläne',
          n.apId,
          'Populationen',
          n.id,
        ],
        text: `Population: ${n.nr || n.id}`,
      }),
    ),
  popStatusAnsaatversuchAlleTpopErloschen: () => get(
      data,
      'popStatusAnsaatversuchAlleTpopErloschen.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr}`,
    })),
  popStatusAnsaatversuchMitTpopUrspruenglichErloschen: () => get(
      data,
      'popStatusAnsaatversuchMitTpopUrspruenglichErloschen.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popStatusErloschenMitTpopAktuell: () => get(data, 'popStatusErloschenMitTpopAktuell.nodes', []).map(
      n => ({
        url: [
          'Projekte',
          n.projId,
          'Aktionspläne',
          n.apId,
          'Populationen',
          n.id,
        ],
        text: `Population: ${n.nr || n.id}`,
      }),
    ),
  popStatusErloschenMitTpopAnsaatversuch: () => get(
      data,
      'popStatusErloschenMitTpopAnsaatversuch.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popStatusAngesiedeltMitTpopUrspruenglich: () => get(
      data,
      'popStatusAngesiedeltMitTpopUrspruenglich.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popStatusAktuellLetzterPopberErloschen: () => get(
      data,
      'popStatusAktuellLetzterPopberErloschen.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popStatusErloschenLetzterPopberAktuell: () => get(
      data,
      'popStatusErloschenLetzterPopberAktuell.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popStatusErloschenLetzterPopberErloschenMitAnsiedlung: () => get(
      data,
      'popStatusErloschenLetzterPopberErloschenMitAnsiedlung.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.id,
      ],
      text: `Population: ${n.nr || n.id}`,
    })),
  popberOhneJahr: () => {
      const popNodes = get(
        data,
        'popberOhneJahr.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const popberNodes = flatten(
        popNodes.map(n => get(n, 'popbersByPopId.nodes', [])),
      )
      return popberNodes.map(n => ({
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          get(n, 'popByPopId.id'),
          'Kontroll-Berichte',
          n.id,
        ],
        text: `Population: ${get(n, 'popByPopId.nr') ||
          get(n, 'popByPopId.id')}, Bericht: ${n.id}`,
      }))
    },
  popberOhneEntwicklung: () => {
      const popNodes = get(
        data,
        'popberOhneEntwicklung.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const popberNodes = flatten(
        popNodes.map(n => get(n, 'popbersByPopId.nodes', [])),
      )
      return popberNodes.map(n => ({
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          get(n, 'popByPopId.id'),
          'Kontroll-Berichte',
          n.id,
        ],
        text: `Population: ${get(n, 'popByPopId.nr') ||
          get(n, 'popByPopId.id')}, Bericht: ${n.jahr || n.id}`,
      }))
    },
  popmassnberOhneJahr: () => {
      const popNodes = get(
        data,
        'popmassnberOhneJahr.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const popberNodes = flatten(
        popNodes.map(n => get(n, 'popmassnbersByPopId.nodes', [])),
      )
      return popberNodes.map(n => ({
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          get(n, 'popByPopId.id'),
          'Massnahmen-Berichte',
          n.id,
        ],
        text: `Population: ${get(n, 'popByPopId.nr') ||
          get(n, 'popByPopId.id')}, Bericht: ${n.id}`,
      }))
    },
  popmassnberOhneEntwicklung: () => {
      const popNodes = get(
        data,
        'popmassnberOhneEntwicklung.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const popberNodes = flatten(
        popNodes.map(n => get(n, 'popmassnbersByPopId.nodes', [])),
      )
      return popberNodes.map(n => ({
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          get(n, 'popByPopId.id'),
          'Massnahmen-Berichte',
          n.id,
        ],
        text: `Population: ${get(n, 'popByPopId.nr') ||
          get(n, 'popByPopId.id')}, Bericht: ${n.jahr || n.id}`,
      }))
    },
  tpopBekanntSeitJuengerAlsAeltesteBeob: () => get(
      data,
      'tpopBekanntSeitJuengerAlsAeltesteBeob.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr}, Teil-Population: ${n.nr}`,
    })),
  tpopStatusAktuellLetzterTpopberErloschen: () => get(
      data,
      'tpopStatusAktuellLetzterTpopberErloschen.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr}, Teil-Population: ${n.nr}`,
    })),
  tpopStatusErloschenLetzterTpopberStabil: () => get(
      data,
      'tpopStatusErloschenLetzterTpopberStabil.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr ||
        n.id}`,
    })),
  tpopStatusErloschenLetzterTpopberAbnehmend: () => get(
      data,
      'tpopStatusErloschenLetzterTpopberAbnehmend.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr ||
        n.id}`,
    })),
  tpopStatusErloschenLetzterTpopberUnsicher: () => get(
      data,
      'tpopStatusErloschenLetzterTpopberUnsicher.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr ||
        n.id}`,
    })),
  tpopStatusErloschenLetzterTpopberZunehmend: () => get(
      data,
      'tpopStatusErloschenLetzterTpopberZunehmend.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr ||
        n.id}`,
    })),
  tpopStatusErloschenLetzterTpopberAktuell: () => (get(data,
    'tpopStatusErloschenLetzterTpopberAktuell.nodes')||[]).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr ||
        n.id}`,
    })),
  tpopStatusErloschenLetzterTpopberErloschenMitAnsiedlung: () => get(
      data,
      'tpopStatusErloschenLetzterTpopberErloschenMitAnsiedlung.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr ||
        n.id}`,
    })),
  tpopOhneNr: () => {
      const popNodes = get(
        data,
        'tpopOhneNr.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      return tpopNodes.map(n => ({
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          get(n, 'popByPopId.id'),
          'Teil-Populationen',
          n.id,
        ],
        text: `Population: ${get(n, 'popByPopId.nr') ||
          get(n, 'popByPopId.id')}, Teil-Population: ${n.id}`,
      }))
    },
  tpopOhneFlurname: () => {
      const popNodes = get(
        data,
        'tpopOhneFlurname.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      return tpopNodes.map(n => ({
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          get(n, 'popByPopId.id'),
          'Teil-Populationen',
          n.id,
        ],
        text: `Population: ${get(n, 'popByPopId.nr') ||
          get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`,
      }))
    },
  tpopOhneStatus: () => {
      const popNodes = get(
        data,
        'tpopOhneStatus.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      return tpopNodes.map(n => ({
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          get(n, 'popByPopId.id'),
          'Teil-Populationen',
          n.id,
        ],
        text: `Population: ${get(n, 'popByPopId.nr') ||
          get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`,
      }))
    },
  tpopOhneBekanntSeit: () => {
      const popNodes = get(
        data,
        'tpopOhneBekanntSeit.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      return tpopNodes.map(n => ({
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          get(n, 'popByPopId.id'),
          'Teil-Populationen',
          n.id,
        ],
        text: `Population: ${get(n, 'popByPopId.nr') ||
          get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`,
      }))
    },
  tpopOhneApberRelevant: () => {
      const popNodes = get(
        data,
        'tpopOhneApberRelevant.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      return tpopNodes.map(n => ({
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          get(n, 'popByPopId.id'),
          'Teil-Populationen',
          n.id,
        ],
        text: `Population: ${get(n, 'popByPopId.nr') ||
          get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`,
      }))
    },
  tpopOhneKoord: () => {
      const popNodes = get(
        data,
        'tpopOhneKoord.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      return tpopNodes.map(n => ({
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          get(n, 'popByPopId.id'),
          'Teil-Populationen',
          n.id,
        ],
        text: `Population: ${get(n, 'popByPopId.nr') ||
          get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`,
      }))
    },
  tpopStatusPotentiellApberrelevant: () => {
      const popNodes = get(
        data,
        'tpopStatusPotentiellApberrelevant.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      return tpopNodes.map(n => ({
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          get(n, 'popByPopId.id'),
          'Teil-Populationen',
          n.id,
        ],
        text: `Population: ${get(n, 'popByPopId.nr') ||
          get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`,
      }))
    },
  tpopErloschenUndRelevantLetzteBeobVor1950: () => get(
      data,
      'tpopErloschenUndRelevantLetzteBeobVor1950.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr ||
        n.id}`,
    })),
  tpopStatusUnklarOhneBegruendung: () => {
      const popNodes = get(
        data,
        'tpopStatusUnklarOhneBegruendung.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      return tpopNodes.map(n => ({
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          get(n, 'popByPopId.id'),
          'Teil-Populationen',
          n.id,
        ],
        text: `Population: ${get(n, 'popByPopId.nr') ||
          get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`,
      }))
    },
  tpopPopnrTponrMehrdeutig: () => get(data, 'tpopPopnrTponrMehrdeutig.nodes', []).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr ||
        n.id}`,
    })),
  tpopOhneTpopber: () => get(data, 'tpopOhneTpopber.nodes', []).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr ||
        n.id}`,
    })),
  tpopOhneMassnber: () => get(data, 'tpopOhneMassnber.nodes', []).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr ||
        n.id}`,
    })),
  tpopCountedEinheitMultipleTimesInYear: () => get(
      data,
      'tpopCountedEinheitMultipleTimesInYear.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr ||
        n.id}: "${n.einheit}" wurde ${n.anzahl} mal gezählt`,
    })),
  tpopMitStatusAnsaatversuchUndZaehlungMitAnzahl: () => get(
      data,
      'tpopMitStatusAnsaatversuchUndZaehlungMitAnzahl.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr ||
        n.id}`,
    })),
  tpopMitStatusPotentiellUndZaehlungMitAnzahl: () => get(
      data,
      'tpopMitStatusPotentiellUndZaehlungMitAnzahl.nodes',
      [],
    ).map(n => ({
      url: [
        'Projekte',
        n.projId,
        'Aktionspläne',
        n.apId,
        'Populationen',
        n.popId,
        'Teil-Populationen',
        n.id,
      ],
      text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr ||
        n.id}`,
    })),
  tpopMitStatusPotentiellUndAnsiedlung: () => get(data, 'tpopMitStatusPotentiellUndAnsiedlung.nodes', []).map(
      n => ({
        url: [
          'Projekte',
          n.projId,
          'Aktionspläne',
          n.apId,
          'Populationen',
          n.popId,
          'Teil-Populationen',
          n.id,
        ],
        text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr ||
          n.id}`,
      }),
    ),
  tpopberOhneJahr: () => {
      const popNodes = get(
        data,
        'tpopberOhneJahr.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopberNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopbersByTpopId.nodes', [])),
      )
      return tpopberNodes.map(n => {
        const popId = get(n, 'tpopByTpopId.popByPopId.id')
        const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
        const tpopId = get(n, 'tpopByTpopId.id')
        const tpopNr = get(n, 'tpopByTpopId.nr')

        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Kontroll-Berichte',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Kontroll-Bericht: ${n.id}`,
        }
      })
    },
  tpopberOhneEntwicklung: () => {
      const popNodes = get(
        data,
        'tpopberOhneEntwicklung.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopberNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopbersByTpopId.nodes', [])),
      )
      return tpopberNodes.map(n => {
        const popId = get(n, 'tpopByTpopId.popByPopId.id')
        const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
        const tpopId = get(n, 'tpopByTpopId.id')
        const tpopNr = get(n, 'tpopByTpopId.nr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Kontroll-Berichte',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Kontroll-Bericht: ${n.nr || n.id}`,
        }
      })
    },
  tpopmassnOhneJahr: () => {
      const popNodes = get(
        data,
        'tpopmassnOhneJahr.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopmassnNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopmassnsByTpopId.nodes', [])),
      )
      return tpopmassnNodes.map(n => {
        const popId = get(n, 'tpopByTpopId.popByPopId.id')
        const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
        const tpopId = get(n, 'tpopByTpopId.id')
        const tpopNr = get(n, 'tpopByTpopId.nr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Massnahmen',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Massnahme: ${n.jahr || n.id}`,
        }
      })
    },
  tpopmassnOhneBearb: () => {
      const popNodes = get(
        data,
        'tpopmassnOhneBearb.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopmassnNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopmassnsByTpopId.nodes', [])),
      )
      return tpopmassnNodes.map(n => {
        const popId = get(n, 'tpopByTpopId.popByPopId.id')
        const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
        const tpopId = get(n, 'tpopByTpopId.id')
        const tpopNr = get(n, 'tpopByTpopId.nr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Massnahmen',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Massnahme: ${n.jahr || n.id}`,
        }
      })
    },
  tpopmassnOhneTyp: () => {
      const popNodes = get(
        data,
        'tpopmassnOhneTyp.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopmassnNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopmassnsByTpopId.nodes', [])),
      )
      return tpopmassnNodes.map(n => {
        const popId = get(n, 'tpopByTpopId.popByPopId.id')
        const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
        const tpopId = get(n, 'tpopByTpopId.id')
        const tpopNr = get(n, 'tpopByTpopId.nr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Massnahmen',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Massnahme: ${n.jahr || n.id}`,
        }
      })
    },
  tpopmassnberOhneJahr: () => {
      const popNodes = get(
        data,
        'tpopmassnberOhneJahr.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopmassnberNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopmassnbersByTpopId.nodes', [])),
      )
      return tpopmassnberNodes.map(n => {
        const popId = get(n, 'tpopByTpopId.popByPopId.id')
        const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
        const tpopId = get(n, 'tpopByTpopId.id')
        const tpopNr = get(n, 'tpopByTpopId.nr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Massnahmen-Berichte',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Massnahmen-Bericht: ${n.jahr || n.id}`,
        }
      })
    },
  tpopmassnberOhneBeurteilung: () => {
      const popNodes = get(
        data,
        'tpopmassnberOhneBeurteilung.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopmassnberNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopmassnbersByTpopId.nodes', [])),
      )
      return tpopmassnberNodes.map(n => {
        const popId = get(n, 'tpopByTpopId.popByPopId.id')
        const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
        const tpopId = get(n, 'tpopByTpopId.id')
        const tpopNr = get(n, 'tpopByTpopId.nr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Massnahmen-Berichte',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Massnahmen-Bericht: ${n.jahr || n.id}`,
        }
      })
    },
  tpopfeldkontrOhneJahr: () => {
      const popNodes = get(
        data,
        'tpopfeldkontrOhneJahr.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopkontrNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', [])),
      )

      return tpopkontrNodes.map(n => {
        const popId = get(n, 'tpopByTpopId.popByPopId.id')
        const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
        const tpopId = get(n, 'tpopByTpopId.id')
        const tpopNr = get(n, 'tpopByTpopId.nr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Feld-Kontrollen',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Kontrolle: ${n.jahr || n.id}`,
        }
      })
    },
  tpopfreiwkontrOhneJahr: () => {
      const popNodes = get(
        data,
        'tpopfreiwkontrOhneJahr.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopkontrNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', [])),
      )
      return tpopkontrNodes.map(n => {
        const popId = get(n, 'tpopByTpopId.popByPopId.id')
        const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
        const tpopId = get(n, 'tpopByTpopId.id')
        const tpopNr = get(n, 'tpopByTpopId.nr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Freiwilligen-Kontrollen',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Kontrolle: ${n.jahr || n.id}`,
        }
      })
    },
  tpopfeldkontrOhneBearb: () => {
      const popNodes = get(
        data,
        'tpopfeldkontrOhneBearb.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopkontrNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', [])),
      )
      return tpopkontrNodes.map(n => {
        const popId = get(n, 'tpopByTpopId.popByPopId.id')
        const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
        const tpopId = get(n, 'tpopByTpopId.id')
        const tpopNr = get(n, 'tpopByTpopId.nr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Feld-Kontrollen',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Kontrolle: ${n.jahr || n.id}`,
        }
      })
    },
  tpopfreiwkontrOhneBearb: () => {
      const popNodes = get(
        data,
        'tpopfreiwkontrOhneBearb.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopkontrNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', [])),
      )
      return tpopkontrNodes.map(n => {
        const popId = get(n, 'tpopByTpopId.popByPopId.id')
        const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
        const tpopId = get(n, 'tpopByTpopId.id')
        const tpopNr = get(n, 'tpopByTpopId.nr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Freiwilligen-Kontrollen',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Kontrolle: ${n.jahr || n.id}`,
        }
      })
    },
  tpopfeldkontrOhneZaehlung: () => {
      const popNodes = get(
        data,
        'tpopfeldkontrOhneZaehlung.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopkontrNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', [])),
      )
      return tpopkontrNodes
        .filter(n => get(n, 'tpopkontrzaehlsByTpopkontrId.totalCount') === 0)
        .map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return {
            url: [
              'Projekte',
              projId,
              'Aktionspläne',
              apId,
              'Populationen',
              popId,
              'Teil-Populationen',
              tpopId,
              'Feld-Kontrollen',
              n.id,
            ],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
              tpopId}, Kontrolle: ${n.jahr || n.id}`,
          }
        })
    },
  tpopfreiwkontrOhneZaehlung: () => {
      const popNodes = get(
        data,
        'tpopfreiwkontrOhneZaehlung.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopkontrNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', [])),
      )
      return tpopkontrNodes
        .filter(n => get(n, 'tpopkontrzaehlsByTpopkontrId.totalCount') === 0)
        .map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return {
            url: [
              'Projekte',
              projId,
              'Aktionspläne',
              apId,
              'Populationen',
              popId,
              'Teil-Populationen',
              tpopId,
              'Freiwilligen-Kontrollen',
              n.id,
            ],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
              tpopId}, Kontrolle: ${n.jahr || n.id}`,
          }
        })
    },
  feldkontrzaehlungOhneEinheit: () => {
      const popNodes = get(
        data,
        'feldkontrzaehlungOhneEinheit.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopkontrNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', [])),
      )
      const tpopkontrzaehlNodes = flatten(
        tpopkontrNodes.map(n =>
          get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []),
        ),
      )
      return tpopkontrzaehlNodes.map(n => {
        const popId = get(
          n,
          'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id',
        )
        const popNr = get(
          n,
          'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr',
        )
        const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
        const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
        const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
        const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Feld-Kontrollen',
            tpopkontrId,
            'Zaehlungen',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${
            n.id
          }`,
        }
      })
    },
  freiwkontrzaehlungOhneEinheit: () => {
      const popNodes = get(
        data,
        'freiwkontrzaehlungOhneEinheit.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopkontrNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', [])),
      )
      const tpopkontrzaehlNodes = flatten(
        tpopkontrNodes.map(n =>
          get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []),
        ),
      )
      return tpopkontrzaehlNodes.map(n => {
        const popId = get(
          n,
          'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id',
        )
        const popNr = get(
          n,
          'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr',
        )
        const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
        const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
        const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
        const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Freiwilligen-Kontrollen',
            tpopkontrId,
            'Zaehlungen',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${
            n.id
          }`,
        }
      })
    },
  feldkontrzaehlungOhneMethode: () => {
      const popNodes = get(
        data,
        'feldkontrzaehlungOhneMethode.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopkontrNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', [])),
      )
      const tpopkontrzaehlNodes = flatten(
        tpopkontrNodes.map(n =>
          get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []),
        ),
      )
      return tpopkontrzaehlNodes.map(n => {
        const popId = get(
          n,
          'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id',
        )
        const popNr = get(
          n,
          'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr',
        )
        const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
        const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
        const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
        const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Feld-Kontrollen',
            tpopkontrId,
            'Zaehlungen',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${
            n.id
          }`,
        }
      })
    },
  freiwkontrzaehlungOhneMethode: () => {
      const popNodes = get(
        data,
        'freiwkontrzaehlungOhneMethode.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopkontrNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', [])),
      )
      const tpopkontrMitZaehlungOhneMethode = tpopkontrNodes.filter(n => {
        const anzZaehlungenMitMethode = get(
          n,
          'zaehlungenMitMethode.nodes',
          [],
        ).length
        const anzZaehlungenOhneMethode = get(
          n,
          'zaehlungenOhneMethode.nodes',
          [],
        ).length
        return anzZaehlungenMitMethode === 0 && anzZaehlungenOhneMethode > 0
      })

      return tpopkontrMitZaehlungOhneMethode.map(n => {
        const popId = get(n, 'tpopByTpopId.popByPopId.id')
        const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
        const tpopId = get(n, 'tpopByTpopId.id')
        const tpopNr = get(n, 'tpopByTpopId.nr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Freiwilligen-Kontrollen',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Kontrolle: ${n.jahr || n.id}`,
        }
      })
    },
  feldkontrzaehlungOhneAnzahl: () => {
      const popNodes = get(
        data,
        'feldkontrzaehlungOhneAnzahl.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopkontrNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', [])),
      )
      const tpopkontrzaehlNodes = flatten(
        tpopkontrNodes.map(n =>
          get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []),
        ),
      )
      return tpopkontrzaehlNodes.map(n => {
        const popId = get(
          n,
          'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id',
        )
        const popNr = get(
          n,
          'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr',
        )
        const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
        const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
        const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
        const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Feld-Kontrollen',
            tpopkontrId,
            'Zaehlungen',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${
            n.id
          }`,
        }
      })
    },
  freiwkontrzaehlungOhneAnzahl: () => {
      const popNodes = get(
        data,
        'freiwkontrzaehlungOhneAnzahl.apsByProjId.nodes[0].popsByApId.nodes',
        [],
      )
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes', [])),
      )
      const tpopkontrNodes = flatten(
        tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', [])),
      )
      const tpopkontrMitZaehlungOhneAnzahl = tpopkontrNodes.filter(n => {
        const anzZaehlungenMitAnzahl = get(n, 'zaehlungenMitAnzahl.nodes', [])
          .length
        const anzZaehlungenOhneAnzahl = get(
          n,
          'zaehlungenOhneAnzahl.nodes',
          [],
        ).length
        return anzZaehlungenMitAnzahl === 0 && anzZaehlungenOhneAnzahl > 0
      })

      return tpopkontrMitZaehlungOhneAnzahl.map(n => {
        const popId = get(n, 'tpopByTpopId.popByPopId.id')
        const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
        const tpopId = get(n, 'tpopByTpopId.id')
        const tpopNr = get(n, 'tpopByTpopId.nr')

        return {
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Freiwilligen-Kontrollen',
            n.id,
          ],
          text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr ||
            tpopId}, Kontrolle: ${n.jahr || n.id}`,
        }
      })
    },
  })