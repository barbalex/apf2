SELECT
  tax.artname,
  ap_user.user_name
FROM
  apflora.ap_user ap_user
  INNER JOIN apflora.ap ap ON ap.id = ap_user.ap_id
  INNER JOIN apflora.ae_taxonomies tax ON ap.art_id = tax.id
WHERE
  user_name = 'hangartner'
ORDER BY
  tax.artname;

-- https://apflora.ch/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Arten/6c52d17c-4f62-11e7-aebe-1fc9d4d8081b/Populationen/70bffdee-4f62-11e7-aebe-630ad7fee719/Teil-Populationen/769f4f4f-4f62-11e7-aebe-33f79e370c6d?apTab=ap&feldkontrTab=entwicklung&idealbiotopTab=idealbiotop&popTab=pop&projekteTabs=tree&projekteTabs=daten&qkTab=qk&tpopTab=tpop&tpopmassnTab=tpopmassn
SELECT
  ap_user.user_name
FROM
  apflora.ap_user ap_user
  INNER JOIN apflora.ap ap ON ap.id = ap_user.ap_id
WHERE
  ap.id = '6c52d17c-4f62-11e7-aebe-1fc9d4d8081b'
ORDER BY
  ap_user.user_name;

