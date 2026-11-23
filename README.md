# Noha's Pearls

An Arabic classroom platform: the teacher prepares or imports lessons, presents
them live, and student groups follow on their devices and answer from the device
or with printed answer cards. The full plan, including how the reference site
works, is in [docs/PLAN.md](docs/PLAN.md).

## How it runs

One Cloudflare Worker, named `noha-pearls`, serves the site and answers `/api/*`.
One Durable Object, the hub, holds all the data in its own SQLite storage (no
other database). It runs on Cloudflare's free plan. The public address is
<https://noha-pearls.miss-noha-farid.workers.dev>. Data is saved on the server
and every device sees the same school. A device is told apart by a cookie, so a
second browser (or a private window) is a second device.

## Run

```bash
npm install
npm run dev        # open the address it prints
```

`npm run dev` runs the site with a local hub and a sample school. The local
sign-in is the public development pair below; it works only on `localhost`, and
a deployed site refuses it.

| Command | Does |
|---|---|
| `npm run dev` | Development server with a local hub and a sample school |
| `npm test` | Unit tests (rules, services, card read/print round trip) |
| `npm run typecheck` | TypeScript check |
| `npm run build` | Production build into `dist/` (the site in `dist/client`, the Worker in `dist/noha_pearls`) |
| `npm run check` | Everything the deploy checks: types, tests, protected files, browser walkthrough |
| `npm run check:quick` | Types and protected files only: what `npm run ship` runs on the computer |
| `npm run ship -- "message"` / `npm run undo` | Send one change (or the taking back of the last one) to the online check, which publishes it when it passes |
| `npm run deployed` | After a ship or an undo: wait for the online check and deploy, and say whether the site shows it, or what failed |
| `npm run discard` | Throw away everything in the folder that is not on the site |
| `npm run admin:2fa` | Make (or show) the authenticator key and its QR code for the admin sign-in |
| `npm run vendor:aruco` | Rebuild the vendored marker library after upgrading `js-aruco2` |

## Ten-minute walkthrough

**1. Become the admin.** On any page press the «دخول المعلّمة» button at the top-left of the page and enter
the development password `teach-2468` and the six-digit code from an
authenticator app. For development the authenticator key is `JBSWY3DPEHPK3PXP`:
add it to any authenticator app by "enter a setup key", or run
`npm run admin:2fa -- JBSWY3DPEHPK3PXP` to get a QR code to scan. An editing panel appears on the side and the
admin pages appear in the navigation. Visitors never see either.

**2. Import a lesson (the main way to create one).** Home → *استيراد درس*:
copy the instructions, paste them into any AI assistant followed by your lesson
material, paste the assistant's reply into the box, press *استيراد*. The lesson
opens unpublished; edit any slide from the panel, then tick *منشور للزوار*.
To try it without an AI, export the sample lesson (*تصدير ملف*) and import that
file back.

**2b. Bring in a class list.** Roster page → *استيراد قائمة هذه الشعبة*: paste three
columns copied from Excel (card number, name, group) or choose a text file, then
press *إضافة إلى القائمة*. Card numbers are kept exactly, so printed cards keep
working. *تصدير القائمة* downloads the list in the same form. Real class lists
belong in the git-ignored `private/` folder, never in the repository.

**3. Start a class.** Open a lesson → *بدء حصة مباشرة بهذا الدرس*. On the
session page press *إظهار رموز الانضمام*: one QR per group. Each card also has
the link *فتح كجهاز طالب*; open it in a **private window or another browser** to act as a student device,
and choose a name. A device without a camera can instead type the session code
(shown in the teacher's side panel) on the home page and pick its group. The
device then waits: let it in from the *الانضمام* section of the side panel,
with *إدخال* beside its name or by scanning the student's answer card.

**4. Teach.** Move through slides with the buttons, the arrow keys or a clicker
(left arrow is "next", as the interface is right-to-left). On a question slide,
answer from the student device and watch the tally on the teacher's screen; press
*إظهار الإجابة* to reveal it, which locks the question and shows each student
their result.

**5. Pace the groups.** In the side panel set a group to *يتبع المعلّم*
(follow), *يتنقّل بحرية* (free), *إيقاف* (hold) or *تثبيت* (pinned to the
current slide), and watch the student device.

**6. Answer cards.** *بطاقات الإجابة* prints one card per student. On an
individual multiple-choice slide press *مسح بطاقات الإجابة*, allow the camera,
and hold a printed card up with the chosen letter at the top. If a card will not
read, tap the student's name in the scanner to enter the answer by hand.

**7. Follow up.** *متابعة المجموعات* shows every student's answers by group;
*لوحة التعزيز* shows scores and hearts. Give hearts from either page; students
give hearts to classmates in other groups from their own device.

To start over locally, stop `npm run dev` and delete the `.wrangler` folder
(the local hub's data).

## Deploying

Every push to `main` runs `.github/workflows/deploy.yml`: **check** (`npm run
check`), then **deploy** (build, then `wrangler deploy` with the admin secrets
as the Worker's secrets), then a **smoke test** (`scripts/smoke.mjs`) that asks
the live address whether it is the real site. If any step fails, nothing newer
goes out. The workflow can also be run by hand from the Actions tab. The
secrets and the maintainer's tasks are in [docs/HANDOVER.md](docs/HANDOVER.md).

## Where things are

```
src/domain/          rules and data shapes (pure, fully unit-tested)
src/ports/           interfaces to the outside world
src/services/        use cases
src/infrastructure/  adapters: browser storage, auth, markers, QR
src/app/             composition root, config, sample data
src/i18n/            all interface text
src/ui/              React pages and components
src/server/          the Worker and the hub (runs on Cloudflare only)
```

The table "Where each rule lives" in the plan maps every concern to its file.
