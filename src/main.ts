import { mount } from "svelte";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./app.css";
import App from "./App.svelte";

const target = document.getElementById("app");

if (!target) {
  throw new Error("Missing #app element");
}

const app = mount(App, { target });

export default app;
