# MovementHUD Settings Editor

A web editor for [MovementHUD](https://github.com/zer0k-z/movementhud) preferences, the GOKZ-integrated movement HUD for CS:GO.

**[Open the editor](https://busheezy.github.io/mhud-settings-editor/)**

## Features

- Every MovementHUD preference, including rounding, takeoff speed, gain/loss colors, mouse direction, key spacing, indicators, and update speed.
- A live preview that simulates a bhop run with your settings. Drag the elements to reposition them.
- Exports an `sm_mhud_import` code. Codes over MovementHUD's 255 character limit are trimmed, and the settings that don't fit are listed as follow-up commands.
- Exports a `mhud.cfg` config file that sets every preference, including the ones codes can't hold.
- Imports export codes (including older revisions), import lines, and config files.
- The URL updates as you edit, so you can share a link to your settings.

## Development

Requires Node 24 and pnpm.

```sh
pnpm install
pnpm dev
```

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `pnpm dev`          | Start the dev server              |
| `pnpm build`        | Build the static site into `dist` |
| `pnpm check`        | Type-check with svelte-check      |
| `pnpm lint`         | Lint with Oxlint                  |
| `pnpm format`       | Format with Prettier              |
| `pnpm format:check` | Check formatting                  |

Pushes to `master` are checked, built, and deployed to GitHub Pages by the [CI workflow](.github/workflows/ci.yml).
