CREATE OR REPLACE FUNCTION beob_extract_datum(quelle text, data jsonb)
  RETURNS date
  AS $$
BEGIN
  CASE quelle
  WHEN IN('EvAB 2016', 'Info Flora 2017') THEN
    RETURN(data ->> 'A_NOTE' || '-' || CASE WHEN data ->> 'M_NOTE' = '0' THEN
        '1'
      ELSE
        data ->> 'M_NOTE' || '-' || CASE WHEN data ->> 'J_NOTE' = '0' THEN
          '1'
        ELSE
          data ->> 'J_NOTE')::date
        WHEN 'FloZ 2017' THEN
          RETURN(data ->> 'YEAR_COLLE' || '-' || CASE WHEN data ->> 'MONTH_COLL' = '0' THEN
              '1'
            ELSE
              data ->> 'MONTH_COLL' || '-' || CASE WHEN data ->> 'DAY_COLLEC' = '0' THEN
                '1'
              ELSE
                data ->> 'DAY_COLLEC')::date
              WHEN IN('Info Flora 2021.05', 'Info Flora 2022.03', 'Info Flora 2022.12 gesamt', 'Info Flora 2022.01', 'Info Flora 2023.02 Utricularia', 'Info Flora 2022.08', 'Info Flora 2022.04', 'Info Flora 2022.12 Auszug') THEN
                RETURN(data ->> 'obs_year' || '-' || CASE WHEN data ->> 'obs_month' = '0' THEN
                    '1'
                  ELSE
                    data ->> 'obs_month' || '-' || CASE WHEN data ->> 'obs_day' = '0' THEN
                      '1'
                    ELSE
                      data ->> 'obs_day')::date
                    END CASE;
                  END;
$$
LANGUAGE plpgsql;
