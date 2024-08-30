import { i18n } from "./util.js";
import { Avatar, ActorAvatar, TokenAvatar, CombatantAvatar } from "./consts.js";

const rgb2hex = (rgb) =>
  `#${rgb
    .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    .slice(1)
    .map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
    .join("")}`;

// Remove system avatar changes
Hooks.on("renderChatMessage", (app, html, data) => {
  const source = game.settings.get("pf2e-dorako-ux", "avatar.source");
  if (source === "none" || source === "system") return;
  // Be after system hack
  setTimeout(() => {
    const messageHeader = html[0].getElementsByClassName("message-header")[0];
    if (messageHeader) {
      messageHeader.classList.remove("with-image");
    }
    const systemAvatar = html[0].getElementsByClassName("portrait")[0];
    if (systemAvatar) {
      systemAvatar.style.display = "none";
    }
    const systemUserTag = html[0].getElementsByClassName("user")[0];
    if (systemUserTag) {
      systemUserTag.style.display = "none";
    }
  }, 0);
});

// Chat cards
Hooks.on("renderChatMessage", (chatMessage, html, messageData) => {
  const isNarratorToolsMessage = chatMessage.flags["narrator-tools"];
  const isMLDRoundMarker = chatMessage.flags["monks-little-details"]?.roundmarker;
  const isMCDRoundMarker = chatMessage.flags["monks-combat-details"]?.roundmarker;
  const isRoundMarker = isMLDRoundMarker || isMCDRoundMarker;
  if (isNarratorToolsMessage || isRoundMarker) {
    return;
  }

  injectSenderWrapper(html, messageData);
  injectMessageTag(html, messageData);
  injectWhisperParticipants(html, messageData);
  injectAuthorName(html, messageData);

  if (
    (game.settings.get("pf2e-dorako-ux", "avatar.hide-when-token-hidden") &&
      chatMessage.getFlag("pf2e-dorako-ux", "wasTokenHidden")) ||
    (game.settings.get("pf2e-dorako-ux", "avatar.hide-gm-avatar-when-secret") && !chatMessage.isContentVisible)
  ) {
    // do nothing
  } else {
    injectAvatar(html, getAvatar(chatMessage));
  }
  moveFlavorTextToContents(html);
});

// Is damage roll
Hooks.on("renderChatMessage", (chatMessage, html, messageData) => {
  if (!game.settings.get("pf2e-dorako-ux", "hiding.remove-attack-info-from-damage-roll-messages")) return;

  if (chatMessage?.isDamageRoll && chatMessage?.item?.type !== "spell") {
    html[0].classList.add("dorako-damage-roll");
    let flavor = html.find(".flavor-text");
    flavor.each(function () {
      $(this).contents().eq(1).wrap("<span/>");
    });
  }
});

// Is check roll
Hooks.on("renderChatMessage", (chatMessage, html, messageData) => {
  if (!game.settings.get("pf2e-dorako-ux", "hiding.remove-attack-info-from-damage-roll-messages")) return;

  if (chatMessage?.isCheckRoll) {
    html.addClass("dorako-check-roll");
  }
});

// "Be last" magic trick. Should ensure that any other modules that modify, say, who spoke the message, have done so before you add the flags.
Hooks.once("ready", () => {
  Hooks.on("preCreateChatMessage", (message) => {
    addAvatarsToFlags(message);
    message.updateSource({
      "flags.pf2e-dorako-ux.wasTokenHidden": message?.token?.hidden,
    });
  });

  Hooks.on("updateChatMessage", (message) => {
    addAvatarsToFlags(message, false);
  });

  Hooks.on("renderChatMessage", (app, html, data) => {
    const isKoboldWorksTurnAnnouncerMessage = app.flags["koboldworks-turn-announcer"];
    if (!isKoboldWorksTurnAnnouncerMessage) return;

    const avatar = html.find(".portrait");
    avatar.css("transform", `scale(${app.flags["pf2e-dorako-ux"]?.tokenAvatar.scale})`);
    avatar.css("flex", `0px 0px var(--avatar-size)`);
    avatar.css("height", `var(--avatar-size)`);
    avatar.css("width", `var(--avatar-size)`);
  });
});

function moveFlavorTextToContents(html) {
  let flavor = html.find(".flavor-text")[0];
  let contents = html.find(".message-content")[0];
  if (flavor) contents.prepend(flavor);
}

function injectSenderWrapper(html, messageData) {
  if (messageData.author === undefined) return;
  var target = html.find(".message-sender")[0];
  var wrapper = document.createElement("div");
  wrapper.classList.add("sender-wrapper");
  target.parentNode.insertBefore(wrapper, target);
  wrapper.appendChild(target);
}

function injectAvatar(html, avatar) {
  if (!avatar) return;
  let messageHeader = html.find(".message-header")[0];
  let portraitAndName = document.createElement("div");
  portraitAndName.classList.add("portrait-and-name");
  messageHeader.prepend(portraitAndName);
  let wrapper = document.createElement("div");
  wrapper.classList.add("portrait-wrapper");
  let portrait = document.createElement("img");
  portrait.classList.add("avatar");
  portrait.classList.add("portrait");
  wrapper.append(portrait);
  let senderWrapper = html.find(".sender-wrapper")[0];
  portraitAndName.append(senderWrapper);
  portraitAndName.prepend(wrapper);
}

function injectAuthorName(html, messageData) {
  if (messageData.author === undefined) return;
  if (game.settings.get("pf2e-dorako-ux", "other.enable-player-tags")) {
    const messageSenderElem = html.find(".sender-wrapper");
    const playerName = messageData.author.name;
    const playerNameElem = document.createElement("span");
    playerNameElem.appendChild(document.createTextNode(playerName));
    playerNameElem.classList.add("player-name");
    playerNameElem.classList.add("header-meta");
    if (playerName === messageData.alias) {
      html.find(".message-sender").addClass("dorako-display-none");
    }
    messageSenderElem.append(playerNameElem);
  }
}

function injectMessageTag(html, messageData) {
  const setting = game.settings.get("pf2e-dorako-ux", "other.enable-rolltype-indication");
  if (setting == false) {
    return;
  }
  const messageMetadata = html.find(".message-metadata");

  const rolltype = $("<span>");
  rolltype.addClass("rolltype");
  rolltype.addClass("header-meta");

  const whisperTargets = messageData.message.whisper;

  const isBlind = messageData.message.blind;
  if (isBlind) rolltype.addClass("blind");
  const isWhisper = whisperTargets?.length > 0;
  if (isWhisper && !isBlind) rolltype.addClass("whisper");
  const isSelf = isWhisper && whisperTargets.length === 1 && whisperTargets[0] === messageData.message.author;
  const isRoll = messageData.message.rolls !== undefined;

  if (isBlind) {
    rolltype.text(i18n("pf2e-dorako-ux.text.secret"));
    messageMetadata.prepend(rolltype);
  } else if (isSelf && whisperTargets[0]) {
    rolltype.text(i18n("pf2e-dorako-ux.text.self-roll"));
    messageMetadata.prepend(rolltype);
  } else if (isRoll && isWhisper) {
    rolltype.text(i18n("pf2e-dorako-ux.text.gm-only"));
    messageMetadata.prepend(rolltype);
  } else if (isWhisper) {
    rolltype.text(i18n("pf2e-dorako-ux.text.whisper"));
    messageMetadata.prepend(rolltype);
  }

  if (game.settings.get("pf2e-dorako-ux", "moving.animate-messages")) {
    // Draw attention to direct whispers from players to GM
    const isGmSpeaker = game.users.get(messageData.message.author)?.isGM;
    const isGmTarget = game.users.get(whisperTargets?.[0])?.isGM;
    if (!(isBlind || isSelf) && isWhisper && !isGmSpeaker && isGmTarget) {
      html[0].classList.add("attention");
    }
  }
}

function injectWhisperParticipants(html, messageData) {
  const alias = messageData.alias;
  const author = messageData.author;
  const whisperTargets = messageData.message.whisper;
  const whisperTargetString = messageData.whisperTo;
  const whisperTargetIds = messageData.message.whisper;
  const isWhisper = whisperTargetIds?.length > 0 || false;
  const isRoll = messageData.message.rolls !== undefined;
  const isSelf =
    (isWhisper && whisperTargets.length === 1 && whisperTargets[0] === messageData.message.author) ||
    (isWhisper &&
      whisperTargets.length === 2 &&
      whisperTargets[0] === "null" &&
      whisperTargets[1] === messageData.message.author);

  const authorId = messageData.message.author;
  const userId = game.user.id;

  if (!isWhisper) return;
  if (userId !== authorId && !whisperTargetIds.includes(userId)) return;

  // remove the old whisper to content, if it exists
  html.find(".whisper-to").detach();

  // if this is a roll
  if (isRoll || isSelf) return;

  const messageHeader = html.find(".message-header");

  const whisperParticipants = $("<span>");
  whisperParticipants.addClass("whisper-to");

  const whisperFrom = $("<span>");
  const fromText = titleCase(i18n("pf2e-dorako-ux.text.from"));
  whisperFrom.text(`${fromText}: ${alias}`);
  whisperFrom.addClass("header-meta");

  const whisperTo = $("<span>");
  const toText = titleCase(i18n("pf2e-dorako-ux.text.to")).toLowerCase();
  whisperTo.text(`${toText}: ${whisperTargetString}`);
  whisperTo.addClass("header-meta");

  whisperParticipants.append(whisperFrom);
  whisperParticipants.append(whisperTo);
  messageHeader.append(whisperParticipants);
}

function addAvatarsToFlags(message, local = true) {
  let combatantImg =
    game.modules.get("combat-tracker-images")?.active && message.actor
      ? message.actor.getFlag("combat-tracker-images", "trackerImage")
      : null;
  let speaker = message.speaker;
  const token = game.scenes.get(speaker.scene)?.tokens.get(speaker.token);
  let tokenImg = token?.texture.src;
  const actor = game.actors.get(speaker.actor);
  let actorImg = actor?.img;
  let userImg = message.author?.avatar;

  let userAvatar = new Avatar(message.speaker.alias, userImg);

  let combatantAvatar = combatantImg ? new CombatantAvatar(message.speaker.alias, combatantImg) : null;

  let actorAvatar = actorImg ? new ActorAvatar(message.speaker.alias, actorImg) : null;

  let tokenAvatar = null;
  if (tokenImg) {
    tokenAvatar = new TokenAvatar(message.speaker.alias, tokenImg, token.texture.scaleX, actor.size == "sm");
  }

  if (local) {
    message.updateSource({
      "flags.pf2e-dorako-ux.userAvatar": userAvatar,
      "flags.pf2e-dorako-ux.combatantAvatar": combatantAvatar,
      "flags.pf2e-dorako-ux.tokenAvatar": tokenAvatar,
      "flags.pf2e-dorako-ux.actorAvatar": actorAvatar,
    });
  } else if (game.user.id == message.user.id) {
    message.update({
      "flags.pf2e-dorako-ux.userAvatar": userAvatar,
      "flags.pf2e-dorako-ux.combatantAvatar": combatantAvatar,
      "flags.pf2e-dorako-ux.tokenAvatar": tokenAvatar,
      "flags.pf2e-dorako-ux.actorAvatar": actorAvatar,
    });
  }
}

function getAvatar(message) {
  const source = game.settings.get("pf2e-dorako-ux", "avatar.source");
  if (source == "none" || source == "system") {
    return null;
  }

  let combatantAvatar = message.getFlag("pf2e-dorako-ux", "combatantAvatar");
  let tokenAvatar = message.getFlag("pf2e-dorako-ux", "tokenAvatar");
  let actorAvatar = message.getFlag("pf2e-dorako-ux", "actorAvatar");
  let userAvatar = game.settings.get("pf2e-dorako-ux", "avatar.use-user-avatar")
    ? message.getFlag("pf2e-dorako-ux", "userAvatar")
    : null;

  if (combatantAvatar) return combatantAvatar;

  if (
    game.settings.get("pf2e-dorako-ux", "avatar.hide-when-token-hidden") &&
    message.getFlag("pf2e-dorako-ux", "wasTokenHidden")
  ) {
    return null;
  }

  return source == "token" ? tokenAvatar || actorAvatar || userAvatar : actorAvatar || tokenAvatar || userAvatar;
}

// Add avatar if message contains avatar data
Hooks.on("renderChatMessage", (message, b) => {
  let avatar = getAvatar(message);
  if (!avatar) return;
  let html = b[0];

  let avatarElem = html.getElementsByClassName("avatar")[0];
  if (!avatarElem) return;

  avatarElem.src = avatar.image;

  if (avatar.type == "token") {
    const smallScale = game.settings.get("pf2e-dorako-ux", "avatar.small-creature-token-avatar-size");
    let smallCorrection = avatar.isSmall ? 1.25 * smallScale : 1;
    avatarElem?.setAttribute("style", "transform: scale(" + Math.abs(avatar.scale) * smallCorrection + ")");
  }

  const portraitDegreeSetting = game.settings.get("pf2e-dorako-ux", "avatar.reacts-to-degree-of-success");

  if (portraitDegreeSetting && message.isContentVisible) {
    let outcome = message?.flags?.pf2e?.context?.outcome;
    if (outcome === undefined) return;
    if (outcome === "criticalFailure") {
      let wrapper = html.getElementsByClassName("portrait-wrapper")[0];
      wrapper?.setAttribute("style", "filter: saturate(0.2) drop-shadow(0px 0px 6px black)");
    } else if (outcome === "criticalSuccess") {
      let wrapper = html.getElementsByClassName("portrait-wrapper")[0];
      wrapper?.setAttribute("style", "filter: drop-shadow(0px 0px 6px lightgreen)");
    }
  }
});

// Add .spell to spells
Hooks.on("renderChatMessage", (app, html, data) => {
  const item = app?.item;
  if (!item) return;
  if (!item.constructor.name.includes("SpellPF2e")) return;
  html[0].classList.add("spell");
});
