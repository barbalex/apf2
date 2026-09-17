import { graphql } from '../../gql/index.ts'

export const adresse = graphql(`
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
`)

export const aeTaxonomies = graphql(`
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
`)

export const aeLrDelarze = graphql(`
  fragment AeLrDelarzeFields on AeLrDelarze {
    id
    label
    einheit
  }
`)

export const ap = graphql(`
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
`)

export const apart = graphql(`
  fragment ApartFields on Apart {
    id
    label
    apId
    artId
    changedBy
  }
`)

export const apber = graphql(`
  fragment ApberFields on Apber {
    id
    label
    jahr
    situation
    vergleichVorjahrGesamtziel
    beurteilung
    veraenderungZumVorjahr
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
`)

export const apberuebersicht = graphql(`
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
`)

export const apFile = graphql(`
  fragment ApFileFields on ApFile {
    id
    apId
    fileId
    fileMimeType
    name
    beschreibung
  }
`)

export const apHistory = graphql(`
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
`)

export const apqk = graphql(`
  fragment ApqkFields on Apqk {
    apId
    qkName
  }
`)

export const assozart = graphql(`
  fragment AssozartFields on Assozart {
    id
    label
    bemerkungen
    aeId
    apId
    changedBy
  }
`)

export const beob = graphql(`
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
`)

export const currentIssue = graphql(`
  fragment CurrentIssueFields on Currentissue {
    id
    label
    sort
    title
    issue
  }
`)

export const ekAbrechnungstypWerte = graphql(`
  fragment EkAbrechnungstypWerteFields on EkAbrechnungstypWerte {
    id
    code
    label
    text
    sort
    historic
    changedBy
  }
`)

export const ekfrequenz = graphql(`
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
`)

export const ekplan = graphql(`
  fragment EkplanFields on Ekplan {
    id
    tpopId
    jahr
    typ
    changedBy
  }
`)

export const ekzaehleinheit = graphql(`
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
`)

export const erfkrit = graphql(`
  fragment ErfkritFields on Erfkrit {
    id
    label
    apId
    erfolg
    kriterien
    changedBy
  }
`)

export const idealbiotop = graphql(`
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
`)
export const idealbiotopFile = graphql(`
  fragment IdealbiotopFileFields on IdealbiotopFile {
    id
    idealbiotopId
    fileId
    fileMimeType
    name
    beschreibung
  }
`)
export const message = graphql(`
  fragment MessageFields on Message {
    id
    message
    time
    active
  }
`)

export const pop = graphql(`
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
`)

export const popber = graphql(`
  fragment PopberFields on Popber {
    id
    label
    popId
    jahr
    entwicklung
    bemerkungen
    changedBy
  }
`)

export const popFile = graphql(`
  fragment PopFileFields on PopFile {
    id
    popId
    fileId
    fileMimeType
    name
    beschreibung
  }
`)

export const popHistory = graphql(`
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
`)

export const popmassnber = graphql(`
  fragment PopmassnberFields on Popmassnber {
    id
    label
    popId
    jahr
    beurteilung
    bemerkungen
    changedBy
  }
`)

export const projekt = graphql(`
  fragment ProjektFields on Projekt {
    id
    label
    name
    changedBy
  }
`)

export const qk = graphql(`
  fragment QkFields on Qk {
    name
    titel
    beschreibung
    sort
  }
`)

export const tpop = graphql(`
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
`)

export const tpopber = graphql(`
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
`)

export const tpopfeldkontr = graphql(`
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
`)

export const tpopFile = graphql(`
  fragment TpopFileFields on TpopFile {
    id
    tpopId
    fileId
    fileMimeType
    name
    beschreibung
  }
`)

export const tpopfreiwkontr = graphql(`
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
`)

export const tpopHistory = graphql(`
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
`)

export const tpopkontr = graphql(`
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
`)

export const tpopkontrFile = graphql(`
  fragment TpopkontrFileFields on TpopkontrFile {
    id
    tpopkontrId
    fileId
    fileMimeType
    name
    beschreibung
  }
`)

export const tpopkontrzaehl = graphql(`
  fragment TpopkontrzaehlFields on Tpopkontrzaehl {
    id
    label
    tpopkontrId
    anzahl
    einheit
    methode
    changedBy
  }
`)

export const tpopmassn = graphql(`
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
`)

export const tpopmassnber = graphql(`
  fragment TpopmassnberFields on Tpopmassnber {
    id
    label
    tpopId
    jahr
    beurteilung
    bemerkungen
    changedBy
  }
`)

export const tpopmassnFile = graphql(`
  fragment TpopmassnFileFields on TpopmassnFile {
    id
    tpopmassnId
    fileId
    fileMimeType
    name
    beschreibung
  }
`)

export const user = graphql(`
  fragment UserFields on User {
    id
    label
    name
    email
    role
    pass
    adresseId
  }
`)

export const ziel = graphql(`
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
`)

export const apBearbstandWerte = graphql(`
  fragment ApBearbstandWerteFields on ApBearbstandWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`)

export const apErfkritWerte = graphql(`
  fragment ApErfkritWerteFields on ApErfkritWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`)

export const apUmsetzungWerte = graphql(`
  fragment ApUmsetzungWerteFields on ApUmsetzungWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`)

export const popStatusWerte = graphql(`
  fragment PopStatusWerteFields on PopStatusWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`)

export const tpopApberrelevantGrundWerte = graphql(`
  fragment TpopApberrelevantGrundWerteFields on TpopApberrelevantGrundWerte {
    id
    code
    text
    label
    sort
    historic
    changedBy
  }
`)

export const tpopEntwicklungWerte = graphql(`
  fragment TpopEntwicklungWerteFields on TpopEntwicklungWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`)

export const tpopkontrIdbiotuebereinstWerte = graphql(`
  fragment TpopkontrIdbiotuebereinstWerteFields on TpopkontrIdbiotuebereinstWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`)

export const tpopkontrTypWerte = graphql(`
  fragment TpopkontrTypWerteFields on TpopkontrTypWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`)

export const tpopkontrzaehlEinheitWerte = graphql(`
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
`)

export const tpopkontrzaehlMethodeWerte = graphql(`
  fragment TpopkontrzaehlMethodeWerteFields on TpopkontrzaehlMethodeWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`)

export const tpopmassnErfbeurtWerte = graphql(`
  fragment TpopmassnErfbeurtWerteFields on TpopmassnErfbeurtWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`)

export const tpopmassnTypWerte = graphql(`
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
`)

export const zielTypWerte = graphql(`
  fragment ZielTypWerteFields on ZielTypWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`)
