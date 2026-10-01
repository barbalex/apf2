# Deploy the change for issue 779

Closes https://github.com/barbalex/apf2/issues/779:
in AP-Berichten wird «Veränderung zum Vorjahr» neu mit =, + oder -
angezeigt. Der Wert wird nicht mehr manuell gewählt und gespeichert,
sondern berechnet - aus den Beurteilungen des Berichtjahres und des
Vorjahres. Damit entfällt die Spalte apflora.apber.veraenderung_zum_vorjahr.

Achtung: die bisher gespeicherten Werte werden gelöscht. Sie werden
durch die berechneten Werte ersetzt.

Im Gesamt-Jahresbericht (Erfolg) wird wie bisher nur + oder - angezeigt,
berechnet aus den Beurteilungen - nicht aus der gelöschten Spalte.

1. deploy the new app code together with this migration
   (old app versions still writing the column will fail afterwards)
2. run the migration:
   - 01_drop_veraenderung_zum_vorjahr.sql
3. restart the graphql server (the GraphQL schema loses the
   apber field veraenderungZumVorjahr):
     docker compose up -d graphql
4. re-dump the schema and regenerate typed operations:
     npm run codegen:schema
     npm run codegen
5. test:
   - open an AP-Bericht with a Beurteilung and an AP-Bericht des
     Vorjahres with a Beurteilung: «Veränderung zum Vorjahr» shows
     +, - or =
   - change the Beurteilung: the value recalculates
   - AP-Bericht without Beurteilung des Vorjahres: no value
   - Jahresbericht (print): Erfolg list still shows only + or -
   - export "AP-Berichte (Jahresberichte)": veraenderung_zum_vorjahr
     right of beurteilung_decodiert, calculated like in the form
     (+, - or =), not read from the table any more
