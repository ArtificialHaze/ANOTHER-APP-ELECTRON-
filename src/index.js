const { app, BrowserWindow, dialog, Menu, shell } = require("electron");
const { ipcMain } = require("electron/main");
const path = require("path");
const fs = require("fs");

// ===========================<<<<<!!!IMPORTANT!!!>>>>>==========================

// 1. DO NOT ENABLE NODE INTEGRATION
// 2. ENABLE CONTEXT ISOLATION
// 3. DEFINE CONTENT SECURITY POLICY IN HTML
// 4. VALIDATE USER INPUT

// ==============================================================================

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let win;
let filePath = undefined;

const template = [
  {
    label: "File",
    submenu: [
      {
        label: "Save",
        accelerator: "ctrl+s",
        click: () => {
          win.webContents.send("save-btn-clicked");
          console.log("Saved from menu button");
        },
      },
      {
        type: "separator",
      },
      {
        label: "Save as",
        accelerator: "ctrl+k",
        click: () => {
          filePath = undefined;
          win.webContents.send("save-as-btn-clicked");
          console.log("Saving as");
        },
      },
    ],
  },
  {
    label: "About",
    submenu: [
      {
        label: "About us",
        click: () => {
          shell.openExternal("https://google.com");
        },
      },
      {
        type: "separator",
      },
      {
        label: "Help",
        accelerator: "Ctrl + H",
      },
    ],
  },
  {
    role: "editMenu",
  },
  {
    role: "viewMenu",
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: false,
      nodeIntegration: true,
    },
  });
  // and load the index.html of the app.
  win.loadFile(path.join(__dirname, "index.html"));

  win.on("ready-to-show", () => {
    win.show();
  });

  // Open the DevTools.
  win.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const writeToFile = (data) => {
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Text File saved.");
    win.webContents.send("saved", "success");
  });
};

ipcMain.on("save-text", (e, text) => {
  if (filePath === undefined) {
    dialog.showSaveDialog(win, { defaultPath: "filename.txt" }, (fullPath) => {
      if (fullPath) {
        filePath = fullPath;
        writeToFile(text);
      }
    });
  } else {
    writeToFile(text);
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
