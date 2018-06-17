// @flow
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import sortBy from 'lodash/sortBy'

export default ({ data, berichtjahr }:{ data: Object, berichtjahr: Number }) => {
  const projId = get(data, 'zielOhneTyp.id')
  const apId = get(data, 'zielOhneTyp.apsByProjId.nodes[0].id')

  return ([
    // 1. Art

    // Ziel ohne Jahr/Zieltyp/Ziel
    {
      title: 'Ziel ohne Jahr:',
      messages: sortBy(
          get(data, 'zielOhneJahr.apsByProjId.nodes[0].zielsByApId.nodes', []),
          'id'
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', n.jahr, n.id],
          text: `Ziel: ${n.id}`,
        }))
    },
    {
      title: 'Ziel ohne Typ:',
      messages: sortBy(
          get(data, 'zielOhneTyp.apsByProjId.nodes[0].zielsByApId.nodes', []),
          'jahr'
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', n.jahr, n.id],
          text: `Ziel: ${n.jahr || n.id}`,
        }))
    },
    {
      title: 'Ziel ohne Ziel:',
      messages: sortBy(
          get(data, 'zielOhneZiel.apsByProjId.nodes[0].zielsByApId.nodes', []),
          'jahr'
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', n.jahr, n.id],
          text: `Ziel: ${n.jahr || n.id}`,
        }))
    },
    {
      title: 'Ziel-Bericht ohne Jahr:',
      messages: (function() {
        const zielNodes = get(data, 'zielberOhneJahr.apsByProjId.nodes[0].zielsByApId.nodes', [])
        let zielberNodes =  flatten(
          zielNodes.map(n => get(n, 'zielbersByZielId.nodes', []))
        )
        zielberNodes = sortBy(
          zielberNodes,
          (n) => [
            get(n, 'zielByZielId.jahr'),
            n.id
          ]
        )
        return zielberNodes.map(n => {
          const zielId = get(n, 'zielByZielId.id')
          const zielJahr = get(n, 'zielByZielId.jahr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', get(n, 'zielByZielId.jahr'), zielId, 'Berichte', n.id],
            text: `Ziel: ${zielJahr || zielId}, Bericht: ${n.id}`,
          })
        })
      }()),
    },
    {
      title: 'Ziel-Bericht ohne Entwicklung:',
      messages: (function() {
        const zielNodes = get(data, 'zielberOhneEntwicklung.apsByProjId.nodes[0].zielsByApId.nodes', [])
        let zielberNodes = flatten(
          zielNodes.map(n => get(n, 'zielbersByZielId.nodes', []))
        )
        zielberNodes = sortBy(
          zielberNodes,
          (n) => [
            get(n, 'zielByZielId.jahr'),
            n.id
          ]
        )
        return zielberNodes.map(n => {
          const zielId = get(n, 'zielByZielId.id')
          const zielJahr = get(n, 'zielByZielId.jahr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', get(n, 'zielByZielId.jahr'), zielId, 'Berichte', n.id],
            text: `Ziel: ${zielJahr || zielId}, Bericht: ${n.jahr || n.id}`,
          })
        })
      }()),
    },
    // AP-Erfolgskriterium ohne Beurteilung/Kriterien
    {
      title: 'Erfolgskriterium ohne Beurteilung:',
      messages: sortBy(
          get(data, 'erfkritOhneBeurteilung.apsByProjId.nodes[0].erfkritsByApId.nodes', []),
          'id'
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Erfolgskriterien', n.id],
          text: `Erfolgskriterium: ${n.id}`,
        }))
    },
    {
      title: 'Erfolgskriterium ohne Kriterien:',
      messages: sortBy(
          get(data, 'erfkritOhneKriterien.apsByProjId.nodes[0].erfkritsByApId.nodes', []),
          'id'
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Erfolgskriterien', n.id],
          text: `Erfolgskriterium: ${n.id}`,
        }))
    },
    // AP-Bericht ohne Jahr/Vergleich Vorjahr-Gesamtziel/Beurteilung
    {
      title: 'AP-Bericht ohne Jahr:',
      messages: sortBy(
          get(data, 'apberOhneJahr.apsByProjId.nodes[0].apbersByApId.nodes', []),
          'id'
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte', n.id],
          text: `AP-Bericht: ${n.id}`,
        }))
    },
    {
      title: 'AP-Bericht ohne Vergleich Vorjahr - Gesamtziel:',
      messages: sortBy(
          get(data, 'apberOhneVergleichVorjahrGesamtziel.apsByProjId.nodes[0].apbersByApId.nodes', []),
          ['jahr', 'id']
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte', n.id],
          text: `AP-Bericht: ${n.jahr || n.id}`,
        }))
    },
    {
      title: 'AP-Bericht ohne Beurteilung:',
      messages: sortBy(
          get(data, 'apberOhneBeurteilung.apsByProjId.nodes[0].apbersByApId.nodes', []),
          ['jahr', 'id']
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte', n.id],
          text: `AP-Bericht: ${n.jahr || n.id}`,
        }))
    },
    // assoziierte Art ohne Art
    {
      title: 'Assoziierte Art ohne Art:',
      messages: sortBy(
          get(data, 'assozartOhneArt.apsByProjId.nodes[0].assozartsByApId.nodes', []),
          'id'
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'assoziierte-Arten', n.id],
          text: `Assoziierte Art: ${n.id}`,
        }))
    },

    // 2. Population

    // Population: ohne Nr/Name/Status/bekannt seit/Koordinaten/tpop
    {
      title: 'Population ohne Nr.:',
      messages: sortBy(
          get(data, 'popOhneNr.apsByProjId.nodes[0].popsByApId.nodes', []),
          ['name', 'id']
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
          text: `Population: ${n.name || n.id}`,
        }))
    },
    {
      title: 'Population ohne Name:',
      messages: sortBy(
          get(data, 'popOhneName.apsByProjId.nodes[0].popsByApId.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population ohne Status:',
      messages: sortBy(
          get(data, 'popOhneStatus.apsByProjId.nodes[0].popsByApId.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population ohne "bekannt seit":',
      messages: sortBy(
          get(data, 'popOhneBekanntSeit.apsByProjId.nodes[0].popsByApId.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Mindestens eine Koordinate fehlt:',
      messages: sortBy(
          get(data, 'popOhneKoord.apsByProjId.nodes[0].popsByApId.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population ohne Teilpopulation:',
      messages: sortBy(
          get(data, 'popOhneTpop.apsByProjId.nodes[0].popsByApId.nodes', []),
          ['nr', 'id']
        )
        .filter(n => get(n, 'tpopsByPopId.totalCount') === 0)
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population mit "Status unklar", ohne Begründung:',
      messages: sortBy(
          get(data, 'popMitStatusUnklarOhneBegruendung.apsByProjId.nodes[0].popsByApId.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Die Nr. ist mehrdeutig:',
      messages: sortBy(
          get(data, 'popMitMehrdeutigerNr.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Populations-Bericht (im Berichtjahr):',
      messages: sortBy(
          get(data, 'popOhnePopber.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },

    // Bericht-Stati kontrollieren
    {
      title: 'Populationen mit Bericht "zunehmend" ohne Teil-Population mit Bericht "zunehmend":',
      messages: sortBy(
          get(data, 'popMitBerZunehmendOhneTpopberZunehmend.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Populationen mit Bericht "abnehmend" ohne Teil-Population mit Bericht "abnehmend":',
      messages: sortBy(
          get(data, 'popMitBerAbnehmendOhneTpopberAbnehmend.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Populationen mit Bericht "erloschen" ohne Teil-Population mit Bericht "erloschen":',
      messages: sortBy(
          get(data, 'popMitBerErloschenOhneTpopberErloschen.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Populationen mit Bericht "erloschen" und mindestens einer gemäss Bericht nicht erloschenen Teil-Population:',
      messages: sortBy(
          get(data, 'popMitBerErloschenUndTpopberNichtErloschen.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },

    // Stati der Population mit den Stati der Teil-Populationen vergleichen
    {
      title: 'Population: Keine Teil-Population hat den Status der Population:',
      messages: sortBy(
          get(data, 'popOhneTpopMitGleichemStatus.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "potentieller Wuchs-/Ansiedlungsort". Es gibt aber Teil-Populationen mit abweichendem Status:',
      messages: sortBy(
          get(data, 'popStatus300TpopStatusAnders.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "Ansaatversuch". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich" oder "angesiedelt, aktuell:',
      messages: sortBy(
          get(data, 'popStatus201TpopStatusUnzulaessig.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "angesiedelt nach Beginn AP, erloschen/nicht etabliert". Es gibt Teil-Populationen mit abweichendem Status:',
      messages: sortBy(
          get(data, 'popStatus202TpopStatusAnders.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "angesiedelt vor Beginn AP, erloschen/nicht etabliert". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich", "angesiedelt, aktuell", "Ansaatversuch", "potentieller Wuchsort"):',
      messages: sortBy(
          get(data, 'popStatus211TpopStatusUnzulaessig.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "angesiedelt nach Beginn AP, aktuell". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich", "angesiedelt vor Beginn AP, aktuell"):',
      messages: sortBy(
          get(data, 'popStatus200TpopStatusUnzulaessig.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "angesiedelt vor Beginn AP, aktuell". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich"):',
      messages: sortBy(
          get(data, 'popStatus210TpopStatusUnzulaessig.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "ursprünglich, erloschen". Es gibt Teil-Populationen (ausser potentiellen Wuchs-/Ansiedlungsorten) mit abweichendem Status:',
      messages: sortBy(
          get(data, 'popStatus101TpopStatusAnders.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },

    // Stati mit letztem Bericht vergleichen
    {
      title: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:',
      messages: sortBy(
          get(data, 'popStatusErloschenLetzterPopberZunehmend.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:',
      messages: sortBy(
          get(data, 'popStatusErloschenLetzterPopberStabil.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:',
      messages: sortBy(
          get(data, 'popStatusErloschenLetzterPopberAbnehmend.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:',
      messages: sortBy(
          get(data, 'popStatusErloschenLetzterPopberUnsicher.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },

    // Stati kontrollieren
    {
      title: 'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Massnahmen-Bericht (im Berichtjahr):',
      messages: sortBy(
          get(data, 'popOhnePopmassnber.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    // Population: Entsprechen Koordinaten der Pop einer der TPops?
    // TODO: seems only to output pops with koord but no tpop
    {
      title: 'Population: Koordinaten entsprechen keiner Teilpopulation:',
      messages: sortBy(
          get(data, 'popKoordEntsprechenKeinerTpop.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine aktuelle Teilpopulation oder eine ursprüngliche erloschene:',
      messages: sortBy(
          get(data, 'popStatusAnsaatversuchTpopAktuell.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "angesiedelt, Ansaatversuch", alle Teilpopulationen sind gemäss Status erloschen:',
      messages: sortBy(
          get(data, 'popStatusAnsaatversuchAlleTpopErloschen.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr}`,
        }))
    },
    {
      title: 'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine Teilpopulation mit Status "urspruenglich, erloschen:',
      messages: sortBy(
          get(data, 'popStatusAnsaatversuchMitTpopUrspruenglichErloschen.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "aktuell" (urspruenglich oder angesiedelt):',
      messages: sortBy(
          get(data, 'popStatusErloschenMitTpopAktuell.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "angesiedelt, Ansaatversuch":',
      messages: sortBy(
          get(data, 'popStatusErloschenMitTpopAnsaatversuch.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "angesiedelt", es gibt aber eine Teilpopulation mit Status "urspruenglich":',
      messages: sortBy(
          get(data, 'popStatusAngesiedeltMitTpopUrspruenglich.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    // Vergleich Pop Status mit letztem Pop-Bericht
    {
      title: 'Population: Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:',
      messages: sortBy(
          get(data, 'popStatusAktuellLetzterPopberErloschen.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "erloschen", der letzte Populations-Bericht meldet aber "aktuell":',
      messages: sortBy(
          get(data, 'popStatusErloschenLetzterPopberAktuell.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Populations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:',
      messages: sortBy(
          get(data, 'popStatusErloschenLetzterPopberErloschenMitAnsiedlung.nodes', []),
          ['nr', 'id']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
          text: `Population: ${n.nr || n.id}`,
        }))
    },
    // Pop-Bericht/Pop-Massn.-Bericht ohne Jahr/Entwicklung
    {
      title: 'Populations-Bericht ohne Jahr:',
      messages: (function() {
        const popNodes = get(data, 'popberOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
        let popberNodes = flatten(
          popNodes.map(n => get(n, 'popbersByPopId.nodes', []))
        )
        popberNodes = sortBy(
          popberNodes,
          (n) => [
            get(n, 'popByPopId.nr'),
            n.id,
          ]
        )
        return popberNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Kontroll-Berichte', n.id],
          text: `Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Bericht: ${n.id}`,
        }))
      }()),
    },
    {
      title: 'Populations-Bericht ohne Entwicklung:',
      messages: (function() {
        const popNodes = get(data, 'popberOhneEntwicklung.apsByProjId.nodes[0].popsByApId.nodes', [])
        let popberNodes = flatten(
          popNodes.map(n => get(n, 'popbersByPopId.nodes', []))
        )
        popberNodes = sortBy(
          popberNodes,
          (n) => [
            get(n, 'popByPopId.nr'),
            n.jahr,
          ]
        )
        return popberNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Kontroll-Berichte', n.id],
          text: `Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Bericht: ${n.jahr || n.id}`,
        }))
      }()),
    },
    {
      title: 'Populations-Massnahmen-Bericht ohne Jahr:',
      messages: (function() {
        const popNodes = get(data, 'popmassnberOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
        let popberNodes = flatten(
          popNodes.map(n => get(n, 'popmassnbersByPopId.nodes', []))
        )
        popberNodes = sortBy(
          popberNodes,
          (n) => [
            get(n, 'popByPopId.nr'),
            n.id,
          ]
        )
        return popberNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Massnahmen-Berichte', n.id],
          text: `Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Bericht: ${n.id}`,
        }))
      }()),
    },
    {
      title: 'Populations-Massnahmen-Bericht ohne Entwicklung:',
      messages: (function() {
        const popNodes = get(data, 'popmassnberOhneEntwicklung.apsByProjId.nodes[0].popsByApId.nodes', [])
        let popberNodes = flatten(
          popNodes.map(n => get(n, 'popmassnbersByPopId.nodes', []))
        )
        popberNodes = sortBy(
          popberNodes,
          (n) => [
            get(n, 'popByPopId.nr'),
            n.jahr,
          ]
        )
        return popberNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Massnahmen-Berichte', n.id],
          text: `Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Bericht: ${n.jahr || n.id}`,
        }))
      }()),
    },

    // 3. Teilpopulation

    // Stati mit letztem Bericht vergleichen
    {
      title: 'Teilpopulation: Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:',
      messages: sortBy(
          get(data, 'tpopStatusAktuellLetzterTpopberErloschen.nodes', []),
          ['popNr', 'nr']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: `Population: ${n.popNr}, Teil-Population: ${n.nr}`,
        }))
    },
    {
      title: 'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:',
      messages: sortBy(
          get(data, 'tpopStatusErloschenLetzterTpopberStabil.nodes', []),
          ['popNr', 'nr']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:',
      messages: sortBy(
          get(data, 'tpopStatusErloschenLetzterTpopberAbnehmend.nodes', []),
          ['popNr', 'nr']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: 'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:',
      messages: sortBy(
          get(data, 'tpopStatusErloschenLetzterTpopberUnsicher.nodes', []),
          ['popNr', 'nr']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: `Teilpopulation:
        Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort;
        der letzte Teilpopulations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:`,
      messages: sortBy(
          get(data, 'tpopStatusErloschenLetzterTpopberZunehmend.nodes', []),
          ['popNr', 'nr']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: `Teilpopulation:
        Status ist "erloschen",
        der letzte Teilpopulations-Bericht meldet aber "abnehmend", "stabil", "zunehmend" oder "unsicher":`,
      messages: sortBy(
          (data, 'tpopStatusErloschenLetzterTpopberAktuell.nodes', []),
          ['popNr', 'nr']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: `Teilpopulation:
        Status ist "erloschen" (ursprünglich oder angesiedelt);
        der letzte Teilpopulations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:`,
      messages: sortBy(
          get(data, 'tpopStatusErloschenLetzterTpopberErloschenMitAnsiedlung.nodes', []),
          ['popNr', 'nr']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`,
        }))
    },
    // tpop ohne gewollte Werte
    {
      title: 'Teilpopulation ohne Nr.:',
      messages: (function() {
        const popNodes = get(data, 'tpopOhneNr.apsByProjId.nodes[0].popsByApId.nodes', [])
        let tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        tpopNodes = sortBy(
          tpopNodes,
          (n) => [
            get(n, 'popByPopId.nr'),
            n.id
          ]
        )
        return tpopNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: `Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.id}`,
        }))
      }()),
    },
    {
      title: `Teilpopulation ohne Flurname:`,
      messages: (function() {
        const popNodes = get(data, 'tpopOhneFlurname.apsByProjId.nodes[0].popsByApId.nodes', [])
        let tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        tpopNodes = sortBy(
          tpopNodes,
          (n) => [
            get(n, 'popByPopId.nr'),
            n.id
          ]
        )
        return tpopNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: `Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`,
        }))
      }()),
    },
    {
      title: `Teilpopulation ohne Status:`,
      messages: (function() {
        const popNodes = get(data, 'tpopOhneStatus.apsByProjId.nodes[0].popsByApId.nodes', [])
        let tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        tpopNodes = sortBy(
          tpopNodes,
          (n) => [
            get(n, 'popByPopId.nr'),
            n.id
          ]
        )
        return tpopNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: `Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`,
        }))
      }()),
    },
    {
      title: `Teilpopulation ohne "bekannt seit":`,
      messages: (function() {
        const popNodes = get(data, 'tpopOhneBekanntSeit.apsByProjId.nodes[0].popsByApId.nodes', [])
        let tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        tpopNodes = sortBy(
          tpopNodes,
          (n) => [
            get(n, 'popByPopId.nr'),
            n.id
          ]
        )
        return tpopNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: `Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`,
        }))
      }()),
    },
    {
      title: `Teilpopulation ohne "Fuer AP-Bericht relevant":`,
      messages: (function() {
        const popNodes = get(data, 'tpopOhneApberRelevant.apsByProjId.nodes[0].popsByApId.nodes', [])
        let tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        tpopNodes = sortBy(
          tpopNodes,
          (n) => [
            get(n, 'popByPopId.nr'),
            n.id
          ]
        )
        return tpopNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: `Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`,
        }))
      }()),
    },
    {
      title: `Teilpopulation: Mindestens eine Koordinate fehlt:`,
      messages: (function() {
        const popNodes = get(data, 'tpopOhneKoord.apsByProjId.nodes[0].popsByApId.nodes', [])
        let tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        tpopNodes = sortBy(
          tpopNodes,
          (n) => [
            get(n, 'popByPopId.nr'),
            n.id
          ]
        )
        return tpopNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: `Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`,
        }))
      }()),
    },
    {
      title: `Teilpopulation
              mit Status "potenzieller Wuchs-/Ansiedlungsort"
              und für AP-Bericht relevant`,
      messages: (function() {
        const popNodes = get(data, 'tpopStatusPotentiellApberrelevant.apsByProjId.nodes[0].popsByApId.nodes', [])
        let tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        tpopNodes = sortBy(
          tpopNodes,
          (n) => [
            get(n, 'popByPopId.nr'),
            n.id
          ]
        )
        return tpopNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: `Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`,
        }))
      }()),
    },
    {
      title: `Teilpopulation
              erloschen,
              für AP-Bericht relevant
              aber letzte Beobachtung vor 1950:`,
      messages: sortBy(
        get(data, 'tpopErloschenUndRelevantLetzteBeobVor1950.nodes', []),
        ['popNr', 'nr']
      )
      .map(n => ({
        url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
        text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`,
      }))
    },
    {
      title: `Teilpopulation
              mit "Status unklar", ohne Begruendung:`,
      messages: (function() {
        const popNodes = get(data, 'tpopStatusUnklarOhneBegruendung.apsByProjId.nodes[0].popsByApId.nodes', [])
        let tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        tpopNodes = sortBy(
          tpopNodes,
          (n) => [
            get(n, 'popByPopId.nr'),
            n.id
          ]
        )
        return tpopNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: `Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`,
        }))
      }()),
    },
    {
      title: `Teilpopulation:
              Die Nummer ist mehrdeutig:`,
      messages: sortBy(
          get(data, 'tpopPopnrTponrMehrdeutig.nodes', []),
          ['popNr', 'nr']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: `Teilpopulation
              mit Kontrolle (im Berichtjahr)
              aber ohne Teilpopulations-Bericht (im Berichtjahr):`,
      messages: sortBy(
          get(data, 'tpopOhneTpopber.nodes', []),
          ['popNr', 'nr']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: `Teilpopulation
              mit Ansiedlung (vor dem Berichtjahr)
              und Kontrolle (im Berichtjahr)
              aber ohne Massnahmen-Bericht (im Berichtjahr):`,
      messages: sortBy(
          get(data, 'tpopOhneMassnber.nodes', []),
          ['popNr', 'nr']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: `Teilpopulation
              mit Status "Ansaatversuch",
              und in der letzten Kontrolle eine Anzahl:`,
      messages: sortBy(
          get(data, 'tpopMitStatusAnsaatversuchUndZaehlungMitAnzahl.nodes', []),
          ['popNr', 'nr']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: `Teilpopulation
              mit Status "potentieller Wuchs-/Ansiedlungsort",
              bei der in einer Kontrolle eine Anzahl festgestellt wurde:`,
      messages: sortBy(
          get(data, 'tpopMitStatusPotentiellUndZaehlungMitAnzahl.nodes', []),
          ['popNr', 'nr']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`,
        }))
    },
    {
      title: `Teilpopulation
              mit Status "potentieller Wuchs-/Ansiedlungsort"
              und Massnahme des Typs "Ansiedlung":`,
      messages: sortBy(
          get(data, 'tpopMitStatusPotentiellUndAnsiedlung.nodes', []),
          ['popNr', 'nr']
        )
        .map(n => ({
          url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
          text: `Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`,
        }))
    },
    // TPop-Bericht ohne Jahr/Entwicklung
    {
      title: `Teilpopulations-Bericht
              ohne Jahr:`,
      messages: (function() {
        const popNodes = get(data, 'tpopberOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        let tpopberNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopbersByTpopId.nodes', []))
        )
        tpopberNodes = sortBy(
          tpopberNodes,
          (n) => [
            get(n, 'tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopByTpopId.nr'),
            n.id
          ]
        )
        return tpopberNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Kontroll-Berichte', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontroll-Bericht: ${n.id}`,
          })
        })
      }()),
    },
    {
      title: `Teilpopulations-Bericht ohne Entwicklung:`,
      messages: (function() {
        const popNodes = get(data, 'tpopberOhneEntwicklung.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        let tpopberNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopbersByTpopId.nodes', []))
        )
        tpopberNodes = sortBy(
          tpopberNodes,
          (n) => [
            get(n, 'tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopByTpopId.nr'),
            n.jahr
          ]
        )
        return tpopberNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Kontroll-Berichte', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontroll-Bericht: ${n.nr || n.id}`,
          })
        })
      }()),
    },

    // 4. Massnahmen

    // Massn ohne gewollte Felder
    {
      title: `Massnahme ohne Jahr:`,
      messages: (function() {
        const popNodes = get(data, 'tpopmassnOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        let tpopmassnNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopmassnsByTpopId.nodes', []))
        )
        tpopmassnNodes = sortBy(
          tpopmassnNodes,
          (n) => [
            get(n, 'tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopByTpopId.nr'),
            n.id
          ]
        )
        return tpopmassnNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Massnahmen', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Massnahme: ${n.jahr || n.id}`,
          })
        })
      }()),
    },
    {
      title: `Massnahme ohne BearbeiterIn:`,
      messages: (function() {
        const popNodes = get(data, 'tpopmassnOhneBearb.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        let tpopmassnNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopmassnsByTpopId.nodes', []))
        )
        tpopmassnNodes = sortBy(
          tpopmassnNodes,
          (n) => [
            get(n, 'tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopByTpopId.nr'),
            n.jahr
          ]
        )
        return tpopmassnNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Massnahmen', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Massnahme: ${n.jahr || n.id}`,
          })
        })
      }()),
    },
    {
      title: `Massnahme ohne Typ:`,
      messages: (function() {
        const popNodes = get(data, 'tpopmassnOhneTyp.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        let tpopmassnNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopmassnsByTpopId.nodes', []))
        )
        tpopmassnNodes = sortBy(
          tpopmassnNodes,
          (n) => [
            get(n, 'tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopByTpopId.nr'),
            n.jahr
          ]
        )
        return tpopmassnNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Massnahmen', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Massnahme: ${n.jahr || n.id}`,
          })
        })
      }()),
    },
    // Massn.-Bericht ohne gewollte Felder
    {
      title: `Massnahmen-Bericht ohne Jahr:`,
      messages: (function() {
        const popNodes = get(data, 'tpopmassnberOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        let tpopmassnberNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopmassnbersByTpopId.nodes', []))
        )
        tpopmassnberNodes = sortBy(
          tpopmassnberNodes,
          (n) => [
            get(n, 'tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopByTpopId.nr'),
            n.id
          ]
        )
        return tpopmassnberNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Massnahmen-Berichte', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Massnahmen-Bericht: ${n.jahr || n.id}`,
          })
        })
      }()),
    },
    {
      title: `Massnahmen-Bericht ohne Entwicklung:`,
      messages: (function() {
        const popNodes = get(data, 'tpopmassnberOhneBeurteilung.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        let tpopmassnberNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopmassnbersByTpopId.nodes', []))
        )
        tpopmassnberNodes = sortBy(
          tpopmassnberNodes,
          (n) => [
            get(n, 'tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopByTpopId.nr'),
            n.jahr
          ]
        )
        return tpopmassnberNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Massnahmen-Berichte', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Massnahmen-Bericht: ${n.jahr || n.id}`,
          })
        })
      }()),
    },

    // 5. Kontrollen

    // Kontrolle ohne Jahr/Zählung/Kontrolltyp
    {
      title: `Feldkontrolle ohne Jahr:`,
      messages: (function() {
        const popNodes = get(data, 'tpopfeldkontrOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        let tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', []))
        )
        tpopkontrNodes = sortBy(
          tpopkontrNodes,
          (n) => [
            get(n, 'tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopByTpopId.nr'),
            n.id
          ]
        )
        return tpopkontrNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Feld-Kontrollen', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${n.jahr || n.id}`,
          })
        })
      }()),
    },
    {
      title: `Freiwilligen-Kontrolle ohne Jahr:`,
      messages: (function() {
        const popNodes = get(data, 'tpopfreiwkontrOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        let tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', []))
        )
        tpopkontrNodes = sortBy(
          tpopkontrNodes,
          (n) => [
            get(n, 'tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopByTpopId.nr'),
            n.id
          ]
        )
        return tpopkontrNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Freiwilligen-Kontrollen', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${n.jahr || n.id}`,
          })
        })
      }()),
    },
    {
      title: `Feldkontrolle ohne BearbeiterIn:`,
      messages: (function() {
        const popNodes = get(data, 'tpopfeldkontrOhneBearb.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        let tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', []))
        )
        tpopkontrNodes = sortBy(
          tpopkontrNodes,
          (n) => [
            get(n, 'tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopByTpopId.nr'),
            n.jahr
          ]
        )
        return tpopkontrNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Feld-Kontrollen', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${n.jahr || n.id}`,
          })
        })
      }()),
    },
    {
      title: `Freiwilligen-Kontrolle ohne BearbeiterIn:`,
      messages: (function() {
        const popNodes = get(data, 'tpopfreiwkontrOhneBearb.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        let tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', []))
        )
        tpopkontrNodes = sortBy(
          tpopkontrNodes,
          (n) => [
            get(n, 'tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopByTpopId.nr'),
            n.jahr
          ]
        )
        return tpopkontrNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Freiwilligen-Kontrollen', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${n.jahr || n.id}`,
          })
        })
      }()),
    },
    {
      title: `Feldkontrolle ohne Zählung:`,
      messages: (function() {
        const popNodes = get(data, 'tpopfeldkontrOhneZaehlung.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        let tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', []))
        )
        tpopkontrNodes = sortBy(
          tpopkontrNodes,
          (n) => [
            get(n, 'tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopByTpopId.nr'),
            n.jahr
          ]
        )
        return tpopkontrNodes
          .filter(n => get(n, 'tpopkontrzaehlsByTpopkontrId.totalCount') === 0)
          .map(n => {
            const popId = get(n, 'tpopByTpopId.popByPopId.id')
            const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
            const tpopId = get(n, 'tpopByTpopId.id')
            const tpopNr = get(n, 'tpopByTpopId.nr')
            return ({
              url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Feld-Kontrollen', n.id],
              text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${n.jahr || n.id}`,
            })
          })
      }()),
    },
    {
      title: `Freiwilligen-Kontrolle ohne Zählung:`,
      messages: (function() {
        const popNodes = get(data, 'tpopfreiwkontrOhneZaehlung.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        let tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', []))
        )
        tpopkontrNodes = sortBy(
          tpopkontrNodes,
          (n) => [
            get(n, 'tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopByTpopId.nr'),
            n.jahr
          ]
        )
        return tpopkontrNodes
          .filter(n => get(n, 'tpopkontrzaehlsByTpopkontrId.totalCount') === 0)
          .map(n => {
            const popId = get(n, 'tpopByTpopId.popByPopId.id')
            const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
            const tpopId = get(n, 'tpopByTpopId.id')
            const tpopNr = get(n, 'tpopByTpopId.nr')
            return ({
              url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Freiwilligen-Kontrollen', n.id],
              text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${n.jahr || n.id}`,
            })
          })
      }()),
    },
    // Zählung ohne gewollte Felder
    {
      title: `Zählung ohne Einheit (Feld-Kontrolle):`,
      messages: (function() {
        const popNodes = get(data, 'feldkontrzaehlungOhneEinheit.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', []))
        )
        let tpopkontrzaehlNodes = flatten(
          tpopkontrNodes.map(n => get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []))
        )
        tpopkontrzaehlNodes = sortBy(
          tpopkontrzaehlNodes,
          (n) => [
            get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr'),
            get(n, 'tpopkontrByTpopkontrId.jahr'),
            n.id
          ]
        )
        return tpopkontrzaehlNodes.map(n => {
          const popId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
          const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
          const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
          const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Feld-Kontrollen', tpopkontrId, 'Zaehlungen', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${n.id}`,
          })
        })
      }()),
    },
    {
      title: `Zählung ohne Einheit (Freiwilligen-Kontrolle):`,
      messages: (function() {
        const popNodes = get(data, 'freiwkontrzaehlungOhneEinheit.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', []))
        )
        let tpopkontrzaehlNodes = flatten(
          tpopkontrNodes.map(n => get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []))
        )
        tpopkontrzaehlNodes = sortBy(
          tpopkontrzaehlNodes,
          (n) => [
            get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr'),
            get(n, 'tpopkontrByTpopkontrId.jahr'),
            n.id
          ]
        )
        return tpopkontrzaehlNodes.map(n => {
          const popId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
          const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
          const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
          const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Freiwilligen-Kontrollen', tpopkontrId, 'Zaehlungen', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${n.id}`,
          })
        })
      }()),
    },
    {
      title: `Zählung ohne Methode (Feld-Kontrolle):`,
      messages: (function() {
        const popNodes = get(data, 'feldkontrzaehlungOhneMethode.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', []))
        )
        let tpopkontrzaehlNodes = flatten(
          tpopkontrNodes.map(n => get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []))
        )
        tpopkontrzaehlNodes = sortBy(
          tpopkontrzaehlNodes,
          (n) => [
            get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr'),
            get(n, 'tpopkontrByTpopkontrId.jahr'),
            n.id
          ]
        )
        return tpopkontrzaehlNodes.map(n => {
          const popId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
          const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
          const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
          const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Feld-Kontrollen', tpopkontrId, 'Zaehlungen', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${n.id}`,
          })
        })
      }()),
    },
    {
      title: `Zählung ohne Methode (Freiwilligen-Kontrolle):`,
      messages: (function() {
        const popNodes = get(data, 'freiwkontrzaehlungOhneMethode.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', []))
        )
        let tpopkontrzaehlNodes = flatten(
          tpopkontrNodes.map(n => get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []))
        )
        tpopkontrzaehlNodes = sortBy(
          tpopkontrzaehlNodes,
          (n) => [
            get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr'),
            get(n, 'tpopkontrByTpopkontrId.jahr'),
            n.id
          ]
        )
        return tpopkontrzaehlNodes.map(n => {
          const popId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
          const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
          const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
          const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Freiwilligen-Kontrollen', tpopkontrId, 'Zaehlungen', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${n.id}`,
          })
        })
      }()),
    },
    {
      title: `Zählung ohne Anzahl (Feld-Kontrolle):`,
      messages: (function() {
        const popNodes = get(data, 'feldkontrzaehlungOhneAnzahl.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', []))
        )
        let tpopkontrzaehlNodes = flatten(
          tpopkontrNodes.map(n => get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []))
        )
        tpopkontrzaehlNodes = sortBy(
          tpopkontrzaehlNodes,
          (n) => [
            get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr'),
            get(n, 'tpopkontrByTpopkontrId.jahr'),
            n.id
          ]
        )
        return tpopkontrzaehlNodes.map(n => {
          const popId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
          const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
          const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
          const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Feld-Kontrollen', tpopkontrId, 'Zaehlungen', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${n.id}`,
          })
        })
      }()),
    },
    {
      title: `Zählung ohne Anzahl (Freiwilligen-Kontrolle):`,
      messages: (function() {
        const popNodes = get(data, 'freiwkontrzaehlungOhneAnzahl.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes', []))
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes', []))
        )
        let tpopkontrzaehlNodes = flatten(
          tpopkontrNodes.map(n => get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []))
        )
        tpopkontrzaehlNodes = sortBy(
          tpopkontrzaehlNodes,
          (n) => [
            get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr'),
            get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr'),
            get(n, 'tpopkontrByTpopkontrId.jahr'),
            n.id
          ]
        )
        return tpopkontrzaehlNodes.map(n => {
          const popId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
          const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
          const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
          const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Freiwilligen-Kontrollen', tpopkontrId, 'Zaehlungen', n.id],
            text: `Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${n.id}`,
          })
        })
      }()),
    },
  ])
}