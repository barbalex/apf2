// for sorting see:
// http://stackoverflow.com/questions/13211709/javascript-sort-array-by-multiple-number-fields
// also: needed to account for elements not having the next array elements
// to be sorted before those that have
// that is why there is if (a !== 0 && !a)

const compare = (a, b) => {
  if (a !== 0 && !a) return -1
  if (b !== 0 && !b) return 1
  return a - b
}

export default (store) => {
  const { activeUrlElements } = store
  const {
    projekt,
    apFolder,
    apberuebersichtFolder,
    exporteFolder,
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
    tpopmassnberFolder,
    tpopmassnber,
    tpopmassnFolder,
    tpopmassn,
  } = store.node.node
  let nodes = projekt
  if (activeUrlElements.projekt) {
    nodes = nodes.concat(apFolder)
  }
  if (activeUrlElements.projekt) {
    nodes = nodes.concat(apberuebersichtFolder)
  }
  if (activeUrlElements.projekt) {
    nodes = nodes.concat(exporteFolder)
  }
  if (activeUrlElements.apberuebersichtFolder) {
    nodes = nodes.concat(apberuebersicht)
  }
  if (activeUrlElements.apFolder) {
    nodes = nodes.concat(ap)
  }
  if (activeUrlElements.ap) {
    nodes = nodes.concat(qkFolder)
  }
  if (activeUrlElements.ap) {
    nodes = nodes.concat(assozartFolder)
  }
  if (activeUrlElements.assozartFolder) {
    nodes = nodes.concat(assozart)
  }
  if (activeUrlElements.ap) {
    nodes = nodes.concat(idealbiotopFolder)
  }
  if (activeUrlElements.ap) {
    nodes = nodes.concat(beobNichtZuzuordnenFolder)
  }
  if (activeUrlElements.beobNichtZuzuordnenFolder) {
    nodes = nodes.concat(beobNichtZuzuordnen)
  }
  if (activeUrlElements.ap) {
    nodes = nodes.concat(beobzuordnungFolder)
  }
  if (activeUrlElements.beobzuordnungFolder) {
    nodes = nodes.concat(beobzuordnung)
  }
  if (activeUrlElements.ap) {
    nodes = nodes.concat(berFolder)
  }
  if (activeUrlElements.berFolder) {
    nodes = nodes.concat(ber)
  }
  if (activeUrlElements.ap) {
    nodes = nodes.concat(apberFolder)
  }
  if (activeUrlElements.apberFolder) {
    nodes = nodes.concat(apber)
  }
  if (activeUrlElements.ap) {
    nodes = nodes.concat(erfkritFolder)
  }
  if (activeUrlElements.erfkritFolder) {
    nodes = nodes.concat(erfkrit)
  }
  if (activeUrlElements.ap) {
    nodes = nodes.concat(zieljahrFolder)
  }
  if (activeUrlElements.zielFolder) {
    nodes = nodes.concat(zieljahr)
  }
  if (activeUrlElements.zieljahr) {
    nodes = nodes.concat(ziel)
  }
  if (activeUrlElements.ziel) {
    nodes = nodes.concat(zielberFolder)
  }
  if (activeUrlElements.zielberFolder) {
    nodes = nodes.concat(zielber)
  }
  if (activeUrlElements.ap) {
    nodes = nodes.concat(popFolder)
  }
  if (activeUrlElements.popFolder) {
    nodes = nodes.concat(pop)
  }
  if (activeUrlElements.pop) {
    nodes = nodes.concat(popmassnberFolder)
  }
  if (activeUrlElements.popmassnberFolder) {
    nodes = nodes.concat(popmassnber)
  }
  if (activeUrlElements.pop) {
    nodes = nodes.concat(popberFolder)
  }
  if (activeUrlElements.popberFolder) {
    nodes = nodes.concat(popber)
  }
  if (activeUrlElements.pop) {
    nodes = nodes.concat(tpopFolder)
  }
  if (activeUrlElements.tpopFolder) {
    nodes = nodes.concat(tpop)
  }
  if (activeUrlElements.tpop) {
    nodes = nodes.concat(tpopbeobFolder)
  }
  if (activeUrlElements.tpopbeobFolder) {
    nodes = nodes.concat(tpopbeob)
  }
  if (activeUrlElements.tpop) {
    nodes = nodes.concat(tpopberFolder)
  }
  if (activeUrlElements.tpopberFolder) {
    nodes = nodes.concat(tpopber)
  }
  if (activeUrlElements.tpop) {
    nodes = nodes.concat(tpopfreiwkontrFolder)
  }
  if (activeUrlElements.tpopfreiwkontrFolder) {
    nodes = nodes.concat(tpopfreiwkontr)
  }
  if (activeUrlElements.tpopfreiwkontr) {
    nodes = nodes.concat(tpopfreiwkontrzaehlFolder)
  }
  if (activeUrlElements.tpopfreiwkontrzaehlFolder) {
    nodes = nodes.concat(tpopfreiwkontrzaehl)
  }
  if (activeUrlElements.tpop) {
    nodes = nodes.concat(tpopfeldkontrFolder)
  }
  if (activeUrlElements.tpopfeldkontrFolder) {
    nodes = nodes.concat(tpopfeldkontr)
  }
  if (activeUrlElements.tpop) {
    nodes = nodes.concat(tpopmassnberFolder)
  }
  if (activeUrlElements.tpopmassnberFolder) {
    nodes = nodes.concat(tpopmassnber)
  }
  if (activeUrlElements.tpop) {
    nodes = nodes.concat(tpopmassnFolder)
  }
  if (activeUrlElements.tpopmassnFolder) {
    nodes = nodes.concat(tpopmassn)
  }
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
