import React, { useState, useEffect } from "react";
import { MessageSquare, Send, CheckCircle2, Trash2, ShieldCheck, Mail, User } from "lucide-react";
import { SupportMessage, DbUser } from "../types.ts";

interface SupportFormProps {
  dbUser: DbUser | null;
  getAuthToken: () => Promise<string | null>;
}

export const SupportForm: React.FC<SupportFormProps> = ({ dbUser, getAuthToken }) => {
  const [name, setName] = useState(dbUser?.name || "");
  const [email, setEmail] = useState(dbUser?.email || "");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin Queue state
  const [queue, setQueue] = useState<SupportMessage[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);

  useEffect(() => {
    if (dbUser) {
      setName(dbUser.name);
      setEmail(dbUser.email);
    }
  }, [dbUser]);

  const fetchQueue = async () => {
    if (!dbUser) return;
    setIsLoadingQueue(true);
    try {
      const token = await getAuthToken();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/support/messages", { headers });
      if (res.ok) {
        const data = await res.json();
        setQueue(data);
      }
    } catch (err) {
      console.error("Failed to fetch support messages:", err);
    } finally {
      setIsLoadingQueue(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [dbUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);

    try {
      const res = await fetch("/api/support/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, text: message }),
      });

      if (!res.ok) {
        throw new Error("Failed to send support message.");
      }

      setSubmitSuccess(true);
      setMessage("");
      fetchQueue(); // Reload queue
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearQueue = async () => {
    if (!window.confirm("Are you sure you want to clear all messages in the support queue?")) return;

    try {
      const token = await getAuthToken();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/support/messages", {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        setQueue([]);
      }
    } catch (err) {
      console.error("Failed to clear support queue:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Support Submission Form */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6">
        <div>
          <h4 className="font-sans font-bold text-lg text-slate-900 leading-tight">Human Support Desk</h4>
          <p className="text-xs text-slate-500 mt-1">Submit an inquiry or report directly to the medical support queue.</p>
        </div>

        {submitSuccess && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-0.5">Message Sent Successfully</p>
              <p className="text-xs text-emerald-700">Thank you. Your request is registered. If you are experiencing a life-threatening emergency, call local emergency lines immediately.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Your Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition duration-150"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email (Optional)</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition duration-150"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Message / Inquiry</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your question or guidelines request..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition duration-150"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2 shadow-md shadow-teal-500/15 cursor-pointer disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>{isSubmitting ? "Submitting..." : "Submit Inquiry"}</span>
          </button>
        </form>
      </div>

      {/* Support Queue Status */}
      <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="font-sans font-bold text-lg text-slate-900 leading-tight">Live Support Queue</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {dbUser ? "Viewing message queue from PostgreSQL." : "Log in to view the live database queue."}
              </p>
            </div>
            {dbUser && queue.length > 0 && (
              <button
                onClick={handleClearQueue}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 border border-rose-100 rounded-xl transition duration-200 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Queue</span>
              </button>
            )}
          </div>

          {/* Queue List */}
          {!dbUser ? (
            <div className="bg-white/60 border border-slate-100 rounded-2xl p-8 text-center mt-4">
              <ShieldCheck className="h-7 w-7 text-slate-400 mx-auto mb-2" />
              <h5 className="font-bold text-slate-700 text-sm">Secure Database Portal</h5>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Please sign in with your Google account to authorize secure lookup of support inquiries.</p>
            </div>
          ) : isLoadingQueue ? (
            <div className="space-y-3 mt-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-xl h-24" />
              ))}
            </div>
          ) : queue.length > 0 ? (
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
              {queue.map((q) => (
                <article key={q.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm leading-tight">{q.name}</h5>
                      {q.email && <span className="text-[10px] text-slate-400 font-medium">{q.email}</span>}
                    </div>
                    <span className="shrink-0 bg-amber-50 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-100">
                      {q.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-slate-50/50 p-2.5 rounded-xl border border-slate-50">{q.text}</p>
                  <div className="text-[9px] text-slate-400 font-medium mt-2 flex justify-end">
                    {new Date(q.createdAt).toLocaleString()}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white/60 border border-slate-100 rounded-2xl p-8 text-center mt-4">
              <MessageSquare className="h-7 w-7 text-slate-400 mx-auto mb-2" />
              <h5 className="font-bold text-slate-700 text-sm">No Messages Received</h5>
              <p className="text-xs text-slate-500 mt-1">The human support queue is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SupportForm;
