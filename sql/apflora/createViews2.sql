/*
 * diese Views hängen von anderen ab, die in viewsGenerieren2.sql erstellt werden
 * daher muss dieser code NACH viewsGenerieren2.sql ausgeführt werden
 */

DROP VIEW IF EXISTS apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber AS
with tpopber_letzte_id as (
  SELECT
    apflora.tpopkontr.tpop_id,
    (
      select id
      from apflora.tpopber
      where tpop_id = apflora.tpopkontr.tpop_id
      order by changed desc
      limit 1
    ) AS tpopber_letzte_id,
    count(apflora.tpopber.id) AS tpopber_anz
  FROM
    apflora.tpopkontr
    INNER JOIN
      apflora.tpopber
      ON apflora.tpopkontr.tpop_id = apflora.tpopber.tpop_id
  WHERE
    apflora.tpopkontr.typ NOT IN ('Ziel', 'Zwischenziel')
    AND apflora.tpopber.jahr IS NOT NULL
  GROUP BY
    apflora.tpopkontr.tpop_id
),
letzte_tpopber as (
  SELECT
    apflora.tpopber.tpop_id,
    tpopber_letzte_id.tpopber_anz,
    apflora.tpopber.id,
    apflora.tpopber.jahr,
    apflora.tpop_entwicklung_werte.text AS entwicklung,
    apflora.tpopber.bemerkungen,
    apflora.tpopber.changed,
    apflora.tpopber.changed_by
  FROM
    tpopber_letzte_id
    INNER JOIN
      apflora.tpopber
      ON
        (tpopber_letzte_id.tpopber_letzte_id = apflora.tpopber.id)
        AND (tpopber_letzte_id.tpop_id = apflora.tpopber.tpop_id)
    LEFT JOIN
      apflora.tpop_entwicklung_werte
      ON apflora.tpopber.entwicklung = tpop_entwicklung_werte.code
)
SELECT
  eulk.ap_id,
  eulk.familie,
  eulk.artname,
  eulk.ap_bearbeitung,
  eulk.ap_start_jahr,
  eulk.ap_umsetzung,
  eulk.ap_bearbeiter,
  eulk.pop_id,
  eulk.pop_nr,
  eulk.pop_name,
  eulk.pop_status,
  eulk.pop_bekannt_seit,
  eulk.pop_status_unklar,
  eulk.pop_status_unklar_begruendung,
  eulk.pop_x,
  eulk.pop_y,
  eulk.id,
  eulk.nr,
  eulk.gemeinde,
  eulk.flurname,
  eulk.status,
  eulk.bekannt_seit,
  eulk.status_unklar,
  eulk.status_unklar_grund,
  eulk.x,
  eulk.y,
  eulk.radius,
  eulk.hoehe,
  eulk.exposition,
  eulk.klima,
  eulk.neigung,
  eulk.beschreibung,
  eulk.kataster_nr,
  eulk.apber_relevant,
  eulk.apber_relevant_grund,
  eulk.eigentuemer,
  eulk.kontakt,
  eulk.nutzungszone,
  eulk.bewirtschafter,
  eulk.bewirtschaftung,
  eulk.ekfrequenz,
  eulk.ekfrequenz_abweichend,
  eulk.changed,
  eulk.changed_by,
  eulk.anzahl_kontrollen,
  eulk.erste_kontrolle_id,
  eulk.erste_kontrolle_jahr,
  eulk.erste_kontrolle_datum,
  eulk.erste_kontrolle_typ,
  eulk.erste_kontrolle_bearbeiter,
  eulk.erste_kontrolle_ueberlebensrate,
  eulk.erste_kontrolle_vitalitaet,
  eulk.erste_kontrolle_entwicklung,
  eulk.erste_kontrolle_ursachen,
  eulk.erste_kontrolle_erfolgsbeurteilung,
  eulk.erste_kontrolle_umsetzung_aendern,
  eulk.erste_kontrolle_kontrolle_aendern,
  eulk.erste_kontrolle_bemerkungen,
  eulk.erste_kontrolle_lr_delarze,
  eulk.erste_kontrolle_lr_umgebung_delarze,
  eulk.erste_kontrolle_vegetationstyp,
  eulk.erste_kontrolle_konkurrenz,
  eulk.erste_kontrolle_moosschicht,
  eulk.erste_kontrolle_krautschicht,
  eulk.erste_kontrolle_strauchschicht,
  eulk.erste_kontrolle_baumschicht,
  eulk.erste_kontrolle_boden_typ,
  eulk.erste_kontrolle_boden_kalkgehalt,
  eulk.erste_kontrolle_boden_durchlaessigkeit,
  eulk.erste_kontrolle_boden_humus,
  eulk.erste_kontrolle_boden_naehrstoffgehalt,
  eulk.erste_kontrolle_boden_abtrag,
  eulk.erste_kontrolle_wasserhaushalt,
  eulk.erste_kontrolle_idealbiotop_uebereinstimmung,
  eulk.erste_kontrolle_handlungsbedarf,
  eulk.erste_kontrolle_flaeche_ueberprueft,
  eulk.erste_kontrolle_flaeche,
  eulk.erste_kontrolle_plan_vorhanden,
  eulk.erste_kontrolle_deckung_vegetation,
  eulk.erste_kontrolle_deckung_nackter_boden,
  eulk.erste_kontrolle_deckung_ap_art,
  eulk.erste_kontrolle_jungpflanzen_vorhanden,
  eulk.erste_kontrolle_vegetationshoehe_maximum,
  eulk.erste_kontrolle_vegetationshoehe_mittel,
  eulk.erste_kontrolle_gefaehrdung,
  eulk.erste_kontrolle_changed,
  eulk.erste_kontrolle_changed_by,
  eulk.erste_kontrolle_apber_nicht_relevant,
  eulk.erste_kontrolle_apber_nicht_relevant_grund,
  eulk.erste_kontrolle_ekf_bemerkungen,
  eulk.erste_kontrolle_zaehlung_anzahlen,
  eulk.erste_kontrolle_zaehlung_einheiten,
  eulk.erste_kontrolle_zaehlung_methoden,
  eulk.letzte_kontrolle_id,
  eulk.letzte_kontrolle_jahr,
  eulk.letzte_kontrolle_datum,
  eulk.letzte_kontrolle_typ,
  eulk.letzte_kontrolle_bearbeiter,
  eulk.letzte_kontrolle_ueberlebensrate,
  eulk.letzte_kontrolle_vitalitaet,
  eulk.letzte_kontrolle_entwicklung,
  eulk.letzte_kontrolle_ursachen,
  eulk.letzte_kontrolle_erfolgsbeurteilung,
  eulk.letzte_kontrolle_umsetzung_aendern,
  eulk.letzte_kontrolle_kontrolle_aendern,
  eulk.letzte_kontrolle_bemerkungen,
  eulk.letzte_kontrolle_lr_delarze,
  eulk.letzte_kontrolle_lr_umgebung_delarze,
  eulk.letzte_kontrolle_vegetationstyp,
  eulk.letzte_kontrolle_konkurrenz,
  eulk.letzte_kontrolle_moosschicht,
  eulk.letzte_kontrolle_krautschicht,
  eulk.letzte_kontrolle_strauchschicht,
  eulk.letzte_kontrolle_baumschicht,
  eulk.letzte_kontrolle_boden_typ,
  eulk.letzte_kontrolle_boden_kalkgehalt,
  eulk.letzte_kontrolle_boden_durchlaessigkeit,
  eulk.letzte_kontrolle_boden_humus,
  eulk.letzte_kontrolle_boden_naehrstoffgehalt,
  eulk.letzte_kontrolle_boden_abtrag,
  eulk.letzte_kontrolle_wasserhaushalt,
  eulk.letzte_kontrolle_idealbiotop_uebereinstimmung,
  eulk.letzte_kontrolle_handlungsbedarf,
  eulk.letzte_kontrolle_flaeche_ueberprueft,
  eulk.letzte_kontrolle_flaeche,
  eulk.letzte_kontrolle_plan_vorhanden,
  eulk.letzte_kontrolle_deckung_vegetation,
  eulk.letzte_kontrolle_deckung_nackter_boden,
  eulk.letzte_kontrolle_deckung_ap_art,
  eulk.letzte_kontrolle_jungpflanzen_vorhanden,
  eulk.letzte_kontrolle_vegetationshoehe_maximum,
  eulk.letzte_kontrolle_vegetationshoehe_mittel,
  eulk.letzte_kontrolle_gefaehrdung,
  eulk.letzte_kontrolle_changed,
  eulk.letzte_kontrolle_changed_by,
  eulk.letzte_kontrolle_apber_nicht_relevant,
  eulk.letzte_kontrolle_apber_nicht_relevant_grund,
  eulk.letzte_kontrolle_ekf_bemerkungen,
  eulk.letzte_kontrolle_zaehlung_anzahlen,
  eulk.letzte_kontrolle_zaehlung_einheiten,
  eulk.letzte_kontrolle_zaehlung_methoden,
	letzte_tpopber.tpopber_anz,
	letzte_tpopber.id AS tpopber_id,
	letzte_tpopber.jahr as tpopber_jahr,
	letzte_tpopber.entwicklung as tpopber_entwicklung,
	letzte_tpopber.bemerkungen as tpopber_bemerkungen,
	letzte_tpopber.changed as tpopber_changed,
	letzte_tpopber.changed_by  as tpopber_changed_by
FROM
	apflora.v_tpop_erste_und_letzte_kontrolle as eulk
  LEFT JOIN
    letzte_tpopber
    ON eulk.id = letzte_tpopber.tpop_id;