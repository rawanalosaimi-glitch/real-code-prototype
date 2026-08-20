import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, ExternalLink, FileText, Loader2, Search, Send, ShieldCheck, User } from "lucide-react";
import { askAlarad } from "@/lib/rag/ask.functions";

const suggestions = [
  "What should ALARAD do when an occupational dose approaches the applicable limit?",
  "What regulation applies to occupational dose limits in Saudi Arabia?",
  "What must we do if a leak is detected in the waste storage area?",
  "How is dose data privacy handled for staff records?",
];

export function AIAssistant() {
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState<string | null>(null);
  const ask = useServerFn(askAlarad);

  const mutation = useMutation({
    mutationFn: (q: string) => ask({ data: { question: q } }),
  });

  const submit = (q: string) => {
    const text = q.trim();
    if (text.length < 3) return;
    setQuestion(text);
    setInput("");
    mutation.mutate(text);
  };

  const result = mutation.data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Ask ALARAD AI</h2>
        <p className="text-sm text-slate-500">
          Retrieval-augmented answering over the indexed NRRC, IAEA and facility documents:
          extraction → chunking → embeddings → vector retrieval → LLM → answer with source and page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-600" />
              Regulatory Q&amp;A
            </CardTitle>
            <CardDescription>Answers are grounded in retrieved document excerpts only</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about dose limits, leaks, monitoring, ALARA, privacy..."
              />
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>

            {question && (
              <div className="flex justify-end gap-2">
                <div className="rounded-lg bg-indigo-600 text-white p-3 text-sm max-w-[85%]">
                  {question}
                </div>
                <div className="h-8 w-8 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
              </div>
            )}

            {mutation.isPending && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Embedding question, retrieving matching clauses, generating answer...
              </div>
            )}

            {mutation.isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                The AI service could not be reached. Please try again.
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    AI Answer
                  </p>
                  <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 whitespace-pre-line">
                    {result.answer}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className="bg-indigo-100 text-indigo-800">
                      {result.engine === "embeddings+llm"
                        ? "Embeddings + LLM retrieval"
                        : "Keyword fallback"}
                    </Badge>
                    {!result.matched && (
                      <Badge className="bg-amber-100 text-amber-800">No matching topic</Badge>
                    )}
                  </div>
                </div>

                {result.sources.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Source
                    </p>
                    {result.sources.map((source) => (
                      <a
                        key={source.chunkId}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-lg border border-slate-200 bg-white p-3 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
                      >
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                          {source.issuer} — {source.section}
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <FileText className="h-3 w-3" />
                          Document: {source.document} • Page {source.page}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Similarity {(source.similarity * 100).toFixed(1)}% • {source.reference}
                        </p>
                      </a>
                    ))}
                  </div>
                )}

                {result.recommendedAction && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Recommended action
                    </p>
                    <div className="mt-1 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
                      <ShieldCheck className="h-4 w-4" />
                      {result.recommendedAction}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Search className="h-5 w-5 text-slate-500" />
              Example Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                className="w-full text-left text-sm bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-3 text-slate-700 transition-colors"
              >
                {s}
              </button>
            ))}
            <p className="text-xs text-slate-400 pt-2">
              Indexed corpus: NRRC Radiation Safety Regulations, IAEA GSR Part 3, facility ALARA
              programme and emergency response plan.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
