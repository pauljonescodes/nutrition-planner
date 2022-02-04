// Native
// Packages
import { app, BrowserWindow } from "electron";
import contextMenu from "electron-context-menu";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import { join } from "path";
import { format } from "url";

contextMenu({ showSaveImage: true });

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  // 375 x 667
  // 768 x 432
  const mainWindow = new BrowserWindow({
    width: 768 * 2,
    height: 432 * 2,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, "preload.js"),
    },
  });

  const url = isDev
    ? "http://localhost:8000/"
    : format({
        pathname: join(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
