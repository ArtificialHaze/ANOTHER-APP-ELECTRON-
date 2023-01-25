const electron = require("electron");
const { ipcRenderer } = electron;

let textareaElement = document.querySelector("textarea");
let defaultFontSize = 20;

const increaseFontSize = () => {
  textareaElement.style.fontSize = `${++defaultFontSize}px`;
};

const decreaseFontSize = () => {
  textareaElement.style.fontSize = `${--defaultFontSize}px`;
};

const saveFile = () => {
  let text = textareaElement.value;
  ipcRenderer.send("save-text", text);
};

ipcRenderer.on("saved", (e, results) => {
  if (results == "success") {
    console.log("Saved successfully.");
    textareaElement.style.backgroundColor = "#b2ff99";
  } else {
    console.log("Error saving a file.");
    textareaElement.style.backgroundColor = "#f00";
  }

  setTimeout(() => {
    textareaElement.style.backgroundColor = "";
  }, 3000);
});

ipcRenderer.on("save-btn-clicked", () => {
  saveFile();
});

ipcRenderer.on("save-as-btn-clicked", () => {
  saveFile();
});
