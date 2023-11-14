import { i18n, debug, warn } from "../util.js";

Hooks.once("ready", () => {
  debug("ready");
});

Hooks.on("renderSettingsConfig", (app, html, data) => {
  $("<div>")
    .addClass("form-group dorako settings-header")
    .html(
      i18n("pf2e-dorako-ux.settings.avatar.name") +
        `<p class="notes">${i18n("pf2e-dorako-ux.settings.avatar.hint")}</p>`
    )
    .insertBefore($('[name="pf2e-dorako-ux.avatar.source"]').parents("div.form-group:first"));
  $("<div>")
    .addClass("form-group dorako settings-header")
    .html(
      i18n("pf2e-dorako-ux.settings.hiding.name") +
        `<p class="notes">${i18n("pf2e-dorako-ux.settings.hiding.hint")}</p>`
    )
    .insertBefore($('[name="pf2e-dorako-ux.hiding.no-cards"]').parents("div.form-group:first"));
  $("<div>")
    .addClass("form-group dorako settings-header")
    .html(
      i18n("pf2e-dorako-ux.settings.moving.name") +
        `<p class="notes">${i18n("pf2e-dorako-ux.settings.moving.hint")}</p>`
    )
    .insertBefore($('[name="pf2e-dorako-ux.moving.restructure-card-info"]').parents("div.form-group:first"));
  $("<div>")
    .addClass("form-group dorako settings-header")
    .html(
      i18n("pf2e-dorako-ux.settings.other.name") + `<p class="notes">${i18n("pf2e-dorako-ux.settings.other.hint")}</p>`
    )
    .insertBefore($('[name="pf2e-dorako-ux.other.enable-rolltype-indication"]').parents("div.form-group:first"));
});
