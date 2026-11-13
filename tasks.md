---
---

---

---

---

---

---

---

Tree keyboard navigation as in ae3

---

---

tree2 (d9bddc432) — deliberately not rewritten in this pass

---

Error telemetry (8a01e4259) — dependency-free, opt-in reporter at
errorTelemetry.ts
: completely inert unless VITE_ERROR_TELEMETRY_URL is set at build time, then posts message/stack/url/UA/release to your self-hosted collector (capped at 25/session, deduped, never throws). Wired into window.onerror, unhandledrejection, and both error boundaries.

---

---

do we need a 'how to deploy' documentation to prevent agents from having to find out themselves?
---

---

---

---

When react-leaflet v6 (actively developed against beta.2 on the next branch) is published, you can drop the override, the patch script, and the shim in one go.

---
