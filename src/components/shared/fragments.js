import gql from 'graphql-tag'

export const adresse = gql`
  fragment AdresseFields on Adresse {
    id
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

export const ap = gql`
  fragment ApFields on Ap {
    id
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
    apId
    artId
    changedBy
  }
`

export const apber = gql`
  fragment ApberFields on Apber {
    id
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
    projId
    jahr
    bemerkungen
    changedBy
  }
`

export const assozart = gql`
  fragment AssozartFields on Assozart {
    id
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
    apId
    autor
    jahr
    titel
    url
    changedBy
  }
`

export const ekfzaehleinheit = gql`
  fragment EkfzaehleinheitFields on Ekfzaehleinheit {
    id
    apId
    zaehleinheitId
    bemerkungen
    changedBy
  }
`

export const erfkrit = gql`
  fragment ErfkritFields on Erfkrit {
    id
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
