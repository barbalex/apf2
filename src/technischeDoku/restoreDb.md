---
typ: 'technDoku'
path: "/Dokumentation/Technisch/Daten-Wiederherstellen"
date: "2019-04-18"
title: "Datenbank aus Sicherung herstellen"
sort: 6
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
create role apflora_manager in group apflora_reader;
create role apflora_artverantwortlich in group apflora_reader;
create role apflora_freiwillig;
create role anon;
create role authenticator with login password 'INSERT PASSWORD' noinherit;
grant connect on database apflora to authenticator;
grant connect on database apflora to anon;
grant anon to authenticator;
```
anon und authenticator werden für das Login benutzt.<br/>
apflora_reader, apflora_freiwillig, apflora_artverantwortlich und apflora_manager sind Benutzer mit unterschiedlichen Rechten.<br/><br/>

### 3. Aus Sicherung wiederherstellen
Am Einfachsten direkt in pgAdmin<br/><br/>

### 4. JWT Secret setzen
ALTER DATABASE apflora SET "app.jwt_secret" TO 'INSERT SECRET';