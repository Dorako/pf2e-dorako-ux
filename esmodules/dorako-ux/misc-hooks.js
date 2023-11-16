import { i18n, debug, warn } from "../util.js";

Hooks.once("ready", () => {
  debug("ready");
});

Hooks.on("renderSettingsConfig", (app, html, data) => {
  $("<div>")
    .addClass("form-group dorako settings-header")
    .html(
      i18n("pf2e-dorako-ux.settings.menu.avatar.name") +
        `<p class="notes">${i18n("pf2e-dorako-ux.settings.menu.avatar.hint")}</p>`
    )
    .insertBefore($('[name="pf2e-dorako-ux.avatar.source"]').parents("div.form-group:first"));
  $("<div>")
    .addClass("form-group dorako settings-header")
    .html(
      i18n("pf2e-dorako-ux.settings.menu.hiding.name") +
        `<p class="notes">${i18n("pf2e-dorako-ux.settings.menu.hiding.hint")}</p>`
    )
    .insertBefore($('[name="pf2e-dorako-ux.hiding.no-cards"]').parents("div.form-group:first"));
  $("<div>")
    .addClass("form-group dorako settings-header")
    .html(
      i18n("pf2e-dorako-ux.settings.menu.moving.name") +
        `<p class="notes">${i18n("pf2e-dorako-ux.settings.menu.moving.hint")}</p>`
    )
    .insertBefore($('[name="pf2e-dorako-ux.moving.restructure-card-info"]').parents("div.form-group:first"));
  $("<div>")
    .addClass("form-group dorako settings-header")
    .html(
      i18n("pf2e-dorako-ux.settings.menu.other.name") +
        `<p class="notes">${i18n("pf2e-dorako-ux.settings.menu.other.hint")}</p>`
    )
    .insertBefore($('[name="pf2e-dorako-ux.other.enable-rolltype-indication"]').parents("div.form-group:first"));
});
