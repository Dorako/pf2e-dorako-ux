function countEffects(token) {
  if (!token) {
    return 0;
  }
  let numEffects = token.document.effects?.length || 0;
  token.actor?.temporaryEffects?.forEach((actorEffect) => {
    if (!actorEffect.getFlag("core", "overlay")) {
      numEffects++;
    }
  });
  return numEffects;
}

function sortIcons(e1, e2) {
  if (e1.position.x === e2.position.x) {
    return e1.position.y - e2.position.y;
  }
  return e1.position.x - e2.position.x;
}

function updateIconSize(effectIcon, size) {
  effectIcon.width = size;
  effectIcon.height = size;
}

function polar_to_cartesian(r, theta) {
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta),
  };
}

function updateIconPosition(effectIcon, i, effectIcons, token) {
  const actorSize = token?.actor?.size;
  let max = 20;
  if (actorSize == "tiny") max = 10;
  if (actorSize == "sm") max = 14;
  if (actorSize == "med") max = 16;
  const ratio = i / max;
  // const angularOffset = i < max ? 0 : ratio / 2;
  const gridSize = token?.scene?.grid?.size ?? 100;
  const tokenTileFactor = token?.document?.width ?? 1;
  const sizeOffset = sizeToOffset(actorSize);
  const offset = sizeOffset * tokenTileFactor * gridSize;
  const initialRotation = (0.5 + (1 / max) * Math.PI) * Math.PI;
  const { x, y } = polar_to_cartesian(offset, (ratio + 0) * 2 * Math.PI + initialRotation);
  // debugger;
  effectIcon.position.x = x / 2 + (gridSize * tokenTileFactor) / 2;
  effectIcon.position.y = (-1 * y) / 2 + (gridSize * tokenTileFactor) / 2;
}

function updateEffectScales(token) {
  const numEffects = countEffects(token);
  if (numEffects > 0 && token.effects.children.length > 0) {
    const background = token.effects.children[0];
    if (!(background instanceof PIXI.Graphics)) return;
    // background.clear()
    background.visible = false; // don't need background layer as we can cache it in the texture itself

    // Exclude the background and overlay
    const effectIcons = token.effects.children.slice(1, 1 + numEffects);
    const tokenSize = token?.actor?.size;

    const gridSize = token?.scene?.grid?.size ?? 100;
    // Reposition and scale them
    effectIcons.forEach((effectIcon, i, effectIcons) => {
      if (!(effectIcon instanceof PIXI.Sprite)) return;

      effectIcon.anchor.set(0.5);

      const iconScale = sizeToIconScale(tokenSize);
      const gridScale = gridSize / 100;
      const scaledSize = 13 * iconScale * gridScale;
      updateIconSize(effectIcon, scaledSize);
      updateIconPosition(effectIcon, i, effectIcons, token);
    });
  }
}

// Nudge icons to be on the token ring or slightly outside
function sizeToOffset(size) {
  if (size == "tiny") {
    return 1.4;
  } else if (size == "sm") {
    return 1.0;
  } else if (size == "med") {
    return 1.2;
  } else if (size == "lg") {
    return 0.925;
  } else if (size == "huge") {
    return 0.925;
  } else if (size == "grg") {
    return 0.925;
  }
  return 1.0;
}

function sizeToIconScale(size) {
  if (size == "tiny") {
    return 1.4;
  } else if (size == "sm") {
    return 1.4;
  } else if (size == "med") {
    return 1.4;
  } else if (size == "lg") {
    return 1.25;
  } else if (size == "huge") {
    return 1.55;
  } else if (size == "grg") {
    return 2.2;
  }
  return 1.0;
}

function createBG(iconSize, borderWidth) {
  const background = new PIXI.Graphics();
  const r = iconSize / 2;
  const isDorakoUiActive = game.modules.get("pf2e-dorako-ui")?.active;
  const appTheme = isDorakoUiActive ? game.settings.get("pf2e-dorako-ui", "theme.app-theme") : false;
  if (appTheme && appTheme.includes("foundry2")) {
    background.lineStyle(borderWidth, 0x302831, 1, 0);
    background.beginFill(0x0b0a13);
    background.drawCircle(r, r, r);
    background.endFill();
  } else if (appTheme && appTheme.includes("crb")) {
    background.lineStyle(borderWidth, 0x956d58, 1, 0);
    background.drawCircle(r, r, r);
    background.lineStyle(borderWidth, 0xe9d7a1, 1, 0);
    background.beginFill(0x956d58);
    background.drawCircle(r, r, r - borderWidth);
    background.endFill();
  } else if (appTheme && appTheme.includes("bg3")) {
    background.lineStyle(borderWidth, 0x9a8860, 1, 0);
    background.drawCircle(r, r, r);
    background.lineStyle(borderWidth, 0xd3b87c, 1, 0);
    background.beginFill(0x000000);
    background.drawCircle(r, r, r - borderWidth);
    background.endFill();
  } else {
    background.lineStyle(borderWidth, 0x444444, 1, 0);
    background.beginFill(0x222222);
    background.drawCircle(r, r, r);
    background.endFill();
  }
  return background;
}

class EffectTextureSpritesheet {
  static #spriteSize = 128;
  static #baseTextureSize = 2048;
  static #maxMemberCount = Math.pow(this.#baseTextureSize / this.#spriteSize, 2);

  static get spriteSize() {
    return this.#spriteSize;
  }
  static get baseTextureSize() {
    return this.#baseTextureSize;
  }

  static get maxMemberCount() {
    return this.#maxMemberCount;
  }

  #baseTextures = [];
  #textureCache = new Map();

  #createBaseRenderTexture() {
    const baseTextureSize = this.constructor.baseTextureSize;
    return new PIXI.BaseRenderTexture({
      width: baseTextureSize,
      height: baseTextureSize,
    });
  }

  #getNextBaseRenderTexture() {
    const lastIdx = this.#baseTextures.length - 1;
    const currentTexture = this.#baseTextures[lastIdx];
    if (!currentTexture || currentTexture[1] >= this.constructor.maxMemberCount) {
      const baseRenderTexture = this.#createBaseRenderTexture();
      this.#baseTextures.push([baseRenderTexture, 1]);
      return [baseRenderTexture, 0];
    }
    this.#baseTextures[lastIdx][1] = currentTexture[1] + 1;
    return currentTexture;
  }

  addToEffectTexture(path, renderable) {
    const existingTexture = this.#textureCache.get(path);
    console.log("adding!", path);
    if (existingTexture) {
      return existingTexture;
    }
    // load base render texture or create new if it does not exist
    const [baseRenderTexture, textureCount] = this.#getNextBaseRenderTexture();

    const spriteSize = this.constructor.spriteSize;
    const maxCols = this.constructor.baseTextureSize / spriteSize;
    const col = textureCount % maxCols;
    const row = Math.floor(textureCount / maxCols);
    const frame = new PIXI.Rectangle(col * spriteSize, row * spriteSize, spriteSize, spriteSize);
    console.log(frame);
    const renderTexture = new PIXI.RenderTexture(baseRenderTexture, frame);
    canvas.app.renderer.render(renderable, { renderTexture: renderTexture });
    this.#textureCache.set(path, renderTexture);
    return renderTexture;
  }

  getEffectTexture(path) {
    return this.#textureCache.get(path);
  }
}
const effectCache = new EffectTextureSpritesheet();

const createRoundedEffectIcon = (effectIcon) => {
  const texture = effectIcon.texture;
  const borderWidth = 4;
  const textureSize = EffectTextureSpritesheet.spriteSize;

  const container = new PIXI.Container();
  container.width = textureSize;
  container.height = textureSize;

  container.addChild(createBG(textureSize, borderWidth));
  container.addChild(effectIcon);

  const effectSize = textureSize - 6 * borderWidth;
  let scale = effectSize / Math.max(texture.height, texture.width);
  effectIcon.scale.set(scale, scale);
  effectIcon.x = (textureSize - effectIcon.width) / 2;
  effectIcon.y = (textureSize - effectIcon.height) / 2;
  const clipRadius = textureSize / 2 - 3 * borderWidth;
  effectIcon.mask = new PIXI.Graphics()
    .beginFill(0xffffff)
    .drawCircle(textureSize / 2, textureSize / 2, clipRadius)
    .endFill();
  return container;
};

function overrideTokenHud() {
  const enabled = game.settings.get("pf2e-dorako-ux", "moving.adjust-token-effects-hud");
  if (!enabled) {
    return;
  }

  const origRefreshEffects = Token.prototype._refreshEffects;
  Token.prototype._refreshEffects = function (...args) {
    if (this) {
      origRefreshEffects.apply(this, args);
      updateEffectScales(this);
    }
  };

  Token.prototype._drawEffect = async function (...args) {
    if (!this) {
      return;
    }
    const src = args[0];
    if (!src) return;

    const fallbackEffectIcon = "icons/svg/hazard.svg";
    const effectTextureCacheKey = src || fallbackEffectIcon;
    let effectTexture = effectCache.getEffectTexture(effectTextureCacheKey);
    let icon;
    if (effectTexture) {
      icon = new PIXI.Sprite(effectTexture);
    } else {
      const texture = await loadTexture(src, { fallback: fallbackEffectIcon });
      const rawEffectIcon = new PIXI.Sprite(texture);

      if (game.system.id === "pf2e" && src == game.settings.get("pf2e", "deathIcon")) {
        return this.effects.addChild(rawEffectIcon);
      }
      effectTexture = effectCache.addToEffectTexture(effectTextureCacheKey, createRoundedEffectIcon(rawEffectIcon));
      icon = new PIXI.Sprite(effectTexture);
    }

    console.log(icon.width, icon.height);
    return this.effects.addChild(icon);
  };
}
function overrideInterfaceClipping() {
  const enabled = game.settings.get("pf2e-dorako-ux", "moving.adjust-token-effects-hud-clipping");
  if (!enabled) {
    return;
  }

  const origRefreshState = Token.prototype._refreshState;
  Token.prototype._refreshState = function (...args) {
    origRefreshState.apply(this, args);
    this.removeChild(this.voidMesh);
    // this.addChildAt(this.voidMesh, this.getChildIndex(this.effects) + 1);
  };
}

Hooks.once("ready", () => {
  overrideTokenHud();
  overrideInterfaceClipping();
});
