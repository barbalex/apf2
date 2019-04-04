import gql from 'graphql-tag'

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

export const aeEigenschaften = gql`
  fragment AeEigenschaftenFields on AeEigenschaften {
    id
    taxid
    familie
    artname
    namedeutsch
    status
    artwert
    kefkontrolljahr
    fnsjahresartjahr
    kefart
  }
`

export const aeLrDelarze = gql`
  fragment AeLrDelarzeFields on AeLrdelarze {
    id
    label
    einheit
    sort
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
    bemerkungen
    changedBy
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
    idField
    datum
    autor
    x
    y
    data
    artId
    tpopId
    nichtZuordnen
    bemerkungen
    quelleId
    artIdOriginal
    changedBy
  }
`

// TODO: beobQuelleWerte and other werte

export const ber = gql`
  fragment BerFields on Ber {
    id
    label
    apId
    autor
    jahr
    titel
    url
    changedBy
  }
`

export const currentIssue = gql`
  fragment CurrentIssueFields on Currentissue {
    id
    label
    sort
    title
    issue
  }
`

export const ekfzaehleinheit = gql`
  fragment EkfzaehleinheitFields on Ekfzaehleinheit {
    id
    apId
    label
    zaehleinheitId
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
    x
    y
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
    name
    changedBy
  }
`

export const tpop = gql`
  fragment TpopFields on Tpop {
    id
    popId
    nr
    gemeinde
    flurname
    x
    y
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
    bekanntSeit
    eigentuemer
    kontakt
    nutzungszone
    bewirtschafter
    bewirtschaftung
    kontrollfrequenz
    kontrollfrequenzFreiwillige
    bemerkungen
    statusUnklar
    changedBy
  }
`

export const tpopber = gql`
  fragment TpopberFields on Tpopber {
    id
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
    typ
    datum
    jahr
    jungpflanzenAnzahl
    vitalitaet
    ueberlebensrate
    entwicklung
    ursachen
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
    gefaehrdung
    tpopId
    bearbeiter
    planVorhanden
    jungpflanzenVorhanden
    changedBy
  }
`

export const tpopfreiwkontr = gql`
  fragment TpopfreiwkontrFields on Tpopkontr {
    id
    typ
    ekfVerifiziert
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
    changedBy
  }
`

export const tpopkontr = gql`
  fragment TpopkontrFields on Tpopkontr {
    id
    typ
    datum
    jahr
    jungpflanzenAnzahl
    vitalitaet
    ueberlebensrate
    entwicklung
    ursachen
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
    gefaehrdung
    tpopId
    bearbeiter
    planVorhanden
    jungpflanzenVorhanden
    changedBy
  }
`

export const tpopkontrzaehl = gql`
  fragment TpopkontrzaehlFields on Tpopkontrzaehl {
    id
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
    wirtspflanze
    herkunftPop
    sammeldatum
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
    tpopId
    jahr
    beurteilung
    bemerkungen
    changedBy
  }
`

export const user = gql`
  fragment UserFields on User {
    id
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
    changedBy
  }
`

export const apErfkritWerte = gql`
  fragment ApErfkritWerteFields on ApErfkritWerte {
    id
    code
    text
    sort
    changedBy
  }
`

export const apUmsetzungWerte = gql`
  fragment ApUmsetzungWerteFields on ApUmsetzungWerte {
    id
    code
    text
    sort
    changedBy
  }
`

export const beobQuelleWerte = gql`
  fragment BeobQuelleWerteFields on BeobQuelleWerte {
    id
    name
  }
`

export const popStatusWerte = gql`
  fragment PopStatusWerteFields on PopStatusWerte {
    id
    code
    text
    sort
    changedBy
  }
`

export const tpopApberrelevantWerte = gql`
  fragment TpopApberrelevantWerteFields on TpopApberrelevantWerte {
    id
    code
    text
    changedBy
  }
`

export const tpopEntwicklungWerte = gql`
  fragment TpopEntwicklungWerteFields on TpopEntwicklungWerte {
    id
    code
    text
    sort
    changedBy
  }
`

export const tpopkontrFrequenzWerte = gql`
  fragment TpopkontrFrequenzWerteFields on TpopkontrFrequenzWerte {
    id
    code
    text
    sort
    changedBy
  }
`

export const tpopkontrIdbiotuebereinstWerte = gql`
  fragment TpopkontrIdbiotuebereinstWerteFields on TpopkontrIdbiotuebereinstWerte {
    id
    code
    text
    sort
    changedBy
  }
`

export const tpopkontrTypWerte = gql`
  fragment TpopkontrTypWerteFields on TpopkontrTypWerte {
    id
    code
    text
    sort
    changedBy
  }
`

export const tpopkontrzaehlEinheitWerte = gql`
  fragment TpopkontrzaehlEinheitWerteFields on TpopkontrzaehlEinheitWerte {
    id
    code
    text
    sort
    changedBy
  }
`

export const tpopkontrzaehlMethodeWerte = gql`
  fragment TpopkontrzaehlMethodeWerteFields on TpopkontrzaehlMethodeWerte {
    id
    code
    text
    sort
    changedBy
  }
`

export const tpopmassnErfbeurtWerte = gql`
  fragment TpopmassnErfbeurtWerteFields on TpopmassnErfbeurtWerte {
    id
    code
    text
    sort
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
    changedBy
  }
`

export const zielTypWerte = gql`
  fragment ZielTypWerteFields on ZielTypWerte {
    id
    code
    text
    sort
    changedBy
  }
`
