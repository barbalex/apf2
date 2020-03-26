select artname, nr, count(*)
from
	apflora.pop pop
	inner join apflora.ap ap
		inner join apflora.ae_taxonomies tax
		on tax.id = ap.art_id
	on ap.id = pop.ap_id
group by artname, nr
having count(*) > 1
order by artname, nr;

select tax.artname, pop.nr, tpop.nr, count(*)
from
	apflora.tpop tpop
	inner join apflora.pop pop
		inner join apflora.ap ap
			inner join apflora.ae_taxonomies tax
			on tax.id = ap.art_id
		on ap.id = pop.ap_id
	on pop.id = tpop.pop_id
group by tax.artname, pop.nr, tpop.nr
having count(tpop.id) > 1
order by tax.artname, pop.nr, tpop.nr;