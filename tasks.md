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

---

Nav tree, 'Beobachtungen nicht beurteilt', 'Beobachtungen nicht zuzuordnen' and 'Beobachtungen zugeordnet': these nodes list apflora.beob rows.

So far, such a row, when shown in the map, is represented with an icon (there are two different, one vor Absenz (beob.absenz = true), the other for all others).

New: The same icon shall be shown left of the row's label in the nav tree. Same as with 'Populationen' and 'Teil-Populationen'

---

Two remaining details:

1. the label of beob are often long and wrap. icons should always remain on the first line (top) of a wrapped label
2. symbols for absenz are now larger than the others. please make them same size

---

Two more corrections:

1. absenz icons's color is darker than the others (for: 'Beobachtungen nicht beurteilt', maybe also 'Beobachtungen zugeordnet'? The color is fine for 'Beobachtungen nicht zuzuordnen')
2. an active 'Beobachtungen nicht beurteilt' node is no more recognizable. It seems the flow symbol is no more drawn or covered by the yellow glow. Same for 'Beobachtungen nicht zuzuordnen'. Maybe also for 'Beobachtungen zugeordnet'?

---

lets implement https://github.com/barbalex/apf2/issues/708#issuecomment-3233512395. This includes the following parts:

1. the value 'Zwischenbeurteilung' in apflora.tpopkontr_typ_werte should change to 'Kontrolle': we need sql code to run when the updated app is set live
2. update all apflora.tpopkontr.typ values. As typ is defined as `typ varchar(50) DEFAULT NULL REFERENCES apflora.tpopkontr_typ_werte(text) ON DELETE SET NULL ON UPDATE CASCADE`, this should happen automatically because of `ON UPDATE CASCADE`
3. replace the value in all views it is used in: we need sql code to run when the updated app is set live
4. replace the value in all functions it is used in: we need sql code to run when the updated app is set live
5. replace the value everywhere it is used in the code (including in the store)
6. restart the graphql server after running the sql when the updated app is set live

Steps:

1. prepare all sql code to run when the updated app is set live
2. replace the value in the code
3. test in dev: run all sql code, restart graphql server, see if things work
4. set live: set app live, run all sql code, reastart graphql server, see if things work

---

now we make changes to /home/alex/Documents/GitHub/apf2/src/components/Projekte/Daten/Ap/Historien/index.tsx:

1. we need to pass in a + button in the FormTitle to enable adding a ap_history
2. Clicking this adds a ap history (art_id and proj_id are set from the route params) (sub-)form below the last ap history and scrolls down there
3. this subform consists of a year input and the other ap_history inputs, similar to how they are used in the /home/alex/Documents/GitHub/apf2/src/components/Projekte/Daten/Ap/Ap/Ap.tsx form
4. when the subform looses focus, it mutates to a regular row in /home/alex/Documents/GitHub/apf2/src/components/Projekte/Daten/Ap/Historien/index.tsx
5. these history rows get an edit button (right of the year title). Clicking that mutates the row to the editable subform

---

when editing, we need a button to remove the row: with a menu asking to confirm or cancel
