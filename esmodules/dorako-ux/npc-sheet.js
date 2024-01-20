Hooks.on("renderNPCSheetPF2e", (app, html, data) => {
  if (html[0].tagName === "FORM") return;
  const setting = game.settings.get("pf2e-dorako-ux", "moving.restructure-npc-sheets");
  if (!setting) return;
  html[0].classList.add("dorako-ux");
  const acDetails = app.object.attributes.ac.details;
  const collapseAc = acDetails === "";
  const hpDetails = app.object.attributes.hp.details;
  const hpTemp = app.object.attributes.hp.temp;
  const collapseHp = hpDetails === "" && hpTemp === 0;

  if (collapseAc) {
    let section = html.find(".armor-class")[0];
    section.classList.add("collapsed");
  }

  if (collapseHp) {
    let section = html.find(".health")[0];
    section.classList.add("collapsed");
  }
});
