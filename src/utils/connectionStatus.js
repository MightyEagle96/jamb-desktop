const { default: axios } = require("axios");
const { ipcRenderer } = require("electron");
const { default: Swal } = require("sweetalert2");
const { port } = require("./data");
const ip = require("ip");

const connectionStatus = document.querySelector(".connectionStatus");

let serverAddress = "";
function GetServerIpAddress() {
  ipcRenderer.send("channel4", "Server IP Address");
  ipcRenderer.on("channel5", (e, args) => {
    serverAddress = args;
  });
}

GetServerIpAddress();

exports.PerformNetworkTest = () => {
  ipcRenderer.send("channel4", "Server Ip Address");
  ipcRenderer.on("channel5", (e, serverIpAddress) => {
    if (serverIpAddress) {
      const timer = setInterval(async () => {
        try {
          const path = `http://${serverIpAddress}:${port}/networkTest`;
          const res = await axios.get(path);
          if (res.data.networkTest.isActive) {
            clearInterval(timer);
            ipcRenderer.send("channel7", {
              duration: res.data.networkTest.duration,
            });
          }
        } catch (error) {
          ChangeConnctionStatusText();
        }
      }, 1200);
    }
  });
};

exports.IsConnctedToServer = () => {
  ipcRenderer.send("channel4", "Server Ip Address");
  ipcRenderer.on("channel5", (e, serverIpAddress) => {
    if (serverIpAddress) {
      const serverConnection = setInterval(async () => {
        try {
          const path = `http://${serverIpAddress}:${port}/serverConnected`;
          const res = await axios.post(path, { ipAddress: ip.address() });
          if (res && res.data.connected && !res.data.shutDown) {
            connectionStatus.classList.add("text-success");
            connectionStatus.textContent = "CONNECTED";
            connectionStatus.classList.remove("text-danger");
          } else {
            ipcRenderer.send("shutDownApp", "Oya shut down");
          }
        } catch (error) {
          ChangeConnctionStatusText();
          if (error && error.message && !error.response) {
            clearInterval(serverConnection);
            Swal.fire({
              icon: "warning",
              titleText: "Network Connection Lost",
              confirmButtonText: "Retry connection",
            }).then(() => {
              ipcRenderer.send("channel4", "Please let me have the IP address");
              ipcRenderer.on("channel5", (e, args) => {
                this.IsConnctedToServer();
              });
            });
          } else if (error && error.response.data.message) {
            ipcRenderer.send("connectToServer", true);
            clearInterval(serverConnection);
          }
        }
      }, 1500);
    }
  });
};

function ChangeConnctionStatusText() {
  connectionStatus.classList.remove("text-success");
  connectionStatus.textContent = "DISCONNECTED";
  connectionStatus.classList.add("text-danger");
}

exports.ShutDownApplication = () => {
  ipcRenderer.on("shutDown", async (e, args) => {
    console.log(args);
    const path = `http://${args.serverIpAddress}:${port}/applicationClosed`;
    const res = await axios.post(path, { ipAddress: args.ipAddress });

    if (res) {
      console.log(res.data);
      ipcRenderer.send("appHasClosed", true);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error Shutting Down",
        text: "Please contact administrator",
      });
    }
  });
};

exports.GetCenterDetails = () => {
  ipcRenderer.send("channel4", "lemme have the Ip Address");
  ipcRenderer.on("channel5", async (e, serverIpAddress) => {
    const path = `http://${serverIpAddress}:${port}/centerDetails`;
    const res = await axios.get(path);

    if (res && res.data.centerDetails) {
      document.querySelector(".centerName").textContent =
        "Centre Name: " + res.data.centerDetails.centerName;
    }
  });
};
