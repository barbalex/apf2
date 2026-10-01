What I recommend but deliberately didn't do (your call, each is a separate project):

- add login rate-limiting before phase 3 (cost-12 bcrypt now slows online guessing too);

What's deliberately still open, no urgency today:

- rotate the JWT secret and the postgres password in a few days (both were pasted into this chat, and dev/prod share them — JWT rotation just logs everyone out once)
- phase 2 on the password-strength branch (the set_initial_password SECURITY DEFINER flow replacing the anonymous updateUserById)
- phase 3 whenever you're ready (run 04_set_allrequire.sql + restart to force the password reset wave, after informing users)

---

lets implement https://github.com/barbalex/apf2/issues/779. So we need:

1. remove the apber.veraenderung_zum_vorjahr column and all its usages
2. remove the value from the export it is used in (/home/alex/Documents/GitHub/apf2/src/components/Projekte/Exporte/Ap/Ber.tsx)
3. ensure the value is calculated in the AP-Bericht form as soon as "Beurteilung" exists for current and previous year (http://localhost:5173/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13/Arten/6c52d173-4f62-11e7-aebe-2bd3a2ea4576/AP-Berichte/cdd111f4-ead7-11f0-99c4-13a346d3861f). Here +,- and = are to be used
4. ensure the value is calculated in the report (Jahresbericht, Erfolg) but only + and - are shown (should match what is implemented now)
5. create a migration script to change the sql on the production server parallel to updating the app code

I started implementing it in the current branch but decided to hand it to you instead.
