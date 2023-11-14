import { SettingsMenuDorakoUX } from "./menu.js";

export class MovingSettings extends SettingsMenuDorakoUX {
  static namespace = "moving";

  static SETTINGS = [
    "restructure-card-info",
    "chat-merge",
    "adjust-chat-controls",
    "compact-ui",
    "center-hotbar",
    "adjust-token-effects-hud",
    "animate-messages",
    // "border-radius",
    // "control-size",
    "controls-alignment",
  ];

  rerenderChatMessages() {}

  static get settings() {
    return {
      "chat-merge": {
        name: "pf2e-dorako-ux.settings.moving.chat-merge.name",
        hint: "pf2e-dorako-ux.settings.moving.chat-merge.hint",
        scope: "client",
        type: Boolean,
        default: false,
        config: true,
        requiresReload: true,
        onChange: (value) => {},
      },
      "adjust-chat-controls": {
        name: "pf2e-dorako-ux.settings.moving.adjust-chat-controls.name",
        hint: "pf2e-dorako-ux.settings.moving.adjust-chat-controls.hint",
        scope: "client",
        type: Boolean,
        default: true,
        config: true,
        requiresReload: true,
        onChange: (value) => {},
      },
      "center-hotbar": {
        name: "pf2e-dorako-ux.settings.moving.center-hotbar.name",
        hint: "pf2e-dorako-ux.settings.moving.center-hotbar.hint",
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
      // "control-size": {
      //   name: "pf2e-dorako-ux.settings.moving.control-size.name",
      //   hint: "pf2e-dorako-ux.settings.moving.control-size.hint",
      //   scope: "client",
      //   type: Number,
      //   default: 36,
      //   range: {
      //     min: 18,
      //     max: 72,
      //     step: 1,
      //   },
      //   config: true,
      //   requiresReload: false,
      //   onChange: (value) => {
      //     const root = document.querySelector(":root").style;
      //     root.setProperty("--control-size", `${value}px`);
      //   },
      // },
      // "border-radius": {
      //   name: "pf2e-dorako-ux.settings.moving.border-radius.name",
      //   hint: "pf2e-dorako-ux.settings.moving.border-radius.hint",
      //   scope: "client",
      //   type: Number,
      //   default: 3,
      //   range: {
      //     min: 0,
      //     max: 48,
      //     step: 1,
      //   },
      //   config: true,
      //   requiresReload: false,
      //   onChange: (value) => {
      //     const root = document.querySelector(":root").style;
      //     root.setProperty("--border-radius", `${value}px`);
      //   },
      // },
      "controls-alignment": {
        name: "pf2e-dorako-ux.settings.moving.controls-alignment.name",
        hint: "pf2e-dorako-ux.settings.moving.controls-alignment.hint",
        scope: "client",
        type: String,
        default: "start",
        choices: {
          start: "pf2e-dorako-ux.settings.moving.controls-alignment.choice.start",
          center: "pf2e-dorako-ux.settings.moving.controls-alignment.choice.center",
          end: "pf2e-dorako-ux.settings.moving.controls-alignment.choice.end",
        },
        config: true,
        requiresReload: false,
        onChange: (value) => {
          const root = document.querySelector(":root").style;
          root.setProperty("--controls-alignment", value);
        },
      },
      "adjust-token-effects-hud": {
        name: "pf2e-dorako-ux.settings.moving.adjust-token-effects-hud.name",
        hint: "pf2e-dorako-ux.settings.moving.adjust-token-effects-hud.hint",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        requiresReload: true,
      },
      "restructure-card-info": {
        name: "pf2e-dorako-ux.settings.moving.restructure-card-info.name",
        hint: "pf2e-dorako-ux.settings.moving.restructure-card-info.hint",
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
      "animate-messages": {
        name: "pf2e-dorako-ux.settings.moving.animate-messages.name",
        hint: "pf2e-dorako-ux.settings.moving.animate-messages.hint",
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
        name: "pf2e-dorako-ux.settings.moving.compact-ui.name",
        hint: "pf2e-dorako-ux.settings.moving.compact-ui.hint",
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: false,
        onChange: (value) => {
          if (value) {
            $("body").addClass("compact-ui");
          } else {
            $("body").removeClass("compact-ui");
          }
        },
      },
    };
  }
}
