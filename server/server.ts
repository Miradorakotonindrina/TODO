import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { initTRPC } from "@trpc/server";
import { todoRouter } from "./routers/todo";

const t = initTRPC.create();

const appRouter = t.router({
  hello: t.procedure.query(() => ({ message: "Liste des choses à faire aujourd'hui" })),
  todo: todoRouter,
});

export type AppRouter = typeof appRouter;

const app = express();

app.use(cors({ origin: "http://localhost:5173" })); // autoriser le frontend

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  }),
);

app.listen(4000, () => {
  console.log("TRPC server running on http://localhost:4000/trpc");
});
