-- Function to execute some sql text and return a scalar (eg number);
-- from https://gist.github.com/dncpax/aa9445b79c8f8ea06150

CREATE OR REPLACE FUNCTION dsql2(i_text text)
  RETURNS integer AS
$BODY$
Declare
  v_val int;
BEGIN
  execute i_text into v_val;
  return v_val;
END; 
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION dsql2(text)
  OWNER TO postgres;
COMMENT ON FUNCTION dsql2(text) IS 'get number of rows per table';