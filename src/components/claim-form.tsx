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
import { SCHOOLS } from "@/lib/firms";

interface Alumni {
  id: string;
  name: string;
  gradYear: number | null;
  school: string | null;
  currentFirm: string;
  currentTitle: string | null;
  office: string | null;
  practiceArea: string | null;
  grcInvolvement: string | null;
}

interface Props {
  alumni: Alumni;
  token: string;
}

export function ClaimForm({ alumni, token }: Props) {
  const [form, setForm] = useState({
    name: alumni.name,
    gradYear: alumni.gradYear?.toString() || "",
    school: alumni.school || "",
    currentTitle: alumni.currentTitle || "",
    office: alumni.office || "",
    practiceArea: alumni.practiceArea || "",
    grcInvolvement: alumni.grcInvolvement || "",
    willingToChat: true,
    columbiEmail: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.columbiEmail.endsWith("@columbia.edu")) {
      toast.error("Please use your @columbia.edu email to verify.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/alumni/${alumni.id}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, token }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to verify");
      }
      setDone(true);
      toast.success("Profile verified and published!");
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
          <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-display font-bold text-navy">You&apos;re verified!</h2>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            Your profile is now visible in the GRC Alumni Directory. Current GRC
            members can reach out to you for advice.
          </p>
          <p className="text-xs text-slate-400 mt-4">
            You can remove yourself at any time from your profile page or via the link in any outreach email.
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
          <h1 className="font-display text-xl font-bold text-navy">Verify Your Profile</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            Hi {alumni.name}! GRC is building an alumni directory to help current
            members connect with alumni at consulting firms. Please confirm your info below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="columbiEmail">Columbia Email</Label>
              <Input id="columbiEmail" type="email" placeholder="uni123@columbia.edu" value={form.columbiEmail} onChange={(e) => setForm({ ...form, columbiEmail: e.target.value })} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gradYear">Grad Year</Label>
              <Input id="gradYear" type="number" value={form.gradYear} onChange={(e) => setForm({ ...form, gradYear: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="school">School</Label>
              <Select value={form.school} onValueChange={(v) => setForm({ ...form, school: v })}>
                <SelectTrigger><SelectValue placeholder="Select school" /></SelectTrigger>
                <SelectContent>
                  {SCHOOLS.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentTitle">Current Title</Label>
              <Input id="currentTitle" value={form.currentTitle} onChange={(e) => setForm({ ...form, currentTitle: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="office">Office</Label>
              <Input id="office" value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value })} />
            </div>
          </div>

          <div>
            <Label htmlFor="practiceArea">Practice Area</Label>
            <Input id="practiceArea" value={form.practiceArea} onChange={(e) => setForm({ ...form, practiceArea: e.target.value })} />
          </div>

          <div>
            <Label htmlFor="grcInvolvement">GRC Involvement (optional)</Label>
            <Textarea id="grcInvolvement" placeholder="e.g., Project Lead F20, Member S19-S20" value={form.grcInvolvement} onChange={(e) => setForm({ ...form, grcInvolvement: e.target.value })} rows={2} />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="willingToChat" checked={form.willingToChat} onChange={(e) => setForm({ ...form, willingToChat: e.target.checked })} className="h-4 w-4 rounded border-slate-300" />
            <Label htmlFor="willingToChat" className="text-sm font-normal">
              I&apos;m open to being contacted by current GRC members for career advice
            </Label>
          </div>

          <div className="bg-slate-50 p-3 rounded-md text-xs text-slate-500">
            By verifying, your profile will be visible to authenticated GRC members (@columbia.edu). You can remove yourself at any time.
          </div>

          <Button type="submit" disabled={submitting} className="w-full bg-navy hover:bg-navy-light text-white">
            {submitting ? "Verifying..." : "Verify & Publish My Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
