import { createTRPCRouter } from "../init";
import { statsRouter } from "./stats";
import { leaderboardRouter } from "./leaderboard";
import { submitRouter } from "./submit";

export const appRouter = createTRPCRouter({
  stats: statsRouter,
  leaderboard: leaderboardRouter,
  submit: submitRouter,
});

export type AppRouter = typeof appRouter;
