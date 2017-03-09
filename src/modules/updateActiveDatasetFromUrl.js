// @flow
import validateActiveDataset from './validateActiveDataset'

export default (store:Object) => {
  const aEl = store.activeUrlElements
  let activeDataset = {
    table: null,
    row: null,
  }
  if (aEl.projektFolder) {
    if (aEl.apberuebersicht) {
      activeDataset = { table: `apberuebersicht`, row: store.table.apberuebersicht.get(aEl.apberuebersicht), folder: null }
    } else if (aEl.ap || aEl.ap === 0) {
      if (aEl.ziel) {
        if (aEl.zielber) {
          activeDataset = { table: `zielber`, row: store.table.zielber.get(aEl.zielber), folder: null }
        } else {
          let folder = null
          if (aEl.zielberFolder) folder = `zielber`
          activeDataset = { table: `ziel`, row: store.table.ziel.get(aEl.ziel), folder }
        }
      } else if (aEl.erfkrit) {
        activeDataset = { table: `erfkrit`, row: store.table.erfkrit.get(aEl.erfkrit), folder: null }
      } else if (aEl.apber) {
        activeDataset = { table: `apber`, row: store.table.apber.get(aEl.apber), folder: null }
      } else if (aEl.ber) {
        activeDataset = { table: `ber`, row: store.table.ber.get(aEl.ber), folder: null }
      } else if (aEl.beobzuordnung) {
        activeDataset = {
          table: `beob_bereitgestellt`,
          row: store.table.beob_bereitgestellt.get(aEl.beobzuordnung),
          folder: null,
        }
      } else if (aEl.beobNichtZuzuordnen) {
        activeDataset = {
          table: `beobzuordnung`,
          row: store.table.beobzuordnung.get(aEl.beobNichtZuzuordnen),
          folder: null,
        }
      } else if (aEl.assozart) {
        activeDataset = {
          table: `assozart`,
          row: store.table.assozart.get(aEl.assozart),
          folder: null,
        }
      } else if (aEl.idealbiotopFolder) {
        activeDataset = {
          table: `idealbiotop`,
          row: store.table.idealbiotop.get(aEl.ap),
          folder: null,
        }
      } else if (aEl.pop) {
        if (aEl.popmassnber) {
          activeDataset = {
            table: `popmassnber`,
            row: store.table.popmassnber.get(aEl.popmassnber),
            folder: null,
          }
        } else if (aEl.popber) {
          activeDataset = {
            table: `popber`,
            row: store.table.popber.get(aEl.popber),
            folder: null,
          }
        } else if (aEl.tpop) {
          if (aEl.tpopbeob) {
            activeDataset = {
              table: `beobzuordnung`,
              row: store.table.beobzuordnung.get(aEl.tpopbeob),
              folder: null,
            }
          } else if (aEl.tpopber) {
            activeDataset = {
              table: `tpopber`,
              row: store.table.tpopber.get(aEl.tpopber),
              folder: null,
            }
          } else if (aEl.tpopfreiwkontr) {
            if (aEl.tpopfreiwkontrzaehl) {
              activeDataset = {
                table: `tpopkontrzaehl`,
                row: store.table.tpopkontrzaehl.get(aEl.tpopfreiwkontrzaehl),
                folder: null,
              }
            } else {
              let folder = null
              if (aEl.tpopfreiwkontrzaehlFolder) folder = `tpopkontrzaehl`
              activeDataset = {
                table: `tpopfreiwkontr`,
                row: store.table.tpopkontr.get(aEl.tpopfreiwkontr),
                folder,
              }
            }
          } else if (aEl.tpopfeldkontr) {
            if (aEl.tpopfeldkontrzaehl) {
              activeDataset = {
                table: `tpopkontrzaehl`,
                row: store.table.tpopkontrzaehl.get(aEl.tpopfeldkontrzaehl),
                folder: null,
              }
            } else {
              let folder = null
              if (aEl.tpopfeldkontrzaehlFolder) folder = `tpopkontrzaehl`
              activeDataset = {
                table: `tpopfeldkontr`,
                row: store.table.tpopkontr.get(aEl.tpopfeldkontr),
                folder,
              }
            }
          } else if (aEl.tpopmassnber) {
            activeDataset = {
              table: `tpopmassnber`,
              row: store.table.tpopmassnber.get(aEl.tpopmassnber),
              folder: null,
            }
          } else if (aEl.tpopmassn) {
            activeDataset = {
              table: `tpopmassn`,
              row: store.table.tpopmassn.get(aEl.tpopmassn),
              folder: null,
            }
          } else {
            let folder = null
            if (aEl.tpopmassnFolder) folder = `tpopmassn`
            if (aEl.tpopmassnberFolder) folder = `tpopmassnber`
            if (aEl.tpopfeldkontrFolder) folder = `tpopfeldkontr`
            if (aEl.tpopfreiwkontrFolder) folder = `tpopfreiwkontr`
            if (aEl.tpopberFolder) folder = `tpopber`
            if (aEl.tpopbeobFolder) folder = `tpopbeob`
            activeDataset = {
              table: `tpop`,
              row: store.table.tpop.get(aEl.tpop),
              folder,
            }
          }
        } else {
          // none of the tpop folders is active
          let folder = null
          if (aEl.popmassnberFolder) folder = `popmassnber`
          if (aEl.popberFolder) folder = `popber`
          if (aEl.tpopFolder) folder = `tpop`
          activeDataset = {
            table: `pop`,
            row: store.table.pop.get(aEl.pop),
            folder,
          }
        }
      } else {
        // none of the pop folders is active
        let folder = null
        if (aEl.popFolder) folder = `pop`
        if (aEl.assozartFolder) folder = `assozart`
        if (aEl.idealbiotopFolder) folder = `idealbiotop`
        if (aEl.beobNichtZuzuordnenFolder) folder = `beobNichtZuzuordnen`
        if (aEl.beobzuordnungFolder) folder = `beobzuordnung`
        if (aEl.berFolder) folder = `ber`
        if (aEl.apberFolder) folder = `apber`
        if (aEl.erfkritFolder) folder = `erfkrit`
        if (aEl.zielFolder) folder = `ziel`
        if (aEl.zieljahr) folder = `ziel`
        activeDataset = {
          table: `ap`,
          row: store.table.ap.get(aEl.ap),
          folder,
        }
      }
    } else if (aEl.projekt) {
      let folder = null
      if (aEl.apFolder) folder = `ap`
      if (aEl.apberuebersichtFolder) folder = `apberuebersicht`
      activeDataset = {
        table: `projekt`,
        row: store.table.projekt.get(aEl.projekt),
        folder,
      }
    } else {
      // !aEl.ap && !aEl.apberuebersicht
      activeDataset = {
        table: null,
        row: null,
        folder: `projekt`,
        valid: {},
      }
    }
  }
  activeDataset.valid = validateActiveDataset(activeDataset.table, activeDataset.row, store.app.fields)
  return activeDataset
}
