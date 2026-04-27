"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    const firmShort = firmName.replace(/ & Company| Consulting Group| & Company/g, "").trim();

    let msg = `Hi ${firstName},\n\n`;
    msg += `I hope this message finds you well! My name is ${yourName || "[Your Name]"}`;
    if (yourYear) msg += `, and I'm a ${yourYear} student at Columbia University`;
    msg += `.\n\n`;

    msg += `I came across your profile and was really impressed by your journey to ${firmShort}`;
    if (alumniTitle) msg += ` as a ${alumniTitle}`;
    msg += `. `;

    if (yourInterest) {
      msg += `I'm particularly interested in ${yourInterest}, and I'd love to hear your perspective on this area. `;
    } else {
      msg += `As someone exploring a career in consulting, I'd love to learn more about your experience. `;
    }

    if (office) {
      msg += `I noticed you're based in ${office} — `;
    }

    msg += `would you have 15-20 minutes for a quick virtual coffee chat sometime in the next couple of weeks?\n\n`;

    msg += `I'd especially love to hear about:\n`;
    msg += `- Your path from Columbia to ${firmShort}\n`;
    msg += `- What a typical day looks like in your role\n`;
    msg += `- Any advice for someone preparing for consulting recruiting\n\n`;

    msg += `I completely understand if you're busy — any time works for me, and I'm happy to work around your schedule.\n\n`;

    msg += `Thank you so much for considering!\n\n`;
    msg += `Best regards,\n${yourName || "[Your Name]"}`;

    setMessage(msg);
    setGenerated(true);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(message);
    toast.success("Message copied to clipboard!");
  };

  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-4 w-4 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="text-sm font-display font-bold text-navy">Coffee Chat Message Generator</h3>
        </div>

        <p className="text-xs text-[#595959] mb-4">
          Fill in your details below and we&apos;ll generate a personalized outreach message you can send via LinkedIn.
        </p>

        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="yourName" className="text-xs">Your Name</Label>
              <Input
                id="yourName"
                placeholder="e.g., Sarah Chen"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="yourYear" className="text-xs">Year / Program</Label>
              <Input
                id="yourYear"
                placeholder="e.g., Junior, CC '26"
                value={yourYear}
                onChange={(e) => setYourYear(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="yourInterest" className="text-xs">Specific Interest (optional)</Label>
            <Input
              id="yourInterest"
              placeholder="e.g., healthcare consulting, digital strategy"
              value={yourInterest}
              onChange={(e) => setYourInterest(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <Button
          onClick={generateMessage}
          className="w-full bg-navy hover:bg-navy-light text-white mb-4"
        >
          Generate Message
        </Button>

        {generated && (
          <div className="space-y-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={14}
              className="text-sm leading-relaxed"
            />
            <div className="flex gap-2">
              <Button onClick={copyMessage} variant="outline" className="flex-1 text-sm">
                Copy to Clipboard
              </Button>
              <a
                href={`https://www.linkedin.com/messaging/compose/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white text-sm">
                  Open LinkedIn Messages
                </Button>
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
