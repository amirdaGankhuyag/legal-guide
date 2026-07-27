import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FiCpu,
  FiSend,
  FiTrash2,
  FiAlertTriangle,
  FiMessageSquare,
} from "react-icons/fi";
import axios from "../utils/axios";
import { useLanguage } from "../context/LanguageContext";

const MAX_MESSAGES = 20;

const Chat = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  const limitReached = messages.length >= MAX_MESSAGES;

  const send = async (preset) => {
    const text = (preset ?? input).trim();
    if (!text || loading || limitReached) return;

    // setMessages шууд шинэчлэгддэггүй тул шинэ массивыг тусад нь барьж илгээнэ
    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("chat", { messages: next });
      setMessages([...next, res.data.data]);
    } catch (err) {
      toast.error(err.response?.data?.error || t("chat.error"));
      setMessages(messages);
      setInput(text);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    t("chat.suggestion1"),
    t("chat.suggestion2"),
    t("chat.suggestion3"),
  ];

  return (
    <div className="min-h-[calc(100vh-4.75rem)] bg-slate-50 px-4 py-10 font-sans dark:bg-slate-950">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
            <FiCpu size={15} />
            {t("chat.badge")}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
            {t("chat.title")}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t("chat.subtitle")}
          </p>
        </div>

        <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          <FiAlertTriangle className="mt-0.5 shrink-0" size={16} />
          <p>{t("chat.disclaimer")}</p>
        </div>

        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-[55vh] space-y-4 overflow-y-auto p-5">
            {messages.length === 0 && !loading ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <FiMessageSquare size={24} />
                </div>
                <p className="mb-1 font-semibold text-slate-900 dark:text-white">
                  {t("chat.emptyTitle")}
                </p>
                <p className="mb-6 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                  {t("chat.emptyHint")}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role !== "user" && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <FiCpu size={15} />
                    </span>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    }`}
                  >
                    {msg.text}
                    {msg.truncated && (
                      <span className="mt-2 block text-xs opacity-70">
                        {t("chat.truncated")}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <FiCpu size={15} />
                </span>
                <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 px-4 py-3.5 dark:bg-slate-800">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-slate-100 p-4 dark:border-slate-800">
            {limitReached && (
              <p className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-center text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
                {t("chat.limitReached")}
              </p>
            )}
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={t("chat.placeholder")}
                rows="2"
                maxLength={2000}
                disabled={loading || limitReached}
                className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading || limitReached}
                aria-label={t("chat.send")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
              >
                <FiSend size={17} />
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between">
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-red-600 disabled:opacity-50 dark:text-slate-400 dark:hover:text-red-400"
                >
                  <FiTrash2 size={13} />
                  {t("chat.clear")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
