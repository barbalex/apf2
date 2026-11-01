// refreshes playwright/.auth/user.json with a fresh login token.
// The storage state expires with the token (24 h) — re-run when tests
// suddenly meet the Anmeldung dialog:
//   node scripts/refresh-auth-state.mjs
// Requires the dev backend stack (postgrest on :3000) and the name/password
// already present in the file.
import { readFileSync, writeFileSync } from 'node:fs'

const stateFile = new URL('../playwright/.auth/user.json', import.meta.url)
const state = JSON.parse(readFileSync(stateFile, 'utf8'))

const res = await fetch('http://localhost:3000/rpc/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: state.name, pass: state.password }),
})
if (!res.ok) {
  const body = await res.text()
  throw new Error(`login failed (${res.status}): ${body}`)
}
const login = await res.json()

// fetch the user id the way the app does after login
// (anon may select id/name columns of apflora.user)
const userRes = await fetch(
  `http://localhost:3000/user?name=eq.${encodeURIComponent(login.username)}&select=id`,
)
const [user] = userRes.ok ? await userRes.json() : []

// the app stores the user under the jotai storage key 'user'
// (see userAtom in src/store/index.ts)
const write = {
  ...state,
  cookies: [],
  origins: [
    {
      origin: 'http://localhost:5173',
      localStorage: [
        {
          name: 'user',
          value: JSON.stringify({
            name: login.username,
            token: login.token,
            id: user?.id ?? null,
          }),
        },
      ],
    },
  ],
}
writeFileSync(stateFile, JSON.stringify(write, null, 2) + '\n')
console.log(`auth state refreshed for ${login.username} (${login.role})`)
