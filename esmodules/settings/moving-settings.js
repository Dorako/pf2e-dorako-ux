import { SettingsMenuDorakoUX } from "./menu.js";

export class MovingSettings extends SettingsMenuDorakoUX {
  static namespace = "moving";

  static SETTINGS = [
    "restructure-card-info",
    "restructure-npc-sheets",
    "chat-merge",
    "adjust-chat-controls",
    "compact-ui",
    "minimize-hotbar",
    "center-hotbar",
    "adjust-token-effects-hud",
    "animate-messages",
    "controls-alignment",
  ];

  rerenderChatMessages() {}

  static get settings() {
    return {
      "restructure-npc-sheets": {
        name: "pf2e-dorako-ux.settings.restructure-npc-sheets.name",
        hint: "pf2e-dorako-ux.settings.restructure-npc-sheets.hint",
        scope: "client",
        type: Boolean,
        default: true,
        config: true,
        requiresReload: false,
        onChange: (value) => {},
      },
      "chat-merge": {
        name: "pf2e-dorako-ux.settings.chat-merge.name",
        hint: "pf2e-dorako-ux.settings.chat-merge.hint",
        scope: "client",
        type: Boolean,
        default: false,
        config: true,
        requiresReload: true,
        onChange: (value) => {},
      },
      "adjust-chat-controls": {
        name: "pf2e-dorako-ux.settings.adjust-chat-controls.name",
        hint: "pf2e-dorako-ux.settings.adjust-chat-controls.hint",
        scope: "client",
        type: Boolean,
        default: true,
        config: true,
        requiresReload: true,
        onChange: (value) => {},
      },
      "center-hotbar": {
        name: "pf2e-dorako-ux.settings.center-hotbar.name",
        hint: "pf2e-dorako-ux.settings.center-hotbar.hint",
        scope: "client",
        type: Boolean,
        default: false,
        config: true,
        requiresReload: false,
        onChange: (value) => {
          if (value) {
            document.getElementById("ui-bottom").classList.add("centered");
          } else {
            document.getElementById("ui-bottom").classList.remove("centered");
          }
        },
      },
      "controls-alignment": {
        name: "pf2e-dorako-ux.settings.controls-alignment.name",
        hint: "pf2e-dorako-ux.settings.controls-alignment.hint",
        scope: "client",
        type: String,
        default: "start",
        choices: {
          start: "pf2e-dorako-ux.settings.controls-alignment.choice.start",
          center: "pf2e-dorako-ux.settings.controls-alignment.choice.center",
          end: "pf2e-dorako-ux.settings.controls-alignment.choice.end",
        },
        config: true,
        requiresReload: false,
        onChange: (value) => {
          const root = document.querySelector(":root").style;
          root.setProperty("--controls-alignment", value);
        },
      },
      "adjust-token-effects-hud": {
        name: "pf2e-dorako-ux.settings.adjust-token-effects-hud.name",
        hint: "pf2e-dorako-ux.settings.adjust-token-effects-hud.hint",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        requiresReload: true,
      },
      // "restructure-card-info": {
      //   name: "pf2e-dorako-ux.settings.restructure-card-info.name",
      //   hint: "pf2e-dorako-ux.settings.restructure-card-info.hint",
      //   scope: "world",
      //   type: Boolean,
      //   default: true,
      //   config: true,
      //   requiresReload: false,
      //   onChange: () => {
      //     const messages = game.messages.filter((m) => m instanceof ChatMessage);
      //     for (const message of messages) {
      //       ui.chat.updateMessage(message);
      //     }
      //   },
      // },
      "animate-messages": {
        name: "pf2e-dorako-ux.settings.animate-messages.name",
        hint: "pf2e-dorako-ux.settings.animate-messages.hint",
        scope: "world",
        type: Boolean,
        default: false,
        config: true,
        requiresReload: false,
        onChange: () => {
          const messages = game.messages.filter((m) => m instanceof ChatMessage);
          for (const message of messages) {
            ui.chat.updateMessage(message);
          }
        },
      },
      "compact-ui": {
        name: "pf2e-dorako-ux.settings.compact-ui.name",
        hint: "pf2e-dorako-ux.settings.compact-ui.hint",
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: true,
        onChange: (value) => {},
      },
      "minimize-hotbar": {
        name: "pf2e-dorako-ux.settings.minimize-hotbar.name",
        hint: "pf2e-dorako-ux.settings.minimize-hotbar.hint",
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: true,
        onChange: (value) => {},
      },
    };
  }
}
