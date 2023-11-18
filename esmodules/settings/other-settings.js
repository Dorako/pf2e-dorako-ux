import { SettingsMenuDorakoUX } from "./menu.js";

export class OtherSettings extends SettingsMenuDorakoUX {
  static namespace = "other";

  static SETTINGS = [
    "enable-rolltype-indication",
    "enable-player-tags",
    "control-size",
    "send-to-chat",
    "skin-crb-journal",
  ];

  rerenderChatMessages() {}

  static get settings() {
    return {
      "send-to-chat": {
        name: "pf2e-dorako-ux.settings.send-to-chat.name",
        hint: "pf2e-dorako-ux.settings.send-to-chat.hint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
        requiresReload: false,
      },
      "skin-crb-journal": {
        name: "pf2e-dorako-ux.settings.skin-crb-journal.name",
        hint: "pf2e-dorako-ux.settings.skin-crb-journal.hint",
        scope: "world",
        type: Boolean,
        default: false,
        config: true,
        requiresReload: false,
      },
      "control-size": {
        name: "pf2e-dorako-ux.settings.control-size.name",
        hint: "pf2e-dorako-ux.settings.control-size.hint",
        scope: "client",
        type: Number,
        default: 36,
        range: {
          min: 18,
          max: 72,
          step: 1,
        },
        config: true,
        requiresReload: false,
        onChange: (value) => {
          const root = document.querySelector(":root").style;
          root.setProperty("--control-size", `${value}px`);
        },
      },
      "enable-player-tags": {
        name: "pf2e-dorako-ux.settings.enable-player-tags.name",
        hint: "pf2e-dorako-ux.settings.enable-player-tags.hint",
        scope: "client",
        config: true,
        default: true,
        type: Boolean,
        requiresReload: false,
        onChange: () => {
          const messages = game.messages.filter((m) => m instanceof ChatMessage);
          for (const message of messages) {
            ui.chat.updateMessage(message);
          }
        },
      },
      "enable-rolltype-indication": {
        name: "pf2e-dorako-ux.settings.enable-rolltype-indication.name",
        hint: "pf2e-dorako-ux.settings.enable-rolltype-indication.hint",
        scope: "client",
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
    };
  }
}
