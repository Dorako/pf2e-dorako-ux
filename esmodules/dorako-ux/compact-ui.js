import { MODULE_NAME } from "../consts.js";

Hooks.once("ready", () => {
  const compactUi = game.settings.get("pf2e-dorako-ux", "moving.compact-ui");
  if (!compactUi) return;
  var body = document.body;
  body.classList.add("compact-ui");
  body.addEventListener("mousemove", toggleActive);

  function toggleActive(e) {
    const offsetLeft = $("body").find("#ui-left")[0] ? $("body").find("#ui-left")[0].offsetLeft : 0;
    if (e.clientX < offsetLeft + 150) {
      $("body").find("#ui-left").addClass("active");
    }
    if (e.clientX > offsetLeft + 200) {
      $("body").find("#ui-left").removeClass("active");
    }
  }
});

// Hooks.on("closeCombatDock", (app, html, data) => {
//   if (!game.settings.get(`${MODULE_NAME}`, "moving.compact-ui")) return;
//   ui.nav.expand();
// });

// Hooks.once("ready", () => {
//   const setting = game.settings.get("pf2e-dorako-ux", "moving.minimize-hotbar");
//   if (!setting) return;
//   var body = document.body;
//   body.classList.add("minimize-hotbar");
//   body.addEventListener("mousemove", toggleActive);

//   function toggleActive(e) {
//     const middleHeight = $("body").find("#ui-middle").height();
//     const enableAt = middleHeight - 25;
//     const disableAt = middleHeight - 150;
//     const extraHotbars =
//       $("#hotbar").find(".hotbar-page-row").length > 0 ? $("#hotbar").find(".hotbar-page-row").length - 1 : 0;
//     const hiddenOffset =
//       $("#hotbar").find("#hotbar-page").length > 0 && !$("#hotbar").find("#hotbar-page").hasClass("collapsed")
//         ? `${-45 - extraHotbars * 56}px`
//         : "-40px";
//     const root = document.querySelector(":root").style;
//     if (e.clientY > enableAt) {
//       //   console.log(e);
//       $("body").find("#ui-middle").addClass("active");
//       root.setProperty("--hotbar-hidden-offset", hiddenOffset);
//     }
//     if (e.clientY < disableAt) {
//       //   console.log(e);
//       $("body").find("#ui-middle").removeClass("active");
//       root.setProperty("--hotbar-hidden-offset", hiddenOffset);
//     }
//   }
// });
