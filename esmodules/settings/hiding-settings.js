import { SettingsMenuDorakoUX } from "./menu.js";

export class HidingSettings extends SettingsMenuDorakoUX {
  static namespace = "hiding";

  static SETTINGS = [
    "no-cards",
    "no-chat-control-icon",
    "no-logo",
    "remove-attack-info-from-damage-roll-messages",
    "start-sidebar-collapsed",
    "start-navigation-collapsed",
    "no-compendium-banner-images",
  ];

  rerenderChatMessages() {}

  static get settings() {
    return {
      "restructure-card-info": {
        name: "pf2e-dorako-ux.settings.restructure-card-info.name",
        hint: "pf2e-dorako-ux.settings.restructure-card-info.hint",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        requiresReload: false,
        onChange: () => {
          const messages = game.messages.filter((m) => m instanceof ChatMessage);
          for (const message of messages) {
            ui.chat.updateMessage(message);
          }
        },
      },
      "remove-attack-info-from-damage-roll-messages": {
        name: "pf2e-dorako-ux.settings.remove-attack-info-from-damage-roll-messages.name",
        hint: "pf2e-dorako-ux.settings.remove-attack-info-from-damage-roll-messages.hint",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        requiresReload: false,
        onChange: () => {
          const messages = game.messages.filter((m) => m instanceof ChatMessage);
          for (const message of messages) {
            ui.chat.updateMessage(message);
          }
        },
      },
      "start-sidebar-collapsed": {
        name: "pf2e-dorako-ux.settings.start-sidebar-collapsed.name",
        hint: "pf2e-dorako-ux.settings.start-sidebar-collapsed.hint",
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: false,
      },
      "start-navigation-collapsed": {
        name: "pf2e-dorako-ux.settings.start-navigation-collapsed.name",
        hint: "pf2e-dorako-ux.settings.start-navigation-collapsed.hint",
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: false,
      },
      "no-compendium-banner-images": {
        name: "pf2e-dorako-ux.settings.no-compendium-banner-images.name",
        hint: "pf2e-dorako-ux.settings.no-compendium-banner-images.hint",
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: false,
        onChange: (value) => {
          $("#sidebar").toggleClass("no-compendium-banner-images");
        },
      },
      "no-logo": {
        name: "pf2e-dorako-ux.settings.no-logo.name",
        hint: "pf2e-dorako-ux.settings.no-logo.hint",
        scope: "client",
        config: true,
        default: true,
        type: Boolean,
        requiresReload: false,
        onChange: (value) => {
          if (value) {
            $("#logo")[0].style.setProperty("display", "none", "important");
          } else {
            $("#logo")[0].style.setProperty("display", "unset");
          }
        },
      },
      "no-chat-control-icon": {
        name: "pf2e-dorako-ux.settings.no-chat-control-icon.name",
        hint: "pf2e-dorako-ux.settings.no-chat-control-icon.hint",
        scope: "client",
        config: true,
        default: true,
        type: Boolean,
        requiresReload: false,
        onChange: (value) => {
          if (value) {
            $("#chat-controls")[0].classList.add("no-chat-control-icon");
          } else {
            $("#chat-controls")[0].classList.remove("no-chat-control-icon");
          }
        },
      },
      "no-cards": {
        name: "pf2e-dorako-ux.settings.no-cards.name",
        hint: "pf2e-dorako-ux.settings.no-cards.hint",
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: false,
        onChange: (value) => {
          if (value) {
            $(".item[data-tab=cards]").addClass("dorako-display-none");
          } else {
            $(".item[data-tab=cards]").removeClass("dorako-display-none");
          }
        },
      },
    };
  }
}
