const electron = require("electron");
const ip = require("ip");
const si = require("systeminformation");

const { app, BrowserWindow, Menu, globalShortcut, ipcMain, MenuItem } =
  electron;

let mainWindow, splashScreen, examinationScreen, networkTestScreen;

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

      createWindow();
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
  splashScreen.loadFile("./screens/splashScreen/splashScreen.html");
  splashScreen.resizable = false;
  splashScreen.minimizable = false;
  splashScreen.focus();
  //splashScreen.closable = false;

  splashScreen.once("ready-to-show", () => {
    splashScreen.show();

    GetSystemConfiguration();
  });
}
