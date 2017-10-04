// @flow
export default (activeNodeArray: Array<mixed>): Object => {
  const projektFolder =
    (activeNodeArray.length > 0 && activeNodeArray[0] === 'Projekte') || false
  const projekt =
    projektFolder && activeNodeArray.length > 1
      ? parseInt(activeNodeArray[1], 10)
      : null
  const apberuebersichtFolder =
    (projekt &&
      activeNodeArray.length > 2 &&
      activeNodeArray[2] === 'AP-Berichte') ||
    false
  const exporte =
    (projekt &&
      activeNodeArray.length > 2 &&
      activeNodeArray[2] === 'Exporte') ||
    false
  const apberuebersicht =
    apberuebersichtFolder && activeNodeArray.length > 3
      ? parseInt(activeNodeArray[3], 10)
      : null
  const apFolder =
    (projekt && activeNodeArray.length > 2 && activeNodeArray[2] === 'Arten') ||
    false
  const ap =
    apFolder && activeNodeArray.length > 3
      ? parseInt(activeNodeArray[3], 10)
      : null
  const assozartFolder =
    (ap &&
      activeNodeArray.length > 4 &&
      activeNodeArray[4] === 'assoziierte-Arten') ||
    false
  const beobArtFolder =
    (ap &&
      activeNodeArray.length > 4 &&
      activeNodeArray[4] === 'arten-fuer-beobachtungen') ||
    false
  const qk =
    (ap &&
      activeNodeArray.length > 4 &&
      activeNodeArray[4] === 'Qualitaetskontrollen') ||
    false
  const assozart =
    assozartFolder && activeNodeArray.length > 5
      ? parseInt(activeNodeArray[5], 10)
      : null
  const beobArt =
    beobArtFolder && activeNodeArray.length > 5
      ? parseInt(activeNodeArray[5], 10)
      : null
  const idealbiotopFolder =
    (ap &&
      activeNodeArray.length > 4 &&
      activeNodeArray[4] === 'Idealbiotop') ||
    false
  const idealbiotop = idealbiotopFolder
    ? parseInt(activeNodeArray[3], 10)
    : null
  const beobNichtZuzuordnenFolder =
    (ap &&
      activeNodeArray.length > 4 &&
      activeNodeArray[4] === 'nicht-zuzuordnende-Beobachtungen') ||
    false
  let beobNichtZuzuordnen =
    beobNichtZuzuordnenFolder && activeNodeArray.length > 5
      ? activeNodeArray[5]
      : null
  if (beobNichtZuzuordnen && !isNaN(beobNichtZuzuordnen)) {
    beobNichtZuzuordnen = parseInt(beobNichtZuzuordnen, 10)
  }
  const beobzuordnungFolder =
    (ap &&
      activeNodeArray.length > 4 &&
      activeNodeArray[4] === 'nicht-beurteilte-Beobachtungen') ||
    false
  let beobzuordnung =
    beobzuordnungFolder && activeNodeArray.length > 5
      ? activeNodeArray[5]
      : null
  if (beobzuordnung && !isNaN(beobzuordnung)) {
    beobzuordnung = parseInt(beobzuordnung, 10)
  }
  const berFolder =
    (ap && activeNodeArray.length > 4 && activeNodeArray[4] === 'Berichte') ||
    false
  const ber =
    berFolder && activeNodeArray.length > 5
      ? parseInt(activeNodeArray[5], 10)
      : null
  const apberFolder =
    (ap &&
      activeNodeArray.length > 4 &&
      activeNodeArray[4] === 'AP-Berichte') ||
    false
  const apber =
    apberFolder && activeNodeArray.length > 5
      ? parseInt(activeNodeArray[5], 10)
      : null
  const erfkritFolder =
    (ap &&
      activeNodeArray.length > 4 &&
      activeNodeArray[4] === 'AP-Erfolgskriterien') ||
    false
  const erfkrit =
    erfkritFolder && activeNodeArray.length > 5
      ? parseInt(activeNodeArray[5], 10)
      : null
  const zielFolder =
    (ap && activeNodeArray.length > 4 && activeNodeArray[4] === 'AP-Ziele') ||
    false
  const zieljahr =
    zielFolder && activeNodeArray.length > 5
      ? parseInt(activeNodeArray[5], 10)
      : null
  const ziel =
    zielFolder && activeNodeArray.length > 6
      ? parseInt(activeNodeArray[6], 10)
      : null
  const zielberFolder =
    (ziel && activeNodeArray.length > 7 && activeNodeArray[7] === 'Berichte') ||
    false
  const zielber =
    zielberFolder && activeNodeArray.length > 8
      ? parseInt(activeNodeArray[8], 10)
      : null
  const popFolder =
    (ap &&
      activeNodeArray.length > 4 &&
      activeNodeArray[4] === 'Populationen') ||
    false
  const pop =
    popFolder && activeNodeArray.length > 5
      ? parseInt(activeNodeArray[5], 10)
      : null
  const popberFolder =
    (pop &&
      activeNodeArray.length > 6 &&
      activeNodeArray[6] === 'Kontroll-Berichte') ||
    false
  const popber =
    popberFolder && activeNodeArray.length > 7
      ? parseInt(activeNodeArray[7], 10)
      : null
  const popmassnberFolder =
    (pop &&
      activeNodeArray.length > 6 &&
      activeNodeArray[6] === 'Massnahmen-Berichte') ||
    false
  const popmassnber =
    popmassnberFolder && activeNodeArray.length > 7
      ? parseInt(activeNodeArray[7], 10)
      : null
  const tpopFolder =
    (pop &&
      activeNodeArray.length > 6 &&
      activeNodeArray[6] === 'Teil-Populationen') ||
    false
  const tpop =
    tpopFolder && activeNodeArray.length > 7
      ? parseInt(activeNodeArray[7], 10)
      : null
  const tpopmassnFolder =
    (tpop &&
      activeNodeArray.length > 8 &&
      activeNodeArray[8] === 'Massnahmen') ||
    false
  const tpopmassn =
    tpopmassnFolder && activeNodeArray.length > 9
      ? parseInt(activeNodeArray[9], 10)
      : null
  const tpopmassnberFolder =
    (tpop &&
      activeNodeArray.length > 8 &&
      activeNodeArray[8] === 'Massnahmen-Berichte') ||
    false
  const tpopmassnber =
    tpopmassnberFolder && activeNodeArray.length > 9
      ? parseInt(activeNodeArray[9], 10)
      : null
  const tpopfeldkontrFolder =
    (tpop &&
      activeNodeArray.length > 8 &&
      activeNodeArray[8] === 'Feld-Kontrollen') ||
    false
  const tpopfeldkontr =
    tpopfeldkontrFolder && activeNodeArray.length > 9
      ? parseInt(activeNodeArray[9], 10)
      : null
  const tpopfeldkontrzaehlFolder =
    (tpopfeldkontr &&
      activeNodeArray.length > 10 &&
      activeNodeArray[10] === 'Zaehlungen') ||
    false
  const tpopfeldkontrzaehl =
    tpopfeldkontrzaehlFolder && activeNodeArray.length > 11
      ? parseInt(activeNodeArray[11], 10)
      : null
  const tpopfreiwkontrFolder =
    (tpop &&
      activeNodeArray.length > 8 &&
      activeNodeArray[8] === 'Freiwilligen-Kontrollen') ||
    false
  const tpopfreiwkontr =
    tpopfreiwkontrFolder && activeNodeArray.length > 9
      ? parseInt(activeNodeArray[9], 10)
      : null
  const tpopfreiwkontrzaehlFolder =
    (tpopfreiwkontr &&
      activeNodeArray.length > 10 &&
      activeNodeArray[10] === 'Zaehlungen') ||
    false
  const tpopfreiwkontrzaehl =
    tpopfreiwkontrzaehlFolder && activeNodeArray.length > 11
      ? parseInt(activeNodeArray[11], 10)
      : null
  const tpopberFolder =
    (tpop &&
      activeNodeArray.length > 8 &&
      activeNodeArray[8] === 'Kontroll-Berichte') ||
    false
  const tpopber =
    tpopberFolder && activeNodeArray.length > 9
      ? parseInt(activeNodeArray[9], 10)
      : null
  const tpopbeobFolder =
    (tpop &&
      activeNodeArray.length > 8 &&
      activeNodeArray[8] === 'Beobachtungen') ||
    false
  const tpopbeob =
    tpopbeobFolder && activeNodeArray.length > 9 ? activeNodeArray[9] : null

  return {
    exporte,
    projektFolder,
    projekt,
    apberuebersichtFolder,
    apberuebersicht,
    apFolder,
    ap,
    assozartFolder,
    beobArtFolder,
    assozart,
    beobArt,
    qk,
    idealbiotopFolder,
    idealbiotop,
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
    zielFolder,
    zieljahr,
    ziel,
    zielberFolder,
    zielber,
    popFolder,
    pop,
    popberFolder,
    popber,
    popmassnberFolder,
    popmassnber,
    tpopFolder,
    tpop,
    tpopmassnFolder,
    tpopmassn,
    tpopmassnberFolder,
    tpopmassnber,
    tpopfeldkontrFolder,
    tpopfeldkontr,
    tpopfeldkontrzaehlFolder,
    tpopfeldkontrzaehl,
    tpopfreiwkontrFolder,
    tpopfreiwkontr,
    tpopfreiwkontrzaehlFolder,
    tpopfreiwkontrzaehl,
    tpopberFolder,
    tpopber,
    tpopbeobFolder,
    tpopbeob,
  }
}
