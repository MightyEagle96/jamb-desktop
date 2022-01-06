const { default: axios } = require("axios");
const { ipcRenderer } = require("electron");
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
      // ChangeConnctionStatusText();
    }
  }, 1500);
};

exports.IsConnctedToServer = (serverIpAddress) => {
  setInterval(async () => {
    try {
      const path = `http://${serverIpAddress}:${port}/serverConnected`;
      const res = await axios(path);
      if (res) {
        connectionStatus.classList.add("text-success");
        connectionStatus.textContent = "CONNECTED";
        connectionStatus.classList.remove("text-danger");
      }
    } catch (error) {
      ChangeConnctionStatusText();
    }
  }, 2500);
};

function ChangeConnctionStatusText() {
  connectionStatus.classList.remove("text-success");
  connectionStatus.textContent = "DISCONNECTED";
  connectionStatus.classList.add("text-danger");
}
