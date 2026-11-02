/**
 * Field manifest per table. Not executed anywhere: this file is the
 * input of scripts/generate-selects.mjs (npm run selects:generate),
 * which derives the PostgREST select strings in src/modules/selects.ts
 * from the field lists below.
 */

export const adresse = `
  fragment AdresseFields on Adresse {
    id
    label
    name
    adresse
    telefon
    email
    freiwErfko
    changedBy
  }
`

export const aeTaxonomies = `
  fragment AeTaxonomiesFields on AeTaxonomy {
    taxonomieId
    taxonomieName
    id
    taxid
    familie
    artname
    taxArtName
    artwert
  }
`

export const aeLrDelarze = `
  fragment AeLrDelarzeFields on AeLrDelarze {
    id
    label
    einheit
  }
`

export const ap = `
  fragment ApFields on Ap {
    id
    label
    artId
    bearbeitung
    startJahr
    umsetzung
    artId
    bearbeiter
    ekfBeobachtungszeitpunkt
    projId
    changedBy
  }
`

export const apart = `
  fragment ApartFields on Apart {
    id
    label
    apId
    artId
    changedBy
  }
`

export const apber = `
  fragment ApberFields on Apber {
    id
    label
    jahr
    situation
    vergleichVorjahrGesamtziel
    beurteilung
    apberAnalyse
    konsequenzenUmsetzung
    konsequenzenErfolgskontrolle
    biotopeNeue
    biotopeOptimieren
    massnahmenOptimieren
    wirkungAufArt
    datum
    massnahmenApBearb
    massnahmenPlanungVsAusfuehrung
    apId
    bearbeiter
    changedBy
  }
`

export const apberuebersicht = `
  fragment ApberuebersichtFields on Apberuebersicht {
    id
    label
    projId
    jahr
    historyDate
    historyFixed
    bemerkungen
    changedBy
  }
`

export const apFile = `
  fragment ApFileFields on ApFile {
    id
    apId
    fileId
    fileMimeType
    name
    beschreibung
  }
`

export const apHistory = `
  fragment ApHistoryFields on ApHistory {
    id
    year
    artId
    bearbeitung
    startJahr
    umsetzung
    artId
    bearbeiter
    ekfBeobachtungszeitpunkt
    projId
    createdAt
    updatedAt
    changedBy
  }
`

export const apqk = `
  fragment ApqkFields on Apqk {
    apId
    qkName
  }
`

export const assozart = `
  fragment AssozartFields on Assozart {
    id
    label
    bemerkungen
    aeId
    apId
    changedBy
  }
`

export const beob = `
  fragment BeobFields on Beob {
    id
    label
    idField
    datum
    autor
    absenz
    lv95X
    wgs84Lat
    lv95Y
    wgs84Long
    geomPoint {
      geojson
      #srid
      x
      y
    }
    data
    artId
    tpopId
    nichtZuordnen
    bemerkungen
    quelle
    artIdOriginal
    infofloraInformiertDatum
    changedBy
  }
`

export const currentIssue = `
  fragment CurrentIssueFields on Currentissue {
    id
    label
    sort
    title
    issue
  }
`

export const ekAbrechnungstypWerte = `
  fragment EkAbrechnungstypWerteFields on EkAbrechnungstypWerte {
    id
    code
    label
    text
    sort
    historic
    changedBy
  }
`

export const ekfrequenz = `
  fragment EkfrequenzFields on Ekfrequenz {
    id
    apId
    ektyp
    anwendungsfall
    code
    kontrolljahre
    kontrolljahreAb
    bemerkungen
    sort
    ekAbrechnungstyp
    changedBy
  }
`

export const ekplan = `
  fragment EkplanFields on Ekplan {
    id
    tpopId
    jahr
    typ
    changedBy
  }
`

export const ekzaehleinheit = `
  fragment EkzaehleinheitFields on Ekzaehleinheit {
    id
    apId
    label
    zaehleinheitId
    zielrelevant
    notMassnCountUnit
    sort
    bemerkungen
    changedBy
  }
`

export const erfkrit = `
  fragment ErfkritFields on Erfkrit {
    id
    label
    apId
    erfolg
    kriterien
    changedBy
  }
`

export const idealbiotop = `
  fragment IdealbiotopFields on Idealbiotop {
    id
    apId
    erstelldatum
    hoehenlage
    region
    exposition
    besonnung
    hangneigung
    bodenTyp
    bodenKalkgehalt
    bodenDurchlaessigkeit
    bodenHumus
    bodenNaehrstoffgehalt
    wasserhaushalt
    konkurrenz
    moosschicht
    krautschicht
    strauchschicht
    baumschicht
    bemerkungen
    changedBy
  }
`
export const idealbiotopFile = `
  fragment IdealbiotopFileFields on IdealbiotopFile {
    id
    idealbiotopId
    fileId
    fileMimeType
    name
    beschreibung
  }
`
export const message = `
  fragment MessageFields on Message {
    id
    message
    time
    active
  }
`

export const pop = `
  fragment PopFields on Pop {
    id
    label
    apId
    nr
    name
    status
    statusUnklar
    statusUnklarBegruendung
    bekanntSeit
    lv95X
    wgs84Lat
    lv95Y
    wgs84Long
    geomPoint {
      geojson
      #srid
      x
      y
    }
    changedBy
  }
`

export const popber = `
  fragment PopberFields on Popber {
    id
    label
    popId
    jahr
    entwicklung
    bemerkungen
    changedBy
  }
`

export const popFile = `
  fragment PopFileFields on PopFile {
    id
    popId
    fileId
    fileMimeType
    name
    beschreibung
  }
`

export const popHistory = `
  fragment PopHistoryFields on PopHistory {
    id
    year
    apId
    nr
    name
    status
    statusUnklar
    statusUnklarBegruendung
    bekanntSeit
    geomPoint {
      geojson
      x
      y
    }
    createdAt
    updatedAt
    changedBy
  }
`

export const popmassnber = `
  fragment PopmassnberFields on Popmassnber {
    id
    label
    popId
    jahr
    beurteilung
    bemerkungen
    changedBy
  }
`

export const projekt = `
  fragment ProjektFields on Projekt {
    id
    label
    name
    changedBy
  }
`

export const qk = `
  fragment QkFields on Qk {
    name
    titel
    beschreibung
    sort
  }
`

export const tpop = `
  fragment TpopFields on Tpop {
    id
    label
    popId
    nr
    gemeinde
    flurname
    lv95X
    wgs84Lat
    lv95Y
    wgs84Long
    geomPoint {
      geojson
      #srid
      x
      y
    }
    radius
    hoehe
    exposition
    klima
    neigung
    bodenTyp
    bodenKalkgehalt
    bodenDurchlaessigkeit
    bodenHumus
    bodenNaehrstoffgehalt
    bodenAbtrag
    wasserhaushalt
    beschreibung
    katasterNr
    status
    statusUnklarGrund
    apberRelevant
    apberRelevantGrund
    bekanntSeit
    eigentuemer
    kontakt
    nutzungszone
    bewirtschafter
    bewirtschaftung
    ekfrequenz
    ekfrequenzAbweichend
    ekfrequenzStartjahr
    ekfKontrolleur
    bemerkungen
    statusUnklar
    changedBy
  }
`

export const tpopber = `
  fragment TpopberFields on Tpopber {
    id
    label
    tpopId
    jahr
    entwicklung
    tpopEntwicklungWerteByEntwicklung {
      id
      code
      text
      sort
    }
    bemerkungen
    changedBy
  }
`

export const tpopfeldkontr = `
  fragment TpopfeldkontrFields on Tpopkontr {
    id
    labelEk
    typ
    datum
    jahr
    vitalitaet
    ueberlebensrate
    entwicklung
    ursachen
    gefaehrdung
    erfolgsbeurteilung
    umsetzungAendern
    kontrolleAendern
    bemerkungen
    lrDelarze
    flaeche
    lrUmgebungDelarze
    vegetationstyp
    konkurrenz
    moosschicht
    krautschicht
    strauchschicht
    baumschicht
    idealbiotopUebereinstimmung
    handlungsbedarf
    flaecheUeberprueft
    deckungVegetation
    deckungNackterBoden
    deckungApArt
    vegetationshoeheMaximum
    vegetationshoeheMittel
    tpopId
    bearbeiter
    planVorhanden
    jungpflanzenVorhanden
    apberNichtRelevant
    apberNichtRelevantGrund
    changedBy
  }
`

export const tpopFile = `
  fragment TpopFileFields on TpopFile {
    id
    tpopId
    fileId
    fileMimeType
    name
    beschreibung
  }
`

export const tpopfreiwkontr = `
  fragment TpopfreiwkontrFields on Tpopkontr {
    id
    labelEkf
    typ
    ekfBemerkungen
    datum
    jahr
    bemerkungen
    flaecheUeberprueft
    deckungVegetation
    deckungNackterBoden
    deckungApArt
    vegetationshoeheMaximum
    vegetationshoeheMittel
    gefaehrdung
    tpopId
    bearbeiter
    planVorhanden
    jungpflanzenVorhanden
    apberNichtRelevant
    apberNichtRelevantGrund
    changedBy
  }
`

export const tpopHistory = `
  fragment TpopHistoryFields on TpopHistory {
    id
    year
    popId
    nr
    gemeinde
    flurname
    geomPoint {
      geojson
      x
      y
    }
    radius
    hoehe
    exposition
    klima
    neigung
    beschreibung
    katasterNr
    status
    statusUnklarGrund
    apberRelevant
    apberRelevantGrund
    bekanntSeit
    eigentuemer
    kontakt
    nutzungszone
    bewirtschafter
    bewirtschaftung
    ekfrequenz
    ekfrequenzAbweichend
    ekfrequenzStartjahr
    ekfKontrolleur
    bemerkungen
    statusUnklar
    createdAt
    updatedAt
    changedBy
  }
`

export const tpopkontr = `
  fragment TpopkontrFields on Tpopkontr {
    id
    typ
    datum
    jahr
    vitalitaet
    ueberlebensrate
    entwicklung
    ursachen
    gefaehrdung
    erfolgsbeurteilung
    umsetzungAendern
    kontrolleAendern
    bemerkungen
    lrDelarze
    flaeche
    lrUmgebungDelarze
    vegetationstyp
    konkurrenz
    moosschicht
    krautschicht
    strauchschicht
    baumschicht
    idealbiotopUebereinstimmung
    handlungsbedarf
    flaecheUeberprueft
    deckungVegetation
    deckungNackterBoden
    deckungApArt
    vegetationshoeheMaximum
    vegetationshoeheMittel
    tpopId
    bearbeiter
    planVorhanden
    apberNichtRelevant
    apberNichtRelevantGrund
    jungpflanzenVorhanden
    changedBy
  }
`

export const tpopkontrFile = `
  fragment TpopkontrFileFields on TpopkontrFile {
    id
    tpopkontrId
    fileId
    fileMimeType
    name
    beschreibung
  }
`

export const tpopkontrzaehl = `
  fragment TpopkontrzaehlFields on Tpopkontrzaehl {
    id
    label
    tpopkontrId
    anzahl
    einheit
    methode
    changedBy
  }
`

export const tpopmassn = `
  fragment TpopmassnFields on Tpopmassn {
    id
    label
    typ
    beschreibung
    jahr
    datum
    bemerkungen
    planBezeichnung
    flaeche
    markierung
    anzTriebe
    anzPflanzen
    anzPflanzstellen
    zieleinheitEinheit
    zieleinheitAnzahl
    wirtspflanze
    herkunftPop
    sammeldatum
    vonAnzahlIndividuen
    form
    pflanzanordnung
    tpopId
    bearbeiter
    planVorhanden
    changedBy
  }
`

export const tpopmassnber = `
  fragment TpopmassnberFields on Tpopmassnber {
    id
    label
    tpopId
    jahr
    beurteilung
    bemerkungen
    changedBy
  }
`

export const tpopmassnFile = `
  fragment TpopmassnFileFields on TpopmassnFile {
    id
    tpopmassnId
    fileId
    fileMimeType
    name
    beschreibung
  }
`

export const user = `
  fragment UserFields on User {
    id
    label
    name
    email
    role
    pass
    adresseId
  }
`

export const ziel = `
  fragment ZielFields on Ziel {
    id
    label
    apId
    typ
    jahr
    bezeichnung
    erreichung
    bemerkungen
    changedBy
  }
`

export const apBearbstandWerte = `
  fragment ApBearbstandWerteFields on ApBearbstandWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const apErfkritWerte = `
  fragment ApErfkritWerteFields on ApErfkritWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const apUmsetzungWerte = `
  fragment ApUmsetzungWerteFields on ApUmsetzungWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const popStatusWerte = `
  fragment PopStatusWerteFields on PopStatusWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const tpopApberrelevantGrundWerte = `
  fragment TpopApberrelevantGrundWerteFields on TpopApberrelevantGrundWerte {
    id
    code
    text
    label
    sort
    historic
    changedBy
  }
`

export const tpopEntwicklungWerte = `
  fragment TpopEntwicklungWerteFields on TpopEntwicklungWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const tpopkontrIdbiotuebereinstWerte = `
  fragment TpopkontrIdbiotuebereinstWerteFields on TpopkontrIdbiotuebereinstWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const tpopkontrTypWerte = `
  fragment TpopkontrTypWerteFields on TpopkontrTypWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const tpopkontrzaehlEinheitWerte = `
  fragment TpopkontrzaehlEinheitWerteFields on TpopkontrzaehlEinheitWerte {
    id
    code
    text
    correspondsToMassnAnzTriebe
    correspondsToMassnAnzPflanzen
    sort
    historic
    label
    changedBy
  }
`

export const tpopkontrzaehlMethodeWerte = `
  fragment TpopkontrzaehlMethodeWerteFields on TpopkontrzaehlMethodeWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const tpopmassnErfbeurtWerte = `
  fragment TpopmassnErfbeurtWerteFields on TpopmassnErfbeurtWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const tpopmassnTypWerte = `
  fragment TpopmassnTypWerteFields on TpopmassnTypWerte {
    id
    code
    text
    sort
    ansiedlung
    anpflanzung
    historic
    changedBy
  }
`

export const zielTypWerte = `
  fragment ZielTypWerteFields on ZielTypWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`
