DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberzunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberzunehmend AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Populations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND lastpopber."PopBerEntwicklung" = 8
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId"
    WHERE
      apflora.tpopmassn."TPopMassnTyp" BETWEEN 1 AND 3
      AND apflora.tpopmassn."TPopMassnJahr" > lastpopber."PopBerJahr"
  );