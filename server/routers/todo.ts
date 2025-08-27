import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

type Todo = { id: number; text: string; done: boolean };
let todos: Todo[] = [{ id: 1, text: "Commencer la journée", done: false }];

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

  update: t.procedure
    .input(z.object({ id: z.number(), text: z.string() }))
    .mutation(({ input }) => {
      const todo = todos.find((t) => t.id === input.id);
      if (todo) todo.text = input.text;
      return todo;
    }),

  delete: t.procedure
    .input(z.number())
    .mutation(({ input }) => {
      todos = todos.filter((t) => t.id !== input);
      return { id: input };
    }),
});
