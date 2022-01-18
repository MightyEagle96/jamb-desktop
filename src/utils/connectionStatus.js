const { default: axios } = require("axios");
const { ipcRenderer, BrowserWindow } = require("electron");
const { default: Swal } = require("sweetalert2");
const { port } = require("./data");

const connectionStatus = document.querySelector(".connectionStatus");
exports.PerformNetworkTest = (serverIpAddress) => {
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
};

exports.IsConnctedToServer = (serverIpAddress) => {
  const serverConnection = setInterval(async () => {
    try {
      const path = `http://${serverIpAddress}:${port}/serverConnected`;
      const res = await axios(path);
      if (res && res.data.connected && !res.data.shutDown) {
        connectionStatus.classList.add("text-success");
        connectionStatus.textContent = "CONNECTED";
        connectionStatus.classList.remove("text-danger");
      } else {
        ipcRenderer.send("shutDownApp", "Oya shut down");
      }
      //else if(res && res.data)
    } catch (error) {
      if (error && error.response.data.message) {
        ipcRenderer.send("connectToServer", true);
        clearInterval(serverConnection);
      }
      ChangeConnctionStatusText();
    }
  }, 1500);
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

exports.GetCenterDetails = async (serverIpAddress) => {
  const path = `http://${serverIpAddress}:${port}/centerDetails`;
  const res = await axios.get(path);

  if (res && res.data.centerDetails) {
    document.querySelector(".centerName").textContent =
      "Center Name: " + res.data.centerDetails.centerName;
  }
};
