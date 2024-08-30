import { debug } from "../util.js";
import { MODULE_NAME } from "../consts.js";
import ChatMerge from "../dorako-ux/chat-merge.js";
import ChatRollPrivacy from "../dorako-ux/chat-rolltype-buttons.js";

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
  document.getElementById("ui-bottom").classList.add("centered");
});

Hooks.once("ready", () => {
  if (game.settings.get("pf2e-dorako-ux", "hiding.no-logo")) {
    $("#logo")[0].style.setProperty("display", "none", "important");
  }
});

Hooks.once("ready", () => {
  if (game.settings.get("pf2e-dorako-ux", "hiding.no-compendium-banner-images")) {
    $("body").addClass("no-compendium-banner-images");
  }
});

Hooks.on("renderChatLogPF2e", (app, html, data) => {
  if (game.settings.get("pf2e-dorako-ux", "hiding.no-chat-control-icon")) {
    html.find("#chat-controls")[0].classList.add("no-chat-control-icon");
  }
});

Hooks.once("renderSidebar", () => {
  const noCards = game.settings.get("pf2e-dorako-ux", "hiding.no-cards");
  if (!noCards) return;
  $(".item[data-tab=cards]").addClass("dorako-display-none");
});

Hooks.once("init", async () => {
  debug(`INIT`);
  debug(`REGISTERING SETTINGS`);
  debug(`INITIALIZING APPLICATIONS`);

  if (game.settings.get("pf2e-dorako-ux", "moving.chat-merge")) {
    ChatMerge.init();
  }

  if (game.settings.get("pf2e-dorako-ux", "moving.adjust-chat-controls")) {
    ChatRollPrivacy.setup();
    ChatRollPrivacy.init();
  }

  debug(`INJECTING CSS VARIABLES`);
  injectCSS("fonts");

  const root = document.querySelector(":root").style;

  root.setProperty("--avatar-size", game.settings.get("pf2e-dorako-ux", "avatar.size").toString() + "px");
  root.setProperty("--control-size", game.settings.get("pf2e-dorako-ux", "other.control-size").toString() + "px");
  root.setProperty(
    "--sidebar-tab-size",
    game.settings.get("pf2e-dorako-ux", "other.sidebar-tab-size").toString() + "px"
  );
  root.setProperty("--controls-alignment", game.settings.get("pf2e-dorako-ux", "moving.controls-alignment").toString());

  debug(`INIT COMPLETE`);
});

Hooks.once("ready", (app, html, data) => {
  if (!game.settings.get(`${MODULE_NAME}`, "hiding.start-sidebar-collapsed")) return;
  ui.sidebar.collapse();
});

Hooks.once("ready", async (app, html, data) => {
  if (!game.settings.get(`${MODULE_NAME}`, "hiding.start-navigation-collapsed")) return;
  await new Promise((r) => setTimeout(r, 100));
  ui.nav.collapse();
});

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
          new Actor({ name: game.user.name, type: "character" }); // Dummy actor fallback

        await new sheet.document.constructor(json, { parent: actor }).toChat();
      }
    },
  });
});

Hooks.on("renderCombatTracker", addScalingToCombatTrackerAvatars);

function addScalingToCombatTrackerAvatars(app, html, data) {
  const combatImagesActive = game.modules.get("combat-tracker-images")?.active;
  $(".combatant", html).each(function () {
    let id = this.dataset.combatantId;
    let combatant = game.combat.combatants.get(id);
    let scale = combatant.token.texture.scaleX;
    let tokenImageElem = this.getElementsByClassName("token-image")[0];
    if (scale < 1 || (combatImagesActive && combatant.actor.getFlag("combat-tracker-images", "trackerImage"))) {
      scale = 1;
    }
    tokenImageElem.setAttribute("style", "transform: scale(" + Math.abs(scale) + ")");
  });
}

for (const appName of ["JournalSheet", "JournalPageSheet"]) {
  Hooks.on("render" + appName, (app, html, data) => {
    const isDalvyn = game.settings.get("pf2e-dorako-ux", "other.skin-crb-journal");
    if (!isDalvyn) return;
    if (app.id.includes("Compendium-pf2e-criticaldeck")) return;
    html.closest(".app").find(".journal-entry-content").addClass("dalvyn-journal");
  });
}
