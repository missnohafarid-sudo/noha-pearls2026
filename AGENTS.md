# AGENTS.md

Arabic classroom platform: Vite, React 19, TypeScript strict.

## 1. Who you are working for

A teacher. She is not a programmer and cannot judge your code.

- Speak to her in simple Arabic, feminine address (استخدمي، اكتبي).
- Never show code, file names, commands or technical terms unless she asks.
- Say what will change ON THE SCREEN, in her words ("الزر سيصير أخضر").
- She trusts you. A wrong "done" costs her a classroom. When unsure, stop and say so.

## 2. Before you touch anything

1. Restate the request in one or two plain Arabic sentences, as a visible change.
2. If it could mean two things, ask at most two short questions. Each has two or three numbered options she picks by number. Never ask an open or technical question.
3. Classify it with this table, then follow the skill in `.agents/skills/` or the action given.

| She says (examples) | What it is | Do |
|---|---|---|
| «غيّري كلمة الزر إلى ...»، «اكتبي "ابدأ" بدل "بدء"» | Interface wording | Skill `change-wording` |
| «اجعلي اللون أخضر»، «غيّري ألوان الموقع كلها»، «الخط أكبر»، «المسافة بين الأزرار ضيقة»، «رتّبي الصفحة بشكل آخر»، «ضعي هذه الصورة أو هذا الشعار»، «غيّري ألوان مظهر اللؤلؤة الوردية» | Look: one colour or the whole palette (of every look or of one pearl's look), fonts, sizes, spacing, how a page is arranged, a picture she gives you | Skill `change-look` |
| «غيّري نص الصفحة الرئيسية»، «أضيفي سؤالاً للدرس»، «أضيفي فيديو أو صوتًا أو صورة أو ملف PDF أو محاكاة للدرس»، «صحّحي اسم طالبة»، «انقلي سلمى إلى مجموعة أخرى»، «عدّلي الدرس»، «أضيفي شارة ملوّنة للشريحة»، «أخفي هذا الجزء من الشريحة حتى أضغط زرًّا»، «أضيفي رمز الدرجة أو معادلة أو كسرًا»، «أضيفي جدولًا للشريحة»، «اجعلي خيارات السؤال صورًا»، «غيّري مظهر الموقع إلى اللؤلؤة الذهبية»، «أريد وضعًا ليليًّا» | CONTENT, edited inside the website by the admin (media goes in a «شريحة وسائط» from a public link; a slide's badges, hidden parts, pictures, picture options, tables, fractions and symbols are in its editor; the site's look is the pearl button in the top bar, and its black pearl is the night look). NOT code | Skill `content-is-edited-in-the-site`. Change no code |
| «أريد نوعاً جديداً من الأسئلة»، «شريحة فيها ترتيب أو مطابقة» | New slide kind | Skill `add-slide-kind` |
| «أريد خانة لرقم ولي الأمر في بيانات الطالبة» | New field on an existing form | Skill `add-form-field` |
| «أضيفي زرًّا يُخفي الأسماء»، «أريد أن تختار كل طالبة مظهر جهازها بنفسها»، «أريد قسمًا أو رابطًا أو عدّادًا جديدًا في الصفحة» | A small new feature: on the page only, remembered on one device, or a setting the site keeps for everyone | Skill `add-small-feature` |
| «الموقع لا يعمل»، «ضغطتُ فلم يحدث شيء»، «ظهرت رسالة خطأ» | Bug | Skill `fix-a-bug` (test first) |
| «تراجعي عن آخر تغيير»، «لا يعجبني ما حدث»، «أبقي اللون وأعيدي الخط كما كان» | Undo: a whole change, or part of one | Skill `undo` |
| «انشري»، «أريد أن يراه الجميع» | Publish | Skill `ship` |
| Passwords, the authenticator code, signing in, the limits, backups or restore, the database or the server itself, GitHub or Cloudflare settings, deleting or rewriting data that is already stored, anything in the protected files | Maintainer only | STOP. Change nothing. Tell her in Arabic this needs the maintainer. |
| Anything else that changes what the pages show or what the site can do | A small new feature | Skill `add-small-feature`. Only when you cannot tell what she wants after your two questions: STOP and say so in Arabic. |

4. One request = one small change, shipped on its own and confirmed on the site (section 5). Several requests: do them one at a time, each finished before the next. A request too big for one small change (a whole new page, several screens at once): say so in Arabic, split it into small changes she can look at one by one, tell her the order, and do them in that order.

## 3. Map of the code

| Layer | Holds | May import |
|---|---|---|
| `src/domain` | Rules and data shapes. Pure: no React, no browser, no I/O | itself only |
| `src/ports` | Interfaces the app needs from outside (`DocumentStore`, `AuthGateway`, `Caller`, codes) | `domain` |
| `src/services` | Use cases as classes (`LessonService`, `RosterService`, ...). Every change of stored data goes through one | `domain`, `ports` |
| `src/infrastructure` | Adapters that implement ports: the hub's SQL store (`SqlDocumentStore`, `sql/`), the page's connection to the hub (`remote/`), markers, QR, the device's look and identity; the browser-only store and sign-in (`LocalDocumentStore`, `PrototypeAuthGateway`) used only by the walkthrough build | `domain`, `ports` |
| `src/server` | The Worker and the hub: the server's composition root and transport. Runs on Cloudflare, never in the page; nothing imports it | `domain`, `ports`, `services`, `infrastructure` |
| `src/app` | `container.ts` (the only file naming concrete adapters), `config.ts` | `domain`, `ports`, `services`, `infrastructure`, `i18n` (never `ui`, never `server`) |
| `src/hubTests` | The hub's tests and their harness | `domain`, `ports`, `services`, `infrastructure`, `server` |
| `src/i18n` | Every word the interface shows, one file per feature, `t` in `index.ts` | `domain` |
| `src/ui` | React pages and components | `domain`, `i18n`, `services`, `ports` (types only), `app/config` |

| Concern | Its one home |
|---|---|
| Data shapes | `domain/models.ts` (lessons, slides and folders: `domain/lessonModels.ts`) |
| Slide kinds: the registry, template, file read/write | `domain/slideKinds.ts`; the file vocabulary (`SlideKindSpec`, `FileFieldName`, `IssueCode`): `domain/slideFile.ts`; field readers and repairs: `domain/slideFields.ts` |
| Slide kinds: edit fields and drawing | `ui/slides/slideUi.tsx` |
| The seven pearl shades: the colours of a slide's badges and the site's looks | `domain/pearlShades.ts`; names `t.common.pearlShade` |
| A slide's coloured badges beside its tag: how many, reading and repair, which are drawn | `domain/badges.ts`; edited in `ui/slides/BadgesField.tsx`, look in `ui/slides/badges.css` |
| What a slide's plain text is made of: lines, bullets, picture lines, tables (two rows or more), parts hidden between `+++` lines, each known by a key made from its own words, and the closed ones cut out | `domain/slideText.ts` (a table's rows: `domain/slideTable.ts`; the key: `domain/fingerprint.ts`); the edits the tools bar makes in a box (hide the selection, a starter table): `domain/slideTextEdits.ts`; drawn by `ui/slides/TextBlocks.tsx` (inside `BodyText.tsx`), `SlideTable.tsx` and `HiddenSection.tsx` |
| Who opens a slide's hidden parts (the teacher, for the whole class) and what a student or a visitor receives of them | `domain/sessions.ts` (`openedParts`, `withPartOpened`), `domain/visibility.ts` (a seat gets the opened parts of its class, a visitor none), each kind's `hiddenPartKeys`/`withOpenedParts` (`domain/slideHiddenParts.ts`, where the end-of-slide part is also decided); command `services/SessionService.ts` (`setHiddenOpen`); the three ways a part is drawn: `ui/slides/hiddenControl.ts`, `ui/hooks/useSharedHiddenParts.ts` |
| A fraction written `{top/bottom}` | `domain/fractions.ts` (its placeholder character is declared with the direction rules), drawn by `ui/slides/DirectedText.tsx` and `fraction.css` |
| The symbols offered while writing a slide, and the tools bar over the slide editor (symbols, hide the selection, a starter table, a fraction) | `domain/symbols.ts`, `ui/forms/TextTools.tsx` and `textTools.css`; words `t.slides.tools` |
| Every limit the transport and the hub hold to (message size, rates, day limit) | `ports/limits.ts`; the counting rules behind them: `domain/abuse.ts` |
| Sign-in length, how long a device's identity lasts, the shortest password | `domain/adminAccess.ts` |
| Who may look a class up by its code | `domain/classCode.ts` |
| How long the page waits before it reconnects | `domain/reconnect.ts` |
| How often a device may change its answer | `domain/answerChanges.ts` |
| How far a group's students have come on a question | `domain/answerProgress.ts` |
| What a results line shows of a question and its answer | `domain/resultRows.ts` |
| Lesson file format and checks | `domain/lessonFormat.ts` |
| Lesson edits (add, copy, move, remove slide) | `domain/lessonOps.ts` |
| The lesson folder tree: nesting, moving, what a folder holds at any depth | `domain/folders.ts` |
| Removing a folder: alone (what it holds moves up one level) or with everything inside it | `services/FolderService.ts` (its lessons through `services/LessonShelf.ts`) |
| The lesson library screen: path line, folder tiles, moving by drag or by the move dialog, the delete-folder dialog, selecting several lessons to publish, move or delete together | `ui/library/` (words in `i18n/library.ts`) |
| Which folders a reader sees, and the folder a page shows for a requested one | `domain/folders.ts` |
| Where an item may be put (by drag or by the move dialog), and repairing a stored folder tree | `domain/folders.ts` |
| Drag wiring (what carries a drag, what is dropped on) | `ui/library/useDragMove.tsx` |
| Who may answer what, whose answer counts for a student (her own, else her group's shared device's), text length limit | `domain/answering.ts` |
| Who has answered the slide on screen, group by group (the pearl panel) | `domain/answering.ts` (`answerStatusByGroup`) |
| What a shared group device may do for the students of its group: who it stands for, answering an individual choice question for one of them, what it sees of them | `domain/sharedDevice.ts` |
| Moving a name onto an answer on a shared device: by mouse, finger or pen, or tap then tap | `ui/join/useNameDrag.ts` (the drag), `ui/join/MemberAnswers.tsx` and `memberAnswers.css` (names and look) |
| Marking and group scores | `domain/scoring.ts` |
| Pearls a group has earned | `domain/scoring.ts` |
| Tallies, monitor table, heart totals (given minus taken) | `domain/analytics.ts` |
| What a group's device shows | `domain/pacing.ts` |
| Card encoding | `domain/cards.ts` |
| Choice limits; whether an option is words or a picture | `domain/choices.ts` (`optionView`); named in a sentence by `ui/common/optionName.ts`; the picture grid `ui/slides/choicePictures.css` |
| What a media link shows and how: its type, its address, its frame; which photos a slide shows | `domain/media.ts` |
| Which part of a line of slide text reads left to right (an equation, an English word inside Arabic), and the form of a text a writing box shows so those parts read in order | `domain/textDirection.ts`, drawn by `ui/slides/DirectedText.tsx`; the boxes: `ui/forms/DirectedBox.tsx` (what is saved never holds the two isolating characters) |
| Keyboard moves through a list of options, typing to jump | `domain/listNavigation.ts` |
| Roster rules, group colours | `domain/roster.ts` |
| Class list format | `domain/rosterFormat.ts` |
| The kept record of an ended class | `domain/records.ts` |
| Weeks and months on the school's clock | `domain/periods.ts` |
| What class data is cleared and when: a date range, the end of the school year | `domain/retention.ts` |
| Cumulative results of a class list over a period, and what anyone may see of them: group totals, one student's own line | `domain/standings.ts` |
| What each kind of caller may read | `domain/visibility.ts` |
| Who may give a heart (the teacher's, live or ended; a student's, live only); the teacher taking one away, and her next heart giving a taken one back first | `domain/rewards.ts` |
| Who is let into a class, one device per name, who joins the roll when a device is let in (a shared device brings its whole group), and where a returning device lands | `domain/admission.ts` |
| Who is here: the roll, and who counts in tallies and scores | `domain/attendance.ts` |
| A session's minimum of interactions, and who is unresponsive | `domain/engagement.ts` |
| A class session: live or ended, starting one, which one a page shows, and what a running class keeps from being removed (its class list, teacher, lesson) | `domain/sessions.ts` |
| The list of teachers | `domain/teachers.ts` |
| Session codes: making and reading one | `domain/ids.ts` |
| Who is asking: the admin or not, and which device | `ports/caller.ts` |
| Is this the admin | `services/AuthService.ts` |
| What the UI may ask of the app: the one table `UI_SURFACE` of method names per service | `services/Services.ts` |
| What an argument or a record sent to the server may look like (the server refuses anything else) | `domain/argumentChecks.ts` (small checkers), `domain/entityChecks.ts` (whole records), `services/surfaceShapes.ts` (per method) |
| Whether a method only reads or also writes (the day's limit goes by it) | `services/surfaceEffects.ts` |
| How the data services are wired together | `services/createDataServices.ts` |
| Addresses and links | `ui/routing/routes.ts` |
| Which hub every request goes to, and where it was made | `server/hubName.ts` |
| Where the hub runs (the data centre), asked once and kept | `ports/hubPlace.ts`, `server/TracedPlace.ts`, read by `services/HubPlaceService.ts`; the places' names in `i18n/home.ts` |
| The note at the foot of the home page and the dot that says where the hub runs | `ui/pages/HomePage.tsx` (`DataNote`), look in `ui/pages/home.css`; words `t.home.dataNote`, `t.home.hubPlace` |
| Whether the edit panel shows | `ui/shell/AdminPanel.tsx` |
| The pearl and its panel over the slide's corner (groups, answered marks, hearts) | `ui/session/pearlPanel/`; how a teacher's heart is given or taken: `ui/hooks/useTeacherHearts.ts`, drawn by `ui/common/HeartButton.tsx` |
| Settings (the page's storage name and the browser-only switch; the real admin password and key are Worker secrets, never in the page) | `app/config.ts` |
| When students' data is cleared at the end of the school year (the setting) | `services/RetentionService.ts`, edited on the results page |
| Colours, fonts, radii, and the colours of each look (one block per pearl; `ui/styles/tokens.test.ts` keeps every look's text readable) | `ui/styles/tokens.css` |
| How the site record is changed: by a patch of the changed fields, merged where it is stored, sent together after a short pause in typing | `services/ContentService.ts` (`updateSite`), `domain/entityChecks.ts` (`isSitePatch`), `ui/hooks/useSiteEdits.ts` (the one queue the home form and the look button share, and its pause) |
| The site's look: which looks exist, the default, the look to show (the site record's, or the one this device showed last while the record is on its way) | `domain/themes.ts`; remembered on the device by `ports/lookMemory.ts` and `infrastructure/StoredLook.ts`; put on the page by `main.tsx` at the start and `ui/shell/useSiteTheme.ts`; chosen with the pearl button `ui/shell/ThemePicker.tsx` and `themePicker.css` (opening and closing a list under a button, shared with the menu: `ui/shell/useDisclosure.ts`) |
| Shared controls | `ui/styles/controls.css` (`.btn`, `.input`) and `ui/styles/base.css` |
| Our own form widgets (drop-down, check box, file picker, number stepper, password field) and floating layers: component and look | `ui/forms/` (`Select`, `Checkbox`, `FilePicker`, `Stepper`, `PasswordField`), `ui/common/useAnchoredLayer.ts`, `ui/styles/widgets.css` (`PasswordField`'s look: `ui/forms/passwordField.css`) |
| The top bar's tabs: the list, one tab, and the menu that replaces the row of tabs on narrow screens | `ui/shell/NavLink.tsx` (list and tab), `ui/shell/NavMenu.tsx` and `navMenu.css` (menu and the width where it takes over) |
| Saying who answers a question (each student, or one answer for the group) | `ui/slides/ScopeBadge.tsx`; words `t.common.scope` |
| Teachers' names (home page, class start) | the `teachers` list, edited in `ui/session/TeachersPanel.tsx`; the panel's words `t.session.teachers` in `i18n/session.ts`; the home page line `teachersLine` in `i18n/home.ts` |
| AI instructions for lesson files | `i18n/lessonPrompt.ts` (the three stages are the teacher's own method in her words; the description of the file is generated from the slide-kind registry), its example lesson `i18n/lessonPromptExample.json` |

## 4. Rules you must never break

1. Respect the import column in section 3. Reason: each layer has one job.
2. All interface text lives in `src/i18n`, in Arabic, feminine address. No Arabic string in any other folder. Reason: one place to read and fix wording.
3. A rule (scoring, who may answer, pacing, limits, validation) lives only in `src/domain`, with a unit test: in `src/domain/domain.test.ts`, in a test file beside the module (such as `visibility.test.ts`), or in the service test `src/services/services.test.ts`. Before writing one, grep for the concern and extend its home. Reason: DRY, one home each.
4. The UI changes data only by calling a service from `useServices()`. Never write to the store directly. Reason: services check who is the admin.
5. Browser storage and network calls exist only in `src/infrastructure` (handed in by `src/app/container.ts`) and, on the server, `src/server`. Only `src/server` may import a Cloudflare package or `cloudflare:*`; nothing outside it imports `src/server`. Reason: swapping the backend must touch one place.
6. Styles use only the tokens (`var(--accent)` and the rest) in `src/ui/styles/tokens.css` (the only file where a colour literal may appear; shared building blocks live in `base.css` and `controls.css`), and logical properties (`inline-size`, `margin-inline-start`, never `left`, `right`, `width` for layout direction). No raw colours, no inline `style` except the existing `toneStyle` and bar widths. Reason: the site is right-to-left and must look consistent.
7. Add no dependency. Add no top-level folder. Reason: each is a long-term cost she cannot judge.
8. Never edit a protected file: `AGENTS.md`, `CLAUDE.md`, `.agents/**`, `docs/**`, `.github/**`, `.githooks/**`, `.guard/**`, `scripts/**`, `src/architecture.test.ts`, `vite.config.ts`, `vitest.e2e.config.ts`, `vitest.server.config.ts`, `tsconfig.json`, `tsconfig.server.json`, `wrangler.jsonc`, `src/server/**`, the `scripts` section of `package.json`, `src/infrastructure/vendor/**`, and the machinery of the browser tests: everything in `e2e/` except `e2e/steps/**`, `e2e/walkthrough.e2e.ts` and `e2e/firstRun.integration.ts`, where you add steps for what you build. A check fails if they change. Never run `npm run guard:accept`: it is for the maintainer.
9. Never weaken, skip, delete or rewrite a test or a check to make it pass (no `.skip`, no loosened expectation, no removed assertion, no `any` or `@ts-ignore` to silence types). Fix the code. A test may change only when she asked for different behaviour. The steps in `e2e/` are tests too: add steps, and change an existing one only where she asked for the page to behave or read differently.
10. To change or publish anything through git use only `npm run ship`, `npm run undo` and `npm run discard` (it throws away everything in this folder that is not on the site). Reading is free (`git status`, and `git --no-pager log`, `git --no-pager show`, `git --no-pager diff`: without `--no-pager` a long answer waits for a key and hangs), and `git restore <file>` throws away your own unshipped edit of a file. No other `git` command, never `--no-verify`, never force-push, never `git reset --hard`.
11. Never create or read `.env` files. Never print a secret or the admin password.
12. No dead code, no commented-out code, no comments that restate the code.
13. Keep it simple: no option, flag, layer or abstraction nobody asked for. One reason to change per module. Add by adding (a registry entry, a field in a list), not by editing every caller. A unit asks its direct collaborator, never reaches through it (`a.b.c.d`).
14. A change of structure (moving code, renaming) and a change of behaviour are separate: separate `ship`s.
15. The site runs on a server that the maintainer looks after. Requests about backup, restore, the database or the server go to the maintainer.
16. Data that is already stored is never lost or made unreadable. A new field on a stored record is optional (`optional(...)` in its shape in `domain/entityChecks.ts`, a default where it is read). Never rename or remove a stored field, never change stored records in bulk, never add a way to delete the students, groups, classes, lessons, answers or results that exist today; a new list she asks for may have its own remove, behind a `ConfirmButton`. Reason: her students' data has no undo; `npm run undo` brings back the site's code, not its data.
17. Who may see what never widens by accident. A command only the teacher gives starts with `requireAdmin`. What a student or a visitor may read is decided in `src/domain/visibility.ts`, with a test. A new feature never shows anything about a student (her name, any field of her record, her answers or results) to someone who cannot see it today. Everything on the site record (`SiteContent`) is public: every visitor reads it.
18. The server refuses every command it does not know. Each method the pages call is named in `UI_SURFACE`, tagged in `SURFACE_EFFECTS` and given the shapes of its arguments in `SURFACE_SHAPES` (section 3), and the shapes accept everything the pages really send, an unfinished draft included. A new or changed command is proven from the page on the real local server by a step in `e2e/firstRun.integration.ts`. Reason: the browser walkthrough runs without the server and cannot see a refused command; one such refusal already broke the live site.

## 5. Finishing a change

Her computer is slow, so the full check does not run on it. `npm run ship` runs a quick check here and sends the change to the online check on GitHub; only a change that passes there reaches the site, and one that fails leaves the site and its code untouched. Never run `npm run check`, `npm run test:server` or `npm run test:e2e` on this computer. `npm run typecheck` and `npm test` are quick and yours to use while you work.

1. Run `git status` and make sure every file it lists is one you meant to change or add; remove what is not. Then run `npm run ship -- "message"`. The message is one line, imperative, at most 65 characters, says what changed and why, never mentions AI or tools.
2. If the quick check fails, read the message: it says where the code belongs. Fix the code and ship again. Three failures in a row: run `npm run discard` and tell her in Arabic that it could not be done safely and should go to the maintainer.
3. Always run `npm run deployed` next and wait for its answer; it takes about five minutes and prints little while it waits. If it was stopped before it answered, run it again. Never tell her a change is on the site before it says `LIVE`. Its answer starts with one of:
   - `LIVE`: tell her in two or three Arabic sentences what changed and where to look on the site, then ask her: «التغيير الآن على الموقع، حدّثي الصفحة لتَرَيه. هل تريدين: 1) إبقاءه 2) التراجع عنه كله 3) إبقاء بعضه والتراجع عن بعضه؟». For 2 or 3 follow skill `undo`. If she does not choose, the change stays.
   - `NOT LIVE: the online check failed`: nothing reached the site. The answer lists what failed. Fix the code (never the check) and ship again; the new attempt replaces the old one. After three failed online checks for the same request, run `npm run discard` and tell her in Arabic that it could not be done safely and should go to the maintainer.
   - `NOT LIVE: the online check could not run` or `was cancelled`, or `NOT LIVE: … could not be published`: nothing is wrong with your change (GitHub could not start the check, a newer change took its place in the queue, or the site's code changed while yours was being checked). Run `npm run ship` again with the same message, then `npm run deployed`. The same answer a second time: tell her in Arabic it needs the maintainer, with the address it printed.
   - `NOT LIVE: … GitHub refused to publish it`: tell her in Arabic it needs the maintainer, with the address it printed. Do not ship again.
   - `NOT LIVE: … the deploy failed`, or any other `NOT LIVE`: the site may show the old version or a new one that does not work. Run `npm run undo`, then `npm run deployed` once more. `LIVE` now: the site is as it was before your change; tell her in Arabic that the change could not be put on the site and needs the maintainer, and give her the address the first answer printed. Not `LIVE`: tell her the site may not be working and that the maintainer is needed now, with that address. Do not ship the same change again.
   - `UNKNOWN`: run it again after a few minutes, three times at most. Still unknown: tell her you could not confirm it yet, that the change shows by itself once the online check passes, and give her the address it printed. Before you start her next change, run `npm run deployed` once more and act on its answer.
4. When she asks «ماذا غيّرتِ؟», answer in plain Arabic from what you did, as visible changes. No code, no file names.

## 6. When to stop and hand over

Most requests do not need the maintainer: wording, look, a new field, a new slide kind, a small new feature (also one that stores a new setting), a bug, an undo. She should not have to go back to the maintainer for those. Stop, change nothing, and tell her in Arabic this needs the maintainer, only when:

- the request is about passwords, the authenticator, signing in, the limits, backups or restore, the database or the server itself, GitHub or Cloudflare settings;
- it needs a protected file to change (rule 8) or a new dependency (rule 7);
- it would delete or rewrite data that is already stored, or show students' names, answers or results to someone who cannot see them today (rules 16 and 17);
- another rule in section 4 would have to be broken to do it;
- the online check fails three times for the same request, `npm run ship` stops because the same lines were changed elsewhere, `npm run ship`, `npm run undo` or `npm run discard` itself fails, or `npm run deployed` says the deploy failed (each after doing what section 5 says for it);
- after your two questions you still do not understand what she wants, or what she sees on the screen.

A request that is only too big is not a reason to hand over: split it (section 2, step 4).

Commands: `npm run dev` (run the site locally), `npm test`, `npm run typecheck`, `npm run ship -- "..."`, `npm run deployed`, `npm run undo`, `npm run discard`. (`npm run check` is the full check; it runs online, not on this computer.)
