// for sorting see:
// //stackoverflow.com/questions/13211709/javascript-sort-array-by-multiple-number-fields
// also: needed to account for elements not having the next array elements
// to be sorted before those that have
// that is why there is if (a !== 0 && !a)

const compare = (a, b) => {
  // sort a before, if it has no value at this index
  if (a !== 0 && !a) return -1
  // sort a after if b has no value at this index
  if (b !== 0 && !b) return 1
  // sort a before if its value is smaller
  return a - b
}

export default (store) => {
  const { activeUrlElements, table } = store
  const {
    projekt,
    apFolder,
    apberuebersichtFolder,
    apberuebersicht,
    ap,
    qkFolder,
    assozartFolder,
    assozart,
    idealbiotopFolder,
    beobNichtZuzuordnenFolder,
    beobNichtZuzuordnen,
    beobzuordnungFolder,
    beobzuordnung,
    berFolder,
    ber,
    apberFolder,
    apber,
    erfkritFolder,
    erfkrit,
    zieljahrFolder,
    zieljahr,
    ziel,
    zielberFolder,
    zielber,
    popFolder,
    pop,
    popmassnberFolder,
    popmassnber,
    popberFolder,
    popber,
    tpopFolder,
    tpop,
    tpopbeobFolder,
    tpopbeob,
    tpopberFolder,
    tpopber,
    tpopfreiwkontrFolder,
    tpopfreiwkontr,
    tpopfreiwkontrzaehlFolder,
    tpopfreiwkontrzaehl,
    tpopfeldkontrFolder,
    tpopfeldkontr,
    tpopfeldkontrzaehlFolder,
    tpopfeldkontrzaehl,
    tpopmassnberFolder,
    tpopmassnber,
    tpopmassnFolder,
    tpopmassn,
  } = store.tree.node

  let nodes = projekt

  if (activeUrlElements.projekt) {
    nodes = nodes.concat(apFolder)
    nodes = nodes.concat(apberuebersichtFolder)
    if (activeUrlElements.apberuebersichtFolder) {
      nodes = nodes.concat(apberuebersicht)
    }
    if (activeUrlElements.apFolder) {
      nodes = nodes.concat(ap)
      if (
        activeUrlElements.ap &&
        // make sure a pops lower levels are not shown
        // if an apFilter exists
        // and the species is not ap species
        (
          !store.tree.apFilter ||
          (
            store.tree.apFilter &&
            table &&
            table.ap &&
            table.ap.get(activeUrlElements.ap) &&
            [1, 2, 3].includes(table.ap.get(activeUrlElements.ap).ApStatus)
          )
        )
      ) {
        nodes = nodes.concat(qkFolder)
        nodes = nodes.concat(assozartFolder)
        if (activeUrlElements.assozartFolder) {
          nodes = nodes.concat(assozart)
        }
        nodes = nodes.concat(idealbiotopFolder)
        nodes = nodes.concat(beobNichtZuzuordnenFolder)
        if (activeUrlElements.beobNichtZuzuordnenFolder) {
          nodes = nodes.concat(beobNichtZuzuordnen)
        }
        nodes = nodes.concat(beobzuordnungFolder)
        if (activeUrlElements.beobzuordnungFolder) {
          nodes = nodes.concat(beobzuordnung)
        }
        nodes = nodes.concat(berFolder)
        if (activeUrlElements.berFolder) {
          nodes = nodes.concat(ber)
        }
        nodes = nodes.concat(apberFolder)
        if (activeUrlElements.apberFolder) {
          nodes = nodes.concat(apber)
        }
        nodes = nodes.concat(erfkritFolder)
        if (activeUrlElements.erfkritFolder) {
          nodes = nodes.concat(erfkrit)
        }
        nodes = nodes.concat(zieljahrFolder)
        if (activeUrlElements.zielFolder) {
          nodes = nodes.concat(zieljahr)
          if (activeUrlElements.zieljahr) {
            nodes = nodes.concat(ziel)
            if (activeUrlElements.ziel) {
              nodes = nodes.concat(zielberFolder)
              if (activeUrlElements.zielberFolder) {
                nodes = nodes.concat(zielber)
              }
            }
          }
        }
        nodes = nodes.concat(popFolder)
        if (activeUrlElements.popFolder) {
          nodes = nodes.concat(pop)
          if (activeUrlElements.pop) {
            nodes = nodes.concat(popmassnberFolder)
            if (activeUrlElements.popmassnberFolder) {
              nodes = nodes.concat(popmassnber)
            }
            nodes = nodes.concat(popberFolder)
            if (activeUrlElements.popberFolder) {
              nodes = nodes.concat(popber)
            }
            nodes = nodes.concat(tpopFolder)
            if (activeUrlElements.tpopFolder) {
              nodes = nodes.concat(tpop)
              if (activeUrlElements.tpop) {
                nodes = nodes.concat(tpopbeobFolder)
                if (activeUrlElements.tpopbeobFolder) {
                  nodes = nodes.concat(tpopbeob)
                }
                nodes = nodes.concat(tpopberFolder)
                if (activeUrlElements.tpopberFolder) {
                  nodes = nodes.concat(tpopber)
                }
                nodes = nodes.concat(tpopfreiwkontrFolder)
                if (activeUrlElements.tpopfreiwkontrFolder) {
                  nodes = nodes.concat(tpopfreiwkontr)
                  if (activeUrlElements.tpopfreiwkontr) {
                    nodes = nodes.concat(tpopfreiwkontrzaehlFolder)
                    if (activeUrlElements.tpopfreiwkontrzaehlFolder) {
                      nodes = nodes.concat(tpopfreiwkontrzaehl)
                    }
                  }
                }
                nodes = nodes.concat(tpopfeldkontrFolder)
                if (activeUrlElements.tpopfeldkontrFolder) {
                  nodes = nodes.concat(tpopfeldkontr)
                  if (activeUrlElements.tpopfeldkontr) {
                    nodes = nodes.concat(tpopfeldkontrzaehlFolder)
                    if (activeUrlElements.tpopfeldkontrzaehlFolder) {
                      nodes = nodes.concat(tpopfeldkontrzaehl)
                    }
                  }
                }
                nodes = nodes.concat(tpopmassnberFolder)
                if (activeUrlElements.tpopmassnberFolder) {
                  nodes = nodes.concat(tpopmassnber)
                }
                nodes = nodes.concat(tpopmassnFolder)
                if (activeUrlElements.tpopmassnFolder) {
                  nodes = nodes.concat(tpopmassn)
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * As all nodes are now in one flat list,
   * we need to sort them
   *
   * This is the sorting algorithm:
   *
   * compare the sort array value in the nodes
   * to determine sorting
   *
   * compare arrays element by element, starting with first
   * if a has no value at this index (> a is folder), sort a before b
   * if b has no value at this index (> b is folder), sort a after b
   * if a is smaller than b, sort a before b
   * if both array elements at this index are same,
   * compare values at next index
   */
  return nodes.sort((a, b) => (
    compare(a.sort[0], b.sort[0]) ||
    compare(a.sort[1], b.sort[1]) ||
    compare(a.sort[2], b.sort[2]) ||
    compare(a.sort[3], b.sort[3]) ||
    compare(a.sort[4], b.sort[4]) ||
    compare(a.sort[5], b.sort[5]) ||
    compare(a.sort[6], b.sort[6]) ||
    compare(a.sort[7], b.sort[7]) ||
    compare(a.sort[8], b.sort[8]) ||
    compare(a.sort[9], b.sort[9]) ||
    compare(a.sort[10], b.sort[10])
  ))
}
