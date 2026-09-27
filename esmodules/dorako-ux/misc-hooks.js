import { i18n, debug } from "../util.js";

Hooks.once("ready", () => {
  debug("ready");
});

// Section headers, inserted before the first setting of each namespace
const SETTINGS_HEADERS = {
  avatar: "avatar.source",
  hiding: "hiding.no-cards",
  moving: "moving.restructure-npc-sheets",
  other: "other.enable-rolltype-indication",
};

Hooks.on("renderSettingsConfig", (app, html) => {
  for (const [menu, firstSetting] of Object.entries(SETTINGS_HEADERS)) {
    const formGroup = html.querySelector(`[name="pf2e-dorako-ux.${firstSetting}"]`)?.closest("div.form-group");
    if (!formGroup || formGroup.previousElementSibling?.classList.contains("settings-header")) continue;

    const header = document.createElement("div");
    header.classList.add("form-group", "dorako", "settings-header");
    header.append(i18n(`pf2e-dorako-ux.settings.menu.${menu}.name`));
    const hint = document.createElement("p");
    hint.classList.add("hint");
    hint.textContent = i18n(`pf2e-dorako-ux.settings.menu.${menu}.hint`);
    header.append(hint);
    formGroup.before(header);
  }
});
