DROP VIEW IF EXISTS apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber AS
with anz_kontr as (
  SELECT
    apflora.tpop.id as tpop_id,
    count(apflora.tpopkontr.id) AS anz_tpopkontr
  FROM
    apflora.tpop
    LEFT JOIN apflora.tpopkontr
    ON apflora.tpop.id = apflora.tpopkontr.tpop_id
  WHERE
    apflora.tpopkontr.jahr is not null
    and apflora.tpopkontr.typ is not null
    and apflora.tpopkontr.typ not in ('Ziel', 'Zwischenziel')
    and apflora.tpopkontr.apber_nicht_relevant is not true
  GROUP BY
    apflora.tpop.id
),
letzte_kontr as (
  SELECT distinct on (apflora.tpop.id)
    apflora.tpop.id,
    apflora.tpopkontr.id AS tpopkontr_id
  FROM 
    apflora.tpop
    inner join apflora.tpopkontr
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
  WHERE
    apflora.tpopkontr.jahr is not null
    and apflora.tpopkontr.typ is not null
    and apflora.tpopkontr.typ not in ('Ziel', 'Zwischenziel')
    and apflora.tpopkontr.apber_nicht_relevant is not true
  order by
    apflora.tpop.id,
    tpopkontr.jahr desc,
    tpopkontr.datum desc
),
letzte_kontr_anzahlen as (
  select
    apflora.tpopkontr.tpop_id,
    array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS anzahlen,
    string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS einheiten,
    string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS methoden
  from
    apflora.tpopkontr
    inner join apflora.tpopkontrzaehl
      LEFT JOIN apflora.tpopkontrzaehl_einheit_werte
      ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code
      LEFT JOIN apflora.tpopkontrzaehl_methode_werte
      ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code
    on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
    inner join letzte_kontr
    on letzte_kontr.tpopkontr_id = apflora.tpopkontr.id and letzte_kontr.id = apflora.tpopkontr.tpop_id
  group by
    apflora.tpopkontr.tpop_id
),
erste_kontr as (
  SELECT distinct on (apflora.tpop.id)
    apflora.tpop.id,
    apflora.tpopkontr.id AS tpopkontr_id
  FROM 
    apflora.tpop
    inner join apflora.tpopkontr
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
  WHERE
    apflora.tpopkontr.jahr is not null
    and apflora.tpopkontr.typ is not null
    and apflora.tpopkontr.typ not in ('Ziel', 'Zwischenziel')
    and apflora.tpopkontr.apber_nicht_relevant is not true
  order by
    apflora.tpop.id,
    tpopkontr.jahr asc,
    tpopkontr.datum asc
),
erste_kontr_anzahlen as (
  select
    apflora.tpopkontr.tpop_id,
    array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS anzahlen,
    string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS einheiten,
    string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS methoden
  from
    apflora.tpopkontr
    inner join apflora.tpopkontrzaehl
      LEFT JOIN apflora.tpopkontrzaehl_einheit_werte
      ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code
      LEFT JOIN apflora.tpopkontrzaehl_methode_werte
      ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code
    on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
    inner join erste_kontr
    on erste_kontr.tpopkontr_id = apflora.tpopkontr.id and erste_kontr.id = apflora.tpopkontr.tpop_id
  group by
    apflora.tpopkontr.tpop_id
),
anz_tpopber as (
  SELECT
    apflora.tpop.id as tpop_id,
    count(apflora.tpopber.id) AS anzahl
  FROM
    apflora.tpop
    left JOIN apflora.tpopber
    ON apflora.tpop.id = apflora.tpopber.tpop_id
  WHERE
    apflora.tpopber.jahr is not null
    and apflora.tpopber.entwicklung is not null
  GROUP BY
    apflora.tpop.id
),
letzte_tpopber as (
  SELECT distinct on (apflora.tpopber.tpop_id)
    apflora.tpopber.tpop_id,
    apflora.tpopber.id,
    apflora.tpopber.jahr,
    apflora.tpop_entwicklung_werte.text AS entwicklung,
    apflora.tpopber.bemerkungen,
    apflora.tpopber.changed,
    apflora.tpopber.changed_by
  FROM
    apflora.tpopber
    LEFT JOIN apflora.tpop_entwicklung_werte
    ON apflora.tpopber.entwicklung = tpop_entwicklung_werte.code
  WHERE
    apflora.tpopber.jahr is not null
    and apflora.tpopber.entwicklung is not null
  order by
    apflora.tpopber.tpop_id,
    apflora.tpopber.jahr desc,
    apflora.tpopber.changed desc
)
SELECT
  apflora.pop.ap_id,
  apflora.ae_taxonomies.familie,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.adresse.name AS ap_bearbeiter,
  apflora.pop.id as pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.pop.status_unklar AS pop_status_unklar,
  apflora.pop.status_unklar_begruendung AS pop_status_unklar_begruendung,
  apflora.pop.lv95_x AS pop_x,
  apflora.pop.lv95_y AS pop_y,
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  apflora.tpop.status,
  pop_status_werte_2.text AS status_decodiert,
  apflora.tpop.bekannt_seit,
  apflora.tpop.status_unklar,
  apflora.tpop.status_unklar_grund,
  apflora.tpop.lv95_x as x,
  apflora.tpop.lv95_y as y,
  apflora.tpop.radius,
  apflora.tpop.hoehe,
  apflora.tpop.exposition,
  apflora.tpop.klima,
  apflora.tpop.neigung,
  apflora.tpop.beschreibung,
  apflora.tpop.kataster_nr,
  apflora.tpop.apber_relevant,
  apflora.tpop.apber_relevant_grund,
  apflora.tpop.eigentuemer,
  apflora.tpop.kontakt,
  apflora.tpop.nutzungszone,
  apflora.tpop.bewirtschafter,
  apflora.tpop.bewirtschaftung,
  apflora.tpop.ekfrequenz,
  apflora.tpop.ekfrequenz_abweichend,
  apflora.tpop.changed,
  apflora.tpop.changed_by,
  coalesce(anz_kontr.anz_tpopkontr, 0) AS anzahl_kontrollen,
  lk.id as letzte_kontrolle_id,
  lk.jahr as letzte_kontrolle_jahr,
  lk.datum as letzte_kontrolle_datum,
  lk_typ_werte as letzte_kontrolle_typ,
  lk_adresse.name as letzte_kontrolle_bearbeiter,
  lk.ueberlebensrate as letzte_kontrolle_ueberlebensrate,
  lk.vitalitaet as letzte_kontrolle_vitalitaet,
  lk_entwicklung_werte as letzte_kontrolle_entwicklung,
  lk.ursachen as letzte_kontrolle_ursachen,
  lk.erfolgsbeurteilung as letzte_kontrolle_erfolgsbeurteilung,
  lk.umsetzung_aendern as letzte_kontrolle_umsetzung_aendern,
  lk.kontrolle_aendern as letzte_kontrolle_kontrolle_aendern,
  lk.bemerkungen as letzte_kontrolle_bemerkungen,
  lk.lr_delarze as letzte_kontrolle_lr_delarze,
  lk.lr_umgebung_delarze as letzte_kontrolle_lr_umgebung_delarze,
  lk.vegetationstyp as letzte_kontrolle_vegetationstyp,
  lk.konkurrenz as letzte_kontrolle_konkurrenz,
  lk.moosschicht as letzte_kontrolle_moosschicht,
  lk.krautschicht as letzte_kontrolle_krautschicht,
  lk.strauchschicht as letzte_kontrolle_strauchschicht,
  lk.baumschicht as letzte_kontrolle_baumschicht,
  lk.boden_typ as letzte_kontrolle_boden_typ,
  lk.boden_kalkgehalt as letzte_kontrolle_boden_kalkgehalt,
  lk.boden_durchlaessigkeit as letzte_kontrolle_boden_durchlaessigkeit,
  lk.boden_humus as letzte_kontrolle_boden_humus,
  lk.boden_naehrstoffgehalt as letzte_kontrolle_boden_naehrstoffgehalt,
  lk.boden_abtrag as letzte_kontrolle_boden_abtrag,
  lk.wasserhaushalt as letzte_kontrolle_wasserhaushalt,
  lk_idbiotuebereinst_werte.text as letzte_kontrolle_idealbiotop_uebereinstimmung,
  lk.handlungsbedarf as letzte_kontrolle_handlungsbedarf,
  lk.flaeche_ueberprueft as letzte_kontrolle_flaeche_ueberprueft,
  lk.flaeche as letzte_kontrolle_flaeche,
  lk.plan_vorhanden as letzte_kontrolle_plan_vorhanden,
  lk.deckung_vegetation as letzte_kontrolle_deckung_vegetation,
  lk.deckung_nackter_boden as letzte_kontrolle_deckung_nackter_boden,
  lk.deckung_ap_art as letzte_kontrolle_deckung_ap_art,
  lk.jungpflanzen_vorhanden as letzte_kontrolle_jungpflanzen_vorhanden,
  lk.vegetationshoehe_maximum as letzte_kontrolle_vegetationshoehe_maximum,
  lk.vegetationshoehe_mittel as letzte_kontrolle_vegetationshoehe_mittel,
  lk.gefaehrdung as letzte_kontrolle_gefaehrdung,
  lk.changed as letzte_kontrolle_changed,
  lk.changed_by as letzte_kontrolle_changed_by,
  lk.apber_nicht_relevant as letzte_kontrolle_apber_nicht_relevant,
  lk.apber_nicht_relevant_grund as letzte_kontrolle_apber_nicht_relevant_grund,
  lk.ekf_bemerkungen as letzte_kontrolle_ekf_bemerkungen,
  letzte_kontr_anzahlen.anzahlen as letzte_kontrolle_zaehlung_anzahlen,
  letzte_kontr_anzahlen.einheiten AS letzte_kontrolle_zaehlung_einheiten,
  letzte_kontr_anzahlen.methoden AS letzte_kontrolle_zaehlung_methoden,
  ek.id as erste_kontrolle_id,
  ek.jahr as erste_kontrolle_jahr,
  ek.datum as erste_kontrolle_datum,
  ek_typ_werte.text as erste_kontrolle_typ,
  ek_adresse.name as erste_kontrolle_bearbeiter,
  ek.ueberlebensrate as erste_kontrolle_ueberlebensrate,
  ek.vitalitaet as erste_kontrolle_vitalitaet,
  ek_entwicklung_werte.text as erste_kontrolle_entwicklung,
  ek.ursachen as erste_kontrolle_ursachen,
  ek.erfolgsbeurteilung as erste_kontrolle_erfolgsbeurteilung,
  ek.umsetzung_aendern as erste_kontrolle_umsetzung_aendern,
  ek.kontrolle_aendern as erste_kontrolle_kontrolle_aendern,
  ek.bemerkungen as erste_kontrolle_bemerkungen,
  ek.lr_delarze as erste_kontrolle_lr_delarze,
  ek.lr_umgebung_delarze as erste_kontrolle_lr_umgebung_delarze,
  ek.vegetationstyp as erste_kontrolle_vegetationstyp,
  ek.konkurrenz as erste_kontrolle_konkurrenz,
  ek.moosschicht as erste_kontrolle_moosschicht,
  ek.krautschicht as erste_kontrolle_krautschicht,
  ek.strauchschicht as erste_kontrolle_strauchschicht,
  ek.baumschicht as erste_kontrolle_baumschicht,
  ek.boden_typ as erste_kontrolle_boden_typ,
  ek.boden_kalkgehalt as erste_kontrolle_boden_kalkgehalt,
  ek.boden_durchlaessigkeit as erste_kontrolle_boden_durchlaessigkeit,
  ek.boden_humus as erste_kontrolle_boden_humus,
  ek.boden_naehrstoffgehalt as erste_kontrolle_boden_naehrstoffgehalt,
  ek.boden_abtrag as erste_kontrolle_boden_abtrag,
  ek.wasserhaushalt as erste_kontrolle_wasserhaushalt,
  ek_idbiotuebereinst_werte.text as erste_kontrolle_idealbiotop_uebereinstimmung,
  ek.handlungsbedarf as erste_kontrolle_handlungsbedarf,
  ek.flaeche_ueberprueft as erste_kontrolle_flaeche_ueberprueft,
  ek.flaeche as erste_kontrolle_flaeche,
  ek.plan_vorhanden as erste_kontrolle_plan_vorhanden,
  ek.deckung_vegetation as erste_kontrolle_deckung_vegetation,
  ek.deckung_nackter_boden as erste_kontrolle_deckung_nackter_boden,
  ek.deckung_ap_art as erste_kontrolle_deckung_ap_art,
  ek.jungpflanzen_vorhanden as erste_kontrolle_jungpflanzen_vorhanden,
  ek.vegetationshoehe_maximum as erste_kontrolle_vegetationshoehe_maximum,
  ek.vegetationshoehe_mittel as erste_kontrolle_vegetationshoehe_mittel,
  ek.gefaehrdung as erste_kontrolle_gefaehrdung,
  ek.changed as erste_kontrolle_changed,
  ek.changed_by as erste_kontrolle_changed_by,
  ek.apber_nicht_relevant as erste_kontrolle_apber_nicht_relevant,
  ek.apber_nicht_relevant_grund as erste_kontrolle_apber_nicht_relevant_grund,
  ek.ekf_bemerkungen as erste_kontrolle_ekf_bemerkungen,
  erste_kontr_anzahlen.anzahlen as erste_kontrolle_zaehlung_anzahlen,
  erste_kontr_anzahlen.einheiten AS erste_kontrolle_zaehlung_einheiten,
  erste_kontr_anzahlen.methoden AS erste_kontrolle_zaehlung_methoden,
	anz_tpopber.anzahl as tpopber_anz,
	letzte_tpopber.id AS tpopber_id,
	letzte_tpopber.jahr as tpopber_jahr,
	letzte_tpopber.entwicklung as tpopber_entwicklung,
	letzte_tpopber.bemerkungen as tpopber_bemerkungen,
	letzte_tpopber.changed as tpopber_changed,
	letzte_tpopber.changed_by  as tpopber_changed_by
FROM
  apflora.ae_taxonomies
  INNER JOIN apflora.ap
    LEFT JOIN apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
    LEFT JOIN apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
    LEFT JOIN apflora.adresse
    ON apflora.ap.bearbeiter = apflora.adresse.id
    INNER JOIN apflora.pop
      LEFT JOIN apflora.pop_status_werte
      ON apflora.pop.status  = pop_status_werte.code
      INNER JOIN apflora.tpop
        left join letzte_kontr_anzahlen
        on letzte_kontr_anzahlen.tpop_id = apflora.tpop.id
        left join erste_kontr_anzahlen
        on erste_kontr_anzahlen.tpop_id = apflora.tpop.id
        left join anz_tpopber
        on anz_tpopber.tpop_id = apflora.tpop.id
        left join anz_kontr
        on anz_kontr.tpop_id = apflora.tpop.id
        LEFT JOIN apflora.pop_status_werte AS pop_status_werte_2
        ON apflora.tpop.status = pop_status_werte_2.code
        LEFT JOIN letzte_tpopber
        ON apflora.tpop.id = letzte_tpopber.tpop_id
        LEFT JOIN letzte_kontr
          inner JOIN apflora.tpopkontr as lk
            LEFT JOIN apflora.tpopkontr_typ_werte lk_typ_werte
            ON lk.typ = lk_typ_werte.text
            LEFT JOIN apflora.adresse lk_adresse
            ON lk.bearbeiter = lk_adresse.id
            LEFT JOIN apflora.tpop_entwicklung_werte lk_entwicklung_werte
            ON lk.entwicklung = lk_entwicklung_werte.code
            LEFT JOIN apflora.tpopkontr_idbiotuebereinst_werte lk_idbiotuebereinst_werte
            ON lk.idealbiotop_uebereinstimmung = lk_idbiotuebereinst_werte.code
          ON letzte_kontr.tpopkontr_id = lk.id
        ON letzte_kontr.id = apflora.tpop.id
        LEFT JOIN erste_kontr
          inner JOIN apflora.tpopkontr as ek
            LEFT JOIN apflora.tpopkontr_typ_werte ek_typ_werte
            ON ek.typ = ek_typ_werte.text
            LEFT JOIN apflora.adresse ek_adresse
            ON ek.bearbeiter = ek_adresse.id
            LEFT JOIN apflora.tpop_entwicklung_werte ek_entwicklung_werte
            ON ek.entwicklung = ek_entwicklung_werte.code
            LEFT JOIN apflora.tpopkontr_idbiotuebereinst_werte ek_idbiotuebereinst_werte
            ON ek.idealbiotop_uebereinstimmung = ek_idbiotuebereinst_werte.code
          ON erste_kontr.tpopkontr_id = ek.id
        ON erste_kontr.id = apflora.tpop.id
      ON apflora.pop.id = apflora.tpop.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
order by
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;