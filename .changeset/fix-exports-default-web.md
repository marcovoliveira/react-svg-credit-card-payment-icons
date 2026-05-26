---
'react-svg-credit-card-payment-icons': patch
---

Fix the `exports` map so the `default` condition resolves to the web build instead of the React Native build.

Previously the `default` condition for `.` and `./icons/*` pointed at `dist/native/*`. Node, SSR and server-side bundlers (e.g. Next.js server components) do not apply the `browser` condition, so they fell through to `default`, resolved the React Native entry, and failed to build with `Module not found: Can't resolve 'react-native-svg'` — an optional peer dependency that web projects do not install.

`default` now serves the web build. React Native consumers still resolve the native build via the `react-native` condition (set by Metro) or the explicit `./native` subpath.
