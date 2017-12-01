alter table apflora.apber
add column "JBerCAktivApbearb" text,
add column "JBerCVerglAusfPl" text;
COMMENT ON COLUMN apflora.apber."JBerCAktivApbearb" IS 'Bemerkungen zum Aussagebereich C: Weitere Aktivitäten der Aktionsplan-Verantwortlichen';
COMMENT ON COLUMN apflora.apber."JBerCVerglAusfPl" IS 'Bemerkungen zum Aussagebereich C: Vergleich Ausführung/Planung';