import { debug, setCardsTabHidden, setChatControlIconHidden, setLogoHidden } from "../util.js";
import { MODULE_NAME } from "../consts.js";
import ChatMerge from "../dorako-ux/chat-merge.js";

function injectCSS(filename) {
  const head = document.getElementsByTagName("head")[0];
  const mainCss = document.createElement("link");
  mainCss.setAttribute("rel", "stylesheet");
  mainCss.setAttribute("type", "text/css");
  mainCss.setAttribute("href", "modules/pf2e-dorako-ux/styles/" + filename + ".css");
  mainCss.setAttribute("media", "all");
  head.insertBefore(mainCss, head.lastChild);
}

Hooks.once("ready", () => {
  if (!game.settings.get("pf2e-dorako-ux", "moving.center-hotbar")) return;
  document.getElementById("ui-bottom")?.classList.add("centered");
});

Hooks.once("ready", () => {
  if (game.settings.get("pf2e-dorako-ux", "hiding.no-logo")) setLogoHidden(true);
});

Hooks.once("ready", () => {
  if (game.settings.get("pf2e-dorako-ux", "hiding.no-compendium-banner-images")) {
    document.body.classList.add("no-compendium-banner-images");
  }
});

Hooks.on("renderChatLog", () => {
  if (game.settings.get("pf2e-dorako-ux", "hiding.no-chat-control-icon")) setChatControlIconHidden(true);
});

Hooks.once("renderSidebar", () => {
  if (game.settings.get("pf2e-dorako-ux", "hiding.no-cards")) setCardsTabHidden(true);
});

Hooks.once("init", async () => {
  debug(`INIT`);
  debug(`REGISTERING SETTINGS`);
  debug(`INITIALIZING APPLICATIONS`);

  if (game.settings.get("pf2e-dorako-ux", "moving.chat-merge")) {
    ChatMerge.init();
  }

  debug(`INJECTING CSS VARIABLES`);
  injectCSS("fonts");

  const root = document.querySelector(":root").style;

  root.setProperty("--avatar-size", game.settings.get("pf2e-dorako-ux", "avatar.size").toString() + "px");
  root.setProperty("--dorako-control-size", game.settings.get("pf2e-dorako-ux", "other.control-size").toString() + "px");
  root.setProperty(
    "--dorako-sidebar-tab-size",
    game.settings.get("pf2e-dorako-ux", "other.sidebar-tab-size").toString() + "px"
  );
  root.setProperty("--controls-alignment", game.settings.get("pf2e-dorako-ux", "moving.controls-alignment").toString());

  debug(`INIT COMPLETE`);
});

Hooks.once("ready", () => {
  if (!game.settings.get(`${MODULE_NAME}`, "hiding.start-sidebar-collapsed")) return;
  ui.sidebar.collapse();
});

Hooks.once("ready", async () => {
  if (!game.settings.get(`${MODULE_NAME}`, "hiding.start-navigation-collapsed")) return;
  await new Promise((r) => setTimeout(r, 100));
  ui.nav.collapse();
});

// PF2e item sheets are still ApplicationV1, so this hook is unchanged
Hooks.on("getItemSheetPF2eHeaderButtons", (sheet, buttons) => {
  if (!game.settings.get(`${MODULE_NAME}`, "other.send-to-chat")) {
    return;
  }

  buttons.unshift({
    label: `${MODULE_NAME}.text.send-to-chat`,
    class: "send",
    icon: "fas fa-comment-alt",
    onclick: async () => {
      if (sheet.document.actor) {
        await sheet.document.toChat(); // Can post directly
      } else {
        const json = sheet.document.toJSON();
        const actor =
          canvas.tokens.controlled[0]?.actor ?? // Selected token's corresponding actor
          game.user?.character ?? // Assigned actor
          new Actor.implementation({ name: game.user.name, type: "character" }); // Dummy actor fallback

        await new sheet.document.constructor(json, { parent: actor }).toChat();
      }
    },
  });
});

Hooks.on("renderCombatTracker", addScalingToCombatTrackerAvatars);

function addScalingToCombatTrackerAvatars(app, html) {
  const combat = app.viewed ?? game.combat;
  if (!combat) return;
  const combatImagesActive = game.modules.get("combat-tracker-images")?.active;
  for (const combatantElem of html.querySelectorAll(".combatant[data-combatant-id]")) {
    const combatant = combat.combatants.get(combatantElem.dataset.combatantId);
    const tokenImageElem = combatantElem.querySelector(".token-image");
    if (!combatant || !tokenImageElem) continue;
    let scale = combatant.token?.texture.scaleX ?? 1;
    if (scale < 1 || (combatImagesActive && combatant.actor?.getFlag("combat-tracker-images", "trackerImage"))) {
      scale = 1;
    }
    tokenImageElem.style.transform = "scale(" + Math.abs(scale) + ")";
  }
}

for (const appName of ["JournalEntrySheet", "JournalEntryPageSheet"]) {
  Hooks.on("render" + appName, (app, html) => {
    const isDalvyn = game.settings.get("pf2e-dorako-ux", "other.skin-crb-journal");
    if (!isDalvyn) return;
    if (app.id.includes("Compendium-pf2e-criticaldeck")) return;
    html.querySelector(".journal-entry-content")?.classList.add("dalvyn-journal");
  });
}
