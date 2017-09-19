-- Bereitgestellte Beobachtungen löschen und SERIAL zurücksetzen:
TRUNCATE TABLE beob.beob RESTART IDENTITY;

-- Feldliste holen:
SELECT attname
FROM   pg_attribute
WHERE  attrelid = 'beob.beob_infospezies'::regclass
AND    attnum > 0
AND    NOT attisdropped
ORDER  BY attnum;
-- im editor zu einer kommagetrennten Liste verarbeiten
-- und im nächsten sql einfügen

-- Beobachtungen von Info Spezies bereitstellen:
INSERT INTO beob.beob (
  "QuelleId",
  "IdField",
  "ArtId",
  "Datum",
  "Autor",
  "X",
  "Y",
  "data"
)
SELECT
  '2',
  'NO_NOTE',
  "NO_ISFS",
  -- build a Date of the form YYYY-MM-DD
  -- infospezies saves dates as integers
  CASE
    WHEN "A_NOTE" IS NULL THEN NULL
    WHEN "M_NOTE" IS NULL THEN to_date("A_NOTE"::text || '-00-00', 'YYYY-MM-DD')
    WHEN "J_NOTE" IS NULL THEN to_date(CONCAT(
      "A_NOTE"::text,
      '-',
      CASE WHEN char_length("M_NOTE"::text) = 2
      THEN "M_NOTE"::text
      ELSE '0' || "M_NOTE"::text
      END,
      '-00'
    ), 'YYYY-MM-DD')
    ELSE to_date(CONCAT(
      "A_NOTE"::text,
      '-',
      CASE WHEN char_length("M_NOTE"::text) = 2
      THEN "M_NOTE"::text
      ELSE '0' || "M_NOTE"::text
      END,
      '-',
      CASE WHEN char_length("J_NOTE"::text) = 2
      THEN "J_NOTE"::text
      ELSE '0' || "J_NOTE"::text
      END
    ), 'YYYY-MM-DD')
  END,
  CASE WHEN "PRENOM_PERSONNE_OBS" IS NULL
  THEN "NOM_PERSONNE_OBS"
  ELSE "NOM_PERSONNE_OBS" || ' ' || "PRENOM_PERSONNE_OBS"
  END,
  "FNS_XGIS",
  "FNS_YGIS",
  row_to_json(
    (
      SELECT d FROM (
        SELECT "ID", "OBJECTID", "FNS_GISLAYER", "FNS_JAHR", "FNS_VK", "FNS_WFN", "FNS_FN", "FNS_ARTWERT", "FNS_ISFS", "FNS_XGIS", "FNS_YGIS", "NO_NOTE", "TY_NOTE", "STATUT_NOTE", "TYPE_RELEVE", "CONFIDENTIALITE", "PROJET", "NO_NOTE_PROJET", "NO_ISFS", "NOM_COMPLET", "FAMILLE", "GENRE", "NOM_ORIGINAL", "EXPERTISE_NOM", "REM_NOM", "NO_BIBLIO_FLORE", "SOURCE_BIBLIO_FLORE", "DETERMINAVIT", "DETERMINAVIT_CF", "PRESENCE", "INDIGENAT", "INTRODUIT", "EXPERTISE_INTRODUIT", "REM_INTRODUIT", "CAT_ABONDANCE", "ABONDANCE", "UNITE_COMPTAGE", "NOM_PERSONNE_OBS", "PRENOM_PERSONNE_OBS", "PERSONNE_SEC", "J_NOTE", "M_NOTE", "A_NOTE", "EXPERTISE_DATE", "CO_CANTON", "NOM_COMMUNE", "EXPERTISE_COMMUNE", "DESC_LOCALITE", "XY_FORME", "XY_PRECISION", "EXPERTISE_GEO", "ALTITUDE_INF", "ALTITUDE_SUP", "EXPERTISE_ALTITUDE", "NO_SURFACE_WELTEN", "EXPERTISE_WS", "STATION", "SUBSTRAT", "CO_MILIEU", "REM_NOTE", "REM_PROJET", "MENACES", "MESURES", "TY_TEMOIN", "DEPOT_TEMOIN", "ID_TEMOIN", "EX_HERBIER", "NO_BIBLIO", "SOURCE_BIBLIO", "NO_BIBLIO_CITE", "ESTIMATION_DATE", "PRECISION_MAILLE", "ZDSF_KATEGORIE", "ZH_GUID", "ZH_PROJEKTNAME"
      )
    d)
  ) AS data
FROM beob.beob_infospezies
WHERE
  -- exclude beob that have no species
  "NO_ISFS" IS NOT NULL AND
  -- exclude beob that were exported from EvAB
  "ZH_GUID" IS NULL;

-- EvAB
-- Feldliste holen:
SELECT attname
FROM   pg_attribute
WHERE  attrelid = 'beob.beob_evab'::regclass
AND    attnum > 0
AND    NOT attisdropped
ORDER  BY attnum;
-- im editor zu eier kommagetrennten Liste verarbeiten
-- und im nächsten sql einfügen

-- Beobachtungen von EvAB bereitstellen:
INSERT INTO beob.beob (
  "QuelleId",
  "IdField",
  "ArtId",
  "Datum",
  "Autor",
  "X",
  "Y",
  "data"
)
SELECT
  '1',
  'NO_NOTE_PROJET',
  "NO_ISFS",
  -- build a Date of the form YYYY-MM-DD
  -- EvAB saves dates as strings and '0' for NULL!
  CASE
    WHEN "A_NOTE" IS NULL THEN NULL
    WHEN "M_NOTE" IS NULL THEN to_date("A_NOTE" || '-00-00', 'YYYY-MM-DD')
    WHEN "J_NOTE" = '0' THEN to_date(CONCAT(
      "A_NOTE",
      '-',
      CASE WHEN char_length("M_NOTE") = 2
      THEN "M_NOTE"
      ELSE '0' || "M_NOTE"
      END,
      '-00'
    ), 'YYYY-MM-DD')
    ELSE to_date(CONCAT(
      "A_NOTE",
      '-',
      CASE WHEN char_length("M_NOTE") = 2
      THEN "M_NOTE"
      ELSE '0' || "M_NOTE"
      END,
      '-',
      CASE WHEN char_length("J_NOTE") = 2
      THEN "J_NOTE"
      ELSE '0' || "J_NOTE"
      END
    ), 'YYYY-MM-DD')
  END,
  CASE WHEN "PRENOM_PERSONNE_OBS" IS NULL
  THEN "NOM_PERSONNE_OBS"
  ELSE "NOM_PERSONNE_OBS" || ' ' || "PRENOM_PERSONNE_OBS"
  END,
  "COORDONNEE_FED_E",
  "COORDONNEE_FED_N",
  row_to_json(
    (
      SELECT d FROM (
        SELECT "Projekt_ZH", "Raum_ZH", "NO_NOTE_PROJET", "CUSTOM_TEXT_5_", "NO_NOTE", "NO_ISFS", "ESPECE", "TY_NOTE", "NOM_PERSONNE_OBS", "PRENOM_PERSONNE_OBS", "PERSONNE_SEC", "J_NOTE", "M_NOTE", "A_NOTE", "ESTIMATION_DATE", "NOM_COMMUNE", "CO_CANTON", "CO_PAYS", "DESC_LOCALITE_", "COORDONNEE_FED_E", "COORDONNEE_FED_N", "PRECISION_MAILLE", "ALTITUDE_INF", "ALTITUDE_SUP", "PRECISION_ALT", "NOM_ORIGINAL", "REM_NOM", "DETERMINAVIT", "DETERMINAVIT_CF_", "CAT_ABONDANCE", "ABONDANCE", "CAT_ABONDANCE_1", "TYPE_ABONDANCE_1", "PREC_ABONDANCE_1", "CAT_ABONDANCE_2", "TYPE_ABONDANCE_2", "PREC_ABONDANCE_2", "CAT_ABONDANCE_3", "TYPE_ABONDANCE_3", "PREC_ABONDANCE_3", "ABS_COUVERTURE", "DeckKlasse", "TYPE_COUVERTURE", "AGREGATION", "REM_COUVERTURE", "CAT_RECOUVREMENT", "PRESENCE_", "INTRODUIT_", "EXPERTISE_INTRODUIT_", "REM_INTRODUIT", "MENACES", "MESURES", "PHENOLOGIE", "TAILLE_PLANTE", "VITALITE_PLANTE", "STATION", "SUBSTRAT", "SOURCE_BIBLIO", "SOURCE_BIBLIO_CITE", "TY_TEMOIN", "DEPOT_TEMOIN", "ID_TEMOIN", "EX_HERBIER", "NO_SURFACE_WELTEN", "HERBIER_WS", "LUTTE_NEOPHYTES", "LUTTE_DATE", "LUTTE_TYPE", "LUTTE_SURFACE", "LUTTE_REM", "CUSTOM_NUMBER_1", "CUSTOM_NUMBER_2", "CUSTOM_NUMBER_3", "CUSTOM_NUMBER_4", "CUSTOM_NUMBER_5", "CUSTOM_TEXT_1", "CUSTOM_TEXT_2", "CUSTOM_TEXT_3", "CUSTOM_TEXT_4", "DEF_CUSTOM", "REM_NOTE", "STRATE_RELEVE", "CO_MILIEU", "CO_MILIEU_2", "CO_MILIEU_3", "ENVIRO_MILIEU", "ENVIRO_MILIEU_2", "ENVIRO_MILIEU_3", "STRUCTURE_MILIEU", "STRUCTURE_MILIEU_2", "STRUCTURE_MILIEU_3", "COUV_ALGUES", "COUV_ARBRES", "COUV_BUISSONS", "COUV_CRYPT", "COUV_EAU", "COUV_HERBACEES", "COUV_LICHENS", "COUV_LITTIERE", "COUV_MOUSSES", "COUV_ROCHE", "COUV_SOLNU", "COUV_TOT", "DEF_COUVERTURE", "HAUTEUR_ARB_MAX", "HAUTEUR_ARB_MIN", "HAUTEUR_ARB_MOY", "HAUTEUR_BUI_MAX", "HAUTEUR_BUI_MIN", "HAUTEUR_BUI_MOY", "HAUTEUR_HERB_MAX", "HAUTEUR_HERB_MIN", "HAUTEUR_HERB_MOY", "HAUTEUR_VEGETATION_MAX", "HAUTEUR_VEGETATION_MIN", "HAUTEUR_VEGETATION_MOY", "HAUTEUR_MOU", "HAUTEUR_LICH", "HAUTEUR_CRYPT", "GEOMORPHOLOGIE", "INCLINAISON", "EXPOSITION", "LUMINOSITE", "PH_SOL", "REM_SOL", "DeckKraut", "DeckStrauch", "DeckBaum"
      )
    d)
  ) AS data
FROM beob.beob_evab
WHERE
  -- exclude beob that have no species
  "NO_ISFS" IS NOT NULL;
