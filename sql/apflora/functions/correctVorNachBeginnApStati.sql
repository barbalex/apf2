CREATE OR REPLACE FUNCTION apflora.correct_vornach_beginnap_stati(apid uuid)
 RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
 BEGIN

   -- diejenigen Werte setzen, welche in der Benutzeroberfläche angezeigt werden

   -- angesiedelt, erloschen/nicht etabliert
   UPDATE apflora.tpop
   SET status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.tpop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND apflora.ap.start_jahr IS NULL
       AND apflora.ap.id = $1
   );

   UPDATE apflora.pop
   SET status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.pop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND apflora.ap.start_jahr IS NULL
       AND apflora.ap.id = $1
   );

   UPDATE apflora.tpop
   SET status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.tpop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND apflora.ap.start_jahr <= apflora.tpop.bekannt_seit
       AND apflora.ap.id = $1
   );

   UPDATE apflora.pop
   SET status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.pop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND apflora.ap.start_jahr <= apflora.pop.bekannt_seit
       AND apflora.ap.id = $1
   );

   UPDATE apflora.tpop
   SET status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.tpop.status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
       AND apflora.ap.start_jahr > apflora.tpop.bekannt_seit
       AND apflora.ap.id = $1
   );

   UPDATE apflora.pop
   SET status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.pop.status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
       AND apflora.ap.start_jahr > apflora.pop.bekannt_seit
       AND apflora.ap.id = $1
   );

   -- angesiedelt, aktuell
   UPDATE apflora.tpop
   SET status = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.tpop.status = 210 -- angesiedelt vor Beginn AP, aktuell
       AND apflora.ap.start_jahr IS NULL
       AND apflora.ap.id = $1
   );

   UPDATE apflora.pop
   SET status = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.pop.status = 210 -- angesiedelt vor Beginn AP, aktuell
       AND apflora.ap.start_jahr IS NULL
       AND apflora.ap.id = $1
   );

   UPDATE apflora.tpop
   SET status = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.tpop.status = 210 -- angesiedelt vor Beginn AP, aktuell
       AND apflora.ap.start_jahr <= apflora.tpop.bekannt_seit
       AND apflora.ap.id = $1
   );

   UPDATE apflora.pop
   SET status = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.pop.status = 210 -- angesiedelt vor Beginn AP, aktuell
       AND apflora.ap.start_jahr <= apflora.pop.bekannt_seit
       AND apflora.ap.id = $1
   );

   UPDATE apflora.tpop
   SET status = 210 -- angesiedelt vor Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.tpop.status = 200  -- angesiedelt nach Beginn AP, aktuell
       AND apflora.ap.start_jahr > apflora.tpop.bekannt_seit
       AND apflora.ap.id = $1
   );

   UPDATE apflora.pop
   SET status = 210 -- angesiedelt vor Beginn AP, aktuell
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.pop.status = 200  -- angesiedelt nach Beginn AP, aktuell
       AND apflora.ap.start_jahr > apflora.pop.bekannt_seit
       AND apflora.ap.id = $1
   );

 END;
 $$;

ALTER FUNCTION apflora.correct_vornach_beginnap_stati(apid uuid)
   OWNER TO postgres;
