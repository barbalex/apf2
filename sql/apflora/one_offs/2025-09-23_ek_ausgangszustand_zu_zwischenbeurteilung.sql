-- select all values for apflora.tpopkontr.typ
select typ, count(*) 
from apflora.tpopkontr 
group by typ 
order by typ;

-- was:
-- "Ausgangszustand"	3406
-- "Freiwilligen-Erfolgskontrolle"	7082
-- "Zwischenbeurteilung"	15052
-- 	36

-- update all "Ausgangszustand" to "Zwischenbeurteilung"
update apflora.tpopkontr
set typ = 'Zwischenbeurteilung'
where typ = 'Ausgangszustand';
-- UPDATE 3406
-- https://github.com/barbalex/apf2/issues/708#issuecomment-3324451034