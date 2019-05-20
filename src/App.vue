<template>
  <div id="app">
    Owner:<br />
    <input type="text" v-model="settingsInput.owner" /><br />

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
    <textarea readonly v-model="settingsOutput64" class="output"></textarea>
  </div>
</template>

<script>
import { Sketch } from 'vue-color';
import * as simpleVdf from 'simple-vdf2';

const color = { r: 255, g: 0, b: 0, a: 1 };

export default {
  components: {
    Sketch,
  },
  data() {
    return {
      color,
      settingsInput: {
        owner: 'bush',
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
      disableAlpha: false,
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
      } ${this.settingsInput.data.speedNormalColor.b} ${
        this.settingsInput.data.speedNormalColor.a
      }`;

      const speedPerfColor = `${this.settingsInput.data.speedPerfColor.r} ${
        this.settingsInput.data.speedPerfColor.g
      } ${this.settingsInput.data.speedPerfColor.b} ${
        this.settingsInput.data.speedPerfColor.a
      }`;

      const keysPosition = `${this.settingsInput.data.keysPositionX} ${
        this.settingsInput.data.keysPositionY
      }`;

      const keysNormalColor = `${this.settingsInput.data.keysNormalColor.r} ${
        this.settingsInput.data.keysNormalColor.g
      } ${this.settingsInput.data.keysNormalColor.b} ${
        this.settingsInput.data.keysNormalColor.a
      }`;

      const keysOverlapColor = `${this.settingsInput.data.keysOverlapColor.r} ${
        this.settingsInput.data.keysOverlapColor.g
      } ${this.settingsInput.data.keysOverlapColor.b} ${
        this.settingsInput.data.keysOverlapColor.a
      }`;

      const settingsOutput = {
        MHud: {
          owner: this.settingsInput.owner,
          rev: '1',
          data: {
            '0': this.settingsInput.data.speedToggle ? 1 : 0,
            '1': speedPosition,
            '2': speedNormalColor,
            '3': speedPerfColor,
            '4': this.settingsInput.data.speedDisplayFormat ? 1 : 0,
            '5': this.settingsInput.data.keysToggle ? 1 : 0,
            '6': keysPosition,
            '7': keysNormalColor,
            '8': keysOverlapColor,
          },
        },
      };

      const outputString = simpleVdf
        .stringify(settingsOutput, false)
        .replace(/\r?\n|\r/g, '')
        .replace(/\t/g, '');

      return outputString;
    },
    settingsOutput64() {
      const base64OutputString = btoa(this.settingsOutput);

      return base64OutputString;
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
