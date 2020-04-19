-- these views depend on others
-- so they need to be create after the others
-- keep the used views separate because they are complicated

-- used in exports
DROP VIEW IF EXISTS apflora.v_pop_last_count CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_last_count AS
select
  artname,
  ap_id, 
  pop_id, 
  pop_nr,
  pop_name,
  pop_status,
  array_to_string (array(SELECT unnest(array_agg(jahr)) AS x group by x ORDER BY x), ', ') as jahre,
  sum("Pflanzen") as "Pflanzen", 
  sum("Pflanzen (ohne Jungpflanzen)") as "Pflanzen (ohne Jungpflanzen)", 
  sum("Triebe") as "Triebe", 
  sum("Triebe Beweidung") as "Triebe Beweidung", 
  sum("Keimlinge") as "Keimlinge", 
  sum("Rosetten") as "Rosetten", 
  sum("Jungpflanzen") as "Jungpflanzen", 
  sum("Blätter") as "Blätter", 
  sum("blühende Pflanzen") as "blühende Pflanzen", 
  sum("blühende Triebe") as "blühende Triebe", 
  sum("Blüten") as "Blüten", 
  sum("Fertile Pflanzen") as "Fertile Pflanzen", 
  sum("fruchtende Triebe") as "fruchtende Triebe", 
  sum("Blütenstände") as "Blütenstände", 
  sum("Fruchtstände") as "Fruchtstände", 
  sum("Gruppen") as "Gruppen", 
  sum("Deckung (%)") as "Deckung (%)", 
  sum("Pflanzen/5m2") as "Pflanzen/5m2", 
  sum("Triebe in 30 m2") as "Triebe in 30 m2", 
  sum("Triebe/50m2") as "Triebe/50m2", 
  sum("Triebe Mähfläche") as "Triebe Mähfläche", 
  sum("Fläche (m2)") as "Fläche (m2)", 
  sum("Pflanzstellen") as "Pflanzstellen", 
  sum("Stellen") as "Stellen", 
  sum("andere Zaehleinheit") as "andere Zaehleinheit", 
  count("Art ist vorhanden") as "Art ist vorhanden"
from apflora.v_tpop_last_count
group by
  artname,
  ap_id,
  pop_id,
  pop_nr,
  pop_name,
  pop_status
order by
  artname,
  pop_nr;
comment on view apflora.v_pop_last_count is '@foreignKey (pop_id) references pop (id)';

-- used in exports
DROP VIEW IF EXISTS apflora.v_pop_last_count_with_massn CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_last_count_with_massn AS
select
  artname,
  ap_id, 
  pop_id, 
  pop_nr, 
  pop_name,
  pop_status,
  array_to_string (array(SELECT unnest(array_agg(jahr)) AS x group by x ORDER BY x), ', ') as jahre,
  sum("Pflanzen") as "Pflanzen", 
  sum("Pflanzen (ohne Jungpflanzen)") as "Pflanzen (ohne Jungpflanzen)", 
  sum("Triebe") as "Triebe", 
  sum("Triebe Beweidung") as "Triebe Beweidung", 
  sum("Keimlinge") as "Keimlinge", 
  sum("Rosetten") as "Rosetten", 
  sum("Jungpflanzen") as "Jungpflanzen", 
  sum("Blätter") as "Blätter", 
  sum("blühende Pflanzen") as "blühende Pflanzen", 
  sum("blühende Triebe") as "blühende Triebe", 
  sum("Blüten") as "Blüten", 
  sum("Fertile Pflanzen") as "Fertile Pflanzen", 
  sum("fruchtende Triebe") as "fruchtende Triebe", 
  sum("Blütenstände") as "Blütenstände", 
  sum("Fruchtstände") as "Fruchtstände", 
  sum("Gruppen") as "Gruppen", 
  sum("Deckung (%)") as "Deckung (%)", 
  sum("Pflanzen/5m2") as "Pflanzen/5m2", 
  sum("Triebe in 30 m2") as "Triebe in 30 m2", 
  sum("Triebe/50m2") as "Triebe/50m2", 
  sum("Triebe Mähfläche") as "Triebe Mähfläche", 
  sum("Fläche (m2)") as "Fläche (m2)", 
  sum("Pflanzstellen") as "Pflanzstellen", 
  sum("Stellen") as "Stellen", 
  sum("andere Zaehleinheit") as "andere Zaehleinheit", 
  count("Art ist vorhanden") as "Art ist vorhanden"
from apflora.v_tpop_last_count_with_massn
group by
  artname,
  ap_id,
  pop_id,
  pop_nr,
  pop_name,
  pop_status
order by
  artname,
  pop_nr;
comment on view apflora.v_pop_last_count_with_massn is '@foreignKey (pop_id) references pop (id)';