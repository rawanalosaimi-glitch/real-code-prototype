import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AskInput = z.object({ question: z.string().min(3).max(1000) });

export const askAlarad = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AskInput.parse(input))
  .handler(async ({ data }) => {
    const { answerQuestion } = await import("./rag.server");
    return answerQuestion(data.question);
  });
