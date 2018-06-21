UPDATE apflora.tpop
SET status = 200
WHERE id IN (
  SELECT
    tpop.id
  FROM
    apflora.tpop
  WHERE
    status = 210
);

UPDATE apflora.tpop
SET status = 202
WHERE id IN (
  SELECT
    tpop.id
  FROM
    apflora.tpop
  WHERE
    status = 211
);

UPDATE apflora.pop
SET status = 200
WHERE id IN (
  SELECT
    pop.id
  FROM
    apflora.pop
  WHERE
    status = 210
);

UPDATE apflora.pop
SET status = 202
WHERE id IN (
  SELECT
    pop.id
  FROM
    apflora.pop
  WHERE
    status = 211
);

delete from apflora.pop_status_werte
where code in (210, 211);

update apflora.pop_status_werte
set text = 'angesiedelt, aktuell'
where code = 200;

update apflora.pop_status_werte
set sort = 3
where code = 200;

update apflora.pop_status_werte
set sort = 4
where code = 201;

update apflora.pop_status_werte
set text = 'angesiedelt, erloschen/nicht etabliert'
where code = 202;

update apflora.pop_status_werte
set sort = 5
where code = 202;

update apflora.pop_status_werte
set sort = 6
where code = 300;
