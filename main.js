const electron = require("electron");
const ip = require("ip");
const si = require("systeminformation");

const { app, BrowserWindow, Menu, globalShortcut, ipcMain, MenuItem } =
  electron;

const baseFilePath = "./src/screens/";

let connectToServerScreen,
  splashScreen,
  examinationScreen,
  networkTestScreen,
  candidateLoginScreen,
  lobbyScreen;

let serverIpAddress, testData;

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
      ).mac ||= "-";
    } catch (error) {
      systemConfiguration.macAddress = "-";
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
    systemConfiguration.ram = `${Math.floor(data.total / 1000000000)} GB`;
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
  // connectToServerScreen.webContents.toggleDevTools();
  connectToServerScreen.loadFile(
    `${baseFilePath}connectToServerScreen/connectToServerScreen.html`
  );
  connectToServerScreen.maximize();

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
function CreateLobbyScreen() {
  lobbyScreen = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  connectToServerScreen.close();
  connectToServerScreen = null;
  lobbyScreen.fullScreen = true;
  lobbyScreen.webContents.toggleDevTools();
  lobbyScreen.loadFile(`${baseFilePath}lobbyScreen/lobbyScreen.html`);
}

//create the candidate login page
function CreateCandidateLoginScreen() {
  candidateLoginScreen = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  lobbyScreen.close();
  lobbyScreen = null;
  candidateLoginScreen.fullScreen = true;
  candidateLoginScreen.webContents.toggleDevTools();
  candidateLoginScreen.loadFile(
    `${baseFilePath}candidateLoginScreen/candidateLoginScreen.html`
  );
}

ipcMain.on("channel1", (e, args) => {
  e.sender.send("channel2", systemConfiguration);
});

ipcMain.on("channel3", (e, args) => {
  serverIpAddress = args;
  CreateLobbyScreen();
});

ipcMain.on("channel4", (e, args) => {
  e.sender.send("channel5", serverIpAddress);
});

ipcMain.on("channel6", (e, args) => {
  CreateCandidateLoginScreen();
});

ipcMain.on("channel7", (e, args) => {
  console.log(args);
  CreateNetworkTestScreen();
});

app.on("ready", function () {
  CreateSplashScreen();
});

process.env.NODE_ENV = "development";
