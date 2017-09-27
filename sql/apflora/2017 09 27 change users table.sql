alter table apflora.userprojekt
add column "UserName" varchar(30);

update apflora.userprojekt
set "UserName" = (
  select "UserName" from apflora.user
  where "UserId" = apflora.userprojekt."UserId"
);

insert into basic_auth.users (name,role,pass)
select
  "UserName",
  CASE
    WHEN
      "NurLesen" = -1
    THEN
      'apflora_reader'
    ELSE
      'apflora_artverantwortlich'
  END AS role,
  "Passwort"
from apflora.user;

-- add reference
alter table apflora.userprojekt
add constraint fk_users
foreign key ("UserName")
references basic_auth.users (name) ON DELETE CASCADE ON UPDATE CASCADE;

-- drop UserId from apflora.userprojekt
alter table apflora.userprojekt
drop column "UserId";

CREATE INDEX ON apflora.userprojekt USING btree ("UserName", "ProjId");

alter table apflora.usermessage
drop constraint "usermessage_UserName_fkey";

alter table apflora.usermessage
add constraint fk_users
foreign key ("UserName")
references basic_auth.users (name) ON DELETE CASCADE ON UPDATE CASCADE;

drop table apflora.user;
