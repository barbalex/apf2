-- 1. add new fields
alter table apflora.tpop add column boden_typ text DEFAULT NULL;
alter table apflora.tpop add column boden_kalkgehalt text DEFAULT NULL;
alter table apflora.tpop add column boden_durchlaessigkeit text DEFAULT NULL;
alter table apflora.tpop add column boden_humus text DEFAULT NULL;
alter table apflora.tpop add column boden_naehrstoffgehalt text DEFAULT NULL;
alter table apflora.tpop add column boden_abtrag text DEFAULT NULL;
alter table apflora.tpop add column wasserhaushalt text DEFAULT NULL;
COMMENT ON COLUMN apflora.tpop.boden_typ IS 'Bodentyp';
COMMENT ON COLUMN apflora.tpop.boden_kalkgehalt IS 'Kalkgehalt des Bodens';
COMMENT ON COLUMN apflora.tpop.boden_durchlaessigkeit IS 'Durchlässigkeit des Bodens';
COMMENT ON COLUMN apflora.tpop.boden_humus IS 'Humusgehalt des Bodens';
COMMENT ON COLUMN apflora.tpop.boden_naehrstoffgehalt IS 'Nährstoffgehalt des Bodens';
COMMENT ON COLUMN apflora.tpop.boden_abtrag IS 'Oberbodenabtrag';
COMMENT ON COLUMN apflora.tpop.wasserhaushalt IS 'Wasserhaushalt';

-- 2. views
drop view if exists apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber;
create or replace view apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber as
with anz_kontr as (
  select
    apflora.tpop.id as tpop_id,
    count(apflora.tpopkontr.id) as anz_tpopkontr
  from
    apflora.tpop
    left join apflora.tpopkontr
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
  where
    apflora.tpopkontr.jahr is not null
    and apflora.tpopkontr.typ is not null
    and apflora.tpopkontr.typ not in ('ziel', 'zwischenziel')
    and apflora.tpopkontr.apber_nicht_relevant is not true
  group by
    apflora.tpop.id
),
letzte_kontr as (
  select distinct on (apflora.tpop.id)
    apflora.tpop.id,
    apflora.tpopkontr.id as tpopkontr_id
  from 
    apflora.tpop
    inner join apflora.tpopkontr
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
  where
    apflora.tpopkontr.jahr is not null
    and apflora.tpopkontr.typ is not null
    and apflora.tpopkontr.typ not in ('ziel', 'zwischenziel')
    and apflora.tpopkontr.apber_nicht_relevant is not true
  order by
    apflora.tpop.id,
    tpopkontr.jahr desc,
    tpopkontr.datum desc
),
letzte_kontr_anzahlen as (
  select
    apflora.tpopkontr.tpop_id,
    array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') as anzahlen,
    string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') as einheiten,
    string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') as methoden
  from
    apflora.tpopkontr
    inner join apflora.tpopkontrzaehl
      left join apflora.tpopkontrzaehl_einheit_werte
      on apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code
      left join apflora.tpopkontrzaehl_methode_werte
      on apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code
    on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
    inner join letzte_kontr
    on letzte_kontr.tpopkontr_id = apflora.tpopkontr.id and letzte_kontr.id = apflora.tpopkontr.tpop_id
  group by
    apflora.tpopkontr.tpop_id
),
erste_kontr as (
  select distinct on (apflora.tpop.id)
    apflora.tpop.id,
    apflora.tpopkontr.id as tpopkontr_id
  from 
    apflora.tpop
    inner join apflora.tpopkontr
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
  where
    apflora.tpopkontr.jahr is not null
    and apflora.tpopkontr.typ is not null
    and apflora.tpopkontr.typ not in ('ziel', 'zwischenziel')
    and apflora.tpopkontr.apber_nicht_relevant is not true
  order by
    apflora.tpop.id,
    tpopkontr.jahr asc,
    tpopkontr.datum asc
),
erste_kontr_anzahlen as (
  select
    apflora.tpopkontr.tpop_id,
    array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') as anzahlen,
    string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') as einheiten,
    string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') as methoden
  from
    apflora.tpopkontr
    inner join apflora.tpopkontrzaehl
      left join apflora.tpopkontrzaehl_einheit_werte
      on apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code
      left join apflora.tpopkontrzaehl_methode_werte
      on apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code
    on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
    inner join erste_kontr
    on erste_kontr.tpopkontr_id = apflora.tpopkontr.id and erste_kontr.id = apflora.tpopkontr.tpop_id
  group by
    apflora.tpopkontr.tpop_id
),
anz_tpopber as (
  select
    apflora.tpop.id as tpop_id,
    count(apflora.tpopber.id) as anzahl
  from
    apflora.tpop
    left join apflora.tpopber
    on apflora.tpop.id = apflora.tpopber.tpop_id
  where
    apflora.tpopber.jahr is not null
    and apflora.tpopber.entwicklung is not null
  group by
    apflora.tpop.id
),
letzte_tpopber as (
  select distinct on (apflora.tpopber.tpop_id)
    apflora.tpopber.tpop_id,
    apflora.tpopber.id,
    apflora.tpopber.jahr,
    apflora.tpop_entwicklung_werte.text as entwicklung,
    apflora.tpopber.bemerkungen,
    apflora.tpopber.changed,
    apflora.tpopber.changed_by
  from
    apflora.tpopber
    left join apflora.tpop_entwicklung_werte
    on apflora.tpopber.entwicklung = tpop_entwicklung_werte.code
  where
    apflora.tpopber.jahr is not null
    and apflora.tpopber.entwicklung is not null
  order by
    apflora.tpopber.tpop_id,
    apflora.tpopber.jahr desc,
    apflora.tpopber.changed desc
)
select
  apflora.pop.ap_id,
  apflora.ae_taxonomies.familie,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text as ap_bearbeitung,
  apflora.ap.start_jahr as ap_start_jahr,
  apflora.ap_umsetzung_werte.text as ap_umsetzung,
  apflora.adresse.name as ap_bearbeiter,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  pop_status_werte.text as pop_status,
  apflora.pop.bekannt_seit as pop_bekannt_seit,
  apflora.pop.status_unklar as pop_status_unklar,
  apflora.pop.status_unklar_begruendung as pop_status_unklar_begruendung,
  apflora.pop.lv95_x as pop_x,
  apflora.pop.lv95_y as pop_y,
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  apflora.tpop.status,
  pop_status_werte_2.text as status_decodiert,
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
  apflora.ekfrequenz.code as ekfrequenz,
  apflora.tpop.ekfrequenz_abweichend,
  apflora.tpop.changed,
  apflora.tpop.changed_by,
  coalesce(anz_kontr.anz_tpopkontr, 0) as anzahl_kontrollen,
  lk.id as letzte_kontrolle_id,
  lk.jahr as letzte_kontrolle_jahr,
  lk.datum as letzte_kontrolle_datum,
  lk.typ as letzte_kontrolle_typ,
  lk_adresse.name as letzte_kontrolle_bearbeiter,
  lk.ueberlebensrate as letzte_kontrolle_ueberlebensrate,
  lk.vitalitaet as letzte_kontrolle_vitalitaet,
  lk_entwicklung_werte.text as letzte_kontrolle_entwicklung,
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
  letzte_kontr_anzahlen.einheiten as letzte_kontrolle_zaehlung_einheiten,
  letzte_kontr_anzahlen.methoden as letzte_kontrolle_zaehlung_methoden,
  ek.id as erste_kontrolle_id,
  ek.jahr as erste_kontrolle_jahr,
  ek.datum as erste_kontrolle_datum,
  ek.typ as erste_kontrolle_typ,
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
  erste_kontr_anzahlen.einheiten as erste_kontrolle_zaehlung_einheiten,
  erste_kontr_anzahlen.methoden as erste_kontrolle_zaehlung_methoden,
	anz_tpopber.anzahl as tpopber_anz,
	letzte_tpopber.id as tpopber_id,
	letzte_tpopber.jahr as tpopber_jahr,
	letzte_tpopber.entwicklung as tpopber_entwicklung,
	letzte_tpopber.bemerkungen as tpopber_bemerkungen,
	letzte_tpopber.changed as tpopber_changed,
	letzte_tpopber.changed_by  as tpopber_changed_by
from
  apflora.ae_taxonomies
  inner join apflora.ap
    left join apflora.ap_bearbstand_werte
    on apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
    left join apflora.ap_umsetzung_werte
    on apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
    left join apflora.adresse
    on apflora.ap.bearbeiter = apflora.adresse.id
    inner join apflora.pop
      left join apflora.pop_status_werte
      on apflora.pop.status  = pop_status_werte.code
      inner join apflora.tpop
        left join apflora.ekfrequenz
        on apflora.ekfrequenz.id = apflora.tpop.ekfrequenz
        left join letzte_kontr_anzahlen
        on letzte_kontr_anzahlen.tpop_id = apflora.tpop.id
        left join erste_kontr_anzahlen
        on erste_kontr_anzahlen.tpop_id = apflora.tpop.id
        left join anz_tpopber
        on anz_tpopber.tpop_id = apflora.tpop.id
        left join anz_kontr
        on anz_kontr.tpop_id = apflora.tpop.id
        left join apflora.pop_status_werte as pop_status_werte_2
        on apflora.tpop.status = pop_status_werte_2.code
        left join letzte_tpopber
        on apflora.tpop.id = letzte_tpopber.tpop_id
        left join letzte_kontr
          inner join apflora.tpopkontr as lk
            left join apflora.adresse lk_adresse
            on lk.bearbeiter = lk_adresse.id
            left join apflora.tpop_entwicklung_werte lk_entwicklung_werte
            on lk.entwicklung = lk_entwicklung_werte.code
            left join apflora.tpopkontr_idbiotuebereinst_werte lk_idbiotuebereinst_werte
            on lk.idealbiotop_uebereinstimmung = lk_idbiotuebereinst_werte.code
          on letzte_kontr.tpopkontr_id = lk.id
        on letzte_kontr.id = apflora.tpop.id
        left join erste_kontr
          inner join apflora.tpopkontr as ek
            left join apflora.adresse ek_adresse
            on ek.bearbeiter = ek_adresse.id
            left join apflora.tpop_entwicklung_werte ek_entwicklung_werte
            on ek.entwicklung = ek_entwicklung_werte.code
            left join apflora.tpopkontr_idbiotuebereinst_werte ek_idbiotuebereinst_werte
            on ek.idealbiotop_uebereinstimmung = ek_idbiotuebereinst_werte.code
          on erste_kontr.tpopkontr_id = ek.id
        on erste_kontr.id = apflora.tpop.id
      on apflora.pop.id = apflora.tpop.pop_id
    on apflora.ap.id = apflora.pop.ap_id
  on apflora.ae_taxonomies.id = apflora.ap.art_id
where
  apflora.ae_taxonomies.taxid > 150
order by
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_tpopkontr_webgisbun;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_webgisbun AS
SELECT
  apflora.ap.id AS "APARTID",
  apflora.ae_taxonomies.artname AS "APART",
  apflora.pop.id AS "POPGUID",
  apflora.pop.nr AS "POPNR",
  apflora.tpop.id AS "TPOPGUID",
  apflora.tpop.nr AS "TPOPNR",
  apflora.tpop.apber_relevant AS "TPop_apber_relevant",
  apberrelevant_grund_werte.text AS "TPop_apber_relevant_grund",
  apflora.tpopkontr.id AS "KONTRGUID",
  apflora.tpopkontr.jahr AS "KONTRJAHR",
  to_char(apflora.tpopkontr.datum, 'DD.MM.YY') AS "KONTRDAT",
  apflora.tpopkontr_typ_werte.text AS "KONTRTYP",
  pop_status_werte_2.text AS "TPOPSTATUS",
  apflora.adresse.name AS "KONTRBEARBEITER",
  apflora.tpopkontr.ueberlebensrate AS "KONTRUEBERLEBENSRATE",
  apflora.tpopkontr.vitalitaet AS "KONTRVITALITAET",
  apflora.tpop_entwicklung_werte.text AS "KONTRENTWICKLUNG",
  apflora.tpopkontr.ursachen AS "KONTRURSACHEN",
  apflora.tpopkontr.erfolgsbeurteilung AS "KONTRERFOLGBEURTEIL",
  apflora.tpopkontr.umsetzung_aendern AS "KONTRAENDUMSETZUNG",
  apflora.tpopkontr.kontrolle_aendern AS "KONTRAENDKONTROLLE",
  apflora.tpop.lv95_x AS "KONTR_X",
  apflora.tpop.lv95_y AS "KONTR_Y",
  apflora.tpop.wgs84_lat AS "KONTR_WGS84LAT",
  apflora.tpop.wgs84_long AS "KONTR_WGS84LONG",
  apflora.tpopkontr.bemerkungen AS "KONTRBEMERKUNGEN",
  apflora.tpopkontr.lr_delarze AS "KONTRLRMDELARZE",
  apflora.tpopkontr.lr_umgebung_delarze AS "KONTRDELARZEANGRENZ",
  apflora.tpopkontr.vegetationstyp AS "KONTRVEGTYP",
  apflora.tpopkontr.konkurrenz AS "KONTRKONKURRENZ",
  apflora.tpopkontr.moosschicht AS "KONTRMOOSE",
  apflora.tpopkontr.krautschicht AS "KONTRKRAUTSCHICHT",
  apflora.tpopkontr.strauchschicht AS "KONTRSTRAUCHSCHICHT",
  apflora.tpopkontr.baumschicht AS "KONTRBAUMSCHICHT",
  apflora.tpopkontr_idbiotuebereinst_werte.text AS "KONTRUEBEREINSTIMMUNIDEAL",
  apflora.tpopkontr.handlungsbedarf AS "KONTRHANDLUNGSBEDARF",
  apflora.tpopkontr.flaeche_ueberprueft AS "KONTRUEBERPRUFTFLAECHE",
  apflora.tpopkontr.flaeche AS "KONTRFLAECHETPOP",
  apflora.tpopkontr.plan_vorhanden AS "KONTRAUFPLAN",
  apflora.tpopkontr.deckung_vegetation AS "KONTRDECKUNGVEG",
  apflora.tpopkontr.deckung_nackter_boden AS "KONTRDECKUNGBODEN",
  apflora.tpopkontr.deckung_ap_art AS "KONTRDECKUNGART",
  apflora.tpopkontr.jungpflanzen_vorhanden AS "KONTRJUNGEPLANZEN",
  apflora.tpopkontr.vegetationshoehe_maximum AS "KONTRMAXHOEHEVEG",
  apflora.tpopkontr.vegetationshoehe_mittel AS "KONTRMITTELHOEHEVEG",
  apflora.tpopkontr.gefaehrdung AS "KONTRGEFAEHRDUNG",
  to_char(apflora.tpopkontr.changed, 'DD.MM.YY') AS "KONTRCHANGEDAT",
  apflora.tpopkontr.changed_by AS "KONTRCHANGEBY",
  string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS "ZAEHLEINHEITEN",
  array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS "ANZAHLEN",
  string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS "METHODEN"
FROM
    (((((((apflora.ae_taxonomies
    INNER JOIN
      apflora.ap
      ON apflora.ae_taxonomies.id = apflora.ap.art_id)
    INNER JOIN
      (apflora.pop
      INNER JOIN
        (apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS pop_status_werte_2
          ON apflora.tpop.status = pop_status_werte_2.code
        LEFT JOIN
          apflora.tpop_apberrelevant_grund_werte AS apberrelevant_grund_werte
          ON apflora.tpop.apber_relevant_grund = apberrelevant_grund_werte.code
        INNER JOIN
          ((((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte.text)
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl
            ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
          ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
        ON apflora.pop.id = apflora.tpop.pop_id)
      ON apflora.ap.id = apflora.pop.ap_id)
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop.status  = apflora.pop_status_werte.code)
    LEFT JOIN
      apflora.tpopkontr_idbiotuebereinst_werte
      ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code)
  LEFT JOIN
    apflora.adresse AS apflora_adresse_1
    ON apflora.ap.bearbeiter = apflora_adresse_1.id)
WHERE
  apflora.ae_taxonomies.taxid > 150
  and apflora.tpop.status not in (202, 300)
  and (apflora.tpop.apber_relevant_grund != 3 or apflora.tpop.apber_relevant_grund is null)
GROUP BY
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum,
  apflora.tpopkontr_typ_werte.text,
  pop_status_werte_2.text,
  apflora.adresse.name,
  apflora.tpopkontr.ueberlebensrate,
  apflora.tpopkontr.vitalitaet,
  apflora.tpop_entwicklung_werte.text,
  apflora.tpopkontr.ursachen,
  apflora.tpopkontr.erfolgsbeurteilung,
  apflora.tpopkontr.umsetzung_aendern,
  apflora.tpopkontr.kontrolle_aendern,
  apflora.tpop.lv95_x,
  apflora.tpop.lv95_y,
  apflora.tpop.wgs84_lat,
  apflora.tpop.wgs84_long,
  apflora.tpop.apber_relevant,
  apberrelevant_grund_werte.text,
  apflora.tpopkontr.bemerkungen,
  apflora.tpopkontr.lr_delarze,
  apflora.tpopkontr.lr_umgebung_delarze,
  apflora.tpopkontr.vegetationstyp,
  apflora.tpopkontr.konkurrenz,
  apflora.tpopkontr.moosschicht,
  apflora.tpopkontr.krautschicht,
  apflora.tpopkontr.strauchschicht,
  apflora.tpopkontr.baumschicht,
  apflora.tpopkontr_idbiotuebereinst_werte.text,
  apflora.tpopkontr.handlungsbedarf,
  apflora.tpopkontr.flaeche_ueberprueft,
  apflora.tpopkontr.flaeche,
  apflora.tpopkontr.plan_vorhanden,
  apflora.tpopkontr.deckung_vegetation,
  apflora.tpopkontr.deckung_nackter_boden,
  apflora.tpopkontr.deckung_ap_art,
  apflora.tpopkontr.jungpflanzen_vorhanden,
  apflora.tpopkontr.vegetationshoehe_maximum,
  apflora.tpopkontr.vegetationshoehe_mittel,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.changed,
  apflora.tpopkontr.changed_by
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;


DROP VIEW IF EXISTS apflora.v_tpopkontr_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_fuergis_write AS
SELECT
  apflora.tpopkontr.id::text AS id,
  apflora.tpopkontr.typ,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum::timestamp,
  apflora.tpopkontr.bearbeiter,
  apflora.tpopkontr.ueberlebensrate,
  apflora.tpopkontr.entwicklung,
  apflora.tpopkontr.vitalitaet,
  apflora.tpopkontr.ursachen,
  apflora.tpopkontr.erfolgsbeurteilung,
  apflora.tpopkontr.umsetzung_aendern,
  apflora.tpopkontr.kontrolle_aendern,
  apflora.tpopkontr.lr_delarze,
  apflora.tpopkontr.flaeche,
  apflora.tpopkontr.lr_umgebung_delarze,
  apflora.tpopkontr.vegetationstyp,
  apflora.tpopkontr.konkurrenz,
  apflora.tpopkontr.moosschicht,
  apflora.tpopkontr.krautschicht,
  apflora.tpopkontr.strauchschicht,
  apflora.tpopkontr.baumschicht,
  apflora.tpopkontr.idealbiotop_uebereinstimmung,
  apflora.tpopkontr.flaeche_ueberprueft,
  apflora.tpopkontr.plan_vorhanden,
  apflora.tpopkontr.deckung_vegetation,
  apflora.tpopkontr.deckung_nackter_boden,
  apflora.tpopkontr.deckung_ap_art,
  apflora.tpopkontr.jungpflanzen_vorhanden,
  apflora.tpopkontr.vegetationshoehe_maximum,
  apflora.tpopkontr.vegetationshoehe_mittel,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.bemerkungen,
  apflora.tpopkontr.changed::timestamp,
  apflora.tpopkontr.changed_by
FROM
  apflora.tpopkontr;

DROP VIEW IF EXISTS apflora.v_tpopkontr_fuergis_read;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_fuergis_read AS
SELECT
  apflora.ap.id as ap_id,
  apflora.ae_taxonomies.artname AS artname,
  apflora.ap_bearbstand_werte.text AS apherkunft,
  apflora.ap.start_jahr AS apjahr,
  apflora.ap_umsetzung_werte.text AS apumsetzung,
  CAST(apflora.pop.id AS varchar(50)) AS popid,
  apflora.pop.nr AS popnr,
  apflora.pop.name AS popname,
  apflora.pop_status_werte.text AS popherkunft,
  apflora.pop.bekannt_seit AS popbekanntseit,
  CAST(apflora.tpop.id AS varchar(50)) AS tpopid,
  apflora.tpop.nr AS tpopnr,
  apflora.tpop.gemeinde AS tpopgemeinde,
  apflora.tpop.flurname AS tpopflurname,
  apflora.tpop.lv95_x AS tpopxkoord,
  apflora.tpop.lv95_y AS tpopykoord,
  apflora.tpop.bekannt_seit AS tpopbekanntseit,
  CAST(apflora.tpopkontr.id AS varchar(50)) AS tpopkontrid,
  apflora.tpopkontr.jahr AS tpopkontrjahr,
  apflora.tpopkontr.datum::timestamp AS tpopkontrdatum,
  apflora.tpopkontr_typ_werte.text AS tpopkontrtyp,
  apflora.adresse.name AS tpopkontrbearb,
  apflora.tpopkontr.ueberlebensrate AS tpopkontrueberleb,
  apflora.tpopkontr.vitalitaet AS tpopkontrvitalitaet,
  apflora.tpop_entwicklung_werte.text AS tpopkontrentwicklung,
  apflora.tpopkontr.ursachen AS tpopkontrursach,
  apflora.tpopkontr.erfolgsbeurteilung AS tpopkontrurteil,
  apflora.tpopkontr.umsetzung_aendern AS tpopkontraendums,
  apflora.tpopkontr.kontrolle_aendern AS tpopkontraendkontr,
  apflora.tpopkontr.lr_delarze AS tpopkontrleb,
  apflora.tpopkontr.flaeche AS tpopkontrflaeche,
  apflora.tpopkontr.lr_umgebung_delarze AS tpopkontrlebumg,
  apflora.tpopkontr.vegetationstyp AS tpopkontrvegtyp,
  apflora.tpopkontr.konkurrenz AS tpopkontrkonkurrenz,
  apflora.tpopkontr.moosschicht AS tpopkontrmoosschicht,
  apflora.tpopkontr.krautschicht AS tpopkontrkrautschicht,
  apflora.tpopkontr.strauchschicht AS tpopkontrstrauchschicht,
  apflora.tpopkontr.baumschicht AS tpopkontrbaumschicht,
  apflora.tpopkontr_idbiotuebereinst_werte.text AS tpopkontridealbiotopuebereinst,
  apflora.tpopkontr.flaeche_ueberprueft AS tpopkontruebflaeche,
  apflora.tpopkontr.plan_vorhanden AS tpopkontrplan,
  apflora.tpopkontr.deckung_vegetation AS tpopkontrveg,
  apflora.tpopkontr.deckung_nackter_boden AS tpopkontrnabo,
  apflora.tpopkontr.deckung_ap_art AS tpopkontruebpfl,
  apflora.tpopkontr.jungpflanzen_vorhanden AS tpopkontrjungpfljn,
  apflora.tpopkontr.vegetationshoehe_maximum AS tpopkontrveghoemax,
  apflora.tpopkontr.vegetationshoehe_mittel AS tpopkontrveghoemit,
  apflora.tpopkontr.gefaehrdung AS tpopkontrgefaehrdung,
  apflora.tpopkontr.changed::timestamp AS mutwann,
  apflora.tpopkontr.changed_by AS mutwer
FROM
  (((((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (((apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontr_typ_werte
          ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte.text)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
        LEFT JOIN
          apflora.tpop_entwicklung_werte
          ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop.status  = apflora.pop_status_werte.code)
  LEFT JOIN
    apflora.tpopkontr_idbiotuebereinst_werte
    ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum;

DROP VIEW IF EXISTS apflora.v_kontrzaehl_anzproeinheit;
CREATE OR REPLACE VIEW apflora.v_kontrzaehl_anzproeinheit AS
SELECT
  apflora.ap.id as ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora_adresse_1.name AS ap_bearbeiter,
  apflora.pop.id as pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  apflora.pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop.gemeinde AS tpop_gemeinde,
  apflora.tpop.flurname AS tpop_flurname,
  tpop_status_werte.text AS tpop_status,
  apflora.tpop.bekannt_seit AS tpop_bekannt_seit,
  apflora.tpop.status_unklar AS tpop_status_unklar,
  apflora.tpop.status_unklar_grund AS tpop_status_unklar_grund,
  apflora.tpop.lv95_x AS tpop_x,
  apflora.tpop.lv95_y AS tpop_y,
  apflora.tpop.radius AS tpop_radius,
  apflora.tpop.hoehe AS tpop_hoehe,
  apflora.tpop.exposition AS tpop_exposition,
  apflora.tpop.klima AS tpop_klima,
  apflora.tpop.neigung AS tpop_neigung,
  apflora.tpop.beschreibung AS tpop_beschreibung,
  apflora.tpop.kataster_nr AS tpop_kataster_nr,
  apflora.tpop.apber_relevant AS tpop_apber_relevant,
  apflora.tpop.apber_relevant_grund AS tpop_apber_relevant_grund,
  apflora.tpop.eigentuemer AS tpop_eigentuemer,
  apflora.tpop.kontakt AS tpop_kontakt,
  apflora.tpop.nutzungszone AS tpop_nutzungszone,
  apflora.tpop.bewirtschafter AS tpop_bewirtschafter,
  apflora.tpop.bewirtschaftung AS tpop_bewirtschaftung,
  apflora.tpop.ekfrequenz AS tpop_ekfrequenz,
  apflora.tpop.ekfrequenz_abweichend AS tpop_ekfrequenz_abweichend,
  apflora.tpopkontr.id AS kontr_id,
  apflora.tpopkontr.jahr AS kontr_jahr,
  apflora.tpopkontr.datum AS kontr_datum,
  apflora.tpopkontr_typ_werte.text AS kontr_typ,
  apflora.adresse.name AS kontr_bearbeiter,
  apflora.tpopkontr.ueberlebensrate AS kontr_ueberlebensrate,
  apflora.tpopkontr.vitalitaet AS kontr_vitalitaet,
  apflora.tpop_entwicklung_werte.text AS kontr_entwicklung,
  apflora.tpopkontr.ursachen AS kontr_ursachen,
  apflora.tpopkontr.erfolgsbeurteilung AS kontr_erfolgsbeurteilung,
  apflora.tpopkontr.umsetzung_aendern AS kontr_umsetzung_aendern,
  apflora.tpopkontr.kontrolle_aendern AS kontr_kontrolle_aendern,
  apflora.tpopkontr.bemerkungen AS kontr_bemerkungen,
  apflora.tpopkontr.lr_delarze AS kontr_lr_delarze,
  apflora.tpopkontr.lr_umgebung_delarze AS kontr_lr_umgebung_delarze,
  apflora.tpopkontr.vegetationstyp AS kontr_vegetationstyp,
  apflora.tpopkontr.konkurrenz AS kontr_konkurrenz,
  apflora.tpopkontr.moosschicht AS kontr_moosschicht,
  apflora.tpopkontr.krautschicht AS kontr_krautschicht,
  apflora.tpopkontr.strauchschicht AS kontr_strauchschicht,
  apflora.tpopkontr.baumschicht AS kontr_baumschicht,
  apflora.tpopkontr_idbiotuebereinst_werte.text AS kontr_idealbiotop_uebereinstimmung,
  apflora.tpopkontr.handlungsbedarf AS kontr_handlungsbedarf,
  apflora.tpopkontr.flaeche_ueberprueft AS kontr_flaeche_ueberprueft,
  apflora.tpopkontr.flaeche AS kontr_flaeche,
  apflora.tpopkontr.plan_vorhanden AS kontr_plan_vorhanden,
  apflora.tpopkontr.deckung_vegetation AS kontr_deckung_vegetation,
  apflora.tpopkontr.deckung_nackter_boden AS kontr_deckung_nackter_boden,
  apflora.tpopkontr.deckung_ap_art AS kontr_deckung_ap_art,
  apflora.tpopkontr.jungpflanzen_vorhanden AS kontr_jungpflanzen_vorhanden,
  apflora.tpopkontr.vegetationshoehe_maximum AS kontr_vegetationshoehe_maximum,
  apflora.tpopkontr.vegetationshoehe_mittel AS kontr_vegetationshoehe_mittel,
  apflora.tpopkontr.gefaehrdung AS kontr_gefaehrdung,
  apflora.tpopkontr.changed AS kontr_changed,
  apflora.tpopkontr.changed_by AS kontr_changed_by,
  apflora.tpopkontr.apber_nicht_relevant as kontr_apber_nicht_relevant,
  apflora.tpopkontr.apber_nicht_relevant_grund as kontr_apber_nicht_relevant_grund,
  apflora.tpopkontr.ekf_bemerkungen as kontr_ekf_bemerkungen,
  apflora.tpopkontrzaehl.id,
  apflora.tpopkontrzaehl_einheit_werte.text AS einheit,
  apflora.tpopkontrzaehl_methode_werte.text AS methode,
  apflora.tpopkontrzaehl.anzahl
FROM
  apflora.ae_taxonomies
  INNER JOIN
    ((((apflora.ap
    LEFT JOIN
      apflora.adresse AS apflora_adresse_1
      ON apflora.ap.bearbeiter = apflora_adresse_1.id)
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop.status  = apflora.pop_status_werte.code)
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS tpop_status_werte
          ON tpop_status_werte.code = apflora.tpop.status)
        INNER JOIN
          (((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_idbiotuebereinst_werte
            ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code)
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte.text)
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
          LEFT JOIN
            ((apflora.tpopkontrzaehl
            LEFT JOIN
              apflora.tpopkontrzaehl_einheit_werte
              ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
            LEFT JOIN
              apflora.tpopkontrzaehl_methode_werte
              ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
            ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
          ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
        ON apflora.pop.id = apflora.tpop.pop_id)
      ON apflora.ap.id = apflora.pop.ap_id)
    ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum;

-- Daten migrieren
with kontr as (
  select
    tpop_id,
    wasserhaushalt,
    array_to_string(sort(array_agg(jahr)), ', ') || ': ' || wasserhaushalt::text as with_years
  from apflora.tpopkontr
  where wasserhaushalt is not null
  group by
    tpop_id,
    wasserhaushalt
  --order by
    --tpop_id
), data as
(
  select
    tpop_id,
    case
      when count(tpop_id) = 1 then string_agg(wasserhaushalt::text, '; ')
      else string_agg(with_years, '; ')
    end as wasserhaushalt,
    count(tpop_id) as anz_tpop
  from kontr
  group by tpop_id
  order by tpop_id
)
update apflora.tpop tpop
set wasserhaushalt = data.wasserhaushalt
from data
where data.tpop_id = tpop.id;

with kontr as (
  select
    tpop_id,
    boden_typ,
    array_to_string(sort(array_agg(jahr)), ', ') || ': ' || boden_typ::text as with_years
  from apflora.tpopkontr
  where boden_typ is not null
  group by
    tpop_id,
    boden_typ
  --order by
    --tpop_id
), data as
(
  select
    tpop_id,
    case
      when count(tpop_id) = 1 then string_agg(boden_typ::text, '; ')
      else string_agg(with_years, '; ')
    end as boden_typ,
    count(tpop_id) as anz_tpop
  from kontr
  group by tpop_id
  order by tpop_id
)
update apflora.tpop tpop
set boden_typ = data.boden_typ
from data
where data.tpop_id = tpop.id;

with kontr as (
  select
    tpop_id,
    boden_kalkgehalt,
    array_to_string(sort(array_agg(jahr)), ', ') || ': ' || boden_kalkgehalt::text as with_years
  from apflora.tpopkontr
  where boden_kalkgehalt is not null
  group by
    tpop_id,
    boden_kalkgehalt
  --order by
    --tpop_id
), data as
(
  select
    tpop_id,
    case
      when count(tpop_id) = 1 then string_agg(boden_kalkgehalt::text, '; ')
      else string_agg(with_years, '; ')
    end as boden_kalkgehalt,
    count(tpop_id) as anz_tpop
  from kontr
  group by tpop_id
  order by tpop_id
)
update apflora.tpop tpop
set boden_kalkgehalt = data.boden_kalkgehalt
from data
where data.tpop_id = tpop.id;

with kontr as (
  select
    tpop_id,
    boden_durchlaessigkeit,
    array_to_string(sort(array_agg(jahr)), ', ') || ': ' || boden_durchlaessigkeit::text as with_years
  from apflora.tpopkontr
  where boden_durchlaessigkeit is not null
  group by
    tpop_id,
    boden_durchlaessigkeit
  --order by
    --tpop_id
), data as
(
  select
    tpop_id,
    case
      when count(tpop_id) = 1 then string_agg(boden_durchlaessigkeit::text, '; ')
      else string_agg(with_years, '; ')
    end as boden_durchlaessigkeit,
    count(tpop_id) as anz_tpop
  from kontr
  group by tpop_id
  order by tpop_id
)
update apflora.tpop tpop
set boden_durchlaessigkeit = data.boden_durchlaessigkeit
from data
where data.tpop_id = tpop.id;

with kontr as (
  select
    tpop_id,
    boden_humus,
    array_to_string(sort(array_agg(jahr)), ', ') || ': ' || boden_humus::text as with_years
  from apflora.tpopkontr
  where boden_humus is not null
  group by
    tpop_id,
    boden_humus
  --order by
    --tpop_id
), data as
(
  select
    tpop_id,
    case
      when count(tpop_id) = 1 then string_agg(boden_humus::text, '; ')
      else string_agg(with_years, '; ')
    end as boden_humus,
    count(tpop_id) as anz_tpop
  from kontr
  group by tpop_id
  order by tpop_id
)
update apflora.tpop tpop
set boden_humus = data.boden_humus
from data
where data.tpop_id = tpop.id;

with kontr as (
  select
    tpop_id,
    boden_naehrstoffgehalt,
    array_to_string(sort(array_agg(jahr)), ', ') || ': ' || boden_naehrstoffgehalt::text as with_years
  from apflora.tpopkontr
  where boden_naehrstoffgehalt is not null
  group by
    tpop_id,
    boden_naehrstoffgehalt
  --order by
    --tpop_id
), data as
(
  select
    tpop_id,
    case
      when count(tpop_id) = 1 then string_agg(boden_naehrstoffgehalt::text, '; ')
      else string_agg(with_years, '; ')
    end as boden_naehrstoffgehalt,
    count(tpop_id) as anz_tpop
  from kontr
  group by tpop_id
  order by tpop_id
)
update apflora.tpop tpop
set boden_naehrstoffgehalt = data.boden_naehrstoffgehalt
from data
where data.tpop_id = tpop.id;

with kontr as (
  select
    tpop_id,
    boden_abtrag,
    array_to_string(sort(array_agg(jahr)), ', ') || ': ' || boden_abtrag::text as with_years
  from apflora.tpopkontr
  where boden_abtrag is not null
  group by
    tpop_id,
    boden_abtrag
  --order by
    --tpop_id
), data as
(
  select
    tpop_id,
    case
      when count(tpop_id) = 1 then string_agg(boden_abtrag::text, '; ')
      else string_agg(with_years, '; ')
    end as boden_abtrag,
    count(tpop_id) as anz_tpop
  from kontr
  group by tpop_id
  order by tpop_id
)
update apflora.tpop tpop
set boden_abtrag = data.boden_abtrag
from data
where data.tpop_id = tpop.id;



-- remove last remains of wasserhaushalt etc.

-- drop old fields
alter table apflora.tpopkontr drop boden_typ;
alter table apflora.tpopkontr drop boden_kalkgehalt;
alter table apflora.tpopkontr drop boden_durchlaessigkeit;
alter table apflora.tpopkontr drop boden_humus;
alter table apflora.tpopkontr drop boden_naehrstoffgehalt;
alter table apflora.tpopkontr drop boden_abtrag;
alter table apflora.tpopkontr drop wasserhaushalt;