CREATE OR REPLACE FUNCTION apflora.correct_vornach_beginnap_stati(apid integer)
 RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
 BEGIN

   -- diejenigen Werte setzen, welche in der Benutzeroberfläche angezeigt werden

   -- angesiedelt, erloschen/nicht etabliert
   UPDATE apflora.tpop
   SET "TPopHerkunft" = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop."PopId"
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "TPopHerkunft" = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" IS NULL
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET "PopHerkunft" = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE "PopId" IN (
     SELECT
       pop."PopId"
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "PopHerkunft" = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" IS NULL
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.tpop
   SET "TPopHerkunft" = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop."PopId"
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "TPopHerkunft" = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" <= "TPopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET "PopHerkunft" = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE "PopId" IN (
     SELECT
       pop."PopId"
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "PopHerkunft" = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" <= "PopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.tpop
   SET "TPopHerkunft" = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop."PopId"
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "TPopHerkunft" = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" > "TPopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET "PopHerkunft" = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
   WHERE "PopId" IN (
     SELECT
       pop."PopId"
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "PopHerkunft" = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" > "PopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

   -- angesiedelt, aktuell
   UPDATE apflora.tpop
   SET "TPopHerkunft" = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop."PopId"
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "TPopHerkunft" = 210 -- angesiedelt vor Beginn AP, aktuell
       AND "ApJahr" IS NULL
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET "PopHerkunft" = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE "PopId" IN (
     SELECT
       pop."PopId"
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "PopHerkunft" = 210 -- angesiedelt vor Beginn AP, aktuell
       AND "ApJahr" IS NULL
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.tpop
   SET "TPopHerkunft" = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop."PopId"
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "TPopHerkunft" = 210 -- angesiedelt vor Beginn AP, aktuell
       AND "ApJahr" <= "TPopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET "PopHerkunft" = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE "PopId" IN (
     SELECT
       pop."PopId"
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "PopHerkunft" = 210 -- angesiedelt vor Beginn AP, aktuell
       AND "ApJahr" <= "PopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.tpop
   SET "TPopHerkunft" = 210 -- angesiedelt vor Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop."PopId"
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "TPopHerkunft" = 200  -- angesiedelt nach Beginn AP, aktuell
       AND "ApJahr" > "TPopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET "PopHerkunft" = 210 -- angesiedelt vor Beginn AP, aktuell
   WHERE "PopId" IN (
     SELECT
       pop."PopId"
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "PopHerkunft" = 200  -- angesiedelt nach Beginn AP, aktuell
       AND "ApJahr" > "PopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

 END;
 $$;

ALTER FUNCTION apflora.correct_vornach_beginnap_stati(apid integer)
   OWNER TO postgres;
