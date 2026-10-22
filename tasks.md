What I recommend but deliberately didn't do (your call, each is a separate project):

- add login rate-limiting before phase 3 (cost-12 bcrypt now slows online guessing too);

What's deliberately still open, no urgency today:

- rotate the JWT secret and the postgres password in a few days (both were pasted into this chat, and dev/prod share them — JWT rotation just logs everyone out once)
- phase 2 on the password-strength branch (the set_initial_password SECURITY DEFINER flow replacing the anonymous updateUserById)
- phase 3 whenever you're ready (run 04_set_allrequire.sql + restart to force the password reset wave, after informing users)

---

---

---

scroll into view issue: does it exist in vermehrung too?

---

I got this info in an email roundletter:

"Umstellung der OGD*ZH WMS-Dienste

Die OGD*ZH WMS-Dienste wurden auf eine neue und einheitliche Namenskonvention umbenannt: OGD*ZH heisst neu *ZHWMS.

Beispiel Amtliche Vermessung:

Alt: https://wms.zh.ch/OGDAVswZH?SERVICE=WMS&REQUEST=GetCapabilities

Neu: https://wms.zh.ch/AVswZHWMS?SERVICE=WMS&REQUEST=GetCapabilities

Falls Sie die betroffenen Dienste in Ihren Anwendungen integriert haben, prüfen Sie die URLs und passen Sie sie auf die neue Namenskonvention (*ZHWMS) an, so dass die Dienste einwandfrei funktionieren."

Lets rename the affected layers. Then list them to test.

---

rotate uploadcare secret in a few days (from 9.10.2026)

---
