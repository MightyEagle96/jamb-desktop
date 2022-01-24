const { default: axios } = require("axios");

exports.port = 5000;

exports.GetQuestions = async (serverIpAddress) => {
  const path = `http://${serverIpAddress}:${this.port}/getQuestions`;
  const res = await axios.get(path);

  return res.data.questions;
};
