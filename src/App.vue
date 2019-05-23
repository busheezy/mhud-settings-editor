<template>
  <div id="app">
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <h1 class="title is-2 has-text-centered">
              MovementHUD Settings Editor
            </h1>
            <p class="subtitle has-text-centered">
              Edit your <strong>MovementHUD</strong> settings with ease!
            </p>

            <div class="columns">
              <div class="column">
                <button
                  v-if="!showLoad"
                  @click="showLoad = true"
                  class="button mb-1 is-primary mr-2 is-fullwidth"
                >
                  Load Settings
                </button>
              </div>
              <div class="column">
                <button
                  @click="resetInput"
                  class="button mb-1 is-warning is-fullwidth"
                >
                  Reset Settings
                </button>
              </div>
            </div>

            <div class="box" v-if="showLoad">
              <div class="is-size-4 mb-2">
                Load Settings
              </div>
              <textarea
                class="textarea mb-1"
                v-model="loadInput"
                placeholder="base64 string"
              >
              </textarea>
              <br />
              <div class="columns">
                <div class="column">
                  <button
                    @click="showLoad = false"
                    class="button is-danger is-fullwidth"
                  >
                    Cancel
                  </button>
                </div>
                <div class="column">
                  <button
                    @click="onLoadInput"
                    class="button is-primary is-fullwidth"
                  >
                    Load
                  </button>
                </div>
              </div>
            </div>

            <div class="box mt-4">
              <h1 class="title has-text-centered">General Settings</h1>
              <div class="field">
                <label class="label">Owner</label>
                <div class="control">
                  <input
                    type="text"
                    v-model="settingsInput.owner"
                    placeholder="STEAM_1:1:6157769"
                    class="input"
                    :class="{
                      'is-danger':
                        !validOwner && this.settingsInput.owner !== '',
                      'is-success': validOwner,
                    }"
                  />
                </div>
              </div>

              <div
                class="notification is-danger p-1"
                v-if="!validOwner && this.settingsInput.owner !== ''"
              >
                Invalid Steam ID
              </div>
            </div>

            <div class="box mt-4">
              <h1 class="title has-text-centered">Speed Settings</h1>
              <div class="field">
                <label class="label">
                  Display Speed
                </label>
                <button
                  class="button"
                  :class="{
                    'is-primary': settingsInput.data.speedDisplay === '0',
                  }"
                  @click="settingsInput.data.speedDisplay = '0'"
                >
                  Disabled
                </button>
                <button
                  class="button ml-2"
                  :class="{
                    'is-primary': settingsInput.data.speedDisplay === '1',
                  }"
                  @click="settingsInput.data.speedDisplay = '1'"
                >
                  Float (23.45)
                </button>
                <button
                  class="button ml-2"
                  :class="{
                    'is-primary': settingsInput.data.speedDisplay === '2',
                  }"
                  @click="settingsInput.data.speedDisplay = '2'"
                >
                  Integer (23)
                </button>
              </div>

              <div class="field">
                <label class="label">Speed Position X</label>
                <div class="control">
                  <input
                    type="number"
                    v-model="settingsInput.data.speedPositionX"
                    min="-1"
                    max="1"
                    step="0.1"
                    class="input"
                    :disabled="settingsInput.data.speedDisplay === '0'"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Speed Position Y</label>
                <div class="control">
                  <input
                    type="number"
                    v-model="settingsInput.data.speedPositionY"
                    min="-1"
                    max="1"
                    step="0.1"
                    class="input"
                    :disabled="settingsInput.data.speedDisplay === '0'"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Speed Normal Color</label>
                <div class="control">
                  <input
                    type="color"
                    v-model="settingsInput.data.speedNormalColor"
                    class="input"
                    :disabled="settingsInput.data.speedDisplay === '0'"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Speed Perf Color</label>
                <div class="control">
                  <input
                    type="color"
                    v-model="settingsInput.data.speedPerfColor"
                    class="input"
                    :disabled="settingsInput.data.speedDisplay === '0'"
                  />
                </div>
              </div>
            </div>

            <div class="box mt-4">
              <h1 class="title has-text-centered">Keys Settings</h1>
              <div class="field">
                <label class="label">
                  Display Keys
                </label>
                <button
                  class="button"
                  :class="{
                    'is-primary': settingsInput.data.keysDisplay === '0',
                  }"
                  @click="settingsInput.data.keysDisplay = '0'"
                >
                  Disabled
                </button>
                <button
                  class="button ml-2"
                  :class="{
                    'is-primary': settingsInput.data.keysDisplay === '1',
                  }"
                  @click="settingsInput.data.keysDisplay = '1'"
                >
                  Blanks as underscores
                </button>
                <button
                  class="button ml-2"
                  :class="{
                    'is-primary': settingsInput.data.keysDisplay === '2',
                  }"
                  @click="settingsInput.data.keysDisplay = '2'"
                >
                  Blanks invisible
                </button>
              </div>

              <div class="field">
                <label class="label">Keys Position X</label>
                <div class="control">
                  <input
                    type="number"
                    v-model="settingsInput.data.keysPositionX"
                    min="-1"
                    max="1"
                    step="0.1"
                    class="input"
                    :disabled="settingsInput.data.keysDisplay === '0'"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Keys Position Y</label>
                <div class="control">
                  <input
                    type="number"
                    v-model="settingsInput.data.keysPositionY"
                    min="-1"
                    max="1"
                    step="0.1"
                    class="input"
                    :disabled="settingsInput.data.keysDisplay === '0'"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Keys Normal Color</label>
                <div class="control">
                  <input
                    type="color"
                    v-model="settingsInput.data.keysNormalColor"
                    class="input"
                    :disabled="settingsInput.data.keysDisplay === '0'"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Keys Overlap Color</label>
                <div class="control">
                  <input
                    type="color"
                    v-model="settingsInput.data.keysOverlapColor"
                    class="input"
                    :disabled="settingsInput.data.keysDisplay === '0'"
                  />
                </div>
              </div>
            </div>

            <div class="box mt-4">
              <div class="is-size-4 mb-2">
                Output
              </div>

              <div>{{ settingsOutput64.length }} / 256</div>
              <progress
                class="progress"
                :value="settingsOutput64.length"
                max="256"
              >
                {{ settingsOutput64.length }} / 256
              </progress>

              <div class="notification is-danger" v-if="isTooLong">
                The settings output string is too long!
              </div>

              <textarea v-model="settingsOutput64" class="textarea" readonly>
              </textarea>

              <button
                type="button"
                class="button is-primary is-fullwidth mt-2"
                v-clipboard:copy="settingsOutput64"
              >
                Copy to clipboard!
              </button>

              <div class="p-1 is-info mt-2 has-text-centered">
                After copying the output, paste directly into console and press
                enter.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import * as SteamID from 'steamid';
import * as _ from 'lodash';

function rgbToHex(r, g, b) {
  const result =
    '#' +
    (
      (1 << 24) +
      (parseInt(r, 10) << 16) +
      (parseInt(g, 10) << 8) +
      parseInt(b, 10)
    )
      .toString(16)
      .slice(1);

  return result;
}

function hexToRgb(hex) {
  const execResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const result = execResult
    ? {
        r: parseInt(execResult[1], 16),
        g: parseInt(execResult[2], 16),
        b: parseInt(execResult[3], 16),
      }
    : null;

  return result;
}

function getDefaultSettings() {
  const defaultSettingsInput = {
    owner: '',
    data: {
      speedDisplay: '1',
      speedPositionX: -1.0,
      speedPositionY: 0.7,
      speedNormalColor: '#FFFFFF',
      speedPerfColor: '#00FF00',
      keysDisplay: '1',
      keysPositionX: -1.0,
      keysPositionY: 0.8,
      keysNormalColor: '#FFFFFF',
      keysOverlapColor: '#FF0000',
    },
  };

  return defaultSettingsInput;
}

export default {
  data() {
    return {
      showLoad: false,
      loadInput: '',
      settingsInput: getDefaultSettings(),
      disableAlpha: true,
      firstLoad: true,
    };
  },
  created() {
    const b64Encoded = window.location.hash.replace('#', '');
    const b64 = decodeURIComponent(b64Encoded);

    if (b64) {
      this.parse64(b64);
    }

    window.onhashchange = () => {
      const b64ChangeEncoded = window.location.hash.replace('#', '');
      if (b64ChangeEncoded !== '') {
        const b64Change = decodeURIComponent(b64ChangeEncoded);
        if (b64Change) {
          this.parse64(b64Change);
        }
      } else {
        this.resetInput();
      }
    };
  },
  methods: {
    onLoadInput() {
      const loadInput = this.loadInput.replace('sm_mhud_settings_import ', '');

      this.parse64(loadInput);

      this.showLoad = false;
    },
    resetInput() {
      this.settingsInput = getDefaultSettings();
    },
    validSteamID(steamIDInput) {
      if (steamIDInput === '') {
        return false;
      }
      try {
        const steamId = new SteamID(steamIDInput);
        return steamId.isValid();
      } catch {
        return false;
      }
    },
    parse64(b64String) {
      const json = atob(b64String);
      const obj = JSON.parse(json);

      if (this.validOwner) {
        const steamID = SteamID.fromIndividualAccountID(obj.owner);
        this.settingsInput.owner = steamID.getSteam2RenderedID(true);
      } else {
        this.settingsInput.owner = '';
      }

      this.settingsInput.rev = obj.rev;

      const [
        speedDisplay,
        speedPosition,
        speedNormalColor,
        speedPerfColor,
        keysDisplay,
        keysPosition,
        keysNormalColor,
        keysOverlapColor,
      ] = obj.data;

      const [speedPositionX, speedPositionY] = speedPosition.split(' ');

      const [
        speedNormalColorR,
        speedNormalColorG,
        speedNormalColorB,
      ] = speedNormalColor.split(' ');

      const [
        speedPerfColorR,
        speedPerfColorG,
        speedPerfColorB,
      ] = speedPerfColor.split(' ');

      const [keysPositionX, keysPositionY] = keysPosition.split(' ');

      const [
        keysNormalColorR,
        keysNormalColorG,
        keysNormalColorB,
      ] = keysNormalColor.split(' ');

      const [
        keysOverlapColorR,
        keysOverlapColorG,
        keysOverlapColorB,
      ] = keysOverlapColor.split(' ');

      this.settingsInput.data.speedPositionX = speedPositionX;
      this.settingsInput.data.speedPositionY = speedPositionY;

      this.settingsInput.data.speedNormalColor = rgbToHex(
        speedNormalColorR,
        speedNormalColorG,
        speedNormalColorB,
      );

      this.settingsInput.data.speedPerfColor = rgbToHex(
        speedPerfColorR,
        speedPerfColorG,
        speedPerfColorB,
      );

      this.settingsInput.data.keysPositionX = keysPositionX;
      this.settingsInput.data.keysPositionY = keysPositionY;

      this.settingsInput.data.keysNormalColor = rgbToHex(
        keysNormalColorR,
        keysNormalColorG,
        keysNormalColorB,
      );

      this.settingsInput.data.keysOverlapColor = rgbToHex(
        keysOverlapColorR,
        keysOverlapColorG,
        keysOverlapColorB,
      );

      this.settingsInput.data.keysDisplay = keysDisplay;
      this.settingsInput.data.speedDisplay = speedDisplay;
    },
  },
  computed: {
    settingsOutput() {
      const speedPosition = `${this.settingsInput.data.speedPositionX} ${
        this.settingsInput.data.speedPositionY
      }`;

      const speedNormalColorObj = hexToRgb(
        this.settingsInput.data.speedNormalColor,
      );

      const speedNormalColor = `${speedNormalColorObj.r} ${
        speedNormalColorObj.g
      } ${speedNormalColorObj.b}`;

      const speedPerfColorObj = hexToRgb(
        this.settingsInput.data.speedPerfColor,
      );

      const speedPerfColor = `${speedPerfColorObj.r} ${speedPerfColorObj.g} ${
        speedPerfColorObj.b
      }`;

      const keysPosition = `${this.settingsInput.data.keysPositionX} ${
        this.settingsInput.data.keysPositionY
      }`;

      const keysNormalColorObj = hexToRgb(
        this.settingsInput.data.keysNormalColor,
      );

      const keysNormalColor = `${keysNormalColorObj.r} ${
        keysNormalColorObj.g
      } ${keysNormalColorObj.b}`;

      const keysOverlapColorObj = hexToRgb(
        this.settingsInput.data.keysOverlapColor,
      );

      const keysOverlapColor = `${keysOverlapColorObj.r} ${
        keysOverlapColorObj.g
      } ${keysOverlapColorObj.b}`;

      let owner = '';

      if (this.validOwner) {
        const steamId = new SteamID(this.settingsInput.owner);
        owner = steamId.accountid;
      }

      const settingsOutput = {
        owner,
        rev: 1,
        data: [
          this.settingsInput.data.speedDisplay,
          speedPosition,
          speedNormalColor,
          speedPerfColor,
          this.settingsInput.data.keysDisplay,
          keysPosition,
          keysNormalColor,
          keysOverlapColor,
        ],
      };

      const outputString = JSON.stringify(settingsOutput);

      return outputString;
    },
    settingsOutput64() {
      const base64OutputString = btoa(this.settingsOutput);

      if (_.isEqual(this.settingsInput, getDefaultSettings())) {
        window.location.hash = '';
      } else {
        const b64Encoded = encodeURIComponent(base64OutputString);

        window.location.hash = b64Encoded;
      }

      return `sm_mhud_settings_import ${base64OutputString}`;
    },
    isTooLong() {
      const maxLength = 256 - 'sm_mhud_settings_import '.length;
      return this.settingsOutput64.length > maxLength;
    },
    validOwner() {
      return this.validSteamID(this.settingsInput.owner);
    },
  },
};
</script>

<style>
.output {
  width: 100%;
  height: 40px;
}

.input {
  width: 100%;
  height: 40px;
}
</style>
