In exports we need to add two columns: 1. avName (apflora.adresse.name) 2. avEmail (apflora.user.email).

Lets add them in the following exports:

- /home/alex/Documents/GitHub/apf2/src/components/Projekte/Exporte/Ap/Ap.tsx
- /home/alex/Documents/GitHub/apf2/src/components/Projekte/Exporte/Populationen/Pops.tsx
- /home/alex/Documents/GitHub/apf2/src/components/Projekte/Exporte/Teilpopulationen/TPop.tsx
- /home/alex/Documents/GitHub/apf2/src/components/Projekte/Exporte/Kontrollen/Kontrollen.tsx
- /home/alex/Documents/GitHub/apf2/src/components/Projekte/Exporte/Massnahmen/Massnahmen.tsx

---

in /home/alex/Documents/GitHub/apf2/src/components/Projekte/Daten/Qk/Qk/createMessageFunctions.ts: tpopmassnOhneJahr, tpopfeldkontrOhneJahr, tpopfreiwkontrOhneJahr need the following changes:

1. adjust the query to ensure there also exists a value in the datum column
2. adjust the query to ensure this value is inside now +- 100 years

3. in the qk table their names change:
   - tpopmassnOhneJahr > tpopmassnDatum
   - tpopfeldkontrOhneJahr > tpopfeldkontrDatum
   - tpopfreiwkontrOhneJahr > tpopfreiwkontrDatum
4. in the qk table their titel changes: 'ohne Jahr' > 'ohne Jahr, ohne Datum oder mit verdächtigem Datum'

For the latter two we need sql that can be run on the server.
