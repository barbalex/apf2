import { gql } from '@apollo/client'

export const adresse = gql`
  fragment AdresseFields on Adresse {
    id
    label
    name
    adresse
    telefon
    email
    freiwErfko
    evabVorname
    evabNachname
    evabOrt
    changedBy
  }
`

export const aeTaxonomies = gql`
  fragment AeTaxonomiesFields on AeTaxonomy {
    taxonomieId
    taxonomieName
    id
    taxid
    familie
    artname
    taxArtName
    status
    artwert
  }
`

export const aeLrDelarze = gql`
  fragment AeLrDelarzeFields on AeLrDelarze {
    id
    label
    einheit
  }
`

export const ap = gql`
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

export const apart = gql`
  fragment ApartFields on Apart {
    id
    label
    apId
    artId
    changedBy
  }
`

export const apber = gql`
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
`

export const apberuebersicht = gql`
  fragment ApberuebersichtFields on Apberuebersicht {
    id
    label
    projId
    jahr
    historyDate
    bemerkungen
    changedBy
  }
`

export const apFile = gql`
  fragment ApFileFields on ApFile {
    id
    apId
    fileId
    fileMimeType
    name
    beschreibung
  }
`

export const apqk = gql`
  fragment ApqkFields on Apqk {
    apId
    qkName
  }
`

export const assozart = gql`
  fragment AssozartFields on Assozart {
    id
    label
    bemerkungen
    aeId
    apId
    changedBy
  }
`

export const beob = gql`
  fragment BeobFields on Beob {
    id
    label
    idField
    datum
    autor
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
    quelleId
    artIdOriginal
    infofloraInformiertDatum
    changedBy
  }
`

// TODO: beobQuelleWerte and other werte

export const currentIssue = gql`
  fragment CurrentIssueFields on Currentissue {
    id
    label
    sort
    title
    issue
  }
`

export const ekAbrechnungstypWerte = gql`
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

export const ekfrequenz = gql`
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

export const ekplan = gql`
  fragment EkplanFields on Ekplan {
    id
    tpopId
    jahr
    typ
    changedBy
  }
`

export const ekzaehleinheit = gql`
  fragment EkzaehleinheitFields on Ekzaehleinheit {
    id
    apId
    label
    zaehleinheitId
    zielrelevant
    sort
    bemerkungen
    changedBy
  }
`

export const erfkrit = gql`
  fragment ErfkritFields on Erfkrit {
    id
    label
    apId
    erfolg
    kriterien
    changedBy
  }
`

export const idealbiotop = gql`
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
export const idealbiotopFile = gql`
  fragment IdealbiotopFileFields on IdealbiotopFile {
    id
    idealbiotopId
    fileId
    fileMimeType
    name
    beschreibung
  }
`
export const message = gql`
  fragment MessageFields on Message {
    id
    message
    time
    active
  }
`

export const pop = gql`
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

export const popber = gql`
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

export const popFile = gql`
  fragment PopFileFields on PopFile {
    id
    popId
    fileId
    fileMimeType
    name
    beschreibung
  }
`

export const popmassnber = gql`
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

export const projekt = gql`
  fragment ProjektFields on Projekt {
    id
    label
    name
    changedBy
  }
`

export const qk = gql`
  fragment QkFields on Qk {
    name
    titel
    beschreibung
    sort
  }
`

export const tpop = gql`
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

export const tpopber = gql`
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

export const tpopfeldkontr = gql`
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
    bodenTyp
    bodenKalkgehalt
    bodenDurchlaessigkeit
    bodenHumus
    bodenNaehrstoffgehalt
    bodenAbtrag
    wasserhaushalt
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

export const tpopFile = gql`
  fragment TpopFileFields on TpopFile {
    id
    tpopId
    fileId
    fileMimeType
    name
    beschreibung
  }
`

export const tpopfreiwkontr = gql`
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

export const tpopkontr = gql`
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
    bodenTyp
    bodenKalkgehalt
    bodenDurchlaessigkeit
    bodenHumus
    bodenNaehrstoffgehalt
    bodenAbtrag
    wasserhaushalt
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

export const tpopkontrFile = gql`
  fragment TpopkontrFileFields on TpopkontrFile {
    id
    tpopkontrId
    fileId
    fileMimeType
    name
    beschreibung
  }
`

export const tpopkontrzaehl = gql`
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

export const tpopmassn = gql`
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

export const tpopmassnber = gql`
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

export const tpopmassnFile = gql`
  fragment TpopmassnFileFields on TpopmassnFile {
    id
    tpopmassnId
    fileId
    fileMimeType
    name
    beschreibung
  }
`

export const user = gql`
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

export const ziel = gql`
  fragment ZielFields on Ziel {
    id
    label
    apId
    typ
    jahr
    bezeichnung
    changedBy
  }
`

export const zielber = gql`
  fragment ZielberFields on Zielber {
    id
    label
    zielId
    jahr
    erreichung
    bemerkungen
    changedBy
  }
`

export const apBearbstandWerte = gql`
  fragment ApBearbstandWerteFields on ApBearbstandWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const apErfkritWerte = gql`
  fragment ApErfkritWerteFields on ApErfkritWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const apUmsetzungWerte = gql`
  fragment ApUmsetzungWerteFields on ApUmsetzungWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const beobQuelleWerte = gql`
  fragment BeobQuelleWerteFields on BeobQuelleWerte {
    id
    name
  }
`

export const nsBetreuung = gql`
  fragment NsBetreuungFields on NsBetreuung {
    id: gebietNr
    gebietNr
    gebietName
    firma
    projektleiter
    telefon
  }
`

export const popStatusWerte = gql`
  fragment PopStatusWerteFields on PopStatusWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const tpopApberrelevantGrundWerte = gql`
  fragment TpopApberrelevantGrundWerteFields on TpopApberrelevantGrundWerte {
    id
    code
    text
    label
    sort
    historic
    changed
    changedBy
  }
`

export const tpopEntwicklungWerte = gql`
  fragment TpopEntwicklungWerteFields on TpopEntwicklungWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const tpopkontrIdbiotuebereinstWerte = gql`
  fragment TpopkontrIdbiotuebereinstWerteFields on TpopkontrIdbiotuebereinstWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const tpopkontrTypWerte = gql`
  fragment TpopkontrTypWerteFields on TpopkontrTypWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const tpopkontrzaehlEinheitWerte = gql`
  fragment TpopkontrzaehlEinheitWerteFields on TpopkontrzaehlEinheitWerte {
    id
    code
    text
    sort
    historic
    label
    changedBy
  }
`

export const tpopkontrzaehlMethodeWerte = gql`
  fragment TpopkontrzaehlMethodeWerteFields on TpopkontrzaehlMethodeWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const tpopmassnErfbeurtWerte = gql`
  fragment TpopmassnErfbeurtWerteFields on TpopmassnErfbeurtWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`

export const tpopmassnTypWerte = gql`
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

export const zielTypWerte = gql`
  fragment ZielTypWerteFields on ZielTypWerte {
    id
    code
    text
    sort
    historic
    changedBy
  }
`
