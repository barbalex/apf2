-- idea: build tree in a psql function
-- Query each branch in separate with clause
-- filter each branch by:
-- 1. passed in openNodes (like in ae, only array instead of single)
-- 2. passed in filter criteria
-- every row gets sort string
-- union all branches
-- sort rows by sort string
--
-- filter criteria:
-- pass in array of composite types (https://www.postgresql.org/docs/14/rowtypes.html)
-- composite type describes filter criteria:
-- - branch (not table: ek/ekf)
-- - field
-- - comparator
-- - value
-- - type (to cast the value correctly)
-- build sql query string using these filter criteria
-- This is same principle used in kapla/personal
-- For example see: https://stackoverflow.com/a/8146245/712005
-- To prevent injection, see: https://dba.stackexchange.com/a/49718/51861
--
-- How to deal with or-queries?
-- Define the function's last arguments as variadic
-- Then loop through all the composite type arrays
-- https://stackoverflow.com/a/32906179/712005
--
-- cons:
-- - lots of work to build (but: some work needed for or-filters anyway)
-- - much more processing server side (but: peaks are comparatively reduced, see pros)
-- - rows fetched are not added to table cache of apollo
-- - passing filter criteria adds to data transfered (but: that happens in graphql too)
-- - sort string: dangerous. Fill each entry to equal lengths?
--
-- pros:
-- - much less data transfered?
-- - sql allows more powerfull queries
-- - much less processing client side
-- - easier to change to offline client side filtering later?
-- - more server side base processing makes peaks less extreme
-- - enables simple endless scrolling i.e. only loading needed data!!!! https://virtuoso.dev/endless-scrolling
--
-- data measurements
-- Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne/6c52d173-4f62-11e7-aebe-2bd3a2ea4576
-- TreeAllQuery + UsermessagesQuery: 202 kb
-- Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Aktionspläne
-- TreeAllQuery + UsermessagesQuery: 147 kb