function updateIconSize(effectIcon, size) {
  effectIcon.width = size;
  effectIcon.height = size;
}

const thetaToXY = new Map();
const sizeAndIndexToOffsets = new Map();

function polar_to_cartesian(theta) {
  if (!thetaToXY.has(theta)) {
    thetaToXY.set(theta, {
      x: Math.cos(theta),
      y: Math.sin(theta),
    });
  }
  return thetaToXY.get(theta);
};

function calculateOffsets(i, actorSize) {
  let key = actorSize + i;
  if (!sizeAndIndexToOffsets.has(key)) {
    const rowMax = sizeToRowMax(actorSize);
    const row = Math.floor(i / rowMax);
    const ratio = i / rowMax;
    const gapOffset = (1 / rowMax) * (1 + row % 2) * Math.PI;
    const initialRotation = (0.5 + (1 / rowMax) * Math.PI) * Math.PI;
    const theta = ratio * 2 * Math.PI + initialRotation + gapOffset
    const offset = sizeToOffset(actorSize) + row * sizeToRowOffset(actorSize);
    sizeAndIndexToOffsets.set(key, {
      offset, theta
    })
  }
  return sizeAndIndexToOffsets.get(key);
}

function updateIconPosition(effectIcon, i, token) {
  const actorSize = token?.actor?.size;
  const { offset, theta } = calculateOffsets(i, actorSize);
  const gridSize = token?.scene?.grid?.size ?? 100;
  const tokenTileFactor = token?.document?.width ?? 1;
  const { x, y } = polar_to_cartesian(theta);
    // debugger;
  effectIcon.position.x = ((x * offset + 1) / 2) * tokenTileFactor * gridSize;
  effectIcon.position.y = ((-1 * y * offset + 1) / 2) * tokenTileFactor * gridSize;
}

function updateEffectScales(token) {
  // don't need background layer as we can cache border/bg it in the texture itself
  token.effects.bg.visible = false;

  const tokenSize = token?.actor?.size;
  const gridSize = token?.scene?.grid?.size ?? 100;
  let i = 0;
  for (const effectIcon of token.effects.children) {
    if (effectIcon === token.effects.bg) continue;
    if (effectIcon === token.effects.overlay) continue;

    effectIcon.anchor.set(0.5);

    const iconScale = sizeToIconScale(tokenSize);
    const gridScale = gridSize / 100;
    const scaledSize = 14 * iconScale * gridScale;
    updateIconSize(effectIcon, scaledSize);
    updateIconPosition(effectIcon, i, token);
    i++;
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

function sizeToRowMax(size) {
  if (size == "tiny") {
    return 10;
  } else if (size == "sm") {
    return 14;
  } else if (size == "med") {
    return 16;
  } else if (size == "lg") {
    return 20;
  } else if (size == "huge") {
    return 24;
  } else if (size == "grg") {
    return 28;
  }
  return 20;
}

function sizeToRowOffset(size) {
  if (size == "tiny") {
    return 0.6;
  } else if (size == "sm") {
    return 0.3;
  } else if (size == "med") {
    return 0.3;
  } else if (size == "lg") {
    return 0.1;
  } else if (size == "huge") {
    return 0.1;
  } else if (size == "grg") {
    return 0.1;
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
  static #spriteSize = 96;
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

  addToCache(path, renderable) {
    const existingTexture = this.#textureCache.get(path);
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
    const renderTexture = new PIXI.RenderTexture(baseRenderTexture, frame);
    canvas.app.renderer.render(renderable, { renderTexture: renderTexture });
    this.#textureCache.set(path, renderTexture);
    return renderTexture;
  }

  loadTexture(path) {
    return this.#textureCache.get(path);
  }
}
const effectCache = new EffectTextureSpritesheet();

const createRoundedEffectIcon = (effectIcon) => {
  const texture = effectIcon.texture;
  const borderWidth = 3;
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
    let effectTexture = effectCache.loadTexture(effectTextureCacheKey);
    let icon;
    if (effectTexture) {
      icon = new PIXI.Sprite(effectTexture);
    } else {
      const texture = await loadTexture(src, { fallback: fallbackEffectIcon });
      const rawEffectIcon = new PIXI.Sprite(texture);

      if (game.system.id === "pf2e" && src == game.settings.get("pf2e", "deathIcon")) {
        return this.effects.addChild(rawEffectIcon);
      }
      effectTexture = effectCache.addToCache(effectTextureCacheKey, createRoundedEffectIcon(rawEffectIcon));
      icon = new PIXI.Sprite(effectTexture);
    }

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
