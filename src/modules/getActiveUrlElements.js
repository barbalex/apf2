export default (url) => {
  const projektFolder = (url.length > 0 && url[0] === `Projekte`) || false
  const projekt = projektFolder && url.length > 1 ? parseInt(url[1], 10) : null
  const apberuebersichtFolder = (projekt && url.length > 2 && url[2] === `AP-Berichte`) || false
  const exporte = (projekt && url.length > 2 && url[2] === `Exporte`) || false
  const apberuebersicht = apberuebersichtFolder && url.length > 3 ? parseInt(url[3], 10) : null
  const apFolder = (projekt && url.length > 2 && url[2] === `Arten`) || false
  const ap = apFolder && url.length > 3 ? parseInt(url[3], 10) : null
  const assozartFolder = (ap && url.length > 4 && url[4] === `assoziierte-Arten`) || false
  const qk = (ap && url.length > 4 && url[4] === `Qualitaetskontrollen`) || false
  const assozart = assozartFolder && url.length > 5 ? parseInt(url[5], 10) : null
  const idealbiotopFolder = (ap && url.length > 4 && url[4] === `Idealbiotop`) || false
  const idealbiotop = idealbiotopFolder ? parseInt(url[3], 10) : null
  const beobNichtZuzuordnenFolder = (ap && url.length > 4 && url[4] === `nicht-zuzuordnende-Beobachtungen`) || false
  let beobNichtZuzuordnen = beobNichtZuzuordnenFolder && url.length > 5 ? url[5] : null
  if (beobNichtZuzuordnen && !isNaN(beobNichtZuzuordnen)) {
    beobNichtZuzuordnen = parseInt(beobNichtZuzuordnen, 10)
  }
  const beobzuordnungFolder = (ap && url.length > 4 && url[4] === `nicht-beurteilte-Beobachtungen`) || false
  let beobzuordnung = beobzuordnungFolder && url.length > 5 ? url[5] : null
  if (beobzuordnung && !isNaN(beobzuordnung)) {
    beobzuordnung = parseInt(beobzuordnung, 10)
  }
  const berFolder = (ap && url.length > 4 && url[4] === `Berichte`) || false
  const ber = berFolder && url.length > 5 ? parseInt(url[5], 10) : null
  const apberFolder = (ap && url.length > 4 && url[4] === `AP-Berichte`) || false
  const apber = apberFolder && url.length > 5 ? parseInt(url[5], 10) : null
  const erfkritFolder = (ap && url.length > 4 && url[4] === `AP-Erfolgskriterien`) || false
  const erfkrit = erfkritFolder && url.length > 5 ? parseInt(url[5], 10) : null
  const zielFolder = (ap && url.length > 4 && url[4] === `AP-Ziele`) || false
  const zieljahr = zielFolder && url.length > 5 ? parseInt(url[5], 10) : null
  const ziel = zielFolder && url.length > 6 ? parseInt(url[6], 10) : null
  const zielberFolder = (ziel && url.length > 7 && url[7] === `Berichte`) || false
  const zielber = zielberFolder && url.length > 8 ? parseInt(url[8], 10) : null
  const popFolder = (ap && url.length > 4 && url[4] === `Populationen`) || false
  const pop = popFolder && url.length > 5 ? parseInt(url[5], 10) : null
  const popberFolder = (pop && url.length > 6 && url[6] === `Kontroll-Berichte`) || false
  const popber = popberFolder && url.length > 7 ? parseInt(url[7], 10) : null
  const popmassnberFolder = (pop && url.length > 6 && url[6] === `Massnahmen-Berichte`) || false
  const popmassnber = popmassnberFolder && url.length > 7 ? parseInt(url[7], 10) : null
  const tpopFolder = (pop && url.length > 6 && url[6] === `Teil-Populationen`) || false
  const tpop = tpopFolder && url.length > 7 ? parseInt(url[7], 10) : null
  const tpopmassnFolder = (tpop && url.length > 8 && url[8] === `Massnahmen`) || false
  const tpopmassn = tpopmassnFolder && url.length > 9 ? parseInt(url[9], 10) : null
  const tpopmassnberFolder = (tpop && url.length > 8 && url[8] === `Massnahmen-Berichte`) || false
  const tpopmassnber = tpopmassnberFolder && url.length > 9 ? parseInt(url[9], 10) : null
  const tpopfeldkontrFolder = (tpop && url.length > 8 && url[8] === `Feld-Kontrollen`) || false
  const tpopfeldkontr = tpopfeldkontrFolder && url.length > 9 ? parseInt(url[9], 10) : null
  const tpopfeldkontrzaehlFolder = (tpopfeldkontr && url.length > 10 && url[10] === `Zaehlungen`) || false
  const tpopfeldkontrzaehl = tpopfeldkontrzaehlFolder && url.length > 11 ? parseInt(url[11], 10) : null
  const tpopfreiwkontrFolder = (tpop && url.length > 8 && url[8] === `Freiwilligen-Kontrollen`) || false
  const tpopfreiwkontr = tpopfreiwkontrFolder && url.length > 9 ? parseInt(url[9], 10) : null
  const tpopfreiwkontrzaehlFolder = (tpopfreiwkontr && url.length > 10 && url[10] === `Zaehlungen`) || false
  const tpopfreiwkontrzaehl = tpopfreiwkontrzaehlFolder && url.length > 11 ? parseInt(url[11], 10) : null
  const tpopberFolder = (tpop && url.length > 8 && url[8] === `Kontroll-Berichte`) || false
  const tpopber = tpopberFolder && url.length > 9 ? parseInt(url[9], 10) : null
  const tpopbeobFolder = (tpop && url.length > 8 && url[8] === `Beobachtungen`) || false
  const tpopbeob = tpopbeobFolder && url.length > 9 ? url[9] : null

  return {
    exporte,
    projektFolder,
    projekt,
    apberuebersichtFolder,
    apberuebersicht,
    apFolder,
    ap,
    assozartFolder,
    assozart,
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
