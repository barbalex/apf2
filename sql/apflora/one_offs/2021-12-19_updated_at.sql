SELECT
  changed,
  updated_at
FROM
  apflora.ap
ORDER BY
  updated_at DESC;

-- most: '2021-11-18 19:08:01.245206+00'
SELECT
  changed,
  updated_at
FROM
  apflora.ap
WHERE
  updated_at = '2021-11-18 19:08:01.245206+00'
ORDER BY
  updated_at DESC;

UPDATE
  apflora.ap
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:08:01.245206+00';

-- now updated_at is '2021-12-19 11:22:30.845034+00'
UPDATE
  apflora.ap
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-12-19 11:22:30.845034+00';

-- bingo
-- TODO:
-- 1. do this for all tables with updated_at
-- 2. drop changed field
SELECT
  changed,
  updated_at
FROM
  apflora.adresse
WHERE
  updated_at = '2021-11-18 19:07:50.619316+00'
ORDER BY
  updated_at DESC;

-- 2021-11-18 19:07:50.619316+00
UPDATE
  apflora.adresse
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-12-19 12:29:43.650213+00';

-- now: 2021-12-19 12:29:43.650213+00!!!
SELECT
  changed,
  updated_at
FROM
  apflora.ap_history
WHERE
  updated_at = '2021-12-16 16:48:38.585452+00'
ORDER BY
  updated_at DESC;

UPDATE
  apflora.ap_history
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:08:53.335921+00';

SELECT
  changed,
  updated_at
FROM
  apflora.ap_bearbstand_werte
WHERE
  updated_at = '2021-11-18 19:08:53.335921+00'
ORDER BY
  updated_at DESC;

UPDATE
  apflora.ap_bearbstand_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:08:53.335921+00';

SELECT
  changed,
  updated_at
FROM
  apflora.ap_erfbeurtkrit_werte
ORDER BY
  updated_at DESC;

UPDATE
  apflora.ap_erfbeurtkrit_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:08:53.335921+00';

SELECT
  changed,
  updated_at
FROM
  apflora.ap_erfkrit_werte
ORDER BY
  updated_at DESC;

UPDATE
  apflora.ap_erfkrit_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:09:23.231213+00';

SELECT
  changed,
  updated_at
FROM
  apflora.ap_umsetzung_werte
ORDER BY
  updated_at DESC;

UPDATE
  apflora.ap_umsetzung_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:09:23.231213+00';

SELECT
  changed,
  updated_at
FROM
  apflora.apber
ORDER BY
  updated_at DESC;

UPDATE
  apflora.apber
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:09:23.231213+00';

SELECT
  changed,
  updated_at
FROM
  apflora.apberuebersicht
ORDER BY
  updated_at DESC;

UPDATE
  apflora.apberuebersicht
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:09:23.231213+00';

SELECT
  changed,
  updated_at
FROM
  apflora.assozart
ORDER BY
  updated_at DESC;

UPDATE
  apflora.assozart
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:09:44.582939+00';

SELECT
  changed,
  updated_at
FROM
  apflora.projekt
ORDER BY
  updated_at DESC;

UPDATE
  apflora.projekt
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:09:44.582939+00';

SELECT
  changed,
  updated_at
FROM
  apflora.erfkrit
ORDER BY
  updated_at DESC;

UPDATE
  apflora.erfkrit
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:10:23.79706+00';

SELECT
  changed,
  updated_at
FROM
  apflora.idealbiotop
ORDER BY
  updated_at DESC;

UPDATE
  apflora.idealbiotop
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:10:23.79706+00';

SELECT
  changed,
  updated_at
FROM
  apflora.pop
ORDER BY
  updated_at DESC;

UPDATE
  apflora.pop
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:10:23.79706+00';

SELECT
  changed,
  updated_at
FROM
  apflora.pop_status_werte
ORDER BY
  updated_at DESC;

UPDATE
  apflora.pop_status_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:11:09.878548+00';

SELECT
  changed,
  updated_at
FROM
  apflora.pop_history
ORDER BY
  updated_at DESC;

UPDATE
  apflora.pop_history
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-12-16 16:48:38.585452+00';

SELECT
  changed,
  updated_at
FROM
  apflora.popber
ORDER BY
  updated_at DESC;

UPDATE
  apflora.popber
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:11:09.878548+00';

SELECT
  changed,
  updated_at
FROM
  apflora.popmassnber
ORDER BY
  updated_at DESC;

UPDATE
  apflora.popmassnber
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:11:09.878548+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpop
ORDER BY
  updated_at DESC;

UPDATE
  apflora.tpop
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:11:09.878548+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpop_history
ORDER BY
  updated_at ASC;

UPDATE
  apflora.tpop_history
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:11:09.878548+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpop_apberrelevant_grund_werte
ORDER BY
  updated_at ASC;

UPDATE
  apflora.tpop_apberrelevant_grund_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:11:53.207033+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpop_entwicklung_werte
ORDER BY
  updated_at ASC;

UPDATE
  apflora.tpop_entwicklung_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:11:53.207033+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpopber
ORDER BY
  updated_at ASC;

UPDATE
  apflora.tpopber
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:11:53.207033+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpopkontr
ORDER BY
  updated_at ASC;

UPDATE
  apflora.tpopkontr
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:11:53.207033+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpopkontr_idbiotuebereinst_werte
ORDER BY
  updated_at ASC;

UPDATE
  apflora.tpopkontr_idbiotuebereinst_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:11:53.207033+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpopkontr_typ_werte
ORDER BY
  updated_at ASC;

UPDATE
  apflora.tpopkontr_typ_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:12:35.073221+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpopkontrzaehl
ORDER BY
  updated_at ASC;

UPDATE
  apflora.tpopkontrzaehl
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:12:35.073221+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpopkontrzaehl_einheit_werte
ORDER BY
  updated_at ASC;

UPDATE
  apflora.tpopkontrzaehl_einheit_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:12:35.073221+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpopkontrzaehl_methode_werte
ORDER BY
  updated_at ASC;

UPDATE
  apflora.tpopkontrzaehl_methode_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:12:35.073221+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpopmassn
ORDER BY
  updated_at ASC;

UPDATE
  apflora.tpopmassn
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:12:35.073221+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpopmassn_erfbeurt_werte
ORDER BY
  updated_at ASC;

UPDATE
  apflora.tpopmassn_erfbeurt_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:13:21.88887+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpopmassn_typ_werte
ORDER BY
  updated_at ASC;

UPDATE
  apflora.tpopmassn_typ_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:13:21.88887+00';

SELECT
  changed,
  updated_at
FROM
  apflora.tpopmassnber
ORDER BY
  updated_at ASC;

UPDATE
  apflora.tpopmassnber
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:13:21.88887+00';

SELECT
  changed,
  updated_at
FROM
  apflora.ziel
ORDER BY
  updated_at ASC;

UPDATE
  apflora.ziel
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:13:21.88887+00';

SELECT
  changed,
  updated_at
FROM
  apflora.ziel_typ_werte
ORDER BY
  updated_at ASC;

UPDATE
  apflora.ziel_typ_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:13:21.88887+00';

SELECT
  changed,
  updated_at
FROM
  apflora.zielber
ORDER BY
  updated_at ASC;

UPDATE
  apflora.zielber
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:13:21.88887+00';

SELECT
  changed,
  updated_at
FROM
  apflora.beob
ORDER BY
  updated_at ASC;

UPDATE
  apflora.beob
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:13:21.88887+00';

SELECT
  changed,
  updated_at
FROM
  apflora.apart
ORDER BY
  updated_at ASC;

SET session_replication_role = REPLICA;

UPDATE
  apflora.apart
SET
  updated_at = NULL
WHERE
  updated_at = '2021-11-18 19:14:08.099009+00';

SET session_replication_role = DEFAULT;

SELECT
  changed,
  updated_at
FROM
  apflora.ekzaehleinheit
ORDER BY
  updated_at ASC;

UPDATE
  apflora.ekzaehleinheit
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:14:08.099009+00';

SELECT
  changed,
  updated_at
FROM
  apflora.ekfrequenz
ORDER BY
  updated_at ASC;

UPDATE
  apflora.ekfrequenz
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:14:08.099009+00';

SELECT
  changed,
  updated_at
FROM
  apflora.ek_abrechnungstyp_werte
ORDER BY
  updated_at ASC;

UPDATE
  apflora.ek_abrechnungstyp_werte
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:14:08.099009+00';

SELECT
  changed,
  updated_at
FROM
  apflora.ekplan
ORDER BY
  updated_at ASC;

UPDATE
  apflora.ekplan
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:14:08.099009+00';

