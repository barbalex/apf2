// @flow
import get from 'lodash/get'
import flatten from 'lodash/flatten'
//import sortBy from 'lodash/sortBy'

export default (berichtjahr) => [
  // 1. Art

  // Ziel ohne Jahr/Zieltyp/Ziel
  {
    query: 'zielOhneJahr',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'zielOhneJahr.id')
      const apId = get(data, 'zielOhneJahr.apsByProjId.nodes[0].id')
      const zielNodes = get(data, 'zielOhneJahr.apsByProjId.nodes[0].zielsByApId.nodes', [])
      return zielNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Ziel ohne Jahr:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', n.jahr, n.id],
        text: [`Ziel (id): ${n.id}`],
      }))
    }
  },
  {
    query: 'zielOhneTyp',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'zielOhneTyp.id')
      const apId = get(data, 'zielOhneTyp.apsByProjId.nodes[0].id')
      const zielNodes = [...get(data, 'zielOhneTyp.apsByProjId.nodes[0].zielsByApId.nodes', [])]
        .sort((a, b) => a.jahr - b.jahr)
      return zielNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Ziel ohne Typ:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', n.jahr, n.id],
        text: [`Ziel (Jahr): ${n.jahr}`],
      }))
    }
  },
  {
    query: 'zielOhneZiel',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'zielOhneZiel.id')
      const apId = get(data, 'zielOhneZiel.apsByProjId.nodes[0].id')
      const zielNodes = [...get(data, 'zielOhneZiel.apsByProjId.nodes[0].zielsByApId.nodes', [])]
        .sort((a, b) => a.jahr - b.jahr)
      return zielNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Ziel ohne Ziel:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', n.jahr, n.id],
        text: [`Ziel (Jahr): ${n.jahr}`],
      }))
    }
  },
  {
    query: 'zielberOhneJahr',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'zielberOhneJahr.id')
      const apId = get(data, 'zielberOhneJahr.apsByProjId.nodes[0].id')
      const zielNodes = get(data, 'zielberOhneJahr.apsByProjId.nodes[0].zielsByApId.nodes', [])
      const zielberNodes = flatten(
        zielNodes.map(n => get(n, 'zielbersByZielId.nodes'), [])
      )
      return zielberNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Ziel-Bericht ohne Jahr:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', get(n, 'zielByZielId.jahr'), get(n, 'zielByZielId.id'), 'Berichte', n.id],
        text: [`Ziel-Bericht (id): ${n.id}`],
      }))
    }
  },
  {
    query: 'zielberOhneEntwicklung',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'zielberOhneEntwicklung.id')
      const apId = get(data, 'zielberOhneEntwicklung.apsByProjId.nodes[0].id')
      const zielNodes = get(data, 'zielberOhneEntwicklung.apsByProjId.nodes[0].zielsByApId.nodes', [])
      const zielberNodes = flatten(
        zielNodes.map(n => get(n, 'zielbersByZielId.nodes'), [])
      )
      return zielberNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Ziel-Bericht ohne Entwicklung:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', get(n, 'zielByZielId.jahr'), get(n, 'zielByZielId.id'), 'Berichte', n.id],
        text: [`Ziel-Bericht (id): ${n.id}`],
      }))
    }
  },
  // AP-Erfolgskriterium ohne Beurteilung/Kriterien
  {
    query: 'erfkritOhneBeurteilung',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'erfkritOhneBeurteilung.id')
      const apId = get(data, 'erfkritOhneBeurteilung.apsByProjId.nodes[0].id')
      const erfkritNodes = get(data, 'erfkritOhneBeurteilung.apsByProjId.nodes[0].erfkritsByApId.nodes', [])
      return erfkritNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Erfolgskriterium ohne Beurteilung:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Erfolgskriterien', n.id],
        text: [`Erfolgskriterium (id): ${n.id}`],
      }))
    }
  },
  {
    query: 'erfkritOhneKriterien',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'erfkritOhneKriterien.id')
      const apId = get(data, 'erfkritOhneKriterien.apsByProjId.nodes[0].id')
      const erfkritNodes = get(data, 'erfkritOhneKriterien.apsByProjId.nodes[0].erfkritsByApId.nodes', [])
      return erfkritNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Erfolgskriterium ohne Kriterien:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Erfolgskriterien', n.id],
        text: [`Erfolgskriterium (id): ${n.id}`],
      }))
    }
  },
  // AP-Bericht ohne Jahr/Vergleich Vorjahr-Gesamtziel/Beurteilung
  {
    query: 'apberOhneJahr',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'apberOhneJahr.id')
      const apId = get(data, 'apberOhneJahr.apsByProjId.nodes[0].id')
      const erfkritNodes = get(data, 'apberOhneJahr.apsByProjId.nodes[0].apbersByApId.nodes', [])
      return erfkritNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'AP-Bericht ohne Jahr:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte', n.id],
        text: [`AP-Bericht (id): ${n.id}`],
      }))
    }
  },
  {
    query: 'apberOhneVergleichVorjahrGesamtziel',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'apberOhneVergleichVorjahrGesamtziel.id')
      const apId = get(data, 'apberOhneVergleichVorjahrGesamtziel.apsByProjId.nodes[0].id')
      const erfkritNodes = get(data, 'apberOhneVergleichVorjahrGesamtziel.apsByProjId.nodes[0].apbersByApId.nodes', [])
      return erfkritNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'AP-Bericht ohne Vergleich Vorjahr - Gesamtziel:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte', n.id],
        text: [`AP-Bericht (id): ${n.id}`],
      }))
    }
  },
  {
    query: 'apberOhneBeurteilung',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'apberOhneBeurteilung.id')
      const apId = get(data, 'apberOhneBeurteilung.apsByProjId.nodes[0].id')
      const erfkritNodes = get(data, 'apberOhneBeurteilung.apsByProjId.nodes[0].apbersByApId.nodes', [])
      return erfkritNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'AP-Bericht ohne Beurteilung:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte', n.id],
        text: [`AP-Bericht (id): ${n.id}`],
      }))
    }
  },
  // assoziierte Art ohne Art
  {
    query: 'assozartOhneArt',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'assozartOhneArt.id')
      const apId = get(data, 'assozartOhneArt.apsByProjId.nodes[0].id')
      const nodes = get(data, 'assozartOhneArt.apsByProjId.nodes[0].assozartsByApId.nodes', [])
      return nodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Assoziierte Art ohne Art:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'assoziierte-Arten', n.id],
        text: [`Assoziierte Art (id): ${n.id}`],
      }))
    }
  },

  // 2. Population

  // Population: ohne Nr/Name/Status/bekannt seit/Koordinaten/tpop
  {
    query: 'popOhneNr',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'popOhneNr.id')
      const apId = get(data, 'popOhneNr.apsByProjId.nodes[0].id')
      const nodes = get(data, 'popOhneNr.apsByProjId.nodes[0].popsByApId.nodes', [])
      return nodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Population ohne Nr.:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
        text: [`Population (Name): ${n.name}`],
      }))
    }
  },
  {
    query: 'popOhneName',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'popOhneName.id')
      const apId = get(data, 'popOhneName.apsByProjId.nodes[0].id')
      const nodes = [...get(data, 'popOhneName.apsByProjId.nodes[0].popsByApId.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Population ohne Name:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
        text: [`Population (Nr.): ${n.nr}`],
      }))
    }
  },
  {
    query: 'popOhneStatus',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'popOhneStatus.id')
      const apId = get(data, 'popOhneStatus.apsByProjId.nodes[0].id')
      const nodes = [...get(data, 'popOhneStatus.apsByProjId.nodes[0].popsByApId.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Population ohne Status:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
        text: [`Population (Nr.): ${n.nr}`],
      }))
    }
  },
  {
    query: 'popOhneBekanntSeit',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'popOhneBekanntSeit.id')
      const apId = get(data, 'popOhneBekanntSeit.apsByProjId.nodes[0].id')
      const nodes = [...get(data, 'popOhneBekanntSeit.apsByProjId.nodes[0].popsByApId.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Population ohne "bekannt seit":',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
        text: [`Population (Nr.): ${n.nr}`],
      }))
    }
  },
  {
    query: 'popOhneKoord',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'popOhneKoord.id')
      const apId = get(data, 'popOhneKoord.apsByProjId.nodes[0].id')
      const nodes = [...get(data, 'popOhneKoord.apsByProjId.nodes[0].popsByApId.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Population: Mindestens eine Koordinate fehlt:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
        text: [`Population (Nr.): ${n.nr}`],
      }))
    }
  },
  {
    query: 'popOhneTpop',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'popOhneTpop.id')
      const apId = get(data, 'popOhneTpop.apsByProjId.nodes[0].id')
      const nodes = [...get(data, 'popOhneTpop.apsByProjId.nodes[0].popsByApId.nodes', [])]
        .filter(n => get(n, 'tpopsByPopId.totalCount') === 0)
        .sort((a, b) => a.nr - b.nr)
      return nodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Population ohne Teilpopulation:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
        text: [`Population (Nr.): ${n.nr}`],
      }))
    }
  },
  {
    query: 'popMitStatusUnklarOhneBegruendung',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'popMitStatusUnklarOhneBegruendung.id')
      const apId = get(data, 'popMitStatusUnklarOhneBegruendung.apsByProjId.nodes[0].id')
      const nodes = [...get(data, 'popMitStatusUnklarOhneBegruendung.apsByProjId.nodes[0].popsByApId.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Population mit "Status unklar", ohne Begründung:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
        text: [`Population (Nr.): ${n.nr}`],
      }))
    }
  },
  {
    query: 'popMitMehrdeutigerNr',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popMitMehrdeutigerNr.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Die Nr. ist mehrdeutig:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popOhnePopber',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popOhnePopber.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Populations-Bericht (im Berichtjahr):',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },

  // Bericht-Stati kontrollieren
  {
    query: 'popMitBerZunehmendOhneTpopberZunehmend',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popMitBerZunehmendOhneTpopberZunehmend.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Populationen mit Bericht "zunehmend" ohne Teil-Population mit Bericht "zunehmend":',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popMitBerAbnehmendOhneTpopberAbnehmend',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popMitBerAbnehmendOhneTpopberAbnehmend.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Populationen mit Bericht "abnehmend" ohne Teil-Population mit Bericht "abnehmend":',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popMitBerErloschenOhneTpopberErloschen',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popMitBerErloschenOhneTpopberErloschen.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Populationen mit Bericht "erloschen" ohne Teil-Population mit Bericht "erloschen":',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popMitBerErloschenUndTpopberNichtErloschen',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popMitBerErloschenUndTpopberNichtErloschen.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Populationen mit Bericht "erloschen" und mindestens einer gemäss Bericht nicht erloschenen Teil-Population:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },

  // Stati der Population mit den Stati der Teil-Populationen vergleichen
  // Keine Teil-Population hat den Status der Population:
  {
    query: 'popOhneTpopMitGleichemStatus',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popOhneTpopMitGleichemStatus.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Keine Teil-Population hat den Status der Population:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatus300TpopStatusAnders',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatus300TpopStatusAnders.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "potentieller Wuchs-/Ansiedlungsort". Es gibt aber Teil-Populationen mit abweichendem Status:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatus201TpopStatusUnzulaessig',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatus201TpopStatusUnzulaessig.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "Ansaatversuch". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich" oder "angesiedelt, aktuell"):',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatus202TpopStatusAnders',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatus202TpopStatusAnders.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "angesiedelt nach Beginn AP, erloschen/nicht etabliert". Es gibt Teil-Populationen mit abweichendem Status:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatus211TpopStatusUnzulaessig',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatus211TpopStatusUnzulaessig.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "angesiedelt vor Beginn AP, erloschen/nicht etabliert". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich", "angesiedelt, aktuell", "Ansaatversuch", "potentieller Wuchsort"):',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatus200TpopStatusUnzulaessig',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatus200TpopStatusUnzulaessig.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "angesiedelt nach Beginn AP, aktuell". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich", "angesiedelt vor Beginn AP, aktuell"):',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatus210TpopStatusUnzulaessig',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatus210TpopStatusUnzulaessig.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "angesiedelt vor Beginn AP, aktuell". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich"):',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatus101TpopStatusAnders',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatus101TpopStatusAnders.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "ursprünglich, erloschen". Es gibt Teil-Populationen (ausser potentiellen Wuchs-/Ansiedlungsorten) mit abweichendem Status:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },

  // Stati mit letztem Bericht vergleichen
  {
    query: 'popStatusErloschenLetzterPopberZunehmend',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatusErloschenLetzterPopberZunehmend.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatusErloschenLetzterPopberStabil',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatusErloschenLetzterPopberStabil.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatusErloschenLetzterPopberAbnehmend',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatusErloschenLetzterPopberAbnehmend.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatusErloschenLetzterPopberUnsicher',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatusErloschenLetzterPopberUnsicher.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },

  // Stati kontrollieren
  {
    query: 'popOhnePopmassnber',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popOhnePopmassnber.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Massnahmen-Bericht (im Berichtjahr):',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  // Population: Entsprechen Koordinaten der Pop einer der TPops?
  // TODO: seems only to output pops with koord but no tpop
  {
    query: 'popKoordEntsprechenKeinerTpop',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popKoordEntsprechenKeinerTpop.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      //console.log({data,nodes})
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Koordinaten entsprechen keiner Teilpopulation:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatusAnsaatversuchTpopAktuell',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatusAnsaatversuchTpopAktuell.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine aktuelle Teilpopulation oder eine ursprüngliche erloschene:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatusAnsaatversuchAlleTpopErloschen',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatusAnsaatversuchAlleTpopErloschen.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "angesiedelt, Ansaatversuch", alle Teilpopulationen sind gemäss Status erloschen:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatusAnsaatversuchMitTpopUrspruenglichErloschen',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatusAnsaatversuchMitTpopUrspruenglichErloschen.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine Teilpopulation mit Status "urspruenglich, erloschen:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatusErloschenMitTpopAktuell',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatusErloschenMitTpopAktuell.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "aktuell" (urspruenglich oder angesiedelt):',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatusErloschenMitTpopAnsaatversuch',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatusErloschenMitTpopAnsaatversuch.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "angesiedelt, Ansaatversuch":',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatusAngesiedeltMitTpopUrspruenglich',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatusAngesiedeltMitTpopUrspruenglich.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "angesiedelt", es gibt aber eine Teilpopulation mit Status "urspruenglich":',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  // Vergleich Pop Status mit letztem Pop-Bericht
  {
    query: 'popStatusAktuellLetzterPopberErloschen',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatusAktuellLetzterPopberErloschen.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatusErloschenLetzterPopberAktuell',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatusErloschenLetzterPopberAktuell.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "erloschen", der letzte Populations-Bericht meldet aber "aktuell":',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'popStatusErloschenLetzterPopberErloschenMitAnsiedlung',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'popStatusErloschenLetzterPopberErloschenMitAnsiedlung.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Populations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
    }
  },
  // Pop-Bericht/Pop-Massn.-Bericht ohne Jahr/Entwicklung
  {
    query: 'popberOhneJahr',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'popberOhneJahr.id')
      const apId = get(data, 'popberOhneJahr.apsByProjId.nodes[0].id')
      const popNodes = get(data, 'popberOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
      const popberNodes = flatten(
        popNodes.map(n => get(n, 'popbersByPopId.nodes'), [])
      )
      return popberNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Populations-Bericht ohne Jahr:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Kontroll-Berichte', n.id],
        text: [`Population (Nr.): ${get(n, 'popByPopId.nr')}, Populations-Bericht (id): ${n.id}`],
      }))
    }
  },
  {
    query: 'popberOhneEntwicklung',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'popberOhneEntwicklung.id')
      const apId = get(data, 'popberOhneEntwicklung.apsByProjId.nodes[0].id')
      const popNodes = get(data, 'popberOhneEntwicklung.apsByProjId.nodes[0].popsByApId.nodes', [])
      const popberNodes = flatten(
        popNodes.map(n => get(n, 'popbersByPopId.nodes'), [])
      )
      return popberNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Populations-Bericht ohne Entwicklung:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Kontroll-Berichte', n.id],
        text: [`Population (Nr.): ${get(n, 'popByPopId.nr')}, Populations-Bericht (id): ${n.id}`],
      }))
    }
  },
  {
    query: 'popmassnberOhneJahr',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'popmassnberOhneJahr.id')
      const apId = get(data, 'popmassnberOhneJahr.apsByProjId.nodes[0].id')
      const popNodes = get(data, 'popmassnberOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
      const popberNodes = flatten(
        popNodes.map(n => get(n, 'popmassnbersByPopId.nodes'), [])
      )
      return popberNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Populations-Massnahmen-Bericht ohne Jahr:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Massnahmen-Berichte', n.id],
        text: [`Population (Nr.): ${get(n, 'popByPopId.nr')}, Populations-Massnahmen-Bericht (id): ${n.id}`],
      }))
    }
  },
  {
    query: 'popmassnberOhneEntwicklung',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'popmassnberOhneEntwicklung.id')
      const apId = get(data, 'popmassnberOhneEntwicklung.apsByProjId.nodes[0].id')
      const popNodes = get(data, 'popmassnberOhneEntwicklung.apsByProjId.nodes[0].popsByApId.nodes', [])
      const popberNodes = flatten(
        popNodes.map(n => get(n, 'popmassnbersByPopId.nodes'), [])
      )
      return popberNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Populations-Massnahmen-Bericht ohne Entwicklung:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Massnahmen-Berichte', n.id],
        text: [`Population (Nr.): ${get(n, 'popByPopId.nr')}, Populations-Massnahmen-Bericht (id): ${n.id}`],
      }))
    }
  },

  // 3. Teilpopulation

  // Stati mit letztem Bericht vergleichen
  {
    query: 'tpopStatusAktuellLetzterTpopberErloschen',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'tpopStatusAktuellLetzterTpopberErloschen.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Teilpopulation: Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: [`Population (Nr.): ${n.popNr}, Teil-Population (Nr.): ${n.nr}`],
        }))
    }
  },
  {
    query: 'tpopStatusErloschenLetzterTpopberStabil',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'tpopStatusErloschenLetzterTpopberStabil.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
        }))
    }
  },
  {
    query: 'tpopStatusErloschenLetzterTpopberAbnehmend',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'tpopStatusErloschenLetzterTpopberAbnehmend.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
        }))
    }
  },
  {
    query: 'tpopStatusErloschenLetzterTpopberUnsicher',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'tpopStatusErloschenLetzterTpopberUnsicher.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
        }))
    }
  },
  {
    query: 'tpopStatusErloschenLetzterTpopberZunehmend',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'tpopStatusErloschenLetzterTpopberZunehmend.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
        }))
    }
  },
  {
    query: 'tpopStatusErloschenLetzterTpopberAktuell',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'tpopStatusErloschenLetzterTpopberAktuell.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Teilpopulation: Status ist "erloschen", der letzte Teilpopulations-Bericht meldet aber "abnehmend", "stabil", "zunehmend" oder "unsicher":',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
        }))
    }
  },
  {
    query: 'tpopStatusErloschenLetzterTpopberErloschenMitAnsiedlung',
    type: 'query',
    data: (data) => {
      const nodes = [...get(data, 'tpopStatusErloschenLetzterTpopberErloschenMitAnsiedlung.nodes', [])]
        .sort((a, b) => a.nr - b.nr)
      return nodes
        .map(n => ({
          proj_id: n.projId,
          ap_id: n.apId,
          hw: 'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Teilpopulations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:',
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
        }))
    }
  },
  // tpop ohne gewollte Werte
  {
    query: 'tpopOhneNr',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'tpopOhneNr.id')
      const apId = get(data, 'tpopOhneNr.apsByProjId.nodes[0].id')
      const popNodes = get(data, 'tpopOhneNr.apsByProjId.nodes[0].popsByApId.nodes', [])
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
      )
      return tpopNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Teilpopulation ohne Nr.:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
        text: [`Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.id}`],
      }))
    }
  },
  {
    query: 'tpopOhneNr',
    type: 'query',
    data: (data) => {
      const projId = get(data, 'tpopOhneNr.id')
      const apId = get(data, 'tpopOhneNr.apsByProjId.nodes[0].id')
      const popNodes = get(data, 'tpopOhneNr.apsByProjId.nodes[0].popsByApId.nodes', [])
      const tpopNodes = flatten(
        popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
      )
      return tpopNodes.map(n => ({
        proj_id: projId,
        ap_id: apId,
        hw: 'Teilpopulation ohne Flurname:',
        url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
        text: [`Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`],
      }))
    }
  },
  {
    type: 'view',
    name: 'v_qk_tpop_ohnestatus'
  },
  {
    type: 'view',
    name: 'v_qk_tpop_ohnebekanntseit'
  },
  {
    type: 'view',
    name: 'v_qk_tpop_ohneapberrelevant'
  },
  {
    type: 'view',
    name: 'v_qk_tpop_ohnekoordinaten'
  },
  // tpop relevant, die nicht relevant sein sollten
  {
    type: 'view',
    name: 'v_qk_tpop_statuspotentiellfuerapberrelevant'
  },
  {
    type: 'view',
    name: 'v_qk_tpop_erloschenundrelevantaberletztebeobvor1950',
  },
  // tpop mit Status unklar ohne Begründung
  {
    type: 'view',
    name: 'v_qk_tpop_mitstatusunklarohnebegruendung'
  },
  // tpop mit mehrdeutiger Kombination von pop_nr und tpop_nr
  {
    type: 'view',
    name: 'v_qk_tpop_popnrtpopnrmehrdeutig'
  },
  // TPop ohne verlangten TPop-Bericht im Berichtjahr
  {
    type: 'function',
    name: 'qk_tpop_ohne_tpopber',
    berichtjahr
  },
  // TPop ohne verlangten TPop-Massn.-Bericht im Berichtjahr
  {
    type: 'function',
    name: 'qk_tpop_ohne_massnber',
    berichtjahr
  },
  // Teilpopulation mit Status "Ansaatversuch", bei denen in einer Kontrolle eine Anzahl festgestellt wurde:
  {
    type: 'view',
    name: 'v_qk_tpop_mitstatusansaatversuchundzaehlungmitanzahl',
  },
  // Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort",
  // bei der eine Massnahme des Typs "Ansiedlung" existiert:
  {
    type: 'view',
    name: 'v_qk_tpop_mitstatuspotentiellundmassnansiedlung'
  },
  // TPop-Bericht ohne Jahr/Entwicklung
  {
    type: 'view',
    name: 'v_qk_tpopber_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_tpopber_ohneentwicklung',
    berichtjahr
  },

  // 4. Massnahmen

  // Massn ohne Jahr/Typ
  {
    type: 'view',
    name: 'v_qk_massn_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_massn_ohnebearb'
  },
  {
    type: 'view',
    name: 'v_qk_massn_ohnetyp',
    berichtjahr
  },
  // Massn.-Bericht ohne Jahr/Entwicklung
  {
    type: 'view',
    name: 'v_qk_massnber_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_massnber_ohneerfbeurt',
    berichtjahr
  },

  // 5. Kontrollen

  // Kontrolle ohne Jahr/Zählung/Kontrolltyp
  {
    type: 'view',
    name: 'v_qk_feldkontr_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_freiwkontr_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_feldkontr_ohnebearb'
  },
  {
    type: 'view',
    name: 'v_qk_freiwkontr_ohnebearb'
  },
  {
    type: 'view',
    name: 'v_qk_feldkontr_ohnezaehlung',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_freiwkontr_ohnezaehlung',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_feldkontr_ohnetyp',
    berichtjahr
  },
  // Zählung ohne Einheit/Methode/Anzahl
  {
    type: 'view',
    name: 'v_qk_feldkontrzaehlung_ohneeinheit',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_freiwkontrzaehlung_ohneeinheit',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_feldkontrzaehlung_ohnemethode',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_freiwkontrzaehlung_ohnemethode',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_feldkontrzaehlung_ohneanzahl',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_freiwkontrzaehlung_ohneanzahl',
    berichtjahr
  },
]