import axios from "axios";
const BVBSTATS_API_URL = process.env.REACT_APP_BVBSTATS_API_URL;

const bvbstatsapi = axios.create({
  baseURL: BVBSTATS_API_URL,
});

// Get search results
export const searchPlayers = async (text) => {
  const params = new URLSearchParams({
    text: text,
  });
  const response = await bvbstatsapi.get(`SearchPlayer?${params}`);
  return response.data;
};

export const searchTeams = async (text) => {
  const params = new URLSearchParams({
    text: text,
  });
  const response = await bvbstatsapi.get(`SearchTeam?${params}`);
  return response.data;
};

export const getMatchesForTeam = async (teamId) => {
  const params = new URLSearchParams({
    teamId: teamId,
  });
  const response = await bvbstatsapi.get(`GetMatchesForTeam?${params}`);
  return response.data;
};

export const storeMatch = async (text) => {
  var data = text;

  var config = {
    method: "post",
    url: BVBSTATS_API_URL + "PostMatch",
    headers: {
      "Content-Type": "application/json-patch+json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      //   console.log(JSON.stringify(response.data));
      return JSON.stringify(response.data);
    })
    .catch(function (error) {
      //   console.log(error);
      return error;
    });
};

export const updateMatchVideoOffset = async (matchId, videoOffset) => {
  var data = "";

  var config = {
    method: "put",
    url: BVBSTATS_API_URL + "UpdateMatchVideoOffset?matchId=" + matchId + "&videoOffset=" + videoOffset,
    headers: {},
    data: data,
  };

  axios(config)
    .then(function (response) {
      return JSON.stringify(response.data);
    })
    .catch(function (error) {
      return error;
    });
};
