const macaddress = require("macaddress");

macaddress.one(function (err, mac) {
  console.log(`Mac Address is ${mac}`);
});
