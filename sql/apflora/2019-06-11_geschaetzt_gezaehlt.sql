-- 1. move geschätzt/gezählt to geschätzt
-- 1015 datasets of 17'446

-- select methode, count(*)
-- from apflora.tpopkontrzaehl
-- group by methode

-- select * from apflora.tpopkontrzaehl
-- where methode = 3;

update apflora.tpopkontrzaehl
set methode = 1 where methode = 3;

-- 2. delete geschätzt/gezählt
delete from apflora.tpopkontrzaehl_methode_werte
where id = 'ddf9e960-3dc8-11e8-acca-0b3c05c7b410';