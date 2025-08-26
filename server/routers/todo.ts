import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

type Todo = { id: number; text: string; done: boolean };
let todos: Todo[] = [{ id: 1, text: "Apprendre tRPC", done: false }];

export const todoRouter = t.router({
  list: t.procedure.query(() => todos),

  add: t.procedure
    .input(z.string())
    .mutation(({ input }) => {
      const newTodo: Todo = { id: Date.now(), text: input, done: false };
      todos.push(newTodo);
      return newTodo;
    }),

  toggle: t.procedure
    .input(z.number())
    .mutation(({ input }) => {
      const todo = todos.find((t) => t.id === input);
      if (todo) todo.done = !todo.done;
      return todo;
    }),
});
