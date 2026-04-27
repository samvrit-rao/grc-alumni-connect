"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Props {
  alumniName: string;
  alumniTitle: string;
  firmName: string;
  office: string;
}

export function CoffeeChatSection({ alumniName, alumniTitle, firmName, office }: Props) {
  const [yourName, setYourName] = useState("");
  const [yourYear, setYourYear] = useState("");
  const [yourInterest, setYourInterest] = useState("");
  const [message, setMessage] = useState("");
  const [generated, setGenerated] = useState(false);

  const generateMessage = () => {
    const firstName = alumniName.split(" ")[0];
    const firmShort = firmName.replace(/ & Company| Consulting Group/g, "").trim();

    let msg = `Hi ${firstName},\n\n`;
    msg += `I hope this message finds you well! My name is ${yourName || "[Your Name]"}`;
    if (yourYear) msg += `, and I'm a ${yourYear} student at Columbia University`;
    msg += `.\n\n`;
    msg += `I came across your profile and was really impressed by your journey to ${firmShort}`;
    if (alumniTitle) msg += ` as a ${alumniTitle}`;
    msg += `. `;
    if (yourInterest) {
      msg += `I'm particularly interested in ${yourInterest}, and I'd love to hear your perspective. `;
    } else {
      msg += `As someone exploring consulting, I'd love to learn more about your experience. `;
    }
    if (office) msg += `I noticed you're based in ${office} -`;
    msg += `would you have 15-20 minutes for a quick virtual coffee chat?\n\n`;
    msg += `I'd especially love to hear about:\n`;
    msg += `- Your path from Columbia to ${firmShort}\n`;
    msg += `- What a typical day looks like in your role\n`;
    msg += `- Any advice for consulting recruiting\n\n`;
    msg += `Happy to work around your schedule. Thank you!\n\n`;
    msg += `Best,\n${yourName || "[Your Name]"}`;

    setMessage(msg);
    setGenerated(true);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(message);
    toast.success("Copied to clipboard!");
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <svg className="h-4 w-4 text-li-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <h2 className="text-base font-semibold text-li-text">Coffee Chat Message Generator</h2>
      </div>
      <p className="text-xs text-li-text-secondary mb-4">
        Fill in your details and we&apos;ll generate a personalized outreach message for LinkedIn.
      </p>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-li-text-secondary">Your Name</label>
            <input
              placeholder="e.g., Sarah Chen"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              className="mt-1 w-full h-9 px-3 border border-li-border rounded text-sm text-li-text focus:outline-none focus:ring-1 focus:ring-li-blue"
            />
          </div>
          <div>
            <label className="text-xs text-li-text-secondary">Year / Program</label>
            <input
              placeholder="e.g., Junior, CC '26"
              value={yourYear}
              onChange={(e) => setYourYear(e.target.value)}
              className="mt-1 w-full h-9 px-3 border border-li-border rounded text-sm text-li-text focus:outline-none focus:ring-1 focus:ring-li-blue"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-li-text-secondary">Specific Interest (optional)</label>
          <input
            placeholder="e.g., healthcare consulting, digital strategy"
            value={yourInterest}
            onChange={(e) => setYourInterest(e.target.value)}
            className="mt-1 w-full h-9 px-3 border border-li-border rounded text-sm text-li-text focus:outline-none focus:ring-1 focus:ring-li-blue"
          />
        </div>
      </div>

      <button
        onClick={generateMessage}
        className="w-full py-2 rounded-full bg-li-blue text-white text-sm font-semibold hover:bg-li-blue-hover transition-colors mb-4"
      >
        Generate Message
      </button>

      {generated && (
        <div className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={12}
            className="w-full p-3 border border-li-border rounded-lg text-sm text-li-text leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-li-blue"
          />
          <div className="flex gap-2">
            <button
              onClick={copyMessage}
              className="flex-1 py-2 rounded-full bg-li-blue text-white text-sm font-semibold hover:bg-li-blue-hover transition-colors"
            >
              Copy to Clipboard
            </button>
            <a
              href="https://www.linkedin.com/messaging/compose/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 rounded-full border border-li-blue text-li-blue text-sm font-semibold text-center hover:bg-li-blue/5 transition-colors"
            >
              Open LinkedIn Messages
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
