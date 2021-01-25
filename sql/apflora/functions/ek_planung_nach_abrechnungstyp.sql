create type apflora.ek_planung_nach_abrechnungstyp as (
  artname text,
  artverantwortlich text,
  jahr smallint,
  "'A (EK-Budget)'" bigint,
  "'B (Umsetzungsbudget Überwachung ursprüngliche Pop)'" bigint,
  "'D (Umsetzungsbudget Ansiedlungsbegleitung)'" bigint,
  "'EKF-Budget'" bigint
);

-- Copyright © 2015, Hannes Landeholm <hannes@jumpstarter.io>
-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at http://mozilla.org/MPL/2.0/.

-- See the README.md file distributed with this project for documentation.
create or replace function ek_planung_nach_abrechnungstyp() returns setof apflora.ek_planung_nach_abrechnungstyp as $$
    begin
        execute ('select colpivot(''_ek_planung_nach_abrechnungstyp'', ''select * from apflora.v_ek_planung_nach_abrechnungstyp'',
    array[''artname'', ''artverantwortlich'', ''jahr''], array[''ek_abrechnungstyp''], ''#.anzahl'', null);');
        return query select * from _ek_planung_nach_abrechnungstyp order by artname, jahr;
    end;
$$ language plpgsql volatile;