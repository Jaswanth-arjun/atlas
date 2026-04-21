import axios from "axios";

const API = "http://localhost:8000/api";

export const api = {
  getState: () => axios.get(`${API}/state`),
  reset: (preset) => axios.post(`${API}/reset`, { preset }),
  leaderboard: () => axios.get(`${API}/leaderboard`),
  replay: (episodeId) => axios.get(`${API}/replay/${episodeId}`),
  investorReport: (episodeId) => `${API}/investor-report/${episodeId}`
};
