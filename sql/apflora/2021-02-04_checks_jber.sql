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