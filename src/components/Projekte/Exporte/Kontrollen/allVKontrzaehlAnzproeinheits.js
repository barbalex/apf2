import { gql } from '@apollo/client'

export default gql`
  query viewKontrzaehlAnzproeinheits {
    allVKontrzaehlAnzproeinheits {
      nodes {
        ap_id: apId
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
        kontr_id: kontrId
        kontr_jahr: kontrJahr
        kontr_datum: kontrDatum
        kontr_typ: kontrTyp
        kontr_bearbeiter: kontrBearbeiter
        kontr_ueberlebensrate: kontrUeberlebensrate
        kontr_vitalitaet: kontrVitalitaet
        kontr_entwicklung: kontrEntwicklung
        kontr_ursachen: kontrUrsachen
        kontr_erfolgsbeurteilung: kontrErfolgsbeurteilung
        kontr_umsetzung_aendern: kontrUmsetzungAendern
        kontr_kontrolle_aendern: kontrKontrolleAendern
        kontr_bemerkungen: kontrBemerkungen
        kontr_lr_delarze: kontrLrDelarze
        kontr_lr_umgebung_delarze: kontrLrUmgebungDelarze
        kontr_vegetationstyp: kontrVegetationstyp
        kontr_konkurrenz: kontrKonkurrenz
        kontr_moosschicht: kontrMoosschicht
        kontr_krautschicht: kontrStrauchschicht
        kontr_strauchschicht: kontrBaumschicht
        kontr_baumschicht: kontrBodenTyp
        kontr_boden_typ: kontrBodenKalkgehalt
        kontr_boden_kalkgehalt: kontrBodenDurchlaessigkeit
        kontr_boden_durchlaessigkeit: kontrBodenHumus
        kontr_boden_humus: kontrBodenNaehrstoffgehalt
        kontr_boden_naehrstoffgehalt: kontrBodenAbtrag
        kontr_boden_abtrag: kontrWasserhaushalt
        kontr_wasserhaushalt: kontrIdealbiotopUebereinstimmung
        kontr_idealbiotop_uebereinstimmung: kontrHandlungsbedarf
        kontr_handlungsbedarf: kontrFlaecheUeberprueft
        kontr_flaeche_ueberprueft: kontrFlaeche
        kontr_flaeche: kontrPlanVorhanden
        kontr_plan_vorhanden: kontrDeckungVegetation
        kontr_deckung_vegetation: kontrDeckungNackterBoden
        kontr_deckung_nackter_boden: kontrDeckungApArt
        kontr_deckung_ap_art: kontrJungpflanzenVorhanden
        kontr_jungpflanzen_vorhanden: kontrVegetationshoeheMaximum
        kontr_vegetationshoehe_maximum: kontrVegetationshoeheMittel
        kontr_gefaehrdung: kontrGefaehrdung
        kontr_changed: kontrChanged
        kontr_changed_by: kontrChangedBy
        kontr_apber_nicht_relevant: kontrApberNichtRelevant
        apber_nicht_relevant_grund: kontrApberNichtRelevantGrund
        ekf_bemerkungen: kontrEkfBemerkungen
        id
        einheit
        methode
        anzahl
      }
    }
  }
`
