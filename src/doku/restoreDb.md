---
slug: 'daten-wiederherstellen'
date: '2021-11-18'
title: 'Datenbank aus Sicherung herstellen'
sort: 31
---

Soll eine Datenbank aus einer Sicherung wiederhergestellt werden, geht das so:<br/><br/>

### 1. Datenbank erstellen

Entweder in pgAdmin oder:

```sql
CREATE DATABASE apflora encoding 'UTF8';
```

### 2. Rollen erstellen

```sql
create role apflora_reader;
create role apflora_ap_reader;
create role apflora_manager in group apflora_reader;
create role apflora_ap_writer in group apflora_reader;
create role apflora_freiwillig;
create role anon;
create role authenticator with login password 'INSERT PASSWORD' noinherit;
grant connect on database apflora to authenticator;
grant connect on database apflora to anon;
grant anon to authenticator;
```

anon und authenticator werden für das Login benutzt.<br/>
apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_freiwillig und apflora_manager sind Benutzer mit unterschiedlichen Rechten.<br/><br/>

### 3. Aus Sicherung wiederherstellen

```
pg_restore --dbname=apflora --port 5432 --username "${POSTGRES_USER}" --no-password --verbose "/sik_data/apflora.backup"
```

### 4. JWT Secret setzen

    ALTER DATABASE apflora SET "app.jwt_secret" TO 'INSERT SECRET';
