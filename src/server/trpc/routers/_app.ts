import { createTRPCRouter } from "../init";
import { leaderboardRouter } from "./leaderboard";
import { statsRouter } from "./stats";
import { submitRouter } from "./submit";

export const appRouter = createTRPCRouter({
  stats: statsRouter,
  leaderboard: leaderboardRouter,
  submit: submitRouter,
});

export type AppRouter = typeof appRouter;
