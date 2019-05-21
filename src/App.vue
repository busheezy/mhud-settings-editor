<template>
  <div id="app">
    <button v-if="!showLoad" @click="showLoad = true">Load</button>
    <div v-else>
      <textarea class="input" v-model="loadInput"></textarea><br />
      <button @click="onLoadInput">Load</button>
    </div>
    <br />
    Owner:<br />
    <input
      type="number"
      v-model.number="settingsInput.owner"
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

    Speed Normal Color:<br />
    <input type="color" v-model="settingsInput.data.speedNormalColor" />
    <br />

    Speed Perf Color:<br />
    <input type="color" v-model="settingsInput.data.speedPerfColor" />
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

    Keys Normal Color:<br />
    <input type="color" v-model="settingsInput.data.keysNormalColor" />
    <br />

    Keys Overlap Color:<br />
    <input type="color" v-model="settingsInput.data.keysOverlapColor" />
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

export default {
  data() {
    return {
      showLoad: false,
      loadInput: '',
      settingsInput: {
        owner: null,
        data: {
          speedToggle: true,
          speedPositionX: -1.0,
          speedPositionY: 0.85,
          speedNormalColor: '#00FFFF',
          speedPerfColor: '#00FF00',
          speedDisplayFormat: false,
          keysToggle: false,
          keysPositionX: -1.0,
          keysPositionY: 0.85,
          keysNormalColor: '#FFFFFF',
          keysOverlapColor: '#FF0000',
        },
      },
      disableAlpha: true,
    };
  },
  methods: {
    onLoadInput() {
      const json = atob(this.loadInput);
      const obj = JSON.parse(json);

      this.settingsInput.owner = obj.owner;
      this.settingsInput.rev = obj.rev;

      const [
        speedToggle,
        speedPosition,
        speedNormalColor,
        speedPerfColor,
        speedDisplayFormat,
        keysToggle,
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

      this.settingsInput.data.speedToggle = speedToggle === '1';

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

      this.settingsInput.data.speedDisplayFormat = speedDisplayFormat === '1';

      this.settingsInput.data.keysToggle = keysToggle === '1';

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

      this.showLoad = false;
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

      const settingsOutput = {
        owner: this.settingsInput.owner,
        rev: 1,
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
  height: 40px;
}

.input {
  width: 100%;
  height: 40px;
}
</style>
