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
