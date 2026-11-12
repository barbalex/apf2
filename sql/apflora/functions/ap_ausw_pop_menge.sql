-- derived from pop_ausw_tpop_menge.sql
-- rules: https://github.com/barbalex/apf2/issues/794
CREATE OR REPLACE FUNCTION apflora.ap_ausw_pop_menge(apid uuid, jahr integer)
  RETURNS SETOF apflora.ausw_pop_menge
  AS $$
  BEGIN
    RETURN QUERY
    WITH
    -- the qualifying TPop histories of the ap:
    -- rules 1 and 2: only TPop histories decide, Pop histories and Pop stati have no influence
    -- rule 3: only TPops relevant for the AP-Bericht
    tpop_historien AS(
      SELECT
        ap.id AS ap_id,
        pop.id AS pop_id,
        th.id AS tpop_id,
        th.year,
        th.status
      FROM apflora.tpop_history th
      -- enforce tpop with same id exists (about 1000 tpop_history entries have no corresponding tpop)
      INNER JOIN apflora.tpop tpop ON tpop.id = th.id
      INNER JOIN apflora.pop pop ON pop.id = tpop.pop_id
      INNER JOIN apflora.ap ap ON ap.id = pop.ap_id
      WHERE
        th.status IN(100, 101, 200, 202)
        AND th.apber_relevant = TRUE
        AND th.year <= $2
        AND ap.id = $1
    ),
    zaehlungen_alle_kandidaten AS(
      SELECT
        kontr.tpop_id,
        kontr.jahr,
        kontr.datum,
        kontr.created_at,
        kontr.id AS kontr_id,
        zaehl.id AS zaehl_id,
        zaehl.created_at AS zaehl_created_at,
        zaehl.anzahl
      FROM apflora.tpopkontrzaehl zaehl
      INNER JOIN apflora.tpopkontr kontr ON kontr.id = zaehl.tpopkontr_id
      INNER JOIN tpop_historien th ON th.tpop_id = kontr.tpop_id
        AND th.year = kontr.jahr
      INNER JOIN apflora.ekzaehleinheit ekze ON ekze.ap_id = th.ap_id
        AND ekze.zielrelevant = TRUE
      INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id
        AND ze.code = zaehl.einheit
      WHERE
        zaehl.anzahl IS NOT NULL
        AND kontr.apber_nicht_relevant IS NOT TRUE
    ),
    -- with several qualifying counts per year the latest wins
    -- if the date does not decide, one is picked deterministically:
    -- dated before undated, then lowest kontr-created_at, lowest zaehl-created_at,
    -- lowest kontr-id, lowest zaehl-id
    zaehlungen_juengste_pro_jahr AS(
      SELECT
        t.tpop_id,
        t.jahr,
        t.datum,
        FALSE AS virtuell,
        t.anzahl
      FROM(
        SELECT
          z.*,
          row_number() OVER(
            PARTITION BY z.tpop_id, z.jahr
            ORDER BY
              z.datum DESC NULLS LAST,
              z.created_at,
              z.zaehl_created_at,
              z.kontr_id,
              z.zaehl_id
          ) AS rn
        FROM zaehlungen_alle_kandidaten z
      ) t
      WHERE t.rn = 1
    ),
    -- rule 17: extinct TPops are only displayed in the year of extinction
    -- and in years before a later re-settlement (to prevent holes in the charts)
    -- re-settlement includes rediscovery: any later qualifying year with status 100 or 200
    tpop_darstellung AS(
      SELECT
        s.tpop_id,
        s.year AS jahr,
        (
          s.status IN(101, 202)
          AND(s.prev_status IS NULL OR s.prev_status IN(100, 200))
        ) AS erloschen_start,
        (
          s.status NOT IN(101, 202)
          -- year of extinction: first year of an erloschen phase
          OR s.prev_status IS NULL
          OR s.prev_status IN(100, 200)
          -- a later re-settlement follows: bridge the years up to it
          OR EXISTS(
            SELECT 1
            FROM tpop_historien h
            WHERE
              h.tpop_id = s.tpop_id
              AND h.year > s.year
              AND h.status IN(100, 200)
          )
        ) AS darstellen
      FROM(
        SELECT
          h.tpop_id,
          h.year,
          h.status,
          lag(h.status) OVER(PARTITION BY h.tpop_id ORDER BY h.year) AS prev_status
        FROM tpop_historien h
      ) s
    ),
    -- extinct TPops are counted as 0, beginning with the first year of each erloschen phase
    -- this 0 replaces older counts until a newer count occurs
    erloschen_start_ohne_zaehlung AS(
      SELECT
        d.tpop_id,
        d.jahr
      FROM tpop_darstellung d
      WHERE
        d.erloschen_start
        AND NOT EXISTS(
          SELECT 1
          FROM zaehlungen_juengste_pro_jahr z
          WHERE
            z.tpop_id = d.tpop_id
            AND z.jahr = d.jahr
        )
    ),
    zaehlungen AS(
      SELECT j.tpop_id, j.jahr, j.datum, j.virtuell, j.anzahl
      FROM zaehlungen_juengste_pro_jahr j
      UNION ALL
      SELECT e.tpop_id, e.jahr, NULL::date, TRUE, 0::real
      FROM erloschen_start_ohne_zaehlung e
    ),
    massnahmen AS(
      SELECT
        m.tpop_id,
        m.jahr,
        m.datum,
        m.zieleinheit_anzahl AS anzahl
      FROM apflora.tpopmassn m
      INNER JOIN tpop_historien th ON th.tpop_id = m.tpop_id
        AND th.year = m.jahr
      INNER JOIN apflora.ekzaehleinheit ekze ON ekze.ap_id = th.ap_id
        AND ekze.zielrelevant = TRUE
      INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id
        AND ze.code = m.zieleinheit_einheit
      INNER JOIN apflora.tpopmassn_typ_werte mtw ON mtw.code = m.typ
        AND mtw.anpflanzung = TRUE
      WHERE
        m.zieleinheit_anzahl IS NOT NULL
    ),
    tpop_werte AS(
      SELECT
        th.pop_id,
        th.tpop_id,
        th.year AS jahr,
        COALESCE(zaehlungen.anzahl, 0) + COALESCE(massnahmen.sum, 0) AS anzahl
      FROM tpop_historien th
      -- rule 17: only displayed TPop values are passed on to the pop level
      INNER JOIN tpop_darstellung d ON
        d.tpop_id = th.tpop_id
        AND d.jahr = th.year
        AND d.darstellen
      LEFT JOIN LATERAL(
        SELECT
          z.tpop_id,
          z.anzahl,
          z.jahr,
          z.datum,
          z.virtuell
        FROM zaehlungen z
        WHERE
          z.tpop_id = th.tpop_id
          AND z.jahr <= th.year
        ORDER BY
          z.jahr DESC,
          z.datum DESC NULLS LAST
        LIMIT 1
      ) AS zaehlungen ON true
      LEFT JOIN LATERAL(
        SELECT sum(m.anzahl) AS sum
        FROM massnahmen m
        WHERE
          m.tpop_id = th.tpop_id
          AND m.jahr <= th.year
          AND(
            -- no count at all: add all previous plantings
            zaehlungen.tpop_id IS NULL
            -- later year than the count: planting is after the count, date not needed
            OR m.jahr > zaehlungen.jahr
            OR(
              m.jahr = zaehlungen.jahr
              AND(
                -- the virtual 0 of extinct TPops does not block plantings
                zaehlungen.virtuell
                OR(
                  -- if the winning count has no date, plantings of the same year are not added
                  zaehlungen.datum IS NOT NULL
                  AND m.datum IS NOT NULL
                  AND m.datum > zaehlungen.datum
                )
              )
            )
          )
      ) AS massnahmen ON true
    ),
    -- rule 16: the TPop values are grouped and summed on pop level
    pop_werte AS(
      SELECT
        w.pop_id,
        w.jahr,
        sum(w.anzahl) AS anzahl
      FROM tpop_werte w
      GROUP BY
        w.pop_id,
        w.jahr
    )
    SELECT
      pop_werte.jahr,
      json_object_agg(pop_werte.pop_id, pop_werte.anzahl) AS values
    FROM pop_werte
    GROUP BY pop_werte.jahr
    ORDER BY pop_werte.jahr;
  END;
  $$
  LANGUAGE plpgsql
  STABLE;

ALTER FUNCTION apflora.ap_ausw_pop_menge(apid uuid, jahr integer) OWNER TO postgres;
