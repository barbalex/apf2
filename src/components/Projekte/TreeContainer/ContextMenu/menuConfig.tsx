import type { ReactNode } from 'react'

import type { Copying, Moving } from '../../../../store/index.ts'

import styles from './TreeContextMenu.module.css'

// state the menu items depend on, resolved once per render in TreeContextMenu
export interface MenuContext {
  // !userIsReadOnly(userToken)
  mayWrite: boolean
  // !userIsReadOnly(userToken, true): freiwillig users may write freiwkontr menus
  mayWriteFreiw: boolean
  moving: Moving
  copying: Copying
  copyingBiotop: { id: string | null; label: string | null }
  beobZugeordnetLayerIsActive: boolean
}

export interface TreeMenuItem {
  label: ReactNode | ((ctx: MenuContext) => ReactNode)
  // key of the actions map in useRunMenuAction
  action: string
  // table for actions that need one (insert, delete, markForMoving, ...)
  table?: string
  // table for actions toggling apflora map layers
  actionTable?: string
  // item is only shown when this returns true
  when?: (ctx: MenuContext) => boolean
}

export interface TreeMenuConfig {
  title: string
  // widen the menu when the title is longer than the widest item
  titleWidth?: number
  items: TreeMenuItem[]
}

const matchesTable = (
  tables: string | string[],
  table: string | null,
): boolean =>
  !!table && (Array.isArray(tables) ? tables.includes(table) : tables === table)

const openLowerNodes: TreeMenuItem = {
  label: 'alle öffnen',
  action: 'openLowerNodes',
}
const closeLowerNodes: TreeMenuItem = {
  label: 'alle schliessen',
  action: 'closeLowerNodes',
}
const insert = (table: string, label: string): TreeMenuItem => ({
  label,
  action: 'insert',
  table,
})
const remove = (table: string): TreeMenuItem => ({
  label: 'lösche',
  action: 'delete',
  table,
})
const moveHere = (tables: string | string[]): TreeMenuItem => ({
  label: (ctx) => `verschiebe '${ctx.moving.label}' hierhin`,
  action: 'move',
  when: (ctx) => matchesTable(tables, ctx.moving.table),
})
const copyHere = (tables: string | string[]): TreeMenuItem => ({
  label: (ctx) => `kopiere '${ctx.copying.label}' hierhin`,
  action: 'copy',
  when: (ctx) => matchesTable(tables, ctx.copying.table),
})
// with tables: shown while a dataset of one of these tables is being copied;
// without: shown while anything is being copied
const resetCopying = (tables?: string | string[]): TreeMenuItem => ({
  label: 'Kopieren aufheben',
  action: 'resetCopying',
  when: (ctx) =>
    !!ctx.copying.table &&
    (tables === undefined || matchesTable(tables, ctx.copying.table)),
})
const showCoordOfBeobOnMapsZhCh: TreeMenuItem = {
  label: 'Zeige auf maps.zh.ch',
  action: 'showCoordOfBeobOnMapsZhCh',
}
const showCoordOfBeobOnMapGeoAdminCh: TreeMenuItem = {
  label: 'Zeige auf map.geo.admin.ch',
  action: 'showCoordOfBeobOnMapGeoAdminCh',
}
const createNewPopFromBeob: TreeMenuItem = {
  label: (
    <>
      neue Population und Teil-Population gründen
      <br />
      <span className={styles.secondLine}>
        und Beobachtung der Teil-Population zuordnen
      </span>
    </>
  ),
  action: 'createNewPopFromBeob',
}
const createNewTpopFromBeob: TreeMenuItem = {
  label: (
    <>
      neue Teil-Population in bestehender Population gründen
      <br />
      <span className={styles.secondLine}>
        und Beobachtung der Teil-Population zuordnen
      </span>
    </>
  ),
  action: 'createNewTpopFromBeob',
}

// kontr tables may be moved/copied onto a tpop node
const kontrTables = ['tpopmassn', 'tpopfeldkontr', 'tpopfreiwkontr']

export const treeMenuConfigs: Record<string, TreeMenuConfig> = {
  projekt: {
    title: 'Projekt',
    items: [closeLowerNodes],
  },
  adresse: {
    title: 'Adresse',
    items: [insert('adresse', 'erstelle neue'), remove('adresse')],
  },
  adresseFolder: {
    title: 'Adressen',
    items: [closeLowerNodes, insert('adresse', 'erstelle neue')],
  },
  ap: {
    title: 'Art',
    items: [
      closeLowerNodes,
      {
        ...insert('ap', 'erstelle neue'),
        when: (ctx) => ctx.mayWrite,
      },
      { ...remove('ap'), when: (ctx) => ctx.mayWrite },
      // shown even for read-only users, as in the previous menu
      moveHere('pop'),
    ],
  },
  apFolder: {
    title: 'Art',
    items: [
      closeLowerNodes,
      { ...insert('ap', 'erstelle neuen'), when: (ctx) => ctx.mayWrite },
    ],
  },
  apart: {
    title: 'Taxon',
    items: [
      { ...insert('apart', 'erstelle neue'), when: (ctx) => ctx.mayWrite },
      { ...remove('apart'), when: (ctx) => ctx.mayWrite },
    ],
  },
  apartFolder: {
    title: 'Taxa',
    items: [{ ...insert('apart', 'erstelle neue'), when: (ctx) => ctx.mayWrite }],
  },
  apber: {
    title: 'AP-Bericht',
    items: [
      { ...insert('apber', 'erstelle neuen'), when: (ctx) => ctx.mayWrite },
      { ...remove('apber'), when: (ctx) => ctx.mayWrite },
    ],
  },
  apberFolder: {
    title: 'AP-Bericht',
    items: [{ ...insert('apber', 'erstelle neuen'), when: (ctx) => ctx.mayWrite }],
  },
  apberuebersicht: {
    title: 'AP-Bericht',
    items: [
      {
        ...insert('apberuebersicht', 'erstelle neuen'),
        when: (ctx) => ctx.mayWrite,
      },
      { ...remove('apberuebersicht'), when: (ctx) => ctx.mayWrite },
    ],
  },
  apberuebersichtFolder: {
    title: 'AP-Bericht',
    items: [
      {
        ...insert('apberuebersicht', 'erstelle neuen'),
        when: (ctx) => ctx.mayWrite,
      },
    ],
  },
  assozart: {
    title: 'assoziierte Art',
    items: [
      { ...insert('assozart', 'erstelle neue'), when: (ctx) => ctx.mayWrite },
      { ...remove('assozart'), when: (ctx) => ctx.mayWrite },
    ],
  },
  assozartFolder: {
    title: 'assoziierte Art',
    items: [
      { ...insert('assozart', 'erstelle neue'), when: (ctx) => ctx.mayWrite },
    ],
  },
  beobNichtZuzuordnen: {
    title: 'Beobachtung',
    items: [
      { ...createNewPopFromBeob, when: (ctx) => ctx.mayWrite },
      { ...createNewTpopFromBeob, when: (ctx) => ctx.mayWrite },
      showCoordOfBeobOnMapsZhCh,
      showCoordOfBeobOnMapGeoAdminCh,
    ],
  },
  beobNichtBeurteilt: {
    title: 'Beobachtung',
    items: [
      { ...createNewPopFromBeob, when: (ctx) => ctx.mayWrite },
      { ...createNewTpopFromBeob, when: (ctx) => ctx.mayWrite },
      showCoordOfBeobOnMapsZhCh,
      showCoordOfBeobOnMapGeoAdminCh,
    ],
  },
  beobZugeordnet: {
    title: 'Beobachtung',
    items: [
      {
        label: 'Koordinaten auf die Teilpopulation übertragen',
        action: 'copyBeobZugeordnetKoordToTpop',
        when: (ctx) => ctx.mayWrite,
      },
      showCoordOfBeobOnMapsZhCh,
      showCoordOfBeobOnMapGeoAdminCh,
    ],
  },
  beobZugeordnetFolder: {
    title: 'Beobachtungen',
    items: [
      {
        label: (ctx) =>
          `blende auf Karte ${
            ctx.beobZugeordnetLayerIsActive ? 'aus' : 'ein'
          }`,
        action: 'showBeobOnMap',
        actionTable: 'beobZugeordnet',
      },
    ],
  },
  ekAbrechnungstypWerte: {
    title: 'EK-Abrechnungstyp',
    items: [
      insert('ek_abrechnungstyp_werte', 'erstelle neue'),
      remove('ek_abrechnungstyp_werte'),
    ],
  },
  ekAbrechnungstypWerteFolder: {
    title: 'EK-Abrechnungstyp',
    items: [insert('ek_abrechnungstyp_werte', 'erstelle neue')],
  },
  ekfrequenz: {
    title: 'EK-Frequenz',
    items: [
      { ...insert('ekfrequenz', 'erstelle neue'), when: (ctx) => ctx.mayWrite },
      { ...remove('ekfrequenz'), when: (ctx) => ctx.mayWrite },
    ],
  },
  ekfrequenzFolder: {
    title: 'EK-Frequenz',
    items: [
      { ...insert('ekfrequenz', 'erstelle neue'), when: (ctx) => ctx.mayWrite },
      {
        label: 'aus anderer Art kopieren',
        action: 'openChooseApToCopyEkfrequenzsFrom',
        when: (ctx) => ctx.mayWrite,
      },
    ],
  },
  ekzaehleinheit: {
    title: 'EK-Zähleinheit',
    items: [
      {
        ...insert('ekzaehleinheit', 'erstelle neue'),
        when: (ctx) => ctx.mayWrite,
      },
      { ...remove('ekzaehleinheit'), when: (ctx) => ctx.mayWrite },
    ],
  },
  ekzaehleinheitFolder: {
    title: 'EK-Zähleinheit',
    items: [
      { ...insert('ekzaehleinheit', 'erstelle neue'), when: (ctx) => ctx.mayWrite },
    ],
  },
  erfkrit: {
    title: 'AP-Erfolgskriterium',
    items: [
      { ...insert('erfkrit', 'erstelle neues'), when: (ctx) => ctx.mayWrite },
      { ...remove('erfkrit'), when: (ctx) => ctx.mayWrite },
    ],
  },
  erfkritFolder: {
    title: 'AP-Erfolgskriterien',
    items: [
      { ...insert('erfkrit', 'erstelle neues'), when: (ctx) => ctx.mayWrite },
      {
        label: 'aus anderer Art kopieren',
        action: 'openChooseApToCopyErfkritsFrom',
        when: (ctx) => ctx.mayWrite,
      },
    ],
  },
  pop: {
    title: 'Population',
    items: [
      openLowerNodes,
      closeLowerNodes,
      { ...insert('pop', 'erstelle neue'), when: (ctx) => ctx.mayWrite },
      { ...remove('pop'), when: (ctx) => ctx.mayWrite },
      {
        label: 'verschiebe',
        action: 'markForMoving',
        table: 'pop',
        when: (ctx) => ctx.mayWrite,
      },
      {
        ...moveHere('tpop'),
        when: (ctx) => ctx.mayWrite && matchesTable('tpop', ctx.moving.table),
      },
      {
        label: 'kopiere',
        action: 'markForCopying',
        table: 'pop',
        when: (ctx) => ctx.mayWrite,
      },
      {
        label: 'kopiere inklusive Teilpopulationen',
        action: 'markForCopyingWithNextLevel',
        table: 'pop',
        when: (ctx) => ctx.mayWrite,
      },
      {
        ...copyHere('tpop'),
        when: (ctx) => ctx.mayWrite && matchesTable('tpop', ctx.copying.table),
      },
      {
        ...resetCopying('tpop'),
        when: (ctx) => ctx.mayWrite && matchesTable('tpop', ctx.copying.table),
      },
    ],
  },
  popFolder: {
    title: 'Populationen',
    items: [
      openLowerNodes,
      closeLowerNodes,
      { ...insert('pop', 'erstelle neue'), when: (ctx) => ctx.mayWrite },
      {
        ...moveHere('pop'),
        when: (ctx) => ctx.mayWrite && matchesTable('pop', ctx.moving.table),
      },
      {
        ...copyHere('pop'),
        when: (ctx) => ctx.mayWrite && matchesTable('pop', ctx.copying.table),
      },
      {
        ...resetCopying('pop'),
        when: (ctx) => ctx.mayWrite && matchesTable('pop', ctx.copying.table),
      },
    ],
  },
  popber: {
    title: 'Kontroll-Bericht',
    items: [
      { ...insert('popber', 'erstelle neuen'), when: (ctx) => ctx.mayWrite },
      { ...remove('popber'), when: (ctx) => ctx.mayWrite },
    ],
  },
  popberFolder: {
    title: 'Kontroll-Berichte',
    items: [{ ...insert('popber', 'erstelle neuen'), when: (ctx) => ctx.mayWrite }],
  },
  popmassnber: {
    title: 'Massnahmen-Bericht',
    items: [
      { ...insert('popmassnber', 'erstelle neuen'), when: (ctx) => ctx.mayWrite },
      { ...remove('popmassnber'), when: (ctx) => ctx.mayWrite },
    ],
  },
  popmassnberFolder: {
    title: 'Massnahmen-Berichte',
    items: [
      { ...insert('popmassnber', 'erstelle neuen'), when: (ctx) => ctx.mayWrite },
    ],
  },
  tpop: {
    title: 'Teil-Population',
    items: [
      openLowerNodes,
      closeLowerNodes,
      { ...insert('tpop', 'erstelle neue'), when: (ctx) => ctx.mayWrite },
      {
        label: 'lösche',
        action: 'delete',
        table: 'tpop',
        actionTable: 'tpop',
        when: (ctx) => ctx.mayWrite,
      },
      {
        label: 'verorte auf Karte (mit Doppel-Klick)',
        action: 'localizeOnMap',
        actionTable: 'tpop',
        when: (ctx) => ctx.mayWrite,
      },
      {
        label: 'verschiebe',
        action: 'markForMoving',
        table: 'tpop',
        when: (ctx) => ctx.mayWrite,
      },
      {
        ...moveHere(kontrTables),
        when: (ctx) => ctx.mayWrite && matchesTable(kontrTables, ctx.moving.table),
      },
      {
        label: 'kopiere',
        action: 'markForCopying',
        table: 'tpop',
        when: (ctx) => ctx.mayWrite,
      },
      {
        ...copyHere(kontrTables),
        when: (ctx) => ctx.mayWrite && matchesTable(kontrTables, ctx.copying.table),
      },
      {
        ...resetCopying(kontrTables),
        when: (ctx) => ctx.mayWrite && matchesTable(kontrTables, ctx.copying.table),
      },
      {
        label: 'Kopiere Koordinaten in die Population',
        action: 'copyTpopKoordToPop',
        when: (ctx) => ctx.mayWrite,
      },
      {
        label: 'Zeige auf maps.zh.ch',
        action: 'showCoordOfTpopOnMapsZhCh',
      },
      {
        label: 'Zeige auf map.geo.admin.ch',
        action: 'showCoordOfTpopOnMapGeoAdminCh',
      },
    ],
  },
  tpopFolder: {
    title: 'Teil-Populationen',
    items: [
      openLowerNodes,
      closeLowerNodes,
      { ...insert('tpop', 'erstelle neue'), when: (ctx) => ctx.mayWrite },
      {
        ...moveHere('tpop'),
        when: (ctx) => ctx.mayWrite && matchesTable('tpop', ctx.moving.table),
      },
      {
        ...copyHere('tpop'),
        when: (ctx) => ctx.mayWrite && matchesTable('tpop', ctx.copying.table),
      },
      {
        ...resetCopying('tpop'),
        when: (ctx) => ctx.mayWrite && matchesTable('tpop', ctx.copying.table),
      },
    ],
  },
  tpopber: {
    title: 'Kontroll-Bericht',
    items: [
      { ...insert('tpopber', 'erstelle neuen'), when: (ctx) => ctx.mayWrite },
      { ...remove('tpopber'), when: (ctx) => ctx.mayWrite },
    ],
  },
  tpopberFolder: {
    title: 'Kontroll-Berichte',
    items: [
      { ...insert('tpopber', 'erstelle neuen'), when: (ctx) => ctx.mayWrite },
    ],
  },
  tpopfeldkontr: {
    title: 'Feld-Kontrolle',
    items: [
      {
        ...insert('tpopfeldkontr', 'erstelle neue'),
        when: (ctx) => ctx.mayWrite,
      },
      { ...remove('tpopfeldkontr'), when: (ctx) => ctx.mayWrite },
      {
        label: 'verschiebe',
        action: 'markForMoving',
        table: 'tpopfeldkontr',
        when: (ctx) => ctx.mayWrite,
      },
      {
        label: 'kopiere',
        action: 'markForCopying',
        table: 'tpopfeldkontr',
        when: (ctx) => ctx.mayWrite,
      },
      { ...resetCopying(), when: (ctx) => ctx.mayWrite && !!ctx.copying.table },
      {
        label: 'kopiere Biotop',
        action: 'markForCopyingBiotop',
        when: (ctx) => ctx.mayWrite,
      },
      {
        label: (ctx) => `kopiere Biotop von '${ctx.copyingBiotop.label}' hierhin`,
        action: 'copyBiotop',
        when: (ctx) => ctx.mayWrite && !!ctx.copyingBiotop.label,
      },
      {
        label: 'Biotop Kopieren aufheben',
        action: 'resetCopyingBiotop',
        when: (ctx) => ctx.mayWrite && !!ctx.copyingBiotop.label,
      },
    ],
  },
  tpopfeldkontrFolder: {
    title: 'Feld-Kontrollen',
    items: [
      openLowerNodes,
      closeLowerNodes,
      {
        ...insert('tpopfeldkontr', 'erstelle neue'),
        when: (ctx) => ctx.mayWrite,
      },
      {
        ...moveHere('tpopfeldkontr'),
        when: (ctx) =>
          ctx.mayWrite && matchesTable('tpopfeldkontr', ctx.moving.table),
      },
      {
        ...copyHere('tpopfeldkontr'),
        when: (ctx) =>
          ctx.mayWrite && matchesTable('tpopfeldkontr', ctx.copying.table),
      },
      { ...resetCopying(), when: (ctx) => ctx.mayWrite && !!ctx.copying.table },
    ],
  },
  tpopfeldkontrzaehl: {
    title: 'Zählung',
    items: [
      {
        ...insert('tpopfeldkontrzaehl', 'erstelle neue'),
        when: (ctx) => ctx.mayWrite,
      },
      { ...remove('tpopfeldkontrzaehl'), when: (ctx) => ctx.mayWrite },
    ],
  },
  tpopfeldkontrzaehlFolder: {
    title: 'Zählungen',
    items: [
      {
        ...insert('tpopfeldkontrzaehl', 'erstelle neue'),
        when: (ctx) => ctx.mayWrite,
      },
    ],
  },
  tpopfreiwkontr: {
    title: 'Freiwilligen-Kontrolle',
    items: [
      {
        ...insert('tpopfreiwkontr', 'erstelle neue'),
        when: (ctx) => ctx.mayWriteFreiw,
      },
      { ...remove('tpopfreiwkontr'), when: (ctx) => ctx.mayWriteFreiw },
      {
        label: 'verschiebe',
        action: 'markForMoving',
        table: 'tpopfreiwkontr',
        when: (ctx) => ctx.mayWriteFreiw,
      },
      {
        label: 'kopiere',
        action: 'markForCopying',
        table: 'tpopfreiwkontr',
        when: (ctx) => ctx.mayWriteFreiw,
      },
      {
        ...resetCopying(),
        when: (ctx) => ctx.mayWriteFreiw && !!ctx.copying.table,
      },
    ],
  },
  tpopfreiwkontrFolder: {
    title: 'Freiwilligen-Kontrollen',
    items: [
      openLowerNodes,
      closeLowerNodes,
      {
        ...insert('tpopfreiwkontr', 'erstelle neue'),
        when: (ctx) => ctx.mayWriteFreiw,
      },
      {
        ...moveHere('tpopfreiwkontr'),
        when: (ctx) =>
          ctx.mayWriteFreiw && matchesTable('tpopfreiwkontr', ctx.moving.table),
      },
      {
        ...copyHere('tpopfreiwkontr'),
        when: (ctx) =>
          ctx.mayWriteFreiw && matchesTable('tpopfreiwkontr', ctx.copying.table),
      },
      {
        ...resetCopying(),
        when: (ctx) => ctx.mayWriteFreiw && !!ctx.copying.table,
      },
    ],
  },
  // both casings occur in the nav data and open the same menu
  tpopkontrzaehlEinheitWerte: {
    title: 'Zähl-Einheit',
    items: [
      insert('tpopkontrzaehl_einheit_werte', 'erstelle neue'),
      remove('tpopkontrzaehl_einheit_werte'),
    ],
  },
  TpopkontrzaehlEinheitWerte: {
    title: 'Zähl-Einheit',
    items: [
      insert('tpopkontrzaehl_einheit_werte', 'erstelle neue'),
      remove('tpopkontrzaehl_einheit_werte'),
    ],
  },
  tpopkontrzaehlEinheitWerteFolder: {
    title: 'Zähl-Einheiten',
    items: [insert('tpopkontrzaehl_einheit_werte', 'erstelle neue')],
  },
  tpopmassn: {
    title: 'Massnahme',
    items: [
      { ...insert('tpopmassn', 'erstelle neue'), when: (ctx) => ctx.mayWrite },
      { ...remove('tpopmassn'), when: (ctx) => ctx.mayWrite },
      {
        label: 'verschiebe',
        action: 'markForMoving',
        table: 'tpopmassn',
        when: (ctx) => ctx.mayWrite,
      },
      {
        label: 'kopiere',
        action: 'markForCopying',
        table: 'tpopmassn',
        when: (ctx) => ctx.mayWrite,
      },
      { ...resetCopying(), when: (ctx) => ctx.mayWrite && !!ctx.copying.table },
    ],
  },
  tpopmassnFolder: {
    title: 'Massnahmen',
    items: [
      { ...insert('tpopmassn', 'erstelle neue'), when: (ctx) => ctx.mayWrite },
      {
        ...moveHere('tpopmassn'),
        when: (ctx) =>
          ctx.mayWrite && matchesTable('tpopmassn', ctx.moving.table),
      },
      {
        ...copyHere('tpopmassn'),
        when: (ctx) =>
          ctx.mayWrite && matchesTable('tpopmassn', ctx.copying.table),
      },
      { ...resetCopying(), when: (ctx) => ctx.mayWrite && !!ctx.copying.table },
    ],
  },
  tpopmassnber: {
    title: 'Massnahmen-Bericht',
    titleWidth: 180,
    items: [
      { ...insert('tpopmassnber', 'erstelle neuen'), when: (ctx) => ctx.mayWrite },
      { ...remove('tpopmassnber'), when: (ctx) => ctx.mayWrite },
    ],
  },
  tpopmassnberFolder: {
    title: 'Massnahmen-Berichte',
    items: [
      { ...insert('tpopmassnber', 'erstelle neuen'), when: (ctx) => ctx.mayWrite },
    ],
  },
  tpopApberrelevantGrundWerte: {
    title: 'Grund',
    items: [
      insert('tpop_apberrelevant_grund_werte', 'erstelle neuen'),
      remove('tpop_apberrelevant_grund_werte'),
    ],
  },
  tpopApberrelevantGrundWerteFolder: {
    title: 'Gründe',
    items: [insert('tpop_apberrelevant_grund_werte', 'erstelle neuen')],
  },
  user: {
    title: 'Benutzer',
    items: [
      { ...insert('user', 'erstelle neuen'), when: (ctx) => ctx.mayWrite },
      { ...remove('user'), when: (ctx) => ctx.mayWrite },
    ],
  },
  userFolder: {
    title: 'Benutzer',
    items: [
      closeLowerNodes,
      { ...insert('user', 'erstelle neuen'), when: (ctx) => ctx.mayWrite },
    ],
  },
  ziel: {
    title: 'Ziel',
    items: [
      { ...insert('ziel', 'erstelle neues'), when: (ctx) => ctx.mayWrite },
      { ...remove('ziel'), when: (ctx) => ctx.mayWrite },
    ],
  },
  zielFolder: {
    title: 'Ziele',
    items: [
      openLowerNodes,
      closeLowerNodes,
      { ...insert('ziel', 'erstelle neues'), when: (ctx) => ctx.mayWrite },
    ],
  },
  zieljahrFolder: {
    title: 'Ziele',
    items: [
      openLowerNodes,
      closeLowerNodes,
      { ...insert('ziel', 'erstelle neues'), when: (ctx) => ctx.mayWrite },
    ],
  },
}
