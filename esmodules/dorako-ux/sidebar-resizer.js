// import { MODULE_NAME } from "../consts.js";

// const _poppedOutSizeDenominator = 1.5;

// function _assignSidebarResizer(sidebar) {
//   let minSize = 300;
//   let mouseStart, startSize, newSize;

//   // Create a resizer handle
//   const resizer = document.createElement("div");
//   resizer.classList.add("dorako-resize");
//   sidebar.appendChild(resizer);

//   // Listen for mousedown on resizer
//   resizer.addEventListener("mousedown", startResize, false);

//   // React to user resizing
//   function startResize(e) {
//     if (ui.sidebar._collapsed) return;
//     mouseStart = e.clientX;
//     startSize = sidebar.offsetWidth;
//     window.addEventListener("mousemove", resize, false);
//     window.addEventListener("mouseup", stopResize, false);
//   }

//   // Perform the resize operation
//   function resize(e) {
//     newSize = Math.round(startSize + mouseStart - e.clientX);
//     const root = document.querySelector(":root");
//     if (newSize >= minSize) {
//       root.style.setProperty("--sidebar-width", `${newSize}px`);
//     } else {
//       root.style.setProperty("--sidebar-width", `${minSize}px`);
//     }
//   }

//   // On mouseup remove listeners & save final size
//   function stopResize(e) {
//     window.localStorage.setItem("pf2e-dorako-ux.sidebar-width", sidebar.offsetWidth);
//     window.removeEventListener("mousemove", resize, false);
//     window.removeEventListener("mouseup", stopResize, false);
//   }
// }

// function _assignChatformResizer(chatform, poppedOut) {
//   let minSize = 50;
//   let mouseStart, startSize, newSize;

//   // Create a resizer handle
//   const resizer = document.createElement("div");
//   resizer.classList.add("dorako-resize");
//   chatform.prepend(resizer);

//   // Listen for mousedown on resizer
//   resizer.addEventListener("mousedown", startResize, false);

//   // React to user resizing
//   function startResize(e) {
//     if (!poppedOut && ui.sidebar._collapsed) return;
//     mouseStart = e.clientY;
//     startSize = chatform.offsetHeight;
//     window.addEventListener("mousemove", resize, false);
//     window.addEventListener("mouseup", stopResize, false);
//   }

//   // Perform the resize operation
//   function resize(e) {
//     newSize = Math.round(startSize + mouseStart - e.clientY);
//     if (newSize >= minSize) {
//       chatform.style.setProperty("--chatform-height", `${newSize}px`);
//     } else {
//       chatform.style.setProperty("--chatform-height", `${minSize}px`);
//     }
//   }

//   // On mouseup remove listeners & save final size
//   function stopResize(e) {
//     const key = `pf2e-dorako-ux.${poppedOut ? "popped-out-" : ""}chatform-height`;
//     window.localStorage.setItem(key, chatform.offsetHeight);
//     window.removeEventListener("mousemove", resize, false);
//     window.removeEventListener("mouseup", stopResize, false);
//   }
// }

// Hooks.once("ready", function () {
//   // Setup vars
//   let boardHeight = $("#board").height();
//   const boardResizeObserver = new ResizeObserver((entries) => {
//     const boardEvent = entries[0];
//     if (!boardEvent) {
//       return;
//     }
//     boardHeight = boardEvent.contentRect.height;
//   });
//   boardResizeObserver.observe(document.querySelector("#board"));

//   const sidebar = ui.sidebar.element[0];
//   const chatform = $(ui.chat.element[0]).find("#chat-form")[0];
//   _assignSidebarResizer(sidebar);
//   if (!chatform) return;

//   // Enable Chat popout Resize
//   if (game.modules.get("lib-wrapper")?.active) {
//     libWrapper.register(
//       "pf2e-dorako-ux",
//       "ChatLog.defaultOptions",
//       function (wrapped, ...args) {
//         let result = wrapped(...args);
//         result.resizable = true;
//         result.height = boardHeight / _poppedOutSizeDenominator;
//         const storedSidebarWidth = window.localStorage.getItem("pf2e-dorako-ux.sidebar-width");
//         if (storedSidebarWidth && Number.isInteger(+storedSidebarWidth)) result.width = parseInt(storedSidebarWidth);
//         return result;
//       },
//       "WRAPPER"
//     );
//     libWrapper.register(
//       "pf2e-dorako-ux",
//       "CombatTracker.defaultOptions",
//       function (wrapped, ...args) {
//         let result = wrapped(...args);
//         result.resizable = true;
//         result.height = boardHeight / _poppedOutSizeDenominator;
//         return result;
//       },
//       "WRAPPER"
//     );
//     libWrapper.register(
//       "pf2e-dorako-ux",
//       "SceneDirectory.defaultOptions",
//       function (wrapped, ...args) {
//         let result = wrapped(...args);
//         result.resizable = true;
//         result.height = boardHeight / _poppedOutSizeDenominator;
//         return result;
//       },
//       "WRAPPER"
//     );
//     libWrapper.register(
//       "pf2e-dorako-ux",
//       "ActorDirectory.defaultOptions",
//       function (wrapped, ...args) {
//         let result = wrapped(...args);
//         result.resizable = true;
//         result.height = boardHeight / _poppedOutSizeDenominator;
//         return result;
//       },
//       "WRAPPER"
//     );
//     libWrapper.register(
//       "pf2e-dorako-ux",
//       "ItemDirectory.defaultOptions",
//       function (wrapped, ...args) {
//         let result = wrapped(...args);
//         result.resizable = true;
//         result.height = boardHeight / _poppedOutSizeDenominator;
//         return result;
//       },
//       "WRAPPER"
//     );
//     libWrapper.register(
//       "pf2e-dorako-ux",
//       "RollTableDirectory.defaultOptions",
//       function (wrapped, ...args) {
//         let result = wrapped(...args);
//         result.resizable = true;
//         result.height = boardHeight / _poppedOutSizeDenominator;
//         return result;
//       },
//       "WRAPPER"
//     );
//     libWrapper.register(
//       "pf2e-dorako-ux",
//       "CardsDirectory.defaultOptions",
//       function (wrapped, ...args) {
//         let result = wrapped(...args);
//         result.resizable = true;
//         result.height = boardHeight / _poppedOutSizeDenominator;
//         return result;
//       },
//       "WRAPPER"
//     );
//     libWrapper.register(
//       "pf2e-dorako-ux",
//       "PlaylistDirectory.defaultOptions",
//       function (wrapped, ...args) {
//         let result = wrapped(...args);
//         result.resizable = true;
//         result.height = boardHeight / _poppedOutSizeDenominator;
//         return result;
//       },
//       "WRAPPER"
//     );
//     libWrapper.register(
//       "pf2e-dorako-ux",
//       "CompendiumDirectory.defaultOptions",
//       function (wrapped, ...args) {
//         let result = wrapped(...args);
//         result.resizable = true;
//         result.height = boardHeight / _poppedOutSizeDenominator;
//         return result;
//       },
//       "WRAPPER"
//     );
//     libWrapper.register(
//       "pf2e-dorako-ux",
//       "JournalDirectory.defaultOptions",
//       function (wrapped, ...args) {
//         let result = wrapped(...args);
//         result.resizable = true;
//         result.height = boardHeight / _poppedOutSizeDenominator;
//         return result;
//       },
//       "WRAPPER"
//     );
//     libWrapper.register(
//       "pf2e-dorako-ux",
//       "Settings.defaultOptions",
//       function (wrapped, ...args) {
//         let result = wrapped(...args);
//         result.resizable = true;
//         result.height = boardHeight / _poppedOutSizeDenominator;
//         return result;
//       },
//       "WRAPPER"
//     );
//   } else {
//     console.warn(`${MODULE_NAME} | libwrapper not enabled, resizing of popped-out sidebars will be limited`);
//   }
// });

// // Sidebar width
// Hooks.once("renderSidebarTab", function () {
//   const storedSidebarWidth = window.localStorage.getItem("pf2e-dorako-ux.sidebar-width");
//   if (!storedSidebarWidth) return;
//   if (Number.isInteger(+storedSidebarWidth)) {
//     const root = document.querySelector(":root");
//     root.style.setProperty("--sidebar-width", `${storedSidebarWidth}px`);
//   }
// });

// // Chat-form height
// Hooks.on("renderChatLogPF2e", function (app, html, data) {
//   if (!app?.options?.classes?.includes("chat-sidebar") ?? true) return;
//   let poppedOut = undefined;
//   if (app?.options?.classes?.includes("sidebar-popout")) {
//     poppedOut = true;
//   }

//   const chatform = html.find("#chat-form");
//   if (!chatform) return;
//   _assignChatformResizer(chatform[0], poppedOut);
//   const key = `pf2e-dorako-ux.${poppedOut ? "popped-out-" : ""}chatform-height`;
//   const storedChatformHeight = window.localStorage.getItem(key);
//   if (!storedChatformHeight) return;
//   if (Number.isInteger(+storedChatformHeight)) {
//     chatform[0].style.setProperty("--chatform-height", `${storedChatformHeight}px`);
//   }
// });
