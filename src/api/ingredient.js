const axios = require("axios");

const url = "https://kqulqn.sse.codesandbox.io";

exports.createIngredient = (id, newIngredient) => {
  axios.post(url + "/api/ingredient/" + id, newIngredient).then((res) => {
    return res.status;
  });
};

exports.getIngredient = (id) => {
  axios.get(url + "/api/ingredient/" + id).then((res) => {
    return res;
  });
};

exports.deleteIngredient = (id) => {
  axios.delete(url + "/api/ingredient/" + id).then((res) => {
    return res.status;
  });
};

exports.modifyIngredient = (id, newIngredient) => {
  axios.put(url + "/api/ingredient/" + id, newIngredient).then((res) => {
    return res.status;
  });
};

exports.getIngredients = () => {
  axios.get(url + "/api/ingredient").then((res) => {
    return res;
  });
};
