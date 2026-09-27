// PF2e NPC sheets are still ApplicationV1, so html is a jQuery object
Hooks.on("renderNPCSheetPF2e", (app, html) => {
  const sheet = html[0];
  if (sheet.tagName === "FORM") return;
  const setting = game.settings.get("pf2e-dorako-ux", "moving.restructure-npc-sheets");
  if (!setting) return;
  sheet.classList.add("dorako-ux");
  const { ac, hp } = app.actor.attributes;
  const collapseAc = !ac.details;
  const collapseHp = !hp.details && !hp.temp;

  if (collapseAc) sheet.querySelector(".armor-class")?.classList.add("collapsed");
  if (collapseHp) sheet.querySelector(".health")?.classList.add("collapsed");
});
