select
	tax.artname,
	ap.bearbeitung,
	pop.*
from apflora.pop pop
	inner join apflora.ap ap
		inner join apflora.ae_taxonomies tax
		on tax.id = ap.art_id
	on pop.ap_id = ap.id
where bekannt_seit is null
order by
 tax.artname,
 pop.nr;
 -- result: no ap pops


select
	tax.artname,
	ap.bearbeitung,
	pop.nr,
  tpop.*
from apflora.tpop tpop
  inner join apflora.pop pop
    inner join apflora.ap ap
      inner join apflora.ae_taxonomies tax
      on tax.id = ap.art_id
    on pop.ap_id = ap.id
  on tpop.pop_id = pop.id
where tpop.bekannt_seit is null
order by
 tax.artname,
 pop.nr,
 tpop.nr;
-- result: no ap tpops


select beurteilung, count(id)
from apflora.tpopmassnber
group by beurteilung;

-- result:
-- 	  13
-- 1	760
-- 3	2499
-- 5	1215
-- 2	1971
-- 4	1534

select beurteilung, count(id)
from apflora.popmassnber
group by beurteilung;

-- result:
-- 	  7
-- 1	368
-- 3	1348
-- 5	791
-- 2	1050
-- 4	545

select
	tax.artname,
	pop.nr as pop_nr,
	massn.jahr
from
	apflora.ae_taxonomies tax
	inner join apflora.ap ap
		inner join apflora.pop pop
			inner join apflora.popmassnber massn
			on pop.id = massn.pop_id
		on ap.id = pop.ap_id
	on tax.id = ap.art_id
where
	massn.beurteilung is null
	and ap.bearbeitung between 1 and 3
order by
	tax.artname,
	pop.nr,
	massn.jahr;

-- result:
"artname"	"pop_nr"	"jahr"
"Pulsatilla vulgaris Mill. (Gewöhnliche Küchenschelle)"	2	2013

select
	tax.artname,
	pop.nr as pop_nr,
	massn.jahr
from
	apflora.ae_taxonomies tax
	inner join apflora.ap ap
		inner join apflora.pop pop
			inner join apflora.tpop tpop
				inner join apflora.tpopmassnber massn
				on tpop.id = massn.tpop_id
			on pop.id = tpop.pop_id
		on ap.id = pop.ap_id
	on tax.id = ap.art_id
where
	massn.beurteilung is null
	and ap.bearbeitung between 1 and 3
order by
	tax.artname,
	pop.nr,
	massn.jahr;

-- result:
"artname"	"pop_nr"	"jahr"
"Gagea villosa (M. Bieb.) Sweet (Acker-Gelbstern)"	4	2017
"Pleurospermum austriacum (L.) Hoffm. (Rippensame)"	1	2015
"Thalictrum simplex L. subsp. galioides (Pers.) Korsh."	41	2011
"Thalictrum simplex L. subsp. galioides (Pers.) Korsh."	41	2013

