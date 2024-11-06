DROP POLICY IF EXISTS reader ON apflora.idealbiotop_file;

CREATE POLICY reader ON apflora.idealbiotop_file
  USING (CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
    OR (CURRENT_USER IN ('apflora_ap_reader') AND idealbiotop_id IN (
      SELECT
        id
      FROM
        apflora.idealbiotop
      WHERE
        ap_id IN (
          SELECT
            ap_id
          FROM
            apflora.ap_user
          WHERE
            user_name = current_user_name()))))
          WITH CHECK (CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
          OR (CURRENT_USER IN ('apflora_ap_writer') AND idealbiotop_id IN (
            SELECT
              id
            FROM
              apflora.idealbiotop
            WHERE
              ap_id IN (
                SELECT
                  ap_id
                FROM
                  apflora.ap_user
                WHERE
                  user_name = current_user_name()))));