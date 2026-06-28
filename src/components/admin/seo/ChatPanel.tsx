"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };
type AuthFetch = (path: string, init?: RequestInit) => Promise<Response>;

export function ChatPanel({ authFetch }: { authFetch: AuthFetch }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    });
  };

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    scrollToBottom();

    try {
      const res = await authFetch("/api/admin/seo/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: `[Error: ${(err as { error?: string }).error ?? res.status}]` };
          return copy;
        });
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
        scrollToBottom();
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: "[Error de red]" };
        return copy;
      });
    } finally {
      setStreaming(false);
      scrollToBottom();
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-[#1e3a5f]">Chat con el agente</h3>
        <p className="text-xs text-gray-500">Pregunta sobre los datos: «¿por qué cayó la posición de X?», «¿qué keyword priorizar?»</p>
      </CardHeader>
      <CardContent>
        <div ref={scrollRef} className="h-72 overflow-y-auto space-y-3 mb-3 pr-1">
          {messages.length === 0 && <p className="text-sm text-gray-400">Aún no hay mensajes.</p>}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === "user" ? "bg-[#1e3a5f] text-white" : "bg-muted text-gray-800"
                }`}
              >
                {m.content || (streaming ? "…" : "")}
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta…"
            disabled={streaming}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <Button type="submit" disabled={streaming || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
