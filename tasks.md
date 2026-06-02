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

---

In form /home/alex/Documents/GitHub/apf2/src/components/Projekte/Daten/Tpopfeldkontr/Form.tsx, column typ:

1. users with role 'apflora_manager' can choose from tpopkontrTypWerte 'Ausgangszustand' or 'Zwischenbeurteilung' (is implemented)
2. users with other roles can only choose from tpopkontrTypWerte 'Zwischenbeurteilung' (new)
3. all commands to create a new Feld-Kontrolle (not: Freiwilligen-Kontrolle which edits rows in the same table but sets typ to 'Freiwilligen-Erfolgskontrolle') should preset typ to 'Zwischenbeurteilung' (new). Here are such commands: a. form menu at /Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Arten/6c52d174-4f62-11e7-aebe-67a303eb0640/Populationen/70d2b98f-4f62-11e7-aebe-d3b09a4611dd/Teil-Populationen/76c7fe44-4f62-11e7-aebe-6b56ab796555/Feld-Kontrollen b. context menu (right click) on the Feld-Kontrollen node in the nav tree c. context menu (right click) on the Feld-Kontrolle node in the nav tree
