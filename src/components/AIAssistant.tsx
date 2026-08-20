import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, Search, Send, User } from "lucide-react";

type Message = { role: "user" | "assistant"; text: string };

const suggestions = [
  "What is my remaining monthly dose allowance?",
  "Summarize today's anomalies in Waste Storage",
  "Which staff members are approaching their dose limits?",
  "What are the ALARA steps for a dose rate spike?",
];

const cannedAnswer =
    "Based on the current monitoring data, dose rates in Zones A and B are within normal limits. Waste Storage shows a spike at 2.3x threshold — restrict access and follow ALARA procedures: reduce time, increase distance, add shielding.";

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello, I'm the ALARAD safety assistant. Ask me about dose levels, alerts, or radiation safety procedures.",
    },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "assistant", text: cannedAnswer },
    ]);
    setInput("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Ask AI</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-600" />
              Safety Assistant
            </CardTitle>
            <CardDescription>Answers grounded in facility monitoring data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="h-8 w-8 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-indigo-600" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 text-sm max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-50 border border-slate-200 text-slate-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === "user" && (
                    <div className="h-8 w-8 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about dose levels, alerts, or procedures..."
              />
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Search className="h-5 w-5 text-slate-500" />
              Suggested Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left text-sm bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-3 text-slate-700 transition-colors"
              >
                {s}
              </button>
            ))}
            <Badge className="bg-blue-100 text-blue-800">Demo responses</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
