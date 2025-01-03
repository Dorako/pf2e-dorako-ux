import { SettingsMenuDorakoUX } from "./menu.js";
import { refreshChat } from "./settings.js";

export class AvatarSettings extends SettingsMenuDorakoUX {
  static namespace = "avatar";

  static SETTINGS = [
    "source",
    "hide-when-token-hidden",
    "hide-gm-avatar-when-secret",
    "size",
    "popout-support",
    "reacts-to-degree-of-success",
    "small-creature-token-avatar-size",
    "use-user-avatar",
  ];

  static get settings() {
    return {
      source: {
        name: "pf2e-dorako-ux.settings.avatar-source.name",
        hint: "pf2e-dorako-ux.settings.avatar-source.hint",
        scope: "client",
        config: true,
        default: "token",
        type: String,
        choices: {
          token: "pf2e-dorako-ux.settings.avatar-source.choice.token",
          actor: "pf2e-dorako-ux.settings.avatar-source.choice.actor",
          system: "pf2e-dorako-ux.settings.avatar-source.choice.system",
          none: "pf2e-dorako-ux.text.disabled",
        },
        requiresReload: false,
        onChange: refreshChat,
        onChange: () => {
          // Also update in settings.js#39
          const root = document.querySelector(":root").style;
          root.setProperty('--systemAvatarDisplay', 'none');
          root.setProperty('--systemAvatarLayout', 'flex');
        },
      },
      size: {
        name: "pf2e-dorako-ux.settings.avatar-size.name",
        hint: "pf2e-dorako-ux.settings.avatar-size.hint",
        scope: "client",
        type: Number,
        default: 40,
        range: {
          min: 10,
          max: 60,
          step: 1,
        },
        config: true,
        requiresReload: false,
        onChange: () => {
          const root = document.querySelector(":root").style;
          root.setProperty("--avatar-size", game.settings.get("pf2e-dorako-ux", "avatar.size").toString() + "px");
        },
      },
      "small-creature-token-avatar-size": {
        name: "pf2e-dorako-ux.settings.small-creature-token-avatar-size.name",
        hint: "pf2e-dorako-ux.settings.small-creature-token-avatar-size.hint",
        scope: "client",
        type: Number,
        default: 0.8,
        range: {
          min: 0.7,
          max: 1.0,
          step: 0.1,
        },
        config: true,
        requiresReload: false,
        onChange: refreshChat,
      },
      "popout-support": {
        name: "pf2e-dorako-ux.settings.popout-support.name",
        hint: "pf2e-dorako-ux.settings.popout-support.hint",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        requiresReload: false,
        onChange: refreshChat,
      },
      "reacts-to-degree-of-success": {
        name: "pf2e-dorako-ux.settings.avatar-reacts-to-degree-of-success.name",
        hint: "pf2e-dorako-ux.settings.avatar-reacts-to-degree-of-success.hint",
        scope: "client",
        type: Boolean,
        default: true,
        config: true,
        requiresReload: false,
        onChange: refreshChat,
      },
      "hide-when-token-hidden": {
        name: "pf2e-dorako-ux.settings.hide-avatar-when-token-hidden.name",
        hint: "pf2e-dorako-ux.settings.hide-avatar-when-token-hidden.hint",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        requiresReload: false,
        onChange: refreshChat,
      },
      "hide-gm-avatar-when-secret": {
        name: "pf2e-dorako-ux.settings.hide-gm-avatar-when-secret.name",
        hint: "pf2e-dorako-ux.settings.hide-gm-avatar-when-secret.hint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
        requiresReload: false,
        onChange: refreshChat,
      },
      "use-user-avatar": {
        name: "pf2e-dorako-ux.settings.use-user-avatar.name",
        hint: "pf2e-dorako-ux.settings.use-user-avatar.hint",
        scope: "world",
        type: Boolean,
        default: false,
        config: true,
        requiresReload: false,
        onChange: refreshChat,
      },
    };
  }
}
