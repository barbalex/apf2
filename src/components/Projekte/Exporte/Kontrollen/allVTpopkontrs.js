import gql from 'graphql-tag'

export default gql`
  query view {
    allVTpopkontrs {
      nodes {
        ap_id: apId
        familie
        artname
        ap_bearbeitung: apBearbeitung
        ap_start_jahr: apStartJahr
        ap_umsetzung: apUmsetzung
        ap_bearbeiter: apBearbeiter
        pop_id: popId
        pop_nr: popNr
        pop_name: popName
        pop_status: popStatus
        pop_bekannt_seit: popBekanntSeit
        tpop_id: tpopId
        tpop_nr: tpopNr
        tpop_gemeinde: tpopGemeinde
        tpop_flurname: tpopFlurname
        tpop_status: tpopStatus
        tpop_bekannt_seit: tpopBekanntSeit
        tpop_status_unklar: tpopStatusUnklar
        tpop_status_unklar_grund: tpopStatusUnklarGrund
        tpop_x: tpopX
        tpop_y: tpopY
        tpop_radius: tpopRadius
        tpop_hoehe: tpopHoehe
        tpop_exposition: tpopExposition
        tpop_klima: tpopKlima
        tpop_neigung: tpopNeigung
        tpop_beschreibung: tpopBeschreibung
        tpop_kataster_nr: tpopKatasterNr
        tpop_apber_relevant: tpopApberRelevant
        tpop_eigentuemer: tpopEigentuemer
        tpop_kontakt: tpopKontakt
        tpop_nutzungszone: tpopNutzungszone
        tpop_bewirtschafter: tpopBewirtschafter
        tpop_bewirtschaftung: tpopBewirtschaftung
        tpop_ekfrequenz: tpopEkfrequenz
        tpop_ekfrequenz_abweichend: tpopEkfrequenzAbweichend
        tpop_ek_abrechnungstyp: tpopEkAbrechnungstyp
        id
        jahr
        datum
        typ
        bearbeiter
        ueberlebensrate
        vitalitaet
        entwicklung
        ursachen
        erfolgsbeurteilung
        umsetzung_aendern: umsetzungAendern
        kontrolle_aendern: kontrolleAendern
        bemerkungen
        lr_delarze: lrDelarze
        lr_umgebung_delarze: lrUmgebungDelarze
        vegetationstyp
        konkurrenz
        moosschicht
        krautschicht
        strauchschicht
        baumschicht
        boden_typ: bodenTyp
        boden_kalkgehalt: bodenKalkgehalt
        boden_durchlaessigkeit: bodenDurchlaessigkeit
        boden_humus: bodenHumus
        boden_naehrstoffgehalt: bodenNaehrstoffgehalt
        boden_abtrag: bodenAbtrag
        wasserhaushalt
        idealbiotop_uebereinstimmung: idealbiotopUebereinstimmung
        handlungsbedarf
        flaeche_ueberprueft: flaecheUeberprueft
        flaeche
        plan_vorhanden: planVorhanden
        deckung_vegetation: deckungVegetation
        deckung_nackter_boden: deckungNackterBoden
        deckung_ap_art: deckungApArt
        jungpflanzen_vorhanden: jungpflanzenVorhanden
        vegetationshoehe_maximum: vegetationshoeheMaximum
        vegetationshoehe_mittel: vegetationshoeheMittel
        gefaehrdung
        changed
        changed_by: changedBy
        apber_nicht_relevant: apberNichtRelevant
        apber_nicht_relevant_grund: apberNichtRelevantGrund
        ekf_bemerkungen: ekfBemerkungen
        zaehlung_anzahlen: zaehlungAnzahlen
        zaehlung_einheiten: zaehlungEinheiten
        zaehlung_methoden: zaehlungMethoden
      }
    }
  }
`
