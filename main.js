const electron = require("electron");
const ip = require("ip");
const si = require("systeminformation");
const macaddress = require("macaddress");
const { GetQuestions, RandomizeQuestions } = require("./src/utils/data");
//const { GetQuestions } = require("./src/utils/connectionStatus");

const { app, BrowserWindow, Menu, globalShortcut, ipcMain, powerSaveBlocker } =
  electron;

const baseFilePath = "./src/screens/";

let connectToServerScreen,
  splashScreen,
  networkTestScreen,
  candidateLoginScreen,
  lobbyScreen,
  examinationScreen;

let serverIpAddress, networkTestDuration;

let focused = true;

let examinationQuestions = [];

let candidate = {};

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
  si.osInfo()
    .then((d) => {
      systemConfiguration.platform = d.platform;
    })
    .catch(() => {
      systemConfiguration.platform = "N/A";
    });

  //mac address && ethernet
  si.networkInterfaces()
    .then((data) => {
      try {
        systemConfiguration.macAddress = data.find(
          (d) => d.iface === "Ethernet"
        ).mac;
      } catch (error) {
        systemConfiguration.macAddress = "-";
        macaddress.one(function (err, mac) {
          systemConfiguration.macAddress = mac;
        });
      }
      try {
        systemConfiguration.dhcp =
          data.find((d) => d.iface === "Ethernet").dhcp || false;
      } catch (error) {
        systemConfiguration.dhcp = false;
      }
    })
    .catch(() => {
      systemConfiguration.macAddress = "N/A";
      systemConfiguration.dhcp = false;
    });

  //operating system
  si.osInfo()
    .then((data) => {
      systemConfiguration.operatingSystem = data.distro;
    })
    .catch(() => {
      systemConfiguration.operatingSystem = "N/A";
    });

  //processor
  si.cpu()
    .then((data) => {
      systemConfiguration.processor = `${data.manufacturer} ${data.brand}`;
    })
    .catch(() => {
      systemConfiguration.processor = "N/A";
    });

  //system model
  si.system()
    .then((data) => {
      systemConfiguration.systemModel = data.model;
    })
    .catch(() => {
      systemConfiguration.systemModel = "N/A";
    });
  //RAM
  si.mem()
    .then((data) => {
      systemConfiguration.ram = `${Math.ceil(data.total / 1073741824)} GB`;
    })
    .catch(() => {
      systemConfiguration.ram = "N/A";
    });
  //DISK storage
  si.fsSize()
    .then((data) => {
      systemConfiguration.diskStorage = hardDiskSize(data[0].size);
    })
    .catch(() => {
      systemConfiguration.diskStorage = "N/A";
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
      splashScreen = null;

      CreateConnectToServerScreen();
      clearInterval(complete);
    }
  }, 1000);

  setTimeout(() => {
    clearInterval(complete);
    if (splashScreen) {
      splashScreen.close();
      splashScreen = null;

      systemConfiguration.ipAddress = systemConfiguration.ipAddress
        ? systemConfiguration.ipAddress
        : "N/A";
      systemConfiguration.macAddress = systemConfiguration.macAddress
        ? systemConfiguration.macAddress
        : "N/A";
      systemConfiguration.operatingSystem = systemConfiguration.operatingSystem
        ? systemConfiguration.operatingSystem
        : "N/A";
      systemConfiguration.platform = systemConfiguration.platform
        ? systemConfiguration.platform
        : "N/A";
      systemConfiguration.systemModel = systemConfiguration.systemModel
        ? systemConfiguration.systemModel
        : "N/A";
      systemConfiguration.ram = systemConfiguration.ram
        ? systemConfiguration.ram
        : "N/A";
      systemConfiguration.diskStorage = systemConfiguration.diskStorage
        ? systemConfiguration.diskStorage
        : "N/A";
      systemConfiguration.processor = systemConfiguration.processor
        ? systemConfiguration.processor
        : "N/A";

      CreateConnectToServerScreen();
    }
  }, 40000);
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
  //connectToServerScreen.webContents.toggleDevTools();
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
  if (lobbyScreen) {
    lobbyScreen.close();
    lobbyScreen = null;
  }
  // networkTestScreen.webContents.toggleDevTools();
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
  //candidateLoginScreen.webContents.toggleDevTools();
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

//create the examination screen
function CreateExaminationScreen() {
  examinationScreen = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  // examinationScreen.webContents.toggleDevTools();
  examinationScreen.fullScreen = true;
  examinationScreen.loadFile(
    `${baseFilePath}examinationScreen/examinationScreen.html`
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
  if (examinationScreen) {
    examinationScreen.close();
    examinationScreen = null;
  }
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

ipcMain.on("shutDownApp", (e, args) => {
  app.quit();
});

ipcMain.on("getQuestions", (e, args) => {
  if (serverIpAddress !== "") {
    GetQuestions(serverIpAddress).then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (
          candidate.subjectCombinations.find(
            (sub) =>
              sub.subject._id.toString() === data[i].subject._id.toString()
          )
        ) {
          data[i].questions = RandomizeQuestions(
            data[i].questions,
            data[i].questions.length
          );
          examinationQuestions.push(data[i]);
        }
      }

      if (examinationQuestions.length > 0) {
        e.sender.send("sendQuestions", examinationQuestions);
      }
    });
  }
});

ipcMain.on("resetQuestions", (e, args) => {
  examinationQuestions = args;
});
app.on("ready", function () {
  powerSaveBlocker.start("prevent-display-sleep");
  CreateSplashScreen();
});

ipcMain.on("connectToServer", (e, args) => {
  if (args) {
    if (networkTestScreen) {
      networkTestScreen.close();
      networkTestScreen = null;
    }
    if (candidateLoginScreen) {
      candidateLoginScreen.close();
      candidateLoginScreen = null;
    }
    if (lobbyScreen) {
      lobbyScreen.close();
      lobbyScreen = null;
    }
    CreateConnectToServerScreen();
  }
});

ipcMain.on("login", (e, args) => {
  if (networkTestScreen) {
    networkTestScreen.close();
    networkTestScreen = null;
  }
  if (candidateLoginScreen) {
    candidateLoginScreen.close();
    candidateLoginScreen = null;
  }
  if (lobbyScreen) {
    lobbyScreen.close();
    lobbyScreen = null;
  }
  CreateExaminationScreen();
});

//to save the candidate
ipcMain.on("storeCandidate", (e, args) => {
  if (args) {
    candidate = args;
  }
});

//to send the candidate to the renderer
ipcMain.on("fetchCandidate", (e, args) => {
  e.sender.send("candidate", candidate);
});

app.whenReady().then(() => {
  globalShortcut.register("Control+Shift+Q", () => {
    app.quit();
  });

  // globalShortcut.register("Control+Shift+I", () => {
  //   BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
  // });
  globalShortcut.register("Super+Tab", () => {
    app.quit();
  });
  globalShortcut.unregister("Win+R");
});

app.on("browser-window-focus", () => {
  focused = true;
  ipcMain.on("focusedState", (e, args) => {
    e.sender.send("sendMessage", { focused });
  });
});
app.on("browser-window-blur", (e) => {
  focused = false;
  ipcMain.on("focusedState", (e, args) => {
    e.sender.send("sendMessage", { focused });
  });
});
app.once("before-quit", (e) => {
  e.preventDefault();

  try {
    BrowserWindow.getFocusedWindow().webContents.send("shutDown", {
      serverIpAddress,
      ipAddress: ip.address(),
    });
  } catch (error) {
    app.quit();
  }
});

//process.env.NODE_ENV = "development";
process.env.NODE_ENV = "production";
