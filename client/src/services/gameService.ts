import API from "./api";
import type { BoardRow } from "../game/Leaderboard";

export const getLeaderboard = async (): Promise<BoardRow[]> =>
  (await API.get("/game/leaderboard")).data;

export const getChallenge = async (userId: string) =>
  (await API.get(`/game/challenge/${userId}`)).data as {
    username: string;
    highScore: number;
    highestLevel: number;
  };

export const getMyGame = async () =>
  (await API.get("/game/me")).data as {
    highScore: number;
    highestLevel: number;
    userId: string;
  };

export const postScore = async (body: { score: number; level: number }) =>
  (await API.post("/game/score", body)).data as {
    highScore: number;
    highestLevel: number;
  };
