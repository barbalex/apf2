-- graphql name: popAuswTpopMenge
-- rules: https://github.com/barbalex/apf2/issues/794
CREATE OR REPLACE FUNCTION apflora.pop_ausw_tpop_menge(popid uuid)
  RETURNS SETOF apflora.ausw_pop_menge
  AS $$
  BEGIN
    RETURN QUERY
    WITH
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
      INNER JOIN apflora.tpop_history th ON th.id = kontr.tpop_id AND th.year = kontr.jahr
      -- enforce tpop with same id exists (about 1000 tpop_history entries have no corresponding tpop)
      INNER JOIN apflora.tpop tpop ON tpop.id = th.id
      INNER JOIN apflora.pop pop ON pop.id = tpop.pop_id
      INNER JOIN apflora.ap ap ON ap.id = pop.ap_id
      INNER JOIN apflora.ekzaehleinheit ekze ON ekze.ap_id = ap.id
        AND ekze.zielrelevant = TRUE
      INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id
        AND ze.code = zaehl.einheit
      WHERE
        zaehl.anzahl IS NOT NULL
        AND kontr.jahr <= EXTRACT(YEAR FROM CURRENT_DATE)
        -- we want false or null, but not true
        -- https://stackoverflow.com/a/46474204/712005
        AND kontr.apber_nicht_relevant IS NOT TRUE
        AND th.status IN(100, 101, 200, 202)
        AND th.apber_relevant = TRUE
        AND tpop.pop_id = $1
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
    -- extinct TPops are counted as 0, beginning with the first year of each erloschen phase
    -- this 0 replaces older counts until a newer count occurs
    erloschen_start_ohne_zaehlung AS(
      SELECT
        s.id AS tpop_id,
        s.year AS jahr
      FROM(
        SELECT
          th.id,
          th.year,
          th.status,
          lag(th.status) OVER(PARTITION BY th.id ORDER BY th.year) AS prev_status
        FROM apflora.tpop_history th
        INNER JOIN apflora.tpop tpop ON tpop.id = th.id
        INNER JOIN apflora.pop pop ON pop.id = tpop.pop_id
        WHERE
          th.status IN(100, 101, 200, 202)
          AND th.apber_relevant = TRUE
          AND th.year <= EXTRACT(YEAR FROM CURRENT_DATE)
          AND tpop.pop_id = $1
      ) s
      WHERE
        s.status IN(101, 202)
        AND (s.prev_status IS NULL OR s.prev_status IN(100, 200))
        AND NOT EXISTS(
          SELECT 1
          FROM zaehlungen_juengste_pro_jahr z
          WHERE
            z.tpop_id = s.id
            AND z.jahr = s.year
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
      INNER JOIN apflora.tpop_history th ON th.id = m.tpop_id AND th.year = m.jahr
      -- enforce tpop with same id exists (about 1000 tpop_history entries have no corresponding tpop)
      INNER JOIN apflora.tpop tpop ON tpop.id = th.id
      INNER JOIN apflora.pop pop ON pop.id = tpop.pop_id
      INNER JOIN apflora.ap ap ON ap.id = pop.ap_id
      INNER JOIN apflora.ekzaehleinheit ekze ON ekze.ap_id = ap.id
        AND ekze.zielrelevant = TRUE
      INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id
        AND ze.code = m.zieleinheit_einheit
      INNER JOIN apflora.tpopmassn_typ_werte mtw ON mtw.code = m.typ
        AND mtw.anpflanzung = TRUE
      WHERE
        m.zieleinheit_anzahl IS NOT NULL
        AND m.jahr <= EXTRACT(YEAR FROM CURRENT_DATE)
        AND th.status IN(100, 101, 200, 202)
        AND th.apber_relevant = TRUE
        AND tpop.pop_id = $1
    ),
    tpop_werte AS(
      SELECT
        th.id AS tpop_id,
        th.year AS jahr,
        COALESCE(zaehlungen.anzahl, 0) + COALESCE(massnahmen.sum, 0) AS anzahl
      FROM apflora.tpop_history th
      -- enforce tpop with same id exists (about 1000 tpop_history entries have no corresponding tpop)
      INNER JOIN apflora.tpop tpop ON tpop.id = th.id
      INNER JOIN apflora.pop pop ON pop.id = tpop.pop_id
      -- only pops with qualifying status in the year in question
      INNER JOIN apflora.pop_history ph ON ph.id = pop.id
        AND ph.year = th.year
        AND ph.status IN(100, 101, 200, 202)
      LEFT JOIN LATERAL(
        SELECT
          z.tpop_id,
          z.anzahl,
          z.jahr,
          z.datum,
          z.virtuell
        FROM zaehlungen z
        WHERE
          z.tpop_id = th.id
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
          m.tpop_id = th.id
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
      WHERE
        tpop.pop_id = $1
        AND th.apber_relevant = TRUE
        AND th.status IN(100, 101, 200, 202)
        AND th.year <= EXTRACT(YEAR FROM CURRENT_DATE)
    )
    SELECT
      jahr,
      json_object_agg(tpop_id, anzahl) AS values
    FROM tpop_werte
    GROUP BY
      jahr
    ORDER BY
      jahr;
  END;
  $$
  LANGUAGE plpgsql
  STABLE;

ALTER FUNCTION apflora.pop_ausw_tpop_menge(popid uuid) OWNER TO postgres;
