/* eslint-disable */
import { print } from 'graphql';
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment AdresseFields on Adresse {\n    id\n    label\n    name\n    adresse\n    telefon\n    email\n    freiwErfko\n    changedBy\n  }\n": typeof types.AdresseFieldsFragmentDoc,
    "\n  fragment AeTaxonomiesFields on AeTaxonomy {\n    taxonomieId\n    taxonomieName\n    id\n    taxid\n    familie\n    artname\n    taxArtName\n    artwert\n  }\n": typeof types.AeTaxonomiesFieldsFragmentDoc,
    "\n  fragment AeLrDelarzeFields on AeLrDelarze {\n    id\n    label\n    einheit\n  }\n": typeof types.AeLrDelarzeFieldsFragmentDoc,
    "\n  fragment ApFields on Ap {\n    id\n    label\n    artId\n    bearbeitung\n    startJahr\n    umsetzung\n    artId\n    bearbeiter\n    ekfBeobachtungszeitpunkt\n    projId\n    changedBy\n  }\n": typeof types.ApFieldsFragmentDoc,
    "\n  fragment ApartFields on Apart {\n    id\n    label\n    apId\n    artId\n    changedBy\n  }\n": typeof types.ApartFieldsFragmentDoc,
    "\n  fragment ApberFields on Apber {\n    id\n    label\n    jahr\n    situation\n    vergleichVorjahrGesamtziel\n    beurteilung\n    apberAnalyse\n    konsequenzenUmsetzung\n    konsequenzenErfolgskontrolle\n    biotopeNeue\n    biotopeOptimieren\n    massnahmenOptimieren\n    wirkungAufArt\n    datum\n    massnahmenApBearb\n    massnahmenPlanungVsAusfuehrung\n    apId\n    bearbeiter\n    changedBy\n  }\n": typeof types.ApberFieldsFragmentDoc,
    "\n  fragment ApberuebersichtFields on Apberuebersicht {\n    id\n    label\n    projId\n    jahr\n    historyDate\n    historyFixed\n    bemerkungen\n    changedBy\n  }\n": typeof types.ApberuebersichtFieldsFragmentDoc,
    "\n  fragment ApFileFields on ApFile {\n    id\n    apId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n": typeof types.ApFileFieldsFragmentDoc,
    "\n  fragment ApHistoryFields on ApHistory {\n    id\n    year\n    artId\n    bearbeitung\n    startJahr\n    umsetzung\n    artId\n    bearbeiter\n    ekfBeobachtungszeitpunkt\n    projId\n    createdAt\n    updatedAt\n    changedBy\n  }\n": typeof types.ApHistoryFieldsFragmentDoc,
    "\n  fragment ApqkFields on Apqk {\n    apId\n    qkName\n  }\n": typeof types.ApqkFieldsFragmentDoc,
    "\n  fragment AssozartFields on Assozart {\n    id\n    label\n    bemerkungen\n    aeId\n    apId\n    changedBy\n  }\n": typeof types.AssozartFieldsFragmentDoc,
    "\n  fragment BeobFields on Beob {\n    id\n    label\n    idField\n    datum\n    autor\n    absenz\n    lv95X\n    wgs84Lat\n    lv95Y\n    wgs84Long\n    geomPoint {\n      geojson\n      #srid\n      x\n      y\n    }\n    data\n    artId\n    tpopId\n    nichtZuordnen\n    bemerkungen\n    quelle\n    artIdOriginal\n    infofloraInformiertDatum\n    changedBy\n  }\n": typeof types.BeobFieldsFragmentDoc,
    "\n  fragment CurrentIssueFields on Currentissue {\n    id\n    label\n    sort\n    title\n    issue\n  }\n": typeof types.CurrentIssueFieldsFragmentDoc,
    "\n  fragment EkAbrechnungstypWerteFields on EkAbrechnungstypWerte {\n    id\n    code\n    label\n    text\n    sort\n    historic\n    changedBy\n  }\n": typeof types.EkAbrechnungstypWerteFieldsFragmentDoc,
    "\n  fragment EkfrequenzFields on Ekfrequenz {\n    id\n    apId\n    ektyp\n    anwendungsfall\n    code\n    kontrolljahre\n    kontrolljahreAb\n    bemerkungen\n    sort\n    ekAbrechnungstyp\n    changedBy\n  }\n": typeof types.EkfrequenzFieldsFragmentDoc,
    "\n  fragment EkplanFields on Ekplan {\n    id\n    tpopId\n    jahr\n    typ\n    changedBy\n  }\n": typeof types.EkplanFieldsFragmentDoc,
    "\n  fragment EkzaehleinheitFields on Ekzaehleinheit {\n    id\n    apId\n    label\n    zaehleinheitId\n    zielrelevant\n    notMassnCountUnit\n    sort\n    bemerkungen\n    changedBy\n  }\n": typeof types.EkzaehleinheitFieldsFragmentDoc,
    "\n  fragment ErfkritFields on Erfkrit {\n    id\n    label\n    apId\n    erfolg\n    kriterien\n    changedBy\n  }\n": typeof types.ErfkritFieldsFragmentDoc,
    "\n  fragment IdealbiotopFields on Idealbiotop {\n    id\n    apId\n    erstelldatum\n    hoehenlage\n    region\n    exposition\n    besonnung\n    hangneigung\n    bodenTyp\n    bodenKalkgehalt\n    bodenDurchlaessigkeit\n    bodenHumus\n    bodenNaehrstoffgehalt\n    wasserhaushalt\n    konkurrenz\n    moosschicht\n    krautschicht\n    strauchschicht\n    baumschicht\n    bemerkungen\n    changedBy\n  }\n": typeof types.IdealbiotopFieldsFragmentDoc,
    "\n  fragment IdealbiotopFileFields on IdealbiotopFile {\n    id\n    idealbiotopId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n": typeof types.IdealbiotopFileFieldsFragmentDoc,
    "\n  fragment MessageFields on Message {\n    id\n    message\n    time\n    active\n  }\n": typeof types.MessageFieldsFragmentDoc,
    "\n  fragment PopFields on Pop {\n    id\n    label\n    apId\n    nr\n    name\n    status\n    statusUnklar\n    statusUnklarBegruendung\n    bekanntSeit\n    lv95X\n    wgs84Lat\n    lv95Y\n    wgs84Long\n    geomPoint {\n      geojson\n      #srid\n      x\n      y\n    }\n    changedBy\n  }\n": typeof types.PopFieldsFragmentDoc,
    "\n  fragment PopberFields on Popber {\n    id\n    label\n    popId\n    jahr\n    entwicklung\n    bemerkungen\n    changedBy\n  }\n": typeof types.PopberFieldsFragmentDoc,
    "\n  fragment PopFileFields on PopFile {\n    id\n    popId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n": typeof types.PopFileFieldsFragmentDoc,
    "\n  fragment PopHistoryFields on PopHistory {\n    id\n    year\n    apId\n    nr\n    name\n    status\n    statusUnklar\n    statusUnklarBegruendung\n    bekanntSeit\n    geomPoint {\n      geojson\n      x\n      y\n    }\n    createdAt\n    updatedAt\n    changedBy\n  }\n": typeof types.PopHistoryFieldsFragmentDoc,
    "\n  fragment PopmassnberFields on Popmassnber {\n    id\n    label\n    popId\n    jahr\n    beurteilung\n    bemerkungen\n    changedBy\n  }\n": typeof types.PopmassnberFieldsFragmentDoc,
    "\n  fragment ProjektFields on Projekt {\n    id\n    label\n    name\n    changedBy\n  }\n": typeof types.ProjektFieldsFragmentDoc,
    "\n  fragment QkFields on Qk {\n    name\n    titel\n    beschreibung\n    sort\n  }\n": typeof types.QkFieldsFragmentDoc,
    "\n  fragment TpopFields on Tpop {\n    id\n    label\n    popId\n    nr\n    gemeinde\n    flurname\n    lv95X\n    wgs84Lat\n    lv95Y\n    wgs84Long\n    geomPoint {\n      geojson\n      #srid\n      x\n      y\n    }\n    radius\n    hoehe\n    exposition\n    klima\n    neigung\n    bodenTyp\n    bodenKalkgehalt\n    bodenDurchlaessigkeit\n    bodenHumus\n    bodenNaehrstoffgehalt\n    bodenAbtrag\n    wasserhaushalt\n    beschreibung\n    katasterNr\n    status\n    statusUnklarGrund\n    apberRelevant\n    apberRelevantGrund\n    bekanntSeit\n    eigentuemer\n    kontakt\n    nutzungszone\n    bewirtschafter\n    bewirtschaftung\n    ekfrequenz\n    ekfrequenzAbweichend\n    ekfrequenzStartjahr\n    ekfKontrolleur\n    bemerkungen\n    statusUnklar\n    changedBy\n  }\n": typeof types.TpopFieldsFragmentDoc,
    "\n  fragment TpopberFields on Tpopber {\n    id\n    label\n    tpopId\n    jahr\n    entwicklung\n    tpopEntwicklungWerteByEntwicklung {\n      id\n      code\n      text\n      sort\n    }\n    bemerkungen\n    changedBy\n  }\n": typeof types.TpopberFieldsFragmentDoc,
    "\n  fragment TpopfeldkontrFields on Tpopkontr {\n    id\n    labelEk\n    typ\n    datum\n    jahr\n    vitalitaet\n    ueberlebensrate\n    entwicklung\n    ursachen\n    gefaehrdung\n    erfolgsbeurteilung\n    umsetzungAendern\n    kontrolleAendern\n    bemerkungen\n    lrDelarze\n    flaeche\n    lrUmgebungDelarze\n    vegetationstyp\n    konkurrenz\n    moosschicht\n    krautschicht\n    strauchschicht\n    baumschicht\n    idealbiotopUebereinstimmung\n    handlungsbedarf\n    flaecheUeberprueft\n    deckungVegetation\n    deckungNackterBoden\n    deckungApArt\n    vegetationshoeheMaximum\n    vegetationshoeheMittel\n    tpopId\n    bearbeiter\n    planVorhanden\n    jungpflanzenVorhanden\n    apberNichtRelevant\n    apberNichtRelevantGrund\n    changedBy\n  }\n": typeof types.TpopfeldkontrFieldsFragmentDoc,
    "\n  fragment TpopFileFields on TpopFile {\n    id\n    tpopId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n": typeof types.TpopFileFieldsFragmentDoc,
    "\n  fragment TpopfreiwkontrFields on Tpopkontr {\n    id\n    labelEkf\n    typ\n    ekfBemerkungen\n    datum\n    jahr\n    bemerkungen\n    flaecheUeberprueft\n    deckungVegetation\n    deckungNackterBoden\n    deckungApArt\n    vegetationshoeheMaximum\n    vegetationshoeheMittel\n    gefaehrdung\n    tpopId\n    bearbeiter\n    planVorhanden\n    jungpflanzenVorhanden\n    apberNichtRelevant\n    apberNichtRelevantGrund\n    changedBy\n  }\n": typeof types.TpopfreiwkontrFieldsFragmentDoc,
    "\n  fragment TpopHistoryFields on TpopHistory {\n    id\n    year\n    popId\n    nr\n    gemeinde\n    flurname\n    geomPoint {\n      geojson\n      x\n      y\n    }\n    radius\n    hoehe\n    exposition\n    klima\n    neigung\n    beschreibung\n    katasterNr\n    status\n    statusUnklarGrund\n    apberRelevant\n    apberRelevantGrund\n    bekanntSeit\n    eigentuemer\n    kontakt\n    nutzungszone\n    bewirtschafter\n    bewirtschaftung\n    ekfrequenz\n    ekfrequenzAbweichend\n    ekfrequenzStartjahr\n    ekfKontrolleur\n    bemerkungen\n    statusUnklar\n    createdAt\n    updatedAt\n    changedBy\n  }\n": typeof types.TpopHistoryFieldsFragmentDoc,
    "\n  fragment TpopkontrFields on Tpopkontr {\n    id\n    typ\n    datum\n    jahr\n    vitalitaet\n    ueberlebensrate\n    entwicklung\n    ursachen\n    gefaehrdung\n    erfolgsbeurteilung\n    umsetzungAendern\n    kontrolleAendern\n    bemerkungen\n    lrDelarze\n    flaeche\n    lrUmgebungDelarze\n    vegetationstyp\n    konkurrenz\n    moosschicht\n    krautschicht\n    strauchschicht\n    baumschicht\n    idealbiotopUebereinstimmung\n    handlungsbedarf\n    flaecheUeberprueft\n    deckungVegetation\n    deckungNackterBoden\n    deckungApArt\n    vegetationshoeheMaximum\n    vegetationshoeheMittel\n    tpopId\n    bearbeiter\n    planVorhanden\n    apberNichtRelevant\n    apberNichtRelevantGrund\n    jungpflanzenVorhanden\n    changedBy\n  }\n": typeof types.TpopkontrFieldsFragmentDoc,
    "\n  fragment TpopkontrFileFields on TpopkontrFile {\n    id\n    tpopkontrId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n": typeof types.TpopkontrFileFieldsFragmentDoc,
    "\n  fragment TpopkontrzaehlFields on Tpopkontrzaehl {\n    id\n    label\n    tpopkontrId\n    anzahl\n    einheit\n    methode\n    changedBy\n  }\n": typeof types.TpopkontrzaehlFieldsFragmentDoc,
    "\n  fragment TpopmassnFields on Tpopmassn {\n    id\n    label\n    typ\n    beschreibung\n    jahr\n    datum\n    bemerkungen\n    planBezeichnung\n    flaeche\n    markierung\n    anzTriebe\n    anzPflanzen\n    anzPflanzstellen\n    zieleinheitEinheit\n    zieleinheitAnzahl\n    wirtspflanze\n    herkunftPop\n    sammeldatum\n    vonAnzahlIndividuen\n    form\n    pflanzanordnung\n    tpopId\n    bearbeiter\n    planVorhanden\n    changedBy\n  }\n": typeof types.TpopmassnFieldsFragmentDoc,
    "\n  fragment TpopmassnberFields on Tpopmassnber {\n    id\n    label\n    tpopId\n    jahr\n    beurteilung\n    bemerkungen\n    changedBy\n  }\n": typeof types.TpopmassnberFieldsFragmentDoc,
    "\n  fragment TpopmassnFileFields on TpopmassnFile {\n    id\n    tpopmassnId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n": typeof types.TpopmassnFileFieldsFragmentDoc,
    "\n  fragment UserFields on User {\n    id\n    label\n    name\n    email\n    role\n    pass\n    adresseId\n  }\n": typeof types.UserFieldsFragmentDoc,
    "\n  fragment ZielFields on Ziel {\n    id\n    label\n    apId\n    typ\n    jahr\n    bezeichnung\n    erreichung\n    bemerkungen\n    changedBy\n  }\n": typeof types.ZielFieldsFragmentDoc,
    "\n  fragment ApBearbstandWerteFields on ApBearbstandWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": typeof types.ApBearbstandWerteFieldsFragmentDoc,
    "\n  fragment ApErfkritWerteFields on ApErfkritWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": typeof types.ApErfkritWerteFieldsFragmentDoc,
    "\n  fragment ApUmsetzungWerteFields on ApUmsetzungWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": typeof types.ApUmsetzungWerteFieldsFragmentDoc,
    "\n  fragment PopStatusWerteFields on PopStatusWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": typeof types.PopStatusWerteFieldsFragmentDoc,
    "\n  fragment TpopApberrelevantGrundWerteFields on TpopApberrelevantGrundWerte {\n    id\n    code\n    text\n    label\n    sort\n    historic\n    changedBy\n  }\n": typeof types.TpopApberrelevantGrundWerteFieldsFragmentDoc,
    "\n  fragment TpopEntwicklungWerteFields on TpopEntwicklungWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": typeof types.TpopEntwicklungWerteFieldsFragmentDoc,
    "\n  fragment TpopkontrIdbiotuebereinstWerteFields on TpopkontrIdbiotuebereinstWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": typeof types.TpopkontrIdbiotuebereinstWerteFieldsFragmentDoc,
    "\n  fragment TpopkontrTypWerteFields on TpopkontrTypWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": typeof types.TpopkontrTypWerteFieldsFragmentDoc,
    "\n  fragment TpopkontrzaehlEinheitWerteFields on TpopkontrzaehlEinheitWerte {\n    id\n    code\n    text\n    correspondsToMassnAnzTriebe\n    correspondsToMassnAnzPflanzen\n    sort\n    historic\n    label\n    changedBy\n  }\n": typeof types.TpopkontrzaehlEinheitWerteFieldsFragmentDoc,
    "\n  fragment TpopkontrzaehlMethodeWerteFields on TpopkontrzaehlMethodeWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": typeof types.TpopkontrzaehlMethodeWerteFieldsFragmentDoc,
    "\n  fragment TpopmassnErfbeurtWerteFields on TpopmassnErfbeurtWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": typeof types.TpopmassnErfbeurtWerteFieldsFragmentDoc,
    "\n  fragment TpopmassnTypWerteFields on TpopmassnTypWerte {\n    id\n    code\n    text\n    sort\n    ansiedlung\n    anpflanzung\n    historic\n    changedBy\n  }\n": typeof types.TpopmassnTypWerteFieldsFragmentDoc,
    "\n  fragment ZielTypWerteFields on ZielTypWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": typeof types.ZielTypWerteFieldsFragmentDoc,
};
const documents: Documents = {
    "\n  fragment AdresseFields on Adresse {\n    id\n    label\n    name\n    adresse\n    telefon\n    email\n    freiwErfko\n    changedBy\n  }\n": types.AdresseFieldsFragmentDoc,
    "\n  fragment AeTaxonomiesFields on AeTaxonomy {\n    taxonomieId\n    taxonomieName\n    id\n    taxid\n    familie\n    artname\n    taxArtName\n    artwert\n  }\n": types.AeTaxonomiesFieldsFragmentDoc,
    "\n  fragment AeLrDelarzeFields on AeLrDelarze {\n    id\n    label\n    einheit\n  }\n": types.AeLrDelarzeFieldsFragmentDoc,
    "\n  fragment ApFields on Ap {\n    id\n    label\n    artId\n    bearbeitung\n    startJahr\n    umsetzung\n    artId\n    bearbeiter\n    ekfBeobachtungszeitpunkt\n    projId\n    changedBy\n  }\n": types.ApFieldsFragmentDoc,
    "\n  fragment ApartFields on Apart {\n    id\n    label\n    apId\n    artId\n    changedBy\n  }\n": types.ApartFieldsFragmentDoc,
    "\n  fragment ApberFields on Apber {\n    id\n    label\n    jahr\n    situation\n    vergleichVorjahrGesamtziel\n    beurteilung\n    apberAnalyse\n    konsequenzenUmsetzung\n    konsequenzenErfolgskontrolle\n    biotopeNeue\n    biotopeOptimieren\n    massnahmenOptimieren\n    wirkungAufArt\n    datum\n    massnahmenApBearb\n    massnahmenPlanungVsAusfuehrung\n    apId\n    bearbeiter\n    changedBy\n  }\n": types.ApberFieldsFragmentDoc,
    "\n  fragment ApberuebersichtFields on Apberuebersicht {\n    id\n    label\n    projId\n    jahr\n    historyDate\n    historyFixed\n    bemerkungen\n    changedBy\n  }\n": types.ApberuebersichtFieldsFragmentDoc,
    "\n  fragment ApFileFields on ApFile {\n    id\n    apId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n": types.ApFileFieldsFragmentDoc,
    "\n  fragment ApHistoryFields on ApHistory {\n    id\n    year\n    artId\n    bearbeitung\n    startJahr\n    umsetzung\n    artId\n    bearbeiter\n    ekfBeobachtungszeitpunkt\n    projId\n    createdAt\n    updatedAt\n    changedBy\n  }\n": types.ApHistoryFieldsFragmentDoc,
    "\n  fragment ApqkFields on Apqk {\n    apId\n    qkName\n  }\n": types.ApqkFieldsFragmentDoc,
    "\n  fragment AssozartFields on Assozart {\n    id\n    label\n    bemerkungen\n    aeId\n    apId\n    changedBy\n  }\n": types.AssozartFieldsFragmentDoc,
    "\n  fragment BeobFields on Beob {\n    id\n    label\n    idField\n    datum\n    autor\n    absenz\n    lv95X\n    wgs84Lat\n    lv95Y\n    wgs84Long\n    geomPoint {\n      geojson\n      #srid\n      x\n      y\n    }\n    data\n    artId\n    tpopId\n    nichtZuordnen\n    bemerkungen\n    quelle\n    artIdOriginal\n    infofloraInformiertDatum\n    changedBy\n  }\n": types.BeobFieldsFragmentDoc,
    "\n  fragment CurrentIssueFields on Currentissue {\n    id\n    label\n    sort\n    title\n    issue\n  }\n": types.CurrentIssueFieldsFragmentDoc,
    "\n  fragment EkAbrechnungstypWerteFields on EkAbrechnungstypWerte {\n    id\n    code\n    label\n    text\n    sort\n    historic\n    changedBy\n  }\n": types.EkAbrechnungstypWerteFieldsFragmentDoc,
    "\n  fragment EkfrequenzFields on Ekfrequenz {\n    id\n    apId\n    ektyp\n    anwendungsfall\n    code\n    kontrolljahre\n    kontrolljahreAb\n    bemerkungen\n    sort\n    ekAbrechnungstyp\n    changedBy\n  }\n": types.EkfrequenzFieldsFragmentDoc,
    "\n  fragment EkplanFields on Ekplan {\n    id\n    tpopId\n    jahr\n    typ\n    changedBy\n  }\n": types.EkplanFieldsFragmentDoc,
    "\n  fragment EkzaehleinheitFields on Ekzaehleinheit {\n    id\n    apId\n    label\n    zaehleinheitId\n    zielrelevant\n    notMassnCountUnit\n    sort\n    bemerkungen\n    changedBy\n  }\n": types.EkzaehleinheitFieldsFragmentDoc,
    "\n  fragment ErfkritFields on Erfkrit {\n    id\n    label\n    apId\n    erfolg\n    kriterien\n    changedBy\n  }\n": types.ErfkritFieldsFragmentDoc,
    "\n  fragment IdealbiotopFields on Idealbiotop {\n    id\n    apId\n    erstelldatum\n    hoehenlage\n    region\n    exposition\n    besonnung\n    hangneigung\n    bodenTyp\n    bodenKalkgehalt\n    bodenDurchlaessigkeit\n    bodenHumus\n    bodenNaehrstoffgehalt\n    wasserhaushalt\n    konkurrenz\n    moosschicht\n    krautschicht\n    strauchschicht\n    baumschicht\n    bemerkungen\n    changedBy\n  }\n": types.IdealbiotopFieldsFragmentDoc,
    "\n  fragment IdealbiotopFileFields on IdealbiotopFile {\n    id\n    idealbiotopId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n": types.IdealbiotopFileFieldsFragmentDoc,
    "\n  fragment MessageFields on Message {\n    id\n    message\n    time\n    active\n  }\n": types.MessageFieldsFragmentDoc,
    "\n  fragment PopFields on Pop {\n    id\n    label\n    apId\n    nr\n    name\n    status\n    statusUnklar\n    statusUnklarBegruendung\n    bekanntSeit\n    lv95X\n    wgs84Lat\n    lv95Y\n    wgs84Long\n    geomPoint {\n      geojson\n      #srid\n      x\n      y\n    }\n    changedBy\n  }\n": types.PopFieldsFragmentDoc,
    "\n  fragment PopberFields on Popber {\n    id\n    label\n    popId\n    jahr\n    entwicklung\n    bemerkungen\n    changedBy\n  }\n": types.PopberFieldsFragmentDoc,
    "\n  fragment PopFileFields on PopFile {\n    id\n    popId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n": types.PopFileFieldsFragmentDoc,
    "\n  fragment PopHistoryFields on PopHistory {\n    id\n    year\n    apId\n    nr\n    name\n    status\n    statusUnklar\n    statusUnklarBegruendung\n    bekanntSeit\n    geomPoint {\n      geojson\n      x\n      y\n    }\n    createdAt\n    updatedAt\n    changedBy\n  }\n": types.PopHistoryFieldsFragmentDoc,
    "\n  fragment PopmassnberFields on Popmassnber {\n    id\n    label\n    popId\n    jahr\n    beurteilung\n    bemerkungen\n    changedBy\n  }\n": types.PopmassnberFieldsFragmentDoc,
    "\n  fragment ProjektFields on Projekt {\n    id\n    label\n    name\n    changedBy\n  }\n": types.ProjektFieldsFragmentDoc,
    "\n  fragment QkFields on Qk {\n    name\n    titel\n    beschreibung\n    sort\n  }\n": types.QkFieldsFragmentDoc,
    "\n  fragment TpopFields on Tpop {\n    id\n    label\n    popId\n    nr\n    gemeinde\n    flurname\n    lv95X\n    wgs84Lat\n    lv95Y\n    wgs84Long\n    geomPoint {\n      geojson\n      #srid\n      x\n      y\n    }\n    radius\n    hoehe\n    exposition\n    klima\n    neigung\n    bodenTyp\n    bodenKalkgehalt\n    bodenDurchlaessigkeit\n    bodenHumus\n    bodenNaehrstoffgehalt\n    bodenAbtrag\n    wasserhaushalt\n    beschreibung\n    katasterNr\n    status\n    statusUnklarGrund\n    apberRelevant\n    apberRelevantGrund\n    bekanntSeit\n    eigentuemer\n    kontakt\n    nutzungszone\n    bewirtschafter\n    bewirtschaftung\n    ekfrequenz\n    ekfrequenzAbweichend\n    ekfrequenzStartjahr\n    ekfKontrolleur\n    bemerkungen\n    statusUnklar\n    changedBy\n  }\n": types.TpopFieldsFragmentDoc,
    "\n  fragment TpopberFields on Tpopber {\n    id\n    label\n    tpopId\n    jahr\n    entwicklung\n    tpopEntwicklungWerteByEntwicklung {\n      id\n      code\n      text\n      sort\n    }\n    bemerkungen\n    changedBy\n  }\n": types.TpopberFieldsFragmentDoc,
    "\n  fragment TpopfeldkontrFields on Tpopkontr {\n    id\n    labelEk\n    typ\n    datum\n    jahr\n    vitalitaet\n    ueberlebensrate\n    entwicklung\n    ursachen\n    gefaehrdung\n    erfolgsbeurteilung\n    umsetzungAendern\n    kontrolleAendern\n    bemerkungen\n    lrDelarze\n    flaeche\n    lrUmgebungDelarze\n    vegetationstyp\n    konkurrenz\n    moosschicht\n    krautschicht\n    strauchschicht\n    baumschicht\n    idealbiotopUebereinstimmung\n    handlungsbedarf\n    flaecheUeberprueft\n    deckungVegetation\n    deckungNackterBoden\n    deckungApArt\n    vegetationshoeheMaximum\n    vegetationshoeheMittel\n    tpopId\n    bearbeiter\n    planVorhanden\n    jungpflanzenVorhanden\n    apberNichtRelevant\n    apberNichtRelevantGrund\n    changedBy\n  }\n": types.TpopfeldkontrFieldsFragmentDoc,
    "\n  fragment TpopFileFields on TpopFile {\n    id\n    tpopId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n": types.TpopFileFieldsFragmentDoc,
    "\n  fragment TpopfreiwkontrFields on Tpopkontr {\n    id\n    labelEkf\n    typ\n    ekfBemerkungen\n    datum\n    jahr\n    bemerkungen\n    flaecheUeberprueft\n    deckungVegetation\n    deckungNackterBoden\n    deckungApArt\n    vegetationshoeheMaximum\n    vegetationshoeheMittel\n    gefaehrdung\n    tpopId\n    bearbeiter\n    planVorhanden\n    jungpflanzenVorhanden\n    apberNichtRelevant\n    apberNichtRelevantGrund\n    changedBy\n  }\n": types.TpopfreiwkontrFieldsFragmentDoc,
    "\n  fragment TpopHistoryFields on TpopHistory {\n    id\n    year\n    popId\n    nr\n    gemeinde\n    flurname\n    geomPoint {\n      geojson\n      x\n      y\n    }\n    radius\n    hoehe\n    exposition\n    klima\n    neigung\n    beschreibung\n    katasterNr\n    status\n    statusUnklarGrund\n    apberRelevant\n    apberRelevantGrund\n    bekanntSeit\n    eigentuemer\n    kontakt\n    nutzungszone\n    bewirtschafter\n    bewirtschaftung\n    ekfrequenz\n    ekfrequenzAbweichend\n    ekfrequenzStartjahr\n    ekfKontrolleur\n    bemerkungen\n    statusUnklar\n    createdAt\n    updatedAt\n    changedBy\n  }\n": types.TpopHistoryFieldsFragmentDoc,
    "\n  fragment TpopkontrFields on Tpopkontr {\n    id\n    typ\n    datum\n    jahr\n    vitalitaet\n    ueberlebensrate\n    entwicklung\n    ursachen\n    gefaehrdung\n    erfolgsbeurteilung\n    umsetzungAendern\n    kontrolleAendern\n    bemerkungen\n    lrDelarze\n    flaeche\n    lrUmgebungDelarze\n    vegetationstyp\n    konkurrenz\n    moosschicht\n    krautschicht\n    strauchschicht\n    baumschicht\n    idealbiotopUebereinstimmung\n    handlungsbedarf\n    flaecheUeberprueft\n    deckungVegetation\n    deckungNackterBoden\n    deckungApArt\n    vegetationshoeheMaximum\n    vegetationshoeheMittel\n    tpopId\n    bearbeiter\n    planVorhanden\n    apberNichtRelevant\n    apberNichtRelevantGrund\n    jungpflanzenVorhanden\n    changedBy\n  }\n": types.TpopkontrFieldsFragmentDoc,
    "\n  fragment TpopkontrFileFields on TpopkontrFile {\n    id\n    tpopkontrId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n": types.TpopkontrFileFieldsFragmentDoc,
    "\n  fragment TpopkontrzaehlFields on Tpopkontrzaehl {\n    id\n    label\n    tpopkontrId\n    anzahl\n    einheit\n    methode\n    changedBy\n  }\n": types.TpopkontrzaehlFieldsFragmentDoc,
    "\n  fragment TpopmassnFields on Tpopmassn {\n    id\n    label\n    typ\n    beschreibung\n    jahr\n    datum\n    bemerkungen\n    planBezeichnung\n    flaeche\n    markierung\n    anzTriebe\n    anzPflanzen\n    anzPflanzstellen\n    zieleinheitEinheit\n    zieleinheitAnzahl\n    wirtspflanze\n    herkunftPop\n    sammeldatum\n    vonAnzahlIndividuen\n    form\n    pflanzanordnung\n    tpopId\n    bearbeiter\n    planVorhanden\n    changedBy\n  }\n": types.TpopmassnFieldsFragmentDoc,
    "\n  fragment TpopmassnberFields on Tpopmassnber {\n    id\n    label\n    tpopId\n    jahr\n    beurteilung\n    bemerkungen\n    changedBy\n  }\n": types.TpopmassnberFieldsFragmentDoc,
    "\n  fragment TpopmassnFileFields on TpopmassnFile {\n    id\n    tpopmassnId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n": types.TpopmassnFileFieldsFragmentDoc,
    "\n  fragment UserFields on User {\n    id\n    label\n    name\n    email\n    role\n    pass\n    adresseId\n  }\n": types.UserFieldsFragmentDoc,
    "\n  fragment ZielFields on Ziel {\n    id\n    label\n    apId\n    typ\n    jahr\n    bezeichnung\n    erreichung\n    bemerkungen\n    changedBy\n  }\n": types.ZielFieldsFragmentDoc,
    "\n  fragment ApBearbstandWerteFields on ApBearbstandWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": types.ApBearbstandWerteFieldsFragmentDoc,
    "\n  fragment ApErfkritWerteFields on ApErfkritWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": types.ApErfkritWerteFieldsFragmentDoc,
    "\n  fragment ApUmsetzungWerteFields on ApUmsetzungWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": types.ApUmsetzungWerteFieldsFragmentDoc,
    "\n  fragment PopStatusWerteFields on PopStatusWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": types.PopStatusWerteFieldsFragmentDoc,
    "\n  fragment TpopApberrelevantGrundWerteFields on TpopApberrelevantGrundWerte {\n    id\n    code\n    text\n    label\n    sort\n    historic\n    changedBy\n  }\n": types.TpopApberrelevantGrundWerteFieldsFragmentDoc,
    "\n  fragment TpopEntwicklungWerteFields on TpopEntwicklungWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": types.TpopEntwicklungWerteFieldsFragmentDoc,
    "\n  fragment TpopkontrIdbiotuebereinstWerteFields on TpopkontrIdbiotuebereinstWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": types.TpopkontrIdbiotuebereinstWerteFieldsFragmentDoc,
    "\n  fragment TpopkontrTypWerteFields on TpopkontrTypWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": types.TpopkontrTypWerteFieldsFragmentDoc,
    "\n  fragment TpopkontrzaehlEinheitWerteFields on TpopkontrzaehlEinheitWerte {\n    id\n    code\n    text\n    correspondsToMassnAnzTriebe\n    correspondsToMassnAnzPflanzen\n    sort\n    historic\n    label\n    changedBy\n  }\n": types.TpopkontrzaehlEinheitWerteFieldsFragmentDoc,
    "\n  fragment TpopkontrzaehlMethodeWerteFields on TpopkontrzaehlMethodeWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": types.TpopkontrzaehlMethodeWerteFieldsFragmentDoc,
    "\n  fragment TpopmassnErfbeurtWerteFields on TpopmassnErfbeurtWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": types.TpopmassnErfbeurtWerteFieldsFragmentDoc,
    "\n  fragment TpopmassnTypWerteFields on TpopmassnTypWerte {\n    id\n    code\n    text\n    sort\n    ansiedlung\n    anpflanzung\n    historic\n    changedBy\n  }\n": types.TpopmassnTypWerteFieldsFragmentDoc,
    "\n  fragment ZielTypWerteFields on ZielTypWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n": types.ZielTypWerteFieldsFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AdresseFields on Adresse {\n    id\n    label\n    name\n    adresse\n    telefon\n    email\n    freiwErfko\n    changedBy\n  }\n"): (typeof documents)["\n  fragment AdresseFields on Adresse {\n    id\n    label\n    name\n    adresse\n    telefon\n    email\n    freiwErfko\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AeTaxonomiesFields on AeTaxonomy {\n    taxonomieId\n    taxonomieName\n    id\n    taxid\n    familie\n    artname\n    taxArtName\n    artwert\n  }\n"): (typeof documents)["\n  fragment AeTaxonomiesFields on AeTaxonomy {\n    taxonomieId\n    taxonomieName\n    id\n    taxid\n    familie\n    artname\n    taxArtName\n    artwert\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AeLrDelarzeFields on AeLrDelarze {\n    id\n    label\n    einheit\n  }\n"): (typeof documents)["\n  fragment AeLrDelarzeFields on AeLrDelarze {\n    id\n    label\n    einheit\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ApFields on Ap {\n    id\n    label\n    artId\n    bearbeitung\n    startJahr\n    umsetzung\n    artId\n    bearbeiter\n    ekfBeobachtungszeitpunkt\n    projId\n    changedBy\n  }\n"): (typeof documents)["\n  fragment ApFields on Ap {\n    id\n    label\n    artId\n    bearbeitung\n    startJahr\n    umsetzung\n    artId\n    bearbeiter\n    ekfBeobachtungszeitpunkt\n    projId\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ApartFields on Apart {\n    id\n    label\n    apId\n    artId\n    changedBy\n  }\n"): (typeof documents)["\n  fragment ApartFields on Apart {\n    id\n    label\n    apId\n    artId\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ApberFields on Apber {\n    id\n    label\n    jahr\n    situation\n    vergleichVorjahrGesamtziel\n    beurteilung\n    apberAnalyse\n    konsequenzenUmsetzung\n    konsequenzenErfolgskontrolle\n    biotopeNeue\n    biotopeOptimieren\n    massnahmenOptimieren\n    wirkungAufArt\n    datum\n    massnahmenApBearb\n    massnahmenPlanungVsAusfuehrung\n    apId\n    bearbeiter\n    changedBy\n  }\n"): (typeof documents)["\n  fragment ApberFields on Apber {\n    id\n    label\n    jahr\n    situation\n    vergleichVorjahrGesamtziel\n    beurteilung\n    apberAnalyse\n    konsequenzenUmsetzung\n    konsequenzenErfolgskontrolle\n    biotopeNeue\n    biotopeOptimieren\n    massnahmenOptimieren\n    wirkungAufArt\n    datum\n    massnahmenApBearb\n    massnahmenPlanungVsAusfuehrung\n    apId\n    bearbeiter\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ApberuebersichtFields on Apberuebersicht {\n    id\n    label\n    projId\n    jahr\n    historyDate\n    historyFixed\n    bemerkungen\n    changedBy\n  }\n"): (typeof documents)["\n  fragment ApberuebersichtFields on Apberuebersicht {\n    id\n    label\n    projId\n    jahr\n    historyDate\n    historyFixed\n    bemerkungen\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ApFileFields on ApFile {\n    id\n    apId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n"): (typeof documents)["\n  fragment ApFileFields on ApFile {\n    id\n    apId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ApHistoryFields on ApHistory {\n    id\n    year\n    artId\n    bearbeitung\n    startJahr\n    umsetzung\n    artId\n    bearbeiter\n    ekfBeobachtungszeitpunkt\n    projId\n    createdAt\n    updatedAt\n    changedBy\n  }\n"): (typeof documents)["\n  fragment ApHistoryFields on ApHistory {\n    id\n    year\n    artId\n    bearbeitung\n    startJahr\n    umsetzung\n    artId\n    bearbeiter\n    ekfBeobachtungszeitpunkt\n    projId\n    createdAt\n    updatedAt\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ApqkFields on Apqk {\n    apId\n    qkName\n  }\n"): (typeof documents)["\n  fragment ApqkFields on Apqk {\n    apId\n    qkName\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AssozartFields on Assozart {\n    id\n    label\n    bemerkungen\n    aeId\n    apId\n    changedBy\n  }\n"): (typeof documents)["\n  fragment AssozartFields on Assozart {\n    id\n    label\n    bemerkungen\n    aeId\n    apId\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BeobFields on Beob {\n    id\n    label\n    idField\n    datum\n    autor\n    absenz\n    lv95X\n    wgs84Lat\n    lv95Y\n    wgs84Long\n    geomPoint {\n      geojson\n      #srid\n      x\n      y\n    }\n    data\n    artId\n    tpopId\n    nichtZuordnen\n    bemerkungen\n    quelle\n    artIdOriginal\n    infofloraInformiertDatum\n    changedBy\n  }\n"): (typeof documents)["\n  fragment BeobFields on Beob {\n    id\n    label\n    idField\n    datum\n    autor\n    absenz\n    lv95X\n    wgs84Lat\n    lv95Y\n    wgs84Long\n    geomPoint {\n      geojson\n      #srid\n      x\n      y\n    }\n    data\n    artId\n    tpopId\n    nichtZuordnen\n    bemerkungen\n    quelle\n    artIdOriginal\n    infofloraInformiertDatum\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CurrentIssueFields on Currentissue {\n    id\n    label\n    sort\n    title\n    issue\n  }\n"): (typeof documents)["\n  fragment CurrentIssueFields on Currentissue {\n    id\n    label\n    sort\n    title\n    issue\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EkAbrechnungstypWerteFields on EkAbrechnungstypWerte {\n    id\n    code\n    label\n    text\n    sort\n    historic\n    changedBy\n  }\n"): (typeof documents)["\n  fragment EkAbrechnungstypWerteFields on EkAbrechnungstypWerte {\n    id\n    code\n    label\n    text\n    sort\n    historic\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EkfrequenzFields on Ekfrequenz {\n    id\n    apId\n    ektyp\n    anwendungsfall\n    code\n    kontrolljahre\n    kontrolljahreAb\n    bemerkungen\n    sort\n    ekAbrechnungstyp\n    changedBy\n  }\n"): (typeof documents)["\n  fragment EkfrequenzFields on Ekfrequenz {\n    id\n    apId\n    ektyp\n    anwendungsfall\n    code\n    kontrolljahre\n    kontrolljahreAb\n    bemerkungen\n    sort\n    ekAbrechnungstyp\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EkplanFields on Ekplan {\n    id\n    tpopId\n    jahr\n    typ\n    changedBy\n  }\n"): (typeof documents)["\n  fragment EkplanFields on Ekplan {\n    id\n    tpopId\n    jahr\n    typ\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EkzaehleinheitFields on Ekzaehleinheit {\n    id\n    apId\n    label\n    zaehleinheitId\n    zielrelevant\n    notMassnCountUnit\n    sort\n    bemerkungen\n    changedBy\n  }\n"): (typeof documents)["\n  fragment EkzaehleinheitFields on Ekzaehleinheit {\n    id\n    apId\n    label\n    zaehleinheitId\n    zielrelevant\n    notMassnCountUnit\n    sort\n    bemerkungen\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ErfkritFields on Erfkrit {\n    id\n    label\n    apId\n    erfolg\n    kriterien\n    changedBy\n  }\n"): (typeof documents)["\n  fragment ErfkritFields on Erfkrit {\n    id\n    label\n    apId\n    erfolg\n    kriterien\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment IdealbiotopFields on Idealbiotop {\n    id\n    apId\n    erstelldatum\n    hoehenlage\n    region\n    exposition\n    besonnung\n    hangneigung\n    bodenTyp\n    bodenKalkgehalt\n    bodenDurchlaessigkeit\n    bodenHumus\n    bodenNaehrstoffgehalt\n    wasserhaushalt\n    konkurrenz\n    moosschicht\n    krautschicht\n    strauchschicht\n    baumschicht\n    bemerkungen\n    changedBy\n  }\n"): (typeof documents)["\n  fragment IdealbiotopFields on Idealbiotop {\n    id\n    apId\n    erstelldatum\n    hoehenlage\n    region\n    exposition\n    besonnung\n    hangneigung\n    bodenTyp\n    bodenKalkgehalt\n    bodenDurchlaessigkeit\n    bodenHumus\n    bodenNaehrstoffgehalt\n    wasserhaushalt\n    konkurrenz\n    moosschicht\n    krautschicht\n    strauchschicht\n    baumschicht\n    bemerkungen\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment IdealbiotopFileFields on IdealbiotopFile {\n    id\n    idealbiotopId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n"): (typeof documents)["\n  fragment IdealbiotopFileFields on IdealbiotopFile {\n    id\n    idealbiotopId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MessageFields on Message {\n    id\n    message\n    time\n    active\n  }\n"): (typeof documents)["\n  fragment MessageFields on Message {\n    id\n    message\n    time\n    active\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PopFields on Pop {\n    id\n    label\n    apId\n    nr\n    name\n    status\n    statusUnklar\n    statusUnklarBegruendung\n    bekanntSeit\n    lv95X\n    wgs84Lat\n    lv95Y\n    wgs84Long\n    geomPoint {\n      geojson\n      #srid\n      x\n      y\n    }\n    changedBy\n  }\n"): (typeof documents)["\n  fragment PopFields on Pop {\n    id\n    label\n    apId\n    nr\n    name\n    status\n    statusUnklar\n    statusUnklarBegruendung\n    bekanntSeit\n    lv95X\n    wgs84Lat\n    lv95Y\n    wgs84Long\n    geomPoint {\n      geojson\n      #srid\n      x\n      y\n    }\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PopberFields on Popber {\n    id\n    label\n    popId\n    jahr\n    entwicklung\n    bemerkungen\n    changedBy\n  }\n"): (typeof documents)["\n  fragment PopberFields on Popber {\n    id\n    label\n    popId\n    jahr\n    entwicklung\n    bemerkungen\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PopFileFields on PopFile {\n    id\n    popId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n"): (typeof documents)["\n  fragment PopFileFields on PopFile {\n    id\n    popId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PopHistoryFields on PopHistory {\n    id\n    year\n    apId\n    nr\n    name\n    status\n    statusUnklar\n    statusUnklarBegruendung\n    bekanntSeit\n    geomPoint {\n      geojson\n      x\n      y\n    }\n    createdAt\n    updatedAt\n    changedBy\n  }\n"): (typeof documents)["\n  fragment PopHistoryFields on PopHistory {\n    id\n    year\n    apId\n    nr\n    name\n    status\n    statusUnklar\n    statusUnklarBegruendung\n    bekanntSeit\n    geomPoint {\n      geojson\n      x\n      y\n    }\n    createdAt\n    updatedAt\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PopmassnberFields on Popmassnber {\n    id\n    label\n    popId\n    jahr\n    beurteilung\n    bemerkungen\n    changedBy\n  }\n"): (typeof documents)["\n  fragment PopmassnberFields on Popmassnber {\n    id\n    label\n    popId\n    jahr\n    beurteilung\n    bemerkungen\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProjektFields on Projekt {\n    id\n    label\n    name\n    changedBy\n  }\n"): (typeof documents)["\n  fragment ProjektFields on Projekt {\n    id\n    label\n    name\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment QkFields on Qk {\n    name\n    titel\n    beschreibung\n    sort\n  }\n"): (typeof documents)["\n  fragment QkFields on Qk {\n    name\n    titel\n    beschreibung\n    sort\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopFields on Tpop {\n    id\n    label\n    popId\n    nr\n    gemeinde\n    flurname\n    lv95X\n    wgs84Lat\n    lv95Y\n    wgs84Long\n    geomPoint {\n      geojson\n      #srid\n      x\n      y\n    }\n    radius\n    hoehe\n    exposition\n    klima\n    neigung\n    bodenTyp\n    bodenKalkgehalt\n    bodenDurchlaessigkeit\n    bodenHumus\n    bodenNaehrstoffgehalt\n    bodenAbtrag\n    wasserhaushalt\n    beschreibung\n    katasterNr\n    status\n    statusUnklarGrund\n    apberRelevant\n    apberRelevantGrund\n    bekanntSeit\n    eigentuemer\n    kontakt\n    nutzungszone\n    bewirtschafter\n    bewirtschaftung\n    ekfrequenz\n    ekfrequenzAbweichend\n    ekfrequenzStartjahr\n    ekfKontrolleur\n    bemerkungen\n    statusUnklar\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopFields on Tpop {\n    id\n    label\n    popId\n    nr\n    gemeinde\n    flurname\n    lv95X\n    wgs84Lat\n    lv95Y\n    wgs84Long\n    geomPoint {\n      geojson\n      #srid\n      x\n      y\n    }\n    radius\n    hoehe\n    exposition\n    klima\n    neigung\n    bodenTyp\n    bodenKalkgehalt\n    bodenDurchlaessigkeit\n    bodenHumus\n    bodenNaehrstoffgehalt\n    bodenAbtrag\n    wasserhaushalt\n    beschreibung\n    katasterNr\n    status\n    statusUnklarGrund\n    apberRelevant\n    apberRelevantGrund\n    bekanntSeit\n    eigentuemer\n    kontakt\n    nutzungszone\n    bewirtschafter\n    bewirtschaftung\n    ekfrequenz\n    ekfrequenzAbweichend\n    ekfrequenzStartjahr\n    ekfKontrolleur\n    bemerkungen\n    statusUnklar\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopberFields on Tpopber {\n    id\n    label\n    tpopId\n    jahr\n    entwicklung\n    tpopEntwicklungWerteByEntwicklung {\n      id\n      code\n      text\n      sort\n    }\n    bemerkungen\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopberFields on Tpopber {\n    id\n    label\n    tpopId\n    jahr\n    entwicklung\n    tpopEntwicklungWerteByEntwicklung {\n      id\n      code\n      text\n      sort\n    }\n    bemerkungen\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopfeldkontrFields on Tpopkontr {\n    id\n    labelEk\n    typ\n    datum\n    jahr\n    vitalitaet\n    ueberlebensrate\n    entwicklung\n    ursachen\n    gefaehrdung\n    erfolgsbeurteilung\n    umsetzungAendern\n    kontrolleAendern\n    bemerkungen\n    lrDelarze\n    flaeche\n    lrUmgebungDelarze\n    vegetationstyp\n    konkurrenz\n    moosschicht\n    krautschicht\n    strauchschicht\n    baumschicht\n    idealbiotopUebereinstimmung\n    handlungsbedarf\n    flaecheUeberprueft\n    deckungVegetation\n    deckungNackterBoden\n    deckungApArt\n    vegetationshoeheMaximum\n    vegetationshoeheMittel\n    tpopId\n    bearbeiter\n    planVorhanden\n    jungpflanzenVorhanden\n    apberNichtRelevant\n    apberNichtRelevantGrund\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopfeldkontrFields on Tpopkontr {\n    id\n    labelEk\n    typ\n    datum\n    jahr\n    vitalitaet\n    ueberlebensrate\n    entwicklung\n    ursachen\n    gefaehrdung\n    erfolgsbeurteilung\n    umsetzungAendern\n    kontrolleAendern\n    bemerkungen\n    lrDelarze\n    flaeche\n    lrUmgebungDelarze\n    vegetationstyp\n    konkurrenz\n    moosschicht\n    krautschicht\n    strauchschicht\n    baumschicht\n    idealbiotopUebereinstimmung\n    handlungsbedarf\n    flaecheUeberprueft\n    deckungVegetation\n    deckungNackterBoden\n    deckungApArt\n    vegetationshoeheMaximum\n    vegetationshoeheMittel\n    tpopId\n    bearbeiter\n    planVorhanden\n    jungpflanzenVorhanden\n    apberNichtRelevant\n    apberNichtRelevantGrund\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopFileFields on TpopFile {\n    id\n    tpopId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n"): (typeof documents)["\n  fragment TpopFileFields on TpopFile {\n    id\n    tpopId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopfreiwkontrFields on Tpopkontr {\n    id\n    labelEkf\n    typ\n    ekfBemerkungen\n    datum\n    jahr\n    bemerkungen\n    flaecheUeberprueft\n    deckungVegetation\n    deckungNackterBoden\n    deckungApArt\n    vegetationshoeheMaximum\n    vegetationshoeheMittel\n    gefaehrdung\n    tpopId\n    bearbeiter\n    planVorhanden\n    jungpflanzenVorhanden\n    apberNichtRelevant\n    apberNichtRelevantGrund\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopfreiwkontrFields on Tpopkontr {\n    id\n    labelEkf\n    typ\n    ekfBemerkungen\n    datum\n    jahr\n    bemerkungen\n    flaecheUeberprueft\n    deckungVegetation\n    deckungNackterBoden\n    deckungApArt\n    vegetationshoeheMaximum\n    vegetationshoeheMittel\n    gefaehrdung\n    tpopId\n    bearbeiter\n    planVorhanden\n    jungpflanzenVorhanden\n    apberNichtRelevant\n    apberNichtRelevantGrund\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopHistoryFields on TpopHistory {\n    id\n    year\n    popId\n    nr\n    gemeinde\n    flurname\n    geomPoint {\n      geojson\n      x\n      y\n    }\n    radius\n    hoehe\n    exposition\n    klima\n    neigung\n    beschreibung\n    katasterNr\n    status\n    statusUnklarGrund\n    apberRelevant\n    apberRelevantGrund\n    bekanntSeit\n    eigentuemer\n    kontakt\n    nutzungszone\n    bewirtschafter\n    bewirtschaftung\n    ekfrequenz\n    ekfrequenzAbweichend\n    ekfrequenzStartjahr\n    ekfKontrolleur\n    bemerkungen\n    statusUnklar\n    createdAt\n    updatedAt\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopHistoryFields on TpopHistory {\n    id\n    year\n    popId\n    nr\n    gemeinde\n    flurname\n    geomPoint {\n      geojson\n      x\n      y\n    }\n    radius\n    hoehe\n    exposition\n    klima\n    neigung\n    beschreibung\n    katasterNr\n    status\n    statusUnklarGrund\n    apberRelevant\n    apberRelevantGrund\n    bekanntSeit\n    eigentuemer\n    kontakt\n    nutzungszone\n    bewirtschafter\n    bewirtschaftung\n    ekfrequenz\n    ekfrequenzAbweichend\n    ekfrequenzStartjahr\n    ekfKontrolleur\n    bemerkungen\n    statusUnklar\n    createdAt\n    updatedAt\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopkontrFields on Tpopkontr {\n    id\n    typ\n    datum\n    jahr\n    vitalitaet\n    ueberlebensrate\n    entwicklung\n    ursachen\n    gefaehrdung\n    erfolgsbeurteilung\n    umsetzungAendern\n    kontrolleAendern\n    bemerkungen\n    lrDelarze\n    flaeche\n    lrUmgebungDelarze\n    vegetationstyp\n    konkurrenz\n    moosschicht\n    krautschicht\n    strauchschicht\n    baumschicht\n    idealbiotopUebereinstimmung\n    handlungsbedarf\n    flaecheUeberprueft\n    deckungVegetation\n    deckungNackterBoden\n    deckungApArt\n    vegetationshoeheMaximum\n    vegetationshoeheMittel\n    tpopId\n    bearbeiter\n    planVorhanden\n    apberNichtRelevant\n    apberNichtRelevantGrund\n    jungpflanzenVorhanden\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopkontrFields on Tpopkontr {\n    id\n    typ\n    datum\n    jahr\n    vitalitaet\n    ueberlebensrate\n    entwicklung\n    ursachen\n    gefaehrdung\n    erfolgsbeurteilung\n    umsetzungAendern\n    kontrolleAendern\n    bemerkungen\n    lrDelarze\n    flaeche\n    lrUmgebungDelarze\n    vegetationstyp\n    konkurrenz\n    moosschicht\n    krautschicht\n    strauchschicht\n    baumschicht\n    idealbiotopUebereinstimmung\n    handlungsbedarf\n    flaecheUeberprueft\n    deckungVegetation\n    deckungNackterBoden\n    deckungApArt\n    vegetationshoeheMaximum\n    vegetationshoeheMittel\n    tpopId\n    bearbeiter\n    planVorhanden\n    apberNichtRelevant\n    apberNichtRelevantGrund\n    jungpflanzenVorhanden\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopkontrFileFields on TpopkontrFile {\n    id\n    tpopkontrId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n"): (typeof documents)["\n  fragment TpopkontrFileFields on TpopkontrFile {\n    id\n    tpopkontrId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopkontrzaehlFields on Tpopkontrzaehl {\n    id\n    label\n    tpopkontrId\n    anzahl\n    einheit\n    methode\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopkontrzaehlFields on Tpopkontrzaehl {\n    id\n    label\n    tpopkontrId\n    anzahl\n    einheit\n    methode\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopmassnFields on Tpopmassn {\n    id\n    label\n    typ\n    beschreibung\n    jahr\n    datum\n    bemerkungen\n    planBezeichnung\n    flaeche\n    markierung\n    anzTriebe\n    anzPflanzen\n    anzPflanzstellen\n    zieleinheitEinheit\n    zieleinheitAnzahl\n    wirtspflanze\n    herkunftPop\n    sammeldatum\n    vonAnzahlIndividuen\n    form\n    pflanzanordnung\n    tpopId\n    bearbeiter\n    planVorhanden\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopmassnFields on Tpopmassn {\n    id\n    label\n    typ\n    beschreibung\n    jahr\n    datum\n    bemerkungen\n    planBezeichnung\n    flaeche\n    markierung\n    anzTriebe\n    anzPflanzen\n    anzPflanzstellen\n    zieleinheitEinheit\n    zieleinheitAnzahl\n    wirtspflanze\n    herkunftPop\n    sammeldatum\n    vonAnzahlIndividuen\n    form\n    pflanzanordnung\n    tpopId\n    bearbeiter\n    planVorhanden\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopmassnberFields on Tpopmassnber {\n    id\n    label\n    tpopId\n    jahr\n    beurteilung\n    bemerkungen\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopmassnberFields on Tpopmassnber {\n    id\n    label\n    tpopId\n    jahr\n    beurteilung\n    bemerkungen\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopmassnFileFields on TpopmassnFile {\n    id\n    tpopmassnId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n"): (typeof documents)["\n  fragment TpopmassnFileFields on TpopmassnFile {\n    id\n    tpopmassnId\n    fileId\n    fileMimeType\n    name\n    beschreibung\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UserFields on User {\n    id\n    label\n    name\n    email\n    role\n    pass\n    adresseId\n  }\n"): (typeof documents)["\n  fragment UserFields on User {\n    id\n    label\n    name\n    email\n    role\n    pass\n    adresseId\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ZielFields on Ziel {\n    id\n    label\n    apId\n    typ\n    jahr\n    bezeichnung\n    erreichung\n    bemerkungen\n    changedBy\n  }\n"): (typeof documents)["\n  fragment ZielFields on Ziel {\n    id\n    label\n    apId\n    typ\n    jahr\n    bezeichnung\n    erreichung\n    bemerkungen\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ApBearbstandWerteFields on ApBearbstandWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"): (typeof documents)["\n  fragment ApBearbstandWerteFields on ApBearbstandWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ApErfkritWerteFields on ApErfkritWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"): (typeof documents)["\n  fragment ApErfkritWerteFields on ApErfkritWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ApUmsetzungWerteFields on ApUmsetzungWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"): (typeof documents)["\n  fragment ApUmsetzungWerteFields on ApUmsetzungWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PopStatusWerteFields on PopStatusWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"): (typeof documents)["\n  fragment PopStatusWerteFields on PopStatusWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopApberrelevantGrundWerteFields on TpopApberrelevantGrundWerte {\n    id\n    code\n    text\n    label\n    sort\n    historic\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopApberrelevantGrundWerteFields on TpopApberrelevantGrundWerte {\n    id\n    code\n    text\n    label\n    sort\n    historic\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopEntwicklungWerteFields on TpopEntwicklungWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopEntwicklungWerteFields on TpopEntwicklungWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopkontrIdbiotuebereinstWerteFields on TpopkontrIdbiotuebereinstWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopkontrIdbiotuebereinstWerteFields on TpopkontrIdbiotuebereinstWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopkontrTypWerteFields on TpopkontrTypWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopkontrTypWerteFields on TpopkontrTypWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopkontrzaehlEinheitWerteFields on TpopkontrzaehlEinheitWerte {\n    id\n    code\n    text\n    correspondsToMassnAnzTriebe\n    correspondsToMassnAnzPflanzen\n    sort\n    historic\n    label\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopkontrzaehlEinheitWerteFields on TpopkontrzaehlEinheitWerte {\n    id\n    code\n    text\n    correspondsToMassnAnzTriebe\n    correspondsToMassnAnzPflanzen\n    sort\n    historic\n    label\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopkontrzaehlMethodeWerteFields on TpopkontrzaehlMethodeWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopkontrzaehlMethodeWerteFields on TpopkontrzaehlMethodeWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopmassnErfbeurtWerteFields on TpopmassnErfbeurtWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopmassnErfbeurtWerteFields on TpopmassnErfbeurtWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TpopmassnTypWerteFields on TpopmassnTypWerte {\n    id\n    code\n    text\n    sort\n    ansiedlung\n    anpflanzung\n    historic\n    changedBy\n  }\n"): (typeof documents)["\n  fragment TpopmassnTypWerteFields on TpopmassnTypWerte {\n    id\n    code\n    text\n    sort\n    ansiedlung\n    anpflanzung\n    historic\n    changedBy\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ZielTypWerteFields on ZielTypWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"): (typeof documents)["\n  fragment ZielTypWerteFields on ZielTypWerte {\n    id\n    code\n    text\n    sort\n    historic\n    changedBy\n  }\n"];

export function graphql(source: string) {
  const doc = (documents as any)[source] ?? lookupNormalized(source);
  if (doc?.kind === 'Document' && !doc.loc) {
    doc.loc = { source: { body: print(doc), name: 'GraphQL request', locationOffset: { line: 1, column: 1 } } };
  }
  return doc ?? {};
}

function normalizeKey(s: string) {
  return s.split('\n').map((l) => l.trim()).join('\n').trim();
}

let normalizedDocuments: Record<string, unknown> | undefined;
function lookupNormalized(source: string) {
  normalizedDocuments ??= Object.fromEntries(
    Object.entries(documents).map(([key, value]) => [normalizeKey(key), value]),
  );
  return (normalizedDocuments as any)[normalizeKey(source)];
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;