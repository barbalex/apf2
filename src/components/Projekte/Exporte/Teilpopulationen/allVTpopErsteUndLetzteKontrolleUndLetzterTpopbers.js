import gql from 'graphql-tag'

export default gql`
  query view {
    allVTpopErsteUndLetzteKontrolleUndLetzterTpopbers {
      nodes {
        ap_id: apId
        familie
        artname
        ap_bearbeitung: apBearbeitung
        ap_start_jahr: apStartJahr
        ap_umsetzung: apUmsetzung
        pop_id: popId
        pop_nr: popNr
        pop_name: popName
        pop_status: popStatus
        pop_bekannt_seit: popBekanntSeit
        pop_status_unklar: popStatusUnklar
        pop_status_unklar_begruendung: popStatusUnklarBegruendung
        pop_x: popX
        pop_y: popY
        id
        nr
        gemeinde
        flurname
        status
        bekannt_seit: bekanntSeit
        status_unklar: statusUnklar
        status_unklar_grund: statusUnklarGrund
        lv95X: x
        lv95Y: y
        radius
        hoehe
        exposition
        klima
        neigung
        beschreibung
        kataster_nr: katasterNr
        apber_relevant: apberRelevant
        apber_relevant_grund: apberRelevantGrund
        eigentuemer
        kontakt
        nutzungszone
        bewirtschafter
        bewirtschaftung
        kontrollfrequenz: kontrollfrequenz
        kontrollfrequenz_freiwillige: kontrollfrequenzFreiwillige
        changed
        changed_by: changedBy
        anzahl_kontrollen: anzahlKontrollen
        erste_kontrolle_id: ersteKontrolleId
        erste_kontrolle_jahr: ersteKontrolleJahr
        erste_kontrolle_datum: ersteKontrolleDatum
        erste_kontrolle_typ: ersteKontrolleTyp
        erste_kontrolle_bearbeiter: ersteKontrolleBearbeiter
        erste_kontrolle_ueberlebensrate: ersteKontrolleUeberlebensrate
        erste_kontrolle_vitalitaet: ersteKontrolleVitalitaet
        erste_kontrolle_entwicklung: ersteKontrolleEntwicklung
        erste_kontrolle_ursachen: ersteKontrolleUrsachen
        erste_kontrolle_erfolgsbeurteilung: ersteKontrolleErfolgsbeurteilung
        erste_kontrolle_umsetzung_aendern: ersteKontrolleUmsetzungAendern
        erste_kontrolle_kontrolle_aendern: ersteKontrolleKontrolleAendern
        erste_kontrolle_bemerkungen: ersteKontrolleBemerkungen
        erste_kontrolle_lr_delarze: ersteKontrolleLrDelarze
        erste_kontrolle_lr_umgebung_delarze: ersteKontrolleLrUmgebungDelarze
        erste_kontrolle_vegetationstyp: ersteKontrolleVegetationstyp
        erste_kontrolle_konkurrenz: ersteKontrolleKonkurrenz
        erste_kontrolle_moosschicht: ersteKontrolleMoosschicht
        erste_kontrolle_krautschicht: ersteKontrolleKrautschicht
        erste_kontrolle_strauchschicht: ersteKontrolleStrauchschicht
        erste_kontrolle_baumschicht: ersteKontrolleBaumschicht
        erste_kontrolle_boden_typ: ersteKontrolleBodenTyp
        erste_kontrolle_boden_kalkgehalt: ersteKontrolleBodenKalkgehalt
        erste_kontrolle_boden_durchlaessigkeit: ersteKontrolleBodenDurchlaessigkeit
        erste_kontrolle_boden_humus: ersteKontrolleBodenHumus
        erste_kontrolle_boden_naehrstoffgehalt: ersteKontrolleBodenNaehrstoffgehalt
        erste_kontrolle_boden_abtrag: ersteKontrolleBodenAbtrag
        erste_kontrolle_wasserhaushalt: ersteKontrolleWasserhaushalt
        erste_kontrolle_idealbiotop_uebereinstimmung: ersteKontrolleIdealbiotopUebereinstimmung
        erste_kontrolle_handlungsbedarf: ersteKontrolleHandlungsbedarf
        erste_kontrolle_flaeche_ueberprueft: ersteKontrolleFlaecheUeberprueft
        erste_kontrolle_flaeche: ersteKontrolleFlaeche
        erste_kontrolle_plan_vorhanden: ersteKontrollePlanVorhanden
        erste_kontrolle_deckung_vegetation: ersteKontrolleDeckungVegetation
        erste_kontrolle_deckung_nackter_boden: ersteKontrolleDeckungNackterBoden
        erste_kontrolle_deckung_ap_art: ersteKontrolleDeckungApArt
        erste_kontrolle_jungpflanzen_vorhanden: ersteKontrolleJungpflanzenVorhanden
        erste_kontrolle_vegetationshoehe_maximum: ersteKontrolleVegetationshoeheMaximum
        erste_kontrolle_vegetationshoehe_mittel: ersteKontrolleVegetationshoeheMittel
        erste_kontrolle_gefaehrdung: ersteKontrolleGefaehrdung
        erste_kontrolle_changed: ersteKontrolleChanged
        erste_kontrolle_changed_by: ersteKontrolleChangedBy
        erste_kontrolle_ekf_verifiziert: ersteKontrolleEkfVerifiziert
        erste_kontrolle_ekf_verifiziert_durch: ersteKontrolleEkfVerifiziertDurch
        erste_kontrolle_ekf_verifiziert_datum: ersteKontrolleEkfVerifiziertDatum
        erste_kontrolle_ekf_bemerkungen: ersteKontrolleEkfBemerkungen
        erste_kontrolle_zaehlung_anzahlen: ersteKontrolleZaehlungAnzahlen
        erste_kontrolle_zaehlung_einheiten: ersteKontrolleZaehlungEinheiten
        erste_kontrolle_zaehlung_methoden: ersteKontrolleZaehlungMethoden
        letzte_kontrolle_id: letzteKontrolleId
        letzte_kontrolle_jahr: letzteKontrolleJahr
        letzte_kontrolle_datum: letzteKontrolleDatum
        letzte_kontrolle_typ: letzteKontrolleTyp
        letzte_kontrolle_bearbeiter: letzteKontrolleBearbeiter
        letzte_kontrolle_ueberlebensrate: letzteKontrolleUeberlebensrate
        letzte_kontrolle_vitalitaet: letzteKontrolleVitalitaet
        letzte_kontrolle_entwicklung: letzteKontrolleEntwicklung
        letzte_kontrolle_ursachen: letzteKontrolleUrsachen
        letzte_kontrolle_erfolgsbeurteilung: letzteKontrolleErfolgsbeurteilung
        letzte_kontrolle_umsetzung_aendern: letzteKontrolleUmsetzungAendern
        letzte_kontrolle_kontrolle_aendern: letzteKontrolleKontrolleAendern
        letzte_kontrolle_bemerkungen: letzteKontrolleBemerkungen
        letzte_kontrolle_lr_delarze: letzteKontrolleLrDelarze
        letzte_kontrolle_lr_umgebung_delarze: letzteKontrolleLrUmgebungDelarze
        letzte_kontrolle_vegetationstyp: letzteKontrolleVegetationstyp
        letzte_kontrolle_konkurrenz: letzteKontrolleKonkurrenz
        letzte_kontrolle_moosschicht: letzteKontrolleMoosschicht
        letzte_kontrolle_krautschicht: letzteKontrolleKrautschicht
        letzte_kontrolle_strauchschicht: letzteKontrolleStrauchschicht
        letzte_kontrolle_baumschicht: letzteKontrolleBaumschicht
        letzte_kontrolle_boden_typ: letzteKontrolleBodenTyp
        letzte_kontrolle_boden_kalkgehalt: letzteKontrolleBodenKalkgehalt
        letzte_kontrolle_boden_durchlaessigkeit: letzteKontrolleBodenDurchlaessigkeit
        letzte_kontrolle_boden_humus: letzteKontrolleBodenHumus
        letzte_kontrolle_boden_naehrstoffgehalt: letzteKontrolleBodenNaehrstoffgehalt
        letzte_kontrolle_boden_abtrag: letzteKontrolleBodenAbtrag
        letzte_kontrolle_wasserhaushalt: letzteKontrolleWasserhaushalt
        letzte_kontrolle_idealbiotop_uebereinstimmung: letzteKontrolleIdealbiotopUebereinstimmung
        letzte_kontrolle_handlungsbedarf: letzteKontrolleHandlungsbedarf
        letzte_kontrolle_flaeche_ueberprueft: letzteKontrolleFlaecheUeberprueft
        letzte_kontrolle_flaeche: letzteKontrolleFlaeche
        letzte_kontrolle_plan_vorhanden: letzteKontrollePlanVorhanden
        letzte_kontrolle_deckung_vegetation: letzteKontrolleDeckungVegetation
        letzte_kontrolle_deckung_nackter_boden: letzteKontrolleDeckungNackterBoden
        letzte_kontrolle_deckung_ap_art: letzteKontrolleDeckungApArt
        letzte_kontrolle_jungpflanzen_vorhanden: letzteKontrolleJungpflanzenVorhanden
        letzte_kontrolle_vegetationshoehe_maximum: letzteKontrolleVegetationshoeheMaximum
        letzte_kontrolle_vegetationshoehe_mittel: letzteKontrolleVegetationshoeheMittel
        letzte_kontrolle_gefaehrdung: letzteKontrolleGefaehrdung
        letzte_kontrolle_changed: letzteKontrolleChanged
        letzte_kontrolle_changed_by: letzteKontrolleChangedBy
        letzte_kontrolle_ekf_verifiziert: letzteKontrolleEkfVerifiziert
        letzte_kontrolle_ekf_verifiziert_durch: letzteKontrolleEkfVerifiziertDurch
        letzte_kontrolle_ekf_verifiziert_datum: letzteKontrolleEkfVerifiziertDatum
        letzte_kontrolle_ekf_bemerkungen: letzteKontrolleEkfBemerkungen
        letzte_kontrolle_zaehlung_anzahlen: letzteKontrolleZaehlungAnzahlen
        letzte_kontrolle_zaehlung_einheiten: letzteKontrolleZaehlungEinheiten
        letzte_kontrolle_zaehlung_methoden: letzteKontrolleZaehlungMethoden
        tpopber_anz: tpopberAnz
        tpopber_id: tpopberId
        tpopber_jahr: tpopberJahr
        tpopber_entwicklung: tpopberEntwicklung
        tpopber_bemerkungen: tpopberBemerkungen
        tpopber_changed: tpopberChanged
        tpopber_changed_by: tpopberChangedBy
      }
    }
  }
`
