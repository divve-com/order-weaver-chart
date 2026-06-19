import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Plus, Send, Trash2, MessageSquare, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type ChatRole = "user" | "assistant";
type ChatMsg = { id: string; role: ChatRole; content: string };
type Thread = { id: string; title: string; updated_at: string };

const FN_URL = "https://pyqhjbkwkdolbmvpzhly.supabase.co/functions/v1/chat-orders";

export default function Chat() {
  const { threadId } = useParams<{ threadId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load threads
  const loadThreads = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("chat_threads")
      .select("id,title,updated_at")
      .order("updated_at", { ascending: false });
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return; }
    setThreads(data ?? []);
  };

  useEffect(() => { void loadThreads(); /* eslint-disable-next-line */ }, [user?.id]);

  // Load messages for current thread
  useEffect(() => {
    if (!threadId) { setMessages([]); return; }
    (async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("id, role, parts")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
      if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return; }
      const msgs: ChatMsg[] = (data ?? [])
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          id: m.id,
          role: m.role as ChatRole,
          content: extractText(m.parts),
        }));
      setMessages(msgs);
    })();
  }, [threadId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => { inputRef.current?.focus(); }, [threadId]);

  const createThread = async (initialTitle = "Neuer Chat"): Promise<string | null> => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("chat_threads")
      .insert({ user_id: user.id, title: initialTitle })
      .select("id")
      .single();
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return null; }
    await loadThreads();
    return data.id;
  };

  const handleNewChat = async () => {
    const id = await createThread();
    if (id) navigate(`/chat/${id}`);
  };

  const deleteThread = async (id: string) => {
    const { error } = await supabase.from("chat_threads").delete().eq("id", id);
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return; }
    if (threadId === id) navigate("/chat");
    await loadThreads();
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending || !user) return;

    let activeId = threadId;
    if (!activeId) {
      activeId = (await createThread(text.slice(0, 60))) ?? undefined;
      if (!activeId) return;
      navigate(`/chat/${activeId}`, { replace: true });
    }

    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", content: text };
    const assistantId = crypto.randomUUID();
    setMessages((m) => [...m, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setSending(true);

    // Persist user message
    void supabase.from("chat_messages").insert({
      thread_id: activeId,
      user_id: user.id,
      role: "user",
      parts: [{ type: "text", text }],
    });

    // Update thread title if first message
    if (messages.length === 0) {
      void supabase.from("chat_threads").update({ title: text.slice(0, 60) }).eq("id", activeId);
    }

    try {
      const { data: sess } = await supabase.auth.getSession();
      const jwt = sess.session?.access_token;
      const allMessages = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(FN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });
      if (!res.ok || !res.body) {
        const err = await res.text();
        throw new Error(err || `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => m.map((msg) => msg.id === assistantId ? { ...msg, content: acc } : msg));
      }

      await supabase.from("chat_messages").insert({
        thread_id: activeId,
        user_id: user.id,
        role: "assistant",
        parts: [{ type: "text", text: acc }],
      });
      await supabase.from("chat_threads").update({ updated_at: new Date().toISOString() }).eq("id", activeId);
      void loadThreads();
    } catch (err: any) {
      toast({ title: "Chat-Fehler", description: err.message ?? String(err), variant: "destructive" });
      setMessages((m) => m.filter((msg) => msg.id !== assistantId));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:h-screen">
      {/* Threads sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-border bg-card">
        <div className="p-3 border-b">
          <Button onClick={handleNewChat} className="w-full justify-start gap-2" variant="default">
            <Plus className="h-4 w-4" /> Neuer Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {threads.length === 0 && (
            <p className="text-xs text-muted-foreground px-2 py-4">Noch keine Chats</p>
          )}
          {threads.map((t) => (
            <div
              key={t.id}
              className={cn(
                "group flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-lavender-50",
                threadId === t.id && "bg-lavender-100 font-medium"
              )}
              onClick={() => navigate(`/chat/${t.id}`)}
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate flex-1">{t.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); void deleteThread(t.id); }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                aria-label="Löschen"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col">
        <div className="border-b border-border px-6 py-4">
          <h1 className="text-lg font-semibold">Auftrags-Chat</h1>
          <p className="text-xs text-muted-foreground">Frag etwas zu deinen Aufträgen — Antworten basieren auf Pinecone-Suche.</p>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-16">
                <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Stelle eine Frage zu deinen Aufträgen, z.&nbsp;B. „Welche Aufträge sind überfällig?"</p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "user" ? (
                  <div className="max-w-[80%] rounded-2xl bg-primary text-primary-foreground px-4 py-2.5 text-sm whitespace-pre-wrap">
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[85%] text-sm prose prose-sm dark:prose-invert">
                    {m.content ? (
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Denke nach…
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={sendMessage} className="border-t border-border p-4">
          <div className="mx-auto max-w-3xl flex gap-2 items-end">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage(e as unknown as FormEvent);
                }
              }}
              placeholder="Frage zu Aufträgen stellen…"
              className="min-h-[52px] max-h-40 resize-none"
              disabled={sending}
            />
            <Button type="submit" disabled={sending || !input.trim()} size="icon" className="h-[52px] w-[52px] shrink-0">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

function extractText(parts: unknown): string {
  if (Array.isArray(parts)) {
    return parts
      .map((p: any) => (p && typeof p === "object" && p.type === "text" ? p.text : ""))
      .join("");
  }
  return "";
}