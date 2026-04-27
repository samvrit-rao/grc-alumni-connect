"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  alumniId: string;
  alumniName: string;
}

export function RequestIntroButton({ alumniId, alumniName }: Props) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const defaultMessage = `Hi ${alumniName},

I'm ${session?.user?.name || "[Your Name]"}, a current member of GRC at Columbia. I'm very interested in consulting and would love to learn about your experience at your firm.

Would you have 15-20 minutes for a quick chat sometime in the next couple of weeks? I'd especially love to hear about your transition from Columbia to consulting and any advice you have for someone preparing for recruiting.

Thank you so much for your time!

Best,
${session?.user?.name || "[Your Name]"}`;

  const handleOpen = () => {
    if (!message) setMessage(defaultMessage);
    setOpen(true);
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alumniId, message }),
      });
      if (!res.ok) throw new Error("Failed to send");
      toast.success("Intro request sent!");
      setOpen(false);
    } catch {
      toast.error("Failed to send request. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (!session) {
    return (
      <Button disabled variant="outline">Sign in to request intro</Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleOpen} className="bg-navy hover:bg-navy-light text-white">
          Request Intro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Request Intro with {alumniName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="message">Your message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              className="mt-1.5 text-sm"
            />
            <p className="text-xs text-slate-400 mt-1">
              This message will be emailed to the alum on your behalf.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSend}
              disabled={sending || !message.trim()}
              className="bg-navy hover:bg-navy-light text-white"
            >
              {sending ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
