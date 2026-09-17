What I recommend but deliberately didn't do (your call, each is a separate project):

- connect PostGraphile as the non-superuser authenticator instead of postgres (the commented URL in backend/.env suggests this was once intended);
- add login rate-limiting before phase 3 (cost-12 bcrypt now slows online guessing too);
- note that username enumeration via "Benutzer nicht gefunden" is inherent to name-based login.
