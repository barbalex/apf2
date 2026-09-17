What I recommend but deliberately didn't do (your call, each is a separate project):

- add login rate-limiting before phase 3 (cost-12 bcrypt now slows online guessing too);

What's deliberately still open, no urgency today:

- rotate the JWT secret and the postgres password in a few days (both were pasted into this chat, and dev/prod share them — JWT rotation just logs everyone out once)
- phase 2 on the password-strength branch (the set_initial_password SECURITY DEFINER flow replacing the anonymous updateUserById)
- phase 3 whenever you're ready (run 04_set_allrequire.sql + restart to force the password reset wave, after informing users)
