CREATE OR REPLACE FUNCTION apflora.historize(year int)
 RETURNS boolean AS $$
 BEGIN

  -- three inserts from queries for ap, pop and tpop
   UPDATE apflora.pop
   SET status = 210
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.pop.status = 200
       AND apflora.ap.start_jahr > apflora.pop.bekannt_seit
       AND apflora.ap.id = $1
   );

   RETURN FOUND;

 END;
 $$ LANGUAGE plpgsql;

ALTER FUNCTION apflora.historize(apid uuid)
   OWNER TO postgres;
