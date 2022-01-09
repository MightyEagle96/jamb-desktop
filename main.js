const electron = require("electron");
const ip = require("ip");
const si = require("systeminformation");
const macaddress = require("macaddress");
const { default: axios } = require("axios");
const { port } = require("./src/utils/data");

const { app, BrowserWindow, Menu, globalShortcut, ipcMain, powerSaveBlocker } =
  electron;

const baseFilePath = "./src/screens/";

let connectToServerScreen,
  splashScreen,
  networkTestScreen,
  candidateLoginScreen,
  lobbyScreen;

let serverIpAddress, networkTestDuration;

let mainMenu = Menu.buildFromTemplate([]);

const systemConfiguration = {
  ipAddress: ip.address(),
  macAddress: "",
  platform: "",
  operatingSystem: "",
  ram: "",
  systemModel: "",
  diskStorage: "",
  processor: "",
  dhcp: false,
};

function hardDiskSize(dataSize) {
  const data = Math.ceil(dataSize / 1000000000);

  if (data >= 1000) {
    return `${data / 1000} TB`;
  } else return `${data} GB`;
}

function GetSystemConfiguration() {
  ///platform;
  si.osInfo().then((d) => {
    systemConfiguration.platform = d.platform;
  });

  //mac address && ethernet
  si.networkInterfaces().then((data) => {
    try {
      systemConfiguration.macAddress = data.find(
        (d) => d.iface === "Ethernet"
      ).mac;
    } catch (error) {
      systemConfiguration.macAddress = "-";
      macaddress.one(function (err, mac) {
        systemConfiguration.macAddress = mac || "-";
      });
    }
    try {
      systemConfiguration.dhcp =
        data.find((d) => d.iface === "Ethernet").dhcp || false;
    } catch (error) {
      systemConfiguration.dhcp = false;
    }
  });

  //operating system
  si.osInfo().then((data) => {
    systemConfiguration.operatingSystem = data.distro;
  });

  //processor
  si.cpu().then((data) => {
    systemConfiguration.processor = `${data.manufacturer} ${data.brand}`;
  });
  //system model
  si.system().then((data) => {
    systemConfiguration.systemModel = data.model;
  });
  //RAM
  si.mem().then((data) => {
    systemConfiguration.ram = `${Math.ceil(data.total / 1073741824)} GB`;
  });
  //DISK storage
  si.fsSize().then((data) => {
    systemConfiguration.diskStorage = hardDiskSize(data[0].size);
  });

  const complete = setInterval(() => {
    if (
      systemConfiguration.diskStorage &&
      systemConfiguration.ipAddress &&
      systemConfiguration.macAddress &&
      systemConfiguration.operatingSystem &&
      systemConfiguration.platform &&
      systemConfiguration.processor &&
      systemConfiguration.systemModel &&
      //systemConfiguration.dhcp &&
      systemConfiguration.ram
    ) {
      splashScreen.close();

      CreateConnectToServerScreen();
      clearInterval(complete);
    }
  }, 1000);
}

//Create the splash screen
function CreateSplashScreen() {
  splashScreen = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    width: 900,
    height: 600,
    autoHideMenuBar: true,
    frame: false,
    show: false,
  });
  //splashScreen.webContents.toggleDevTools();
  splashScreen.loadFile(`${baseFilePath}splashScreen/splashScreen.html`);
  splashScreen.resizable = false;
  splashScreen.minimizable = false;
  splashScreen.focus();
  //splashScreen.closable = false;

  splashScreen.once("ready-to-show", () => {
    splashScreen.show();

    GetSystemConfiguration();
  });
}

//create the connect to server screen
function CreateConnectToServerScreen() {
  connectToServerScreen = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  connectToServerScreen.webContents.toggleDevTools();
  connectToServerScreen.fullScreen = true;
  connectToServerScreen.loadFile(
    `${baseFilePath}connectToServerScreen/connectToServerScreen.html`
  );

  Menu.setApplicationMenu(mainMenu);
}

//create the network test screen
function CreateNetworkTestScreen() {
  networkTestScreen = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });

  networkTestScreen.fullScreen = true;
  lobbyScreen.close();
  lobbyScreen = null;
  networkTestScreen.webContents.toggleDevTools();
  networkTestScreen.loadFile(
    `${baseFilePath}networkTestScreen/networkTestScreen.html`
  );
}

//create the lobby screen
function CreateLobbyScreen(pageToClose) {
  lobbyScreen = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  if (pageToClose === "networkTest") {
    networkTestScreen.close();
    networkTestScreen = null;
  } else {
    connectToServerScreen.close();
    connectToServerScreen = null;
  }

  lobbyScreen.fullScreen = true;
  //lobbyScreen.webContents.toggleDevTools();

  lobbyScreen.webContents.on("before-input-event", (event, input) => {
    if (input.code == "F4" && input.alt) event.preventDefault();
    if (input.code == "MetaLeft" && input.meta) {
      lobbyScreen.focus();
    }
  });
  lobbyScreen.loadFile(`${baseFilePath}lobbyScreen/lobbyScreen.html`);
}

//create the candidate login page
function CreateCandidateLoginScreen(pageToClose) {
  candidateLoginScreen = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  if (pageToClose === "lobbyScreen") {
    lobbyScreen.close();
    lobbyScreen = null;
  } else if (pageToClose === "networkTest") {
    networkTestScreen.close();
    networkTestScreen = null;
  }
  candidateLoginScreen.fullScreen = true;
  //candidateLoginScreen.webContents.toggleDevTools();
  candidateLoginScreen.loadFile(
    `${baseFilePath}candidateLoginScreen/candidateLoginScreen.html`
  );
}

ipcMain.on("channel1", (e, args) => {
  e.sender.send("channel2", systemConfiguration);
});

ipcMain.on("channel3", (e, args) => {
  if (args.serverIp) {
    serverIpAddress = args.serverIp;
  }
  CreateLobbyScreen(args.pageToClose);
});

ipcMain.on("channel4", (e, args) => {
  e.sender.send("channel5", serverIpAddress);
});

ipcMain.on("channel6", (e, args) => {
  console.log(args);
  CreateCandidateLoginScreen(args);
});

ipcMain.on("channel7", (e, args) => {
  networkTestDuration = args;
  CreateNetworkTestScreen();
});

ipcMain.on("channel8", (e, args) => {
  e.sender.send("channel9", networkTestDuration);
});

ipcMain.on("appHasClosed", (e, args) => {
  if (args) {
    return app.quit();
  }
});
app.on("ready", function () {
  powerSaveBlocker.start("prevent-display-sleep");
  CreateSplashScreen();
});

app.whenReady().then(() => {
  globalShortcut.register("Control+Shift+Q", () => {
    app.quit();
  });
  // globalShortcut.register("Alt+Tab", function () {
  //   app.focus();
  // });

  globalShortcut.register("Super+Tab", () => {
    app.quit();
  });
  globalShortcut.unregister("Win+R");
});

app.once("before-quit", (e) => {
  e.preventDefault();
  BrowserWindow.getFocusedWindow().webContents.send("shutDown", {
    serverIpAddress,
    ipAddress: ip.address(),
  });
});

//process.env.NODE_ENV = "development";
process.env.NODE_ENV = "production";
