"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FIRMS, SCHOOLS } from "@/lib/firms";

interface Props {
  referralCode?: string;
}

export function OnboardingForm({ referralCode }: Props) {
  const [form, setForm] = useState({
    name: "", columbiaEmail: "", linkedinUrl: "", gradYear: "", school: "",
    currentFirm: "", currentTitle: "", office: "", practiceArea: "",
    grcInvolvement: "", willingToChat: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.columbiaEmail.endsWith("@columbia.edu")) {
      toast.error("Please use your @columbia.edu email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, referralCode }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      setDone(true);
      toast.success("Welcome to the GRC Alumni Directory!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <Card className="border-slate-200">
        <CardContent className="py-16 text-center">
          <div className="h-16 w-16 mx-auto rounded-full bg-columbia-blue flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-display font-bold text-navy">Welcome to the Directory!</h2>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            Your profile is now live. Current GRC members can reach out to you for advice and mentorship.
          </p>
          <p className="text-xs text-slate-400 mt-4">
            You can remove yourself at any time via the link in any outreach email.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="h-12 w-12 mx-auto rounded-full bg-columbia-blue flex items-center justify-center mb-3">
            <span className="text-navy font-bold text-sm">GRC</span>
          </div>
          <h1 className="font-display text-xl font-bold text-navy">Join the GRC Alumni Directory</h1>
          <p className="text-sm text-slate-500 mt-2">
            Help current GRC members break into consulting. Takes 30 seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="columbiaEmail">Columbia Email</Label>
              <Input id="columbiaEmail" type="email" placeholder="uni123@columbia.edu" value={form.columbiaEmail} onChange={(e) => setForm({ ...form, columbiaEmail: e.target.value })} required />
            </div>
          </div>

          <div>
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input id="linkedinUrl" placeholder="https://linkedin.com/in/yourname" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentFirm">Current Firm</Label>
              <Select value={form.currentFirm} onValueChange={(v) => setForm({ ...form, currentFirm: v })}>
                <SelectTrigger><SelectValue placeholder="Select firm" /></SelectTrigger>
                <SelectContent>
                  {FIRMS.map((f) => (<SelectItem key={f.slug} value={f.slug}>{f.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currentTitle">Title</Label>
              <Input id="currentTitle" placeholder="e.g., Associate" value={form.currentTitle} onChange={(e) => setForm({ ...form, currentTitle: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="gradYear">Grad Year</Label>
              <Input id="gradYear" type="number" value={form.gradYear} onChange={(e) => setForm({ ...form, gradYear: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="school">School</Label>
              <Select value={form.school} onValueChange={(v) => setForm({ ...form, school: v })}>
                <SelectTrigger><SelectValue placeholder="School" /></SelectTrigger>
                <SelectContent>
                  {SCHOOLS.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="office">Office</Label>
              <Input id="office" placeholder="e.g., New York" value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value })} />
            </div>
          </div>

          <div>
            <Label htmlFor="grcInvolvement">GRC Involvement (optional)</Label>
            <Textarea id="grcInvolvement" placeholder="e.g., Project Lead F20" value={form.grcInvolvement} onChange={(e) => setForm({ ...form, grcInvolvement: e.target.value })} rows={2} />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="willingToChat" checked={form.willingToChat} onChange={(e) => setForm({ ...form, willingToChat: e.target.checked })} className="h-4 w-4 rounded border-slate-300" />
            <Label htmlFor="willingToChat" className="text-sm font-normal">
              I&apos;m open to being contacted by current GRC members
            </Label>
          </div>

          <Button
            type="submit"
            disabled={submitting || !form.name || !form.columbiaEmail || !form.linkedinUrl || !form.currentFirm}
            className="w-full bg-navy hover:bg-navy-light text-white"
          >
            {submitting ? "Joining..." : "Join the Directory"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
