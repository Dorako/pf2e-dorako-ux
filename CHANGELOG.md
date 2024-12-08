# 1.5.8

- (Fix) Removed some logspam.

# 1.5.7

- (Refinement) Removed the superfluous 'from' tag in whispers.
- (Refinement) Made the recipient names in whispers into individual tags rather than one comma-separated one.
- (Refinement) Apply 'whisper' class to individual whisper tags.

# 1.5.6

- (Refinement) General housecleaning related to NPC sheets.
- (Module) Added the `/sass` folder to the packaged files.

# 1.5.5

- (Fix) Several fixes related to /whisper functionality including restoring to/from tags, contributed by @FolkvangrForgent.

# 1.5.4

- (Refinement) Performance improvement in relation to turn-passing in encounter mode contributed by @Codas.
- (Refinement) Old and busted `.user` replaced with new hotness `.author`, reducing some console noise contributed by @xdy.

# 1.5.3

- (Refinement) Added tooltips to the rolltype buttons.

# 1.5.2

- (Refinement) Increased specificity of hack to remove system avatars, so it doesn't remove avatars provided by UX under certain circumstances.

# 1.5.1

- (Fix) Ensure that the 'Disabled' avatar option also disables the system avatars.

# 1.5.0

- (Maintenance) Introduced a hack to disable the system chat avatars when Dorako UX's avatars are enabled.
- (Refinement) Removed the performance setting for the radial effects HUD, as it (and more) is now included in [Prime Performance](https://foundryvtt.com/packages/fvtt-perf-optim) by @Codas.
- (Fix) Fixed an issue where the scene navigation collapse by default setting was not working.
- (Refinement) Updated radial hud code to account for non-square grids.
- (Fix) Fixed some logspam.

# 1.4.3

- (Refinement) Further performance improvements to the radial effects HUD thanks to @Kyamsil.
- (Fix) Fixed some logspam related to the short-lived remove effects panel feature.

# 1.4.2

- (Refinement) Removed the setting to hide the Effects Panel - you can already do that using a player setting.
- (Refinement + Fix) Massive performance improvements to radial effects HUD thanks to @Codas.
- (Refinement) Updated the radial effects HUD to support multiple rings of effects, thanks to @Kyamsil for the PR.

# 1.4.1

- (New) Added new feature to hide the Effects Panel, intended to be used with modules that introduce their own effects display.

# 1.4.0

- (New) FVTT V12 compatibility.

# 1.3.6

- (Fix) Fixed an issue where right-click interaction for the button added by Vauxs' Archives did not work, courtesy of MrVauxs.

# 1.3.5

- (Fix) Fixed a system reference in the radial HUD code that was causing UX to misbehave when using SWADE.

# 1.3.4

- (Refinement) Optimized the masking of radial HUD effect icons, courtesy of Codas.

# 1.3.3

- (Refinement) Made the adjust-token-effects-hud setting a client setting so it can disabled according to preference/performance level.

# 1.3.2

- (Maintenance) Trimmed the NPC sheet restructuring feature down, due to some of its original behaviour being outdated. This also fixes some logspam.

# 1.3.1

- (Fix) Bugfixes and improvements :^)

# 1.3.0

- (Maintenance) Removed the "restructure card info" setting as System includes a similar feature now.
- (Fix) Fixed an issue where some avatar related data would be inconsistent on a refresh, courtesy of K4rakara.

# 1.2.5

- (Maintenance) More adjustments to NPC sheet restructuring to work on newest system version.

# 1.2.4

- (Maintenance) Adjustments to NPC sheet restructuring to work on newest system version.

# 1.2.3

- (Fix) Removed some logspam.
- (Refinement) Moved the NPC sheet restructuring to a default=on setting, so it can be disabled.

# 1.2.2

- (Fix) Fixed an issue where the radial effect HUD would break when Dorako UI was not enabled.

# 1.2.1

- (Fix) Fixed the 'hide compendium banner images' setting.

# 1.2.0

- (New) New feature to minimize the hotbar unless hovered. (Compatible with Monk's Hotbar Extension)

# 1.1.3

- (Fix) Fixed an issue where the .dorako-ux (for restructuring NPC sheets) class would be added to PC sheets.
- (New) Added .blind and .whisper classes to the rolltype indicators, so they can be themed.

# 1.1.2

- (Fix) Migrated some styling from Dorako UI, to ensure integrity of the module when used as a stand-alone.

# 1.1.1

- (Fix) Added missing localization string for new feature.

# 1.1.0

- (New) New setting to change the size of the sidebar tab icons. If you increase the size, you might have to hide some icons, or increase the width of the sidebar.
- (Meta) Updated readme and licenses.

# 1.0.1

- (Fix) Fixed a localization issue.
- (Fix) Fixed an issue where chat messages from short-named actors + short-named players without avatars would wrap weirdly.

# 1.0.0

- (New) Contains all non-UI features from Dorako UI
