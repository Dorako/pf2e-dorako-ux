# PF2e Dorako UX

This module is split from [Dorako UI](https://github.com/Dorako/pf2e-dorako-ui) for the following reasons:

- Makes a cleaner separation of concerns
- Makes the UX features available for people that prefer other UI modules

# Features include

- Chat message avatars
  - Supports Token or Actor or Combatant images
  - Supports 'pop out' tokens (also for Combat Tracker)
  - Configurable size
  - Reacts to critical rolls, glowing green on a critical success, and dimming and desaturating for critical failures
  - Hidden when token is hidden, or roll is secret
- Chat message accesibility
  - Label indicating whispered messages and secret rolls
  - Label for Player names
- Chat message simplification
  - Pull important spellcasting information out of the footer and into the main message
  - Remove attack-related tags from damage rolls to save space
- Centered hotbar
  - Also works with modules that add extra hotbar rows
- Hide stuff you don't want to see
  - Foundry icon
  - Cards sidebar
  - Chat control icon
  - "Compact UI" mode that fades out UI when inactive
  - Collapse the Sidebar and/or Navigation by default
- Includes Dalvyn's CRB-styled journal theme

# Licenses

The sidebar resizing functionality has been adapted from [Sidebar Resizer](https://github.com/saif-ellafi/foundryvtt-sidebar-resizer) available under the MIT license.

The chat merge and rolltype buttons functionality has been adapted from [DFCE](https://github.com/flamewave000/dragonflagon-fvtt/tree/master/df-chat-enhance) available under the BSD 3-Clause license.
