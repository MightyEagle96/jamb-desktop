const fs = require("fs");

exports.WriteServerString = (serverIpAddress) => {
  const path = "./serverAddress.txt";
  fs.writeFile(path, JSON.stringify(serverIpAddress), (err) => {
    if (err) {
      console.log(err);
    }
  });
};
