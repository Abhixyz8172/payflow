# PayFlow — React Frontend

A React dashboard for the PayFlow digital wallet: sign in, view balance, send
money, see transaction history. Built to sit in front of the existing
PayFlow backend (Django/FastAPI + PostgreSQL) described in the main project.

Currently wired to mock data in `src/api/walletApi.js` so it runs standalone
with zero setup — swap that one file for real `fetch()` calls once you want
to connect it to your backend (each function already has the real version
commented out right below the mock).

## Run it locally

You need Node.js installed (v18+; check with `node -v`).

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). Log in with any
email and any password that's 4+ characters — it's mocked, so nothing needs
to match.

## Project structure

```
src/
  api/walletApi.js       — all backend calls live here (currently mocked)
  components/
    Login.jsx             — email/password form, calls login()
    Dashboard.jsx          — loads balance + transactions on mount
    Balance.jsx            — displays the balance card
    TransferForm.jsx       — send-money form, calls transferMoney()
    TransactionList.jsx    — renders the transaction history
  App.jsx                 — top-level: shows Login or Dashboard
  main.jsx                — React entry point
  styles.css               — all styling
```

## What to actually understand before an interview

Don't just submit this — walk through it once so you can talk about it.
Here's the shortlist of concepts this project touches, and where to see them:

- **Components & props** — `Balance.jsx` takes `amount` and `loading` as
  props and just renders them. It has no state of its own. `TransferForm`
  calls `onTransferComplete(...)` — a function *passed in* from `Dashboard`
  — so the child can tell the parent "something happened."
- **State (`useState`)** — `App.jsx` holds `user`; `Dashboard.jsx` holds
  `balance` and `transactions`. Whoever *owns* a piece of data is whoever
  calls `useState` for it — that's the core React mental model.
  export interviewers often ask: "why does `Dashboard`, not `Balance`, hold
  the balance?" — because `Dashboard` is the lowest component that both
  `Balance` and `TransferForm` need to share it.
- **Effects (`useEffect`)** — `Dashboard.jsx` fetches balance + transactions
  once when the screen first loads, using an empty `[]` dependency array.
- **Lifting state up** — when a transfer succeeds, `TransferForm` doesn't
  update the balance itself; it calls `onTransferComplete`, and `Dashboard`
  (the shared parent) updates its own state, which flows back down to
  `Balance` as a new prop. This is *the* React data-flow pattern.
- **Controlled inputs** — every `<input>` has `value={state}` and
  `onChange={setState}`. React owns the input's value, not the DOM.
- **Async/await + error handling** — `walletApi.js` functions are `async`
  and can `throw`; every component that calls them wraps the call in
  `try/catch` and shows the error message.
- **API abstraction** — nothing outside `walletApi.js` knows or cares that
  the data is mocked. That's the seam where you'd plug in your real
  Django/FastAPI backend without touching any component.

## Connecting to the real PayFlow backend

In `src/api/walletApi.js`, each function has its mock logic plus a commented
"Real backend version" block using `fetch()`. To go live:

1. Make sure your Django/FastAPI backend has CORS enabled for
   `http://localhost:5173`.
2. Uncomment the `fetch()` block in each function, delete the mock logic
   above it.
3. Store the JWT you get back from `login()` (e.g. in a `useState` in
   `App.jsx`, passed down via context or props) and send it as the
   `Authorization` header on the other calls.

## Next steps if you want to extend it

- Add a signup screen.
- Persist the logged-in session (e.g. store the token so refresh doesn't
  log you out).
- Add loading skeletons instead of "Loading...".
- Write a couple of component tests with Vitest + React Testing Library —
  worth mentioning in interviews even if you only add one or two.
