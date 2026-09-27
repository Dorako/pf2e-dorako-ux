import { i18n, titleCase } from "./util.js";
import { Avatar, ActorAvatar, TokenAvatar, CombatantAvatar, SubjectAvatar } from "./consts.js";

// Chat cards
// Everything is read from the ChatMessage document rather than the hook's context argument, which may be absent
Hooks.on("renderChatMessageHTML", (chatMessage, html) => {
  const isNarratorToolsMessage = chatMessage.flags["narrator-tools"];
  const isMLDRoundMarker = chatMessage.flags["monks-little-details"]?.roundmarker;
  const isMCDRoundMarker = chatMessage.flags["monks-combat-details"]?.roundmarker;
  const isRoundMarker = isMLDRoundMarker || isMCDRoundMarker;
  if (isNarratorToolsMessage || isRoundMarker) {
    return;
  }

  adjustWhisperParticipants(html, chatMessage);
  injectMessageTag(html, chatMessage);
  const hideSecretAvatar =
    game.settings.get("pf2e-dorako-ux", "avatar.hide-gm-avatar-when-secret") && !chatMessage.isContentVisible;
  if (!hideSecretAvatar) injectAvatar(html, getAvatar(chatMessage));
  moveFlavorTextToContents(html);
});

// Is damage roll
Hooks.on("renderChatMessageHTML", (chatMessage, html) => {
  if (!game.settings.get("pf2e-dorako-ux", "hiding.remove-attack-info-from-damage-roll-messages")) return;

  if (chatMessage?.isDamageRoll && chatMessage?.item?.type !== "spell") {
    html.classList.add("dorako-damage-roll");
    for (const flavor of html.querySelectorAll(".flavor-text")) {
      const node = flavor.childNodes[1];
      if (!node) continue;
      const wrapper = document.createElement("span");
      node.replaceWith(wrapper);
      wrapper.append(node);
    }
  }
});

// Is check roll
Hooks.on("renderChatMessageHTML", (chatMessage, html) => {
  if (!game.settings.get("pf2e-dorako-ux", "hiding.remove-attack-info-from-damage-roll-messages")) return;

  if (chatMessage?.isCheckRoll) {
    html.classList.add("dorako-check-roll");
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

  Hooks.on("renderChatMessageHTML", (message, html) => {
    const isKoboldWorksTurnAnnouncerMessage = message.flags["koboldworks-turn-announcer"];
    if (!isKoboldWorksTurnAnnouncerMessage) return;

    const avatar = html.querySelector(".portrait.dorako");
    if (!avatar) return;
    avatar.style.transform = `scale(${message.flags["pf2e-dorako-ux"]?.tokenAvatar?.scale ?? 1})`;
    avatar.style.maskImage = `radial-gradient(circle, black 56%, rgba(0, 0, 0, 0.2) 92%)`;
    avatar.style.flex = `0 0 var(--avatar-size)`;
    avatar.style.height = `var(--avatar-size)`;
    avatar.style.width = `var(--avatar-size)`;
  });
});

function moveFlavorTextToContents(html) {
  const flavor = html.querySelector(".flavor-text");
  const contents = html.querySelector(".message-content");
  if (flavor && contents) contents.prepend(flavor);
}

function injectAvatar(html, avatar) {
  if (!avatar) return;
  const messageHeader = html.querySelector(".message-header");
  if (!messageHeader) return;
  const dorakoPortraitElem = document.createElement("div");
  dorakoPortraitElem.setAttribute("class", "portrait token dorako");
  messageHeader.prepend(dorakoPortraitElem);
  // Use the system's portrait layout even for messages where PF2e doesn't add its own portrait
  messageHeader.classList.add("with-image");
}

function injectMessageTag(html, message) {
  const setting = game.settings.get("pf2e-dorako-ux", "other.enable-rolltype-indication");
  if (setting == false) {
    return;
  }
  const messageHeader = html.querySelector(".message-header");
  if (!messageHeader) return;

  const rolltype = document.createElement("span");
  rolltype.classList.add("rolltype");

  const whisperTargets = message.whisper;

  const isBlind = message.blind;
  if (isBlind) rolltype.classList.add("blind");
  const isWhisper = whisperTargets.length > 0;
  if (isWhisper) rolltype.classList.add("whisper");
  const isSelf = whisperTargets.length === 1 && whisperTargets[0] === message.author?.id;
  const isRoll = message.isRoll;

  if (isBlind) {
    rolltype.textContent = i18n("pf2e-dorako-ux.text.secret");
    messageHeader.prepend(rolltype);
  } else if (isRoll && isSelf) {
    rolltype.textContent = i18n("pf2e-dorako-ux.text.self-roll");
    messageHeader.prepend(rolltype);
  } else if (isRoll && isWhisper) {
    rolltype.textContent = i18n("pf2e-dorako-ux.text.gm-only");
    rolltype.classList.add("whisper");
    messageHeader.prepend(rolltype);
  }

  if (game.settings.get("pf2e-dorako-ux", "moving.animate-messages")) {
    // Draw attention to direct whispers from players to GM
    const isGmSpeaker = message.author?.isGM;
    const isGmTarget = game.users.get(whisperTargets[0])?.isGM;
    if (!(isBlind || isSelf) && isWhisper && !isGmSpeaker && isGmTarget) {
      html.classList.add("attention");
    }
  }
}

function adjustWhisperParticipants(html, message) {
  const whisperTargetIds = message.whisper;
  const isWhisper = whisperTargetIds.length > 0;

  const authorId = message.author?.id;
  const userId = game.user.id;

  if (!isWhisper) return;
  if (userId !== authorId && !whisperTargetIds.includes(userId)) return;

  // remove the old whisper to content, if it exists
  html.querySelectorAll(".whisper-to").forEach((e) => e.remove());

  if (message.flags?.pf2e?.context?.type == "damage-taken") return;

  // if this is a roll
  if (message.isRoll) return;

  const messageHeader = html.querySelector(".message-header");
  if (!messageHeader) return;

  const whisperParticipants = document.createElement("span");
  whisperParticipants.classList.add("dux", "whisper-to");

  const whisperTo = document.createElement("span");
  const whisperToLabel = document.createElement("span");
  const toText = titleCase(i18n("pf2e-dorako-ux.text.to"));
  whisperToLabel.textContent = `${toText}: `;
  whisperTo.append(whisperToLabel);
  whisperParticipants.append(whisperTo);

  const recipients = document.createElement("span");
  whisperParticipants.append(recipients);

  for (const whisperId of whisperTargetIds) {
    const recipient = document.createElement("span");
    recipient.textContent = game.users.get(whisperId)?.name ?? "";
    recipient.classList.add("tag", "whisper");
    recipients.append(recipient);
  }

  messageHeader.append(whisperParticipants);
}

function addAvatarsToFlags(message, local = true) {
  let combatantImg =
    game.modules.get("combat-tracker-images")?.active && message.actor
      ? message.actor.getFlag("combat-tracker-images", "trackerImage")
      : null;
  let speaker = message.speaker;
  const actor = game.actors.get(speaker.actor);
  let actorImg = actor?.img;
  const token = game.scenes.get(speaker.scene)?.tokens.get(speaker.token) ?? actor?.prototypeToken;
  let tokenImg = token?.texture.src;
  let userImg = message.author?.avatar;
  let subjectImg = token?.ring?.subject;
  const isSmall = actor?.size == "sm";

  let userAvatar = new Avatar(message.speaker.alias, userImg);

  let combatantAvatar = combatantImg ? new CombatantAvatar(message.speaker.alias, combatantImg) : null;

  let actorAvatar = actorImg ? new ActorAvatar(message.speaker.alias, actorImg) : null;

  let tokenAvatar = tokenImg ? new TokenAvatar(message.speaker.alias, tokenImg, token.texture.scaleX, isSmall) : null;

  let subjectAvatar =
    token?.ring?.enabled && subjectImg?.texture
      ? new SubjectAvatar(message.speaker.alias, subjectImg.texture, subjectImg.scale * 1.25, isSmall)
      : null;

  // Flags only keep plain objects; class instances would be stored as {}
  const plain = (avatar) => (avatar ? { ...avatar } : null);
  const flags = {
    "flags.pf2e-dorako-ux.userAvatar": plain(userAvatar),
    "flags.pf2e-dorako-ux.combatantAvatar": plain(combatantAvatar),
    "flags.pf2e-dorako-ux.tokenAvatar": plain(tokenAvatar),
    "flags.pf2e-dorako-ux.actorAvatar": plain(actorAvatar),
    "flags.pf2e-dorako-ux.subjectAvatar": plain(subjectAvatar),
  };

  if (local) {
    message.updateSource(flags);
  } else if (game.user.id == message.author?.id) {
    message.update(flags);
  }
}

function getAvatar(message) {
  const source = game.settings.get("pf2e-dorako-ux", "avatar.source");
  if (source == "none" || source == "system") {
    return null;
  }

  // Ignore avatars without an image, e.g. flags saved as {} before class instances were converted to plain objects
  const flag = (key) => {
    const avatar = message.getFlag("pf2e-dorako-ux", key);
    return avatar?.image ? avatar : null;
  };
  let combatantAvatar = flag("combatantAvatar");
  let tokenAvatar = flag("tokenAvatar");
  let actorAvatar = flag("actorAvatar");
  let subjectAvatar = flag("subjectAvatar");
  let userAvatar = game.settings.get("pf2e-dorako-ux", "avatar.use-user-avatar") ? flag("userAvatar") : null;

  if (
    game.settings.get("pf2e-dorako-ux", "avatar.hide-when-token-hidden") &&
    message.getFlag("pf2e-dorako-ux", "wasTokenHidden")
  ) {
    return null;
  }

  if (combatantAvatar) return combatantAvatar;

  return source == "token"
    ? subjectAvatar || tokenAvatar || actorAvatar || userAvatar
    : actorAvatar || subjectAvatar || tokenAvatar || userAvatar;
}

// Add avatar if message contains avatar data
Hooks.on("renderChatMessageHTML", (message, html) => {
  let avatar = getAvatar(message);
  if (!avatar) {
    html.querySelector(".message-header")?.classList.add("no-image");
    return;
  }

  let avatarElem = html.querySelector(".portrait.dorako");
  if (!avatarElem) return;

  let avatarImgElement = document.createElement("img");
  avatarImgElement.src = avatar.image;
  avatarElem.append(avatarImgElement);

  const smallScale = game.settings.get("pf2e-dorako-ux", "avatar.small-creature-token-avatar-size");
  let smallCorrection = avatar.isSmall ? 1.25 * smallScale : 1;
  const newScale = Math.abs(avatar.scale) * smallCorrection;
  if (avatar.scale > 2) {
    avatarImgElement.style.maskImage = `radial-gradient(circle, black 24%, rgba(0, 0, 0, 0.2) 30%)`;
  }

  if (avatar.type == "token") {
    avatarImgElement.style.transform = "scale(" + newScale * 1.25 + ")";
  }

  if (avatar.type == "subject-texture") {
    avatarImgElement.style.transform = "scale(" + newScale * 1.33 + ")";

    const svgCode = `
      <defs>
        <radialGradient id="inner-ring" cx="0.4" cy="0.33" r="0.8">
          <stop offset="0%" stop-color="var(--dynamic-token-inner-ring-top-left-color)" />
          <stop offset="20%" stop-color="var(--dynamic-token-inner-ring-top-left-color)" />
          <stop offset="100%" stop-color="var(--dynamic-token-inner-ring-color)" />
        </radialGradient>
        <radialGradient id="outer-ring" cx="0.35" cy="0.25" r="0.9">
          <stop offset="0%" stop-color="var(--dynamic-token-outer-ring-top-left-color)" />
          <stop offset="20%" stop-color="var(--dynamic-token-outer-ring-top-left-color)" />
          <stop offset="100%" stop-color="var(--dynamic-token-outer-ring-color)" />
        </radialGradient> <radialGradient id="bg">
          <stop offset="0%" stop-color="var(--dynamic-token-background-color)" />
          <stop offset="80%" stop-color="var(--dynamic-token-background-color)" />
          <stop offset="100%" stop-color="var(--dynamic-token-background-outer-color)" />
        </radialGradient>
      </defs>
      <circle cx="50%" cy="50%" r="19.75" width="100" height="100" fill="url(#outer-ring)"></circle>
      <circle cx="50%" cy="50%" r="18.75" width="100" height="100" fill="url(#inner-ring)"></circle>
      <circle cx="50%" cy="50%" r="17.75" width="100" height="100" fill="var(--dynamic-token-dynamic-color)"></circle>
      <circle cx="50%" cy="50%" r="16.75" width="100" height="100" fill="url(#bg)"></circle>`;
    let dynamicTokenRing = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    dynamicTokenRing.innerHTML = svgCode;
    dynamicTokenRing.setAttribute("viewBox", "0 0 45 45");
    dynamicTokenRing.style.pointerEvents = "none";
    avatarElem.prepend(dynamicTokenRing);
  }

  const portraitDegreeSetting = game.settings.get("pf2e-dorako-ux", "avatar.reacts-to-degree-of-success");

  if (portraitDegreeSetting && message.isContentVisible) {
    let outcome = message?.flags?.pf2e?.context?.outcome;
    if (outcome === undefined) return;
    if (outcome === "criticalFailure") {
      avatarElem.style.filter = `saturate(0.2) drop-shadow(0px 0px 6px black)`;
    } else if (outcome === "criticalSuccess") {
      avatarElem.style.filter = `drop-shadow(0px 0px 6px lightgreen)`;
    }
  }
});

// Add .spell to spells
Hooks.on("renderChatMessageHTML", (message, html) => {
  const item = message?.item;
  if (!item) return;
  if (!item.constructor.name.includes("SpellPF2e")) return;
  html.classList.add("spell");
});
