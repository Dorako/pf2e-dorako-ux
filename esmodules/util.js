import { MODULE_NAME } from "./consts.js";

export function getSetting(key, localize = false) {
  return game.settings.get(MODULE_NAME, key);
}

export function setSetting(key, value) {
  return game.settings.set(MODULE_NAME, key, value);
}

export function log(message) {
  message = `${MODULE_NAME} | ${message}`;
  console.log(message.replace("<br>", "\n"));
  return message;
}

export function debug(message) {
  message = `${MODULE_NAME} | ${message}`;
  console.debug(message.replace("<br>", "\n"));
  return message;
}

export function info(message, notify = false) {
  message = `${MODULE_NAME} | ${message}`;
  if (notify) ui.notifications?.info(message);
  console.log(message.replace("<br>", "\n"));
  return message;
}

export function warn(warning, notify = false) {
  warning = `${MODULE_NAME} | ${warning}`;
  if (notify) ui.notifications?.warn(warning);
  console.warn(warning.replace("<br>", "\n"));
  return warning;
}

export function error(error, notify = true) {
  error = `${MODULE_NAME} | ${error}`;
  if (notify) ui.notifications?.error(error);
  return new Error(error.replace("<br>", "\n"));
}

export function i18n(key) {
  return game.i18n.localize(key)?.trim();
}

export function i18nFormat(key, data) {
  return game.i18n.format(key, data)?.trim();
}

export function titleCase(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

// The Foundry logo was removed in V13, so this only matters if another module re-adds it
export function setLogoHidden(hidden) {
  const logo = document.getElementById("logo");
  if (!logo) return;
  if (hidden) logo.style.setProperty("display", "none", "important");
  else logo.style.removeProperty("display");
}

export function setCardsTabHidden(hidden) {
  const tab = document.querySelector('#sidebar nav.tabs button[data-tab="cards"]')?.closest("li");
  tab?.classList.toggle("dorako-display-none", hidden);
}

export function setChatControlIconHidden(hidden) {
  document.getElementById("chat-controls")?.classList.toggle("no-chat-control-icon", hidden);
}
