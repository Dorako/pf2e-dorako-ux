# PF2e Dorako UX: Foundry v14 + PF2e 8.x migration plan

Making the module work on Foundry v14 and the current PF2e system is mostly finishing the v13 migration that was left half-done (commit `7a8516b checkpoint`), plus a few v14 checks. PF2e 8.x is the line that supports v14; the 7.x releases were for v13.

Items marked **(verify)** could not be confirmed from the docs and need checking in a live v14 world.

---

## 1. Manifest (`module.json`)

- [ ] Set `compatibility` to `{ "minimum": "13", "verified": "14" }`.
- [ ] Set the `pf2e` relationship to at least `"minimum": "8.0.0"`.
- [ ] Remove the `swade` and `dnd5e` entries, or keep them only if you'll test those systems.
- [ ] Fix `download`, which still points at `v1.11.3`. The CI rewrites it on release, but fix it anyway.

## 2. Fix the crash first

- [ ] `esmodules/dorako-ux/customization.js:4` imports a default export from `chat-rolltype-buttons.js`, and everything in that file is commented out. On any Foundry version, that import error probably stops the whole of `customization.js` from loading: CSS variables, chat merge, hotbar, logo and more.
  - Delete the import and the `ChatRollPrivacy.setup()` / `ChatRollPrivacy.init()` calls, **or** restore the class. The rolltype buttons would need rewriting for the v13+ chat controls anyway.

## 3. Chat hooks (the biggest job): `message-hooks.js`, `chat-merge.js`

- [ ] **Switch `renderChatMessage` to `renderChatMessageHTML`.** The old hook was deprecated in v13, and the new one passes a plain `HTMLElement`, not jQuery.
  - `html.find(...)` becomes `html.querySelector(...)` / `html.querySelectorAll(...)`
  - `html[0]` becomes `html`
  - `$("<span>")` becomes `document.createElement("span")`
  - This also fixes the `insertAdjacentHTML`-on-a-jQuery-object bug at `message-hooks.js:183`.
- [ ] **Stop relying on the third hook argument (`messageData`).** Foundry issue #13701 reported that the context argument can be missing when a system overrides message rendering, and PF2e does. It's listed as fixed in 14.364, but it's safer to read everything from the message itself:
  - `message.whisper`, `message.blind`, `message.isRoll`, `message.author`, `message.author.name`, `message.whisper.length > 0`
- [ ] Fix `message-hooks.js:199`: `rolls > 0` compares an array with a number. Use `message.isRoll`.
- [ ] **Null-guard `actor`** in `addAvatarsToFlags` (`message-hooks.js:258` and `:270`). Messages with no actor currently throw.
- [ ] **(verify)** Check the header markup in a v14 world with PF2e 8.x. The code puts the avatar in `.message-header` and moves `.flavor-text` into `.message-content`; confirm those class names still exist.
- [ ] **(verify)** Retest the `--systemAvatarDisplay` hack. `.portrait.token` and `span.user` in `_chat-messages.scss` belong to the system's own avatar.

## 4. Remove jQuery from the rest of the code

### `customization.js`
- [ ] `$("#logo")[0].style` throws if `#logo` isn't there, and it is probably gone in v13+ **(verify)**. Use `document.getElementById("logo")?.style...`.
- [ ] **(verify)** `renderChatLogPF2e` and `#chat-controls`: the chat log and its controls were rebuilt in v13.
- [ ] `.item[data-tab=cards]`: the sidebar tabs are now `nav.tabs` buttons.
- [ ] `renderCombatTracker` now passes an `HTMLElement`; recheck `.combatant` and `.token-image`.
- [ ] `JournalSheet` / `JournalPageSheet` became `JournalEntrySheet` / `JournalEntryPageSheet` (ApplicationV2), so the `render*` hook names change.
- [ ] **(verify)** Check that `ui.nav.collapse()` and `ui.sidebar.collapse()` still exist in v14. The v13 sidebar uses `toggleExpanded`.
- [ ] **(verify)** The `getItemSheetPF2eHeaderButtons` hook only works while PF2e item sheets are still ApplicationV1. If PF2e 8.x moved them to ApplicationV2, use `getHeaderControlsItemSheetPF2e` instead.

### `misc-hooks.js`
- [ ] `renderSettingsConfig` is ApplicationV2 now. Rewrite the header injection with the DOM API.
- [ ] Point the "Moving" header at a setting that exists, such as `moving.restructure-npc-sheets`. It currently points at `moving.restructure-card-info`, which doesn't exist.

### `settings/hiding-settings.js`
- [ ] Replace the `$(...)` calls in the `onChange` handlers.

### `npc-sheet.js`
- [ ] Change `html[0]` to `html` and `app.object` to `app.actor`.
- [ ] **(verify)** Check that PF2e 8.x still fires `renderNPCSheetPF2e` and that `.armor-class` and `.health` still exist.

## 5. Namespaced globals

| Old | New |
|---|---|
| `mergeObject` (`menu.js`) | `foundry.utils.mergeObject` |
| `FormApplication` (`menu.js`) | `foundry.applications.api.HandlebarsApplicationMixin(ApplicationV2)`, or delete `getData` / `_updateObject`, since `registerMenu` is never called |
| `Token.prototype` | `foundry.canvas.placeables.Token.prototype` |
| `loadTexture` | `foundry.canvas.loadTexture` |
| `renderTemplate` | `foundry.applications.handlebars.renderTemplate` |

- [ ] Fix `menu.js:548`, which points at `modules/pf2e-dorako-ui/templates/menu.hbs`.
- [ ] Fix the `pf2e-dorako-ui.settings.reset-changes` localization key in `templates/menu.hbs:975`.

## 6. Radial effects HUD (`radial-condition-hud.js`), the riskiest part

- [x] ~~Signature change~~: checked against the Foundry 14.368 source. `_drawEffect(src, tint)` still returns `Promise<PIXI.Sprite>`, and `effects.bg` and `effects.overlay` still exist. PF2e 8.5.1 overrides only `_drawEffects` and calls `super`, so the override still applies. Namespaced in steps 1–5.
- [ ] Test in a v14 world: effect icons on small, medium, large and huge tokens, the overlay (dead) icon, and hex grids.

## 7. SCSS, then recompile `styles/dorako-ux.css`

- [ ] `_dfce.scss`, `_moving.scss` (`nav#controls`, `ol.control-tools`) and `_resizer.scss` (`#sidebar-tabs`) target v12 markup. The controls and sidebar were rebuilt in v13, so rewrite these selectors.
- [ ] `_compact-ui.scss` and `#ui-bottom.centered` are already updated for v13; just retest them.
- [ ] Optional: v14 deprecates `CONFIG.fontFamilies`. Injecting `fonts.css` still works, but you can register the fonts through `CONFIG.fontDefinitions` if you want them in Foundry's font pickers.

## 8. Test in a real v14 world

Install PF2e 8.x, keep the browser console open, and watch for deprecation warnings while you:

- [ ] send a public roll, a whisper, a blind GM roll and a self roll
- [ ] make an attack, then a damage roll
- [ ] cast a spell
- [ ] apply conditions to a token
- [ ] open an NPC sheet
- [ ] open a journal
- [ ] open the combat tracker

---

Most of this is mechanical except steps 3 and 6, which need a running v14 world to get right.

## Sources

- [Foundry v14 API docs](https://foundryvtt.com/api/)
- [Token v14 API](https://foundryvtt.com/api/classes/foundry.canvas.placeables.Token.html)
- [renderChatMessageHTML v14](https://foundryvtt.com/api/functions/hookEvents.renderChatMessageHTML.html)
- [renderChatMessage deprecation (ac2d20 #172)](https://github.com/Muttley/foundryvtt-ac2d20/issues/172)
- [Foundry issue #13701](https://github.com/foundryvtt/foundryvtt/issues/13701)
- [PF2e v14-dev changelog](https://github.com/foundryvtt/pf2e/blob/v14-dev/CHANGELOG.md)
- [PF2e releases](https://github.com/foundryvtt/pf2e/releases)
- [Foundry v14 release notes (14.359)](https://foundryvtt.com/releases/14.359)
- [FoundryVTT.store v14 news](https://www.foundryvtt.store/news/2026-04-01-foundry-vtt-v14)
