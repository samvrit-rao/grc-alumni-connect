"use client";

import { useState } from "react";

interface AlumniItem {
  id: string;
  name: string;
  currentTitle: string | null;
  firmName: string;
  office: string | null;
  linkedinUrl: string;
}

function generateCoffeeChatMessage(alumni: AlumniItem, yourName: string): string {
  const firstName = alumni.name.split(" ")[0];
  return `Hi ${firstName},

I hope this message finds you well! My name is ${yourName || "[Your Name]"}, and I'm a current student at Columbia University.

I came across your profile and was really impressed by your work as ${alumni.currentTitle || "a professional"} at ${alumni.firmName}. As someone interested in consulting, I'd love to learn more about your experience.

Would you have 15-20 minutes for a quick virtual coffee chat? I'd especially love to hear about:
- Your path from Columbia to ${alumni.firmName}
- What your day-to-day looks like
- Any advice for someone preparing for consulting recruiting

Happy to work around your schedule. Thank you so much!

Best,
${yourName || "[Your Name]"}`;
}

export function MessageThread({ alumni }: { alumni: AlumniItem[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [yourName, setYourName] = useState("");
  const [messages, setMessages] = useState<Record<string, string>>({});

  const selected = alumni.find((a) => a.id === selectedId);

  const handleSelect = (a: AlumniItem) => {
    setSelectedId(a.id);
    if (!messages[a.id]) {
      setMessages((prev) => ({
        ...prev,
        [a.id]: generateCoffeeChatMessage(a, yourName),
      }));
    }
  };

  const handleCopy = () => {
    if (selected && messages[selected.id]) {
      navigator.clipboard.writeText(messages[selected.id]);
    }
  };

  return (
    <div className="flex h-full">
      {/* Left: Conversation list */}
      <div className="w-[300px] border-r border-li-border flex flex-col">
        <div className="p-3 border-b border-li-border">
          <h2 className="text-base font-semibold text-li-text">Messaging</h2>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Your name (for messages)"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              className="w-full h-8 px-3 bg-[#EEF3F8] rounded text-xs text-li-text placeholder:text-li-text-muted focus:outline-none focus:ring-1 focus:ring-li-blue"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {alumni.map((a) => (
            <button
              key={a.id}
              onClick={() => handleSelect(a)}
              className={`w-full flex items-center gap-2.5 px-3 py-3 text-left hover:bg-[#F4F2EE] transition-colors border-b border-li-border/50 ${
                selectedId === a.id ? "bg-[#EEF3F8]" : ""
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-[#E8E8E8] flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-li-text-secondary">
                  {a.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-li-text truncate">{a.name}</div>
                <div className="text-xs text-li-text-muted truncate">{a.firmName}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Message content */}
      <div className="flex-1 flex flex-col">
        {selected ? (
          <>
            {/* Thread header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-li-border">
              <div className="h-10 w-10 rounded-full bg-[#E8E8E8] flex items-center justify-center">
                <span className="text-sm font-semibold text-li-text-secondary">
                  {selected.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-li-text">{selected.name}</div>
                <div className="text-xs text-li-text-secondary">
                  {selected.currentTitle} at {selected.firmName}
                </div>
              </div>
            </div>

            {/* AI-generated summary */}
            <div className="px-4 py-3 bg-[#F8F8F8] border-b border-li-border">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="h-3.5 w-3.5 text-li-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-xs font-semibold text-li-blue">AI Summary</span>
              </div>
              <p className="text-xs text-li-text-secondary leading-relaxed">
                {selected.name} is {selected.currentTitle ? `a ${selected.currentTitle}` : "working"} at {selected.firmName}.
                {selected.office ? ` Based in ${selected.office}.` : ""}
                {" "}Consider asking about their career path, day-to-day responsibilities, and recruiting advice.
              </p>
            </div>

            {/* Message editor */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="bg-[#F4F2EE] rounded-lg p-3 max-w-[85%]">
                <p className="text-xs text-li-text-muted mb-1">Draft message -edit below</p>
              </div>
              <textarea
                value={messages[selected.id] || ""}
                onChange={(e) =>
                  setMessages((prev) => ({ ...prev, [selected.id]: e.target.value }))
                }
                className="w-full mt-3 p-3 border border-li-border rounded-lg text-sm text-li-text leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-li-blue"
                rows={12}
              />
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t border-li-border flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-full bg-li-blue text-white text-sm font-semibold hover:bg-li-blue-hover transition-colors"
              >
                Copy Message
              </button>
              <a
                href={selected.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-li-blue text-li-blue text-sm font-semibold hover:bg-li-blue/5 transition-colors"
              >
                Open LinkedIn Profile
              </a>
              <button
                onClick={() => {
                  setMessages((prev) => ({
                    ...prev,
                    [selected.id]: generateCoffeeChatMessage(selected, yourName),
                  }));
                }}
                className="px-4 py-2 rounded-full border border-li-border text-li-text-secondary text-sm font-semibold hover:bg-[#F4F2EE] transition-colors ml-auto"
              >
                Regenerate
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <svg className="h-16 w-16 mx-auto text-li-text-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="text-base font-semibold text-li-text">Your messages</h3>
              <p className="text-sm text-li-text-secondary mt-1">
                Select an alumni to generate a personalized coffee chat message
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
