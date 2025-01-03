import * as util from "../util.js";
import { AvatarSettings } from "./avatar-settings.js";
import { HidingSettings } from "./hiding-settings.js";
import { MovingSettings } from "./moving-settings.js";
import { OtherSettings } from "./other-settings.js";

function injectCSS(filename) {
  const head = document.getElementsByTagName("head")[0];
  const mainCss = document.createElement("link");
  mainCss.setAttribute("rel", "stylesheet");
  mainCss.setAttribute("type", "text/css");
  mainCss.setAttribute("href", "modules/pf2e-dorako-ux/styles/" + filename + ".css");
  mainCss.setAttribute("media", "all");
  head.insertBefore(mainCss, head.lastChild);
}

export function refreshChat() {
  if (game.messages.size > 100) {
    return ui.notifications.warn(game.i18n.localize("pf2e-dorako-ux.text.large-chatlog-warning"));
  }
  const messages = game.messages.filter((m) => m instanceof ChatMessage);
  for (const message of messages) {
    ui.chat.updateMessage(message);
  }
}

Hooks.once("init", async () => {
  util.debug("init");

  AvatarSettings.registerSettings();
  HidingSettings.registerSettings();
  MovingSettings.registerSettings();
  OtherSettings.registerSettings();

  util.debug("registered settings");

  util.debug("initialized properties");

  // Also update in /avatar-settings.js#35
  const avatar = game.settings.get("pf2e-dorako-ux", "avatar.source")
  if (avatar !== "system") {
    document.documentElement.style.setProperty('--systemAvatarDisplay', 'none');
    document.documentElement.style.setProperty('--systemAvatarLayout', 'flex');
  }
});
