<template>
  <div id="app">
    Owner:<br />
    <input
      type="text"
      v-model="settingsInput.owner"
      placeholder="steamID3"
    /><br />

    Speed Toggle:
    <input
      type="checkbox"
      id="checkbox"
      v-model="settingsInput.data.speedToggle"
    /><br />

    Speed Position X:<br />
    <input
      type="number"
      v-model="settingsInput.data.speedPositionX"
      min="-1"
      max="1"
      step="0.1"
    /><br />

    Speed Position Y:<br />
    <input
      type="number"
      v-model="settingsInput.data.speedPositionY"
      min="-1"
      max="1"
      step="0.1"
    /><br />

    Speed Normal Color:
    <Sketch
      :value="color"
      :disableAlpha="disableAlpha"
      disableFields
      @input="updateValue($event, 'speedNormalColor')"
    ></Sketch>
    <br />

    Speed Perf Color:
    <Sketch
      :value="color"
      :disableAlpha="disableAlpha"
      disableFields
      @input="updateValue($event, 'speedPerfColor')"
    ></Sketch>
    <br />

    Keys Toggle:
    <input
      type="checkbox"
      id="checkbox"
      v-model="settingsInput.data.keysToggle"
    />
    <br />

    Keys Position X:<br />
    <input
      type="number"
      v-model="settingsInput.data.keysPositionX"
      min="-1"
      max="1"
      step="0.1"
    /><br />

    Keys Position Y:<br />
    <input
      type="number"
      v-model="settingsInput.data.keysPositionY"
      min="-1"
      max="1"
      step="0.1"
    /><br />

    Keys Normal Color:
    <Sketch
      :value="color"
      :disableAlpha="disableAlpha"
      disableFields
      @input="updateValue($event, 'keysNormalColor')"
    ></Sketch>
    <br />

    Keys Overlap Color:
    <Sketch
      :value="color"
      :disableAlpha="disableAlpha"
      disableFields
      @input="updateValue($event, 'keysOverlapColor')"
    ></Sketch>
    <br />
    <br />
    <br />
    <textarea readonly v-model="settingsOutput" class="output"></textarea>
    <br />
    <div v-if="isTooLong">
      The settings string is too long!
    </div>
    <div>{{ this.settingsOutput64.length }} / 256</div>
    <textarea readonly v-model="settingsOutput64" class="output"></textarea>
  </div>
</template>

<script>
import { Sketch } from 'vue-color';

const color = { r: 255, g: 0, b: 0, a: 1 };

export default {
  components: {
    Sketch,
  },
  data() {
    return {
      color,
      settingsInput: {
        owner: '',
        data: {
          speedToggle: false,
          speedPositionX: 0,
          speedPositionY: 0,
          speedNormalColor: color,
          speedPerfColor: color,
          speedDisplayFormat: false,
          keysToggle: false,
          keysPositionX: 0,
          keysPositionY: 0,
          keysNormalColor: color,
          keysOverlapColor: color,
        },
      },
      disableAlpha: true,
    };
  },
  methods: {
    updateValue(update, field) {
      this.settingsInput.data[field] = update.rgba;
    },
  },
  computed: {
    settingsOutput() {
      const speedPosition = `${this.settingsInput.data.speedPositionX} ${
        this.settingsInput.data.speedPositionY
      }`;

      const speedNormalColor = `${this.settingsInput.data.speedNormalColor.r} ${
        this.settingsInput.data.speedNormalColor.g
      } ${this.settingsInput.data.speedNormalColor.b}`;

      const speedPerfColor = `${this.settingsInput.data.speedPerfColor.r} ${
        this.settingsInput.data.speedPerfColor.g
      } ${this.settingsInput.data.speedPerfColor.b}`;

      const keysPosition = `${this.settingsInput.data.keysPositionX} ${
        this.settingsInput.data.keysPositionY
      }`;

      const keysNormalColor = `${this.settingsInput.data.keysNormalColor.r} ${
        this.settingsInput.data.keysNormalColor.g
      } ${this.settingsInput.data.keysNormalColor.b}`;

      const keysOverlapColor = `${this.settingsInput.data.keysOverlapColor.r} ${
        this.settingsInput.data.keysOverlapColor.g
      } ${this.settingsInput.data.keysOverlapColor.b}`;

      const settingsOutput = {
        owner: this.settingsInput.owner,
        rev: '1',
        data: [
          this.settingsInput.data.speedToggle ? '1' : '0',
          speedPosition,
          speedNormalColor,
          speedPerfColor,
          this.settingsInput.data.speedDisplayFormat ? '1' : '0',
          this.settingsInput.data.keysToggle ? '1' : '0',
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

      return base64OutputString;
    },
    isTooLong() {
      const maxLength = 256 - 'sm_mhud_settings_import'.length;
      return this.settingsOutput64.length > maxLength;
    },
  },
};
</script>

<style>
.output {
  width: 100%;
  height: 120px;
}
</style>
