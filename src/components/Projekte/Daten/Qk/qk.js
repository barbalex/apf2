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
  // Ziel-Bericht ohne Jahr/Entwicklung
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
    type: 'view',
    name: 'v_qk_pop_mit_ber_erloschen_ohne_tpopber_erloschen',
    berichtjahr,
  },
  {
    type: 'view',
    name: 'v_qk_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen',
    berichtjahr,
  },

  // Stati der Population mit den Stati der Teil-Populationen vergleichen
  // Keine Teil-Population hat den Status der Population:
  {
    type: 'view',
    name: 'v_qk_pop_ohnetpopmitgleichemstatus',
  },
  // Status ist "potentieller Wuchs-/Ansiedlungsort".
  // Es gibt aber Teil-Populationen mit abweichendem Status:
  {
    type: 'view',
    name: 'v_qk_pop_status300tpopstatusanders',
  },
  // Status ist "Ansaatversuch".
  // Es gibt Teil-Populationen mit nicht zulässigen Stati
  // ("ursprünglich" oder "angesiedelt, aktuell"):
  {
    type: 'view',
    name: 'v_qk_pop_status201tpopstatusunzulaessig',
  },
  // Status ist "angesiedelt nach Beginn AP, erloschen/nicht etabliert".
  // Es gibt Teil-Populationen mit abweichendem Status:
  {
    type: 'view',
    name: 'v_qk_pop_status202tpopstatusanders',
  },
  // Status ist "angesiedelt vor Beginn AP, erloschen/nicht etabliert".
  // Es gibt Teil-Populationen mit nicht zulässigen Stati
  // ("ursprünglich", "angesiedelt, aktuell", "Ansaatversuch", "potentieller Wuchsort"):
  {
    type: 'view',
    name: 'v_qk_pop_status211tpopstatusunzulaessig',
  },
  // Status ist "angesiedelt nach Beginn AP, aktuell".
  // Es gibt Teil-Populationen mit nicht zulässigen Stati
  // ("ursprünglich", "angesiedelt vor Beginn AP, aktuell"):
  {
    type: 'view',
    name: 'v_qk_pop_status200tpopstatusunzulaessig',
  },
  // Status ist "angesiedelt vor Beginn AP, aktuell".
  // Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich"):
  {
    type: 'view',
    name: 'v_qk_pop_status210tpopstatusunzulaessig',
  },
  // Status ist "ursprünglich, erloschen".
  // Es gibt Teil-Populationen mit abweichendem Status:
  {
    type: 'view',
    name: 'v_qk_pop_status101tpopstatusanders',
  },

  // Stati mit letztem Bericht vergleichen
  // Status ist "erloschen" (ursprünglich oder angesiedelt),
  // Ansaatversuch oder potentieller Wuchsort;
  // der letzte Populations-Bericht meldet aber "zunehmend"
  // und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenletzterpopberzunehmend'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenletzterpopberstabil'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenletzterpopberabnehmend'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenletzterpopberunsicher'
  },

  // Stati kontrollieren
  // Population: ohne verlangten Pop-Massn-Bericht im Berichtjahr
  {
    type: 'function',
    name: 'qk_pop_ohne_popmassnber',
    berichtjahr
  },
  // Population: Entsprechen Koordinaten der Pop einer der TPops?
  {
    type: 'view',
    name: 'v_qk_pop_koordentsprechenkeinertpop'
  },
  // Population: Status ist ansaatversuch,
  // es gibt tpop mit status aktuell oder erloschene, die vor Beginn AP bestanden
  {
    type: 'view',
    name: 'v_qk_pop_statusansaatversuchmitaktuellentpop'
  },
  // Population: Status ist ansaatversuch, alle tpop sind gemäss Status erloschen
  {
    type: 'view',
    name: 'v_qk_pop_statusansaatversuchalletpoperloschen'
  },
  // Population: Status ist ansaatversuch, es gibt tpop mit status ursprünglich erloschen
  {
    type: 'view',
    name: 'v_qk_pop_statusansaatversuchmittpopursprerloschen',
  },
  // Population: Status ist "erloschen" (ursprünglich oder angesiedelt),
  // es gibt aber eine Teilpopulation mit Status "aktuell" (ursprünglich oder angesiedelt)
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenmittpopaktuell'
  },
  // Population: Status ist "erloschen" (ursprünglich oder angesiedelt),
  // es gibt aber eine Teilpopulation mit Status "angesiedelt, Ansaatversuch":
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenmittpopansaatversuch'
  },
  // Population: Status ist "angesiedelt", es gibt aber eine Teilpopulation mit Status "ursprünglich":
  {
    type: 'view',
    name: 'v_qk_pop_statusangesiedeltmittpopurspruenglich'
  },
  // Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_pop_statusaktuellletzterpopbererloschen'
  },
  // Population: Status ist "erloschen", der letzte Populations-Bericht meldet aber "aktuell"
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenletzterpopberaktuell'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Populations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenletzterpopbererloschenmitansiedlung',
  },
  // Pop-Bericht/Pop-Massn.-Bericht ohne Jahr/Entwicklung
  {
    type: 'view',
    name: 'v_qk_popber_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_popber_ohneentwicklung',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_popmassnber_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_popmassnber_ohneentwicklung',
    berichtjahr
  },

  // 3. Teilpopulation

  // Stati mit letztem Bericht vergleichen
  // Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort, der letzte Teilpopulations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung
  {
    type: 'view',
    name: 'v_qk_tpop_statusaktuellletztertpopbererloschen'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_tpop_statuserloschenletztertpopberstabil'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_tpop_statuserloschenletztertpopberabnehmend'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_tpop_statuserloschenletztertpopberunsicher'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_tpop_statuserloschenletztertpopberzunehmend'
  },
  // Teilpopulation: Status ist "erloschen", der letzte Teilpopulations-Bericht meldet aber "aktuell"
  // ????? popber aktuell????
  {
    type: 'view',
    name: 'v_qk_tpop_statuserloschenletzterpopberaktuell'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Teilpopulations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_tpop_statuserloschenletztertpopbererloschenmitansiedlung',
  },
  // tpop ohne Nr/Flurname/Status/bekannt seit/Koordinaten
  {
    type: 'view',
    name: 'v_qk_tpop_ohnenr'
  },
  {
    type: 'view',
    name: 'v_qk_tpop_ohneflurname'
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