CREATE OR REPLACE FUNCTION apflora.correct_vornach_beginnap_stati(apid integer)
 RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
 BEGIN

   -- diejenigen Werte setzen, welche in der Benutzeroberfläche angezeigt werden

   -- angesiedelt, erloschen/nicht etabliert
   UPDATE apflora.tpop
   SET apflora.tpop.status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap."ApArtId"
     WHERE
       apflora.tpop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" IS NULL
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET apflora.pop.status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap."ApArtId"
     WHERE
       apflora.pop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" IS NULL
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.tpop
   SET apflora.tpop.status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap."ApArtId"
     WHERE
       apflora.tpop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" <= apflora.tpop.bekannt_seit
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET apflora.pop.status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap."ApArtId"
     WHERE
       apflora.pop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" <= "PopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.tpop
   SET apflora.tpop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap."ApArtId"
     WHERE
       apflora.tpop.status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" > apflora.tpop.bekannt_seit
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET apflora.pop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap."ApArtId"
     WHERE
       apflora.pop.status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" > "PopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

   -- angesiedelt, aktuell
   UPDATE apflora.tpop
   SET apflora.tpop.status = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap."ApArtId"
     WHERE
       apflora.tpop.status = 210 -- angesiedelt vor Beginn AP, aktuell
       AND "ApJahr" IS NULL
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET apflora.pop.status = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap."ApArtId"
     WHERE
       apflora.pop.status = 210 -- angesiedelt vor Beginn AP, aktuell
       AND "ApJahr" IS NULL
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.tpop
   SET apflora.tpop.status = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap."ApArtId"
     WHERE
       apflora.tpop.status = 210 -- angesiedelt vor Beginn AP, aktuell
       AND "ApJahr" <= apflora.tpop.bekannt_seit
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET apflora.pop.status = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap."ApArtId"
     WHERE
       apflora.pop.status = 210 -- angesiedelt vor Beginn AP, aktuell
       AND "ApJahr" <= "PopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.tpop
   SET apflora.tpop.status = 210 -- angesiedelt vor Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap."ApArtId"
     WHERE
       apflora.tpop.status = 200  -- angesiedelt nach Beginn AP, aktuell
       AND "ApJahr" > apflora.tpop.bekannt_seit
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET apflora.pop.status = 210 -- angesiedelt vor Beginn AP, aktuell
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap."ApArtId"
     WHERE
       apflora.pop.status = 200  -- angesiedelt nach Beginn AP, aktuell
       AND "ApJahr" > "PopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

 END;
 $$;

ALTER FUNCTION apflora.correct_vornach_beginnap_stati(apid integer)
   OWNER TO postgres;
