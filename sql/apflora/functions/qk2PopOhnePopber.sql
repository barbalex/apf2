CREATE OR REPLACE FUNCTION apflora.qk2_pop_ohne_popber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, "ApArtId" integer, hw text, url text[], text text[]) AS
  $$
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop."ApArtId",
    'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Populations-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
  WHERE
    apflora.pop."PopId" IN (
      SELECT
        apflora.tpop."PopId"
      FROM
        apflora.tpop
      WHERE
        apflora.tpop."TPopApBerichtRelevant" = 1
      GROUP BY
        apflora.tpop."PopId"
    )
    AND apflora.pop."PopId" IN (
      -- 3. "Pop mit TPop mit verlangten TPopBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpop."PopId"
      FROM
        apflora.tpop
      WHERE
        apflora.tpop."TPopId" IN (
          -- 1. "TPop mit Ansiedlungen/Ansaaten vor dem Berichtjahr" ermitteln:
          SELECT DISTINCT
          apflora.tpopmassn.tpop_id
          FROM
            apflora.tpopmassn
          WHERE
            apflora.tpopmassn.typ in (1, 2, 3)
            AND apflora.tpopmassn.jahr < $2
        )
        AND apflora.tpop."TPopId" IN (
          -- 2. "TPop mit Kontrolle im Berichtjahr" ermitteln:
          SELECT DISTINCT
            apflora.tpopkontr."TPopId"
          FROM
            apflora.tpopkontr
          WHERE
            apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
            AND apflora.tpopkontr."TPopKontrJahr" = $2
        )
    )
    AND apflora.pop."PopId" NOT IN (
      -- 4. "Pop mit PopBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.popber."PopId"
      FROM
        apflora.popber
      WHERE
        apflora.popber."PopBerJahr" = $2
    )
    AND apflora.pop."ApArtId" = $1
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.qk2_pop_ohne_popber(apid integer, berichtjahr integer)
  OWNER TO postgres;
