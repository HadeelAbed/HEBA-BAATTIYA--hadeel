"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TABS = ["Homepage Hero", "Brand Story", "Couture Services", "Announcement Bar"] as const;

const DEFAULT_HERO = {
  eyebrow: "The Spring Couture Collection",
  heading: "Dressed in Silence",
  subtext: "Each piece is cut to disappear into the way you move — nothing announced, everything felt.",
};

const DEFAULT_STORY = {
  heading: "A House Built on Restraint",
  body: "Heba Baattiya began in a small atelier with a single conviction: that elegance is something you remove, not something you add.",
};

export default function AdminContentPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Homepage Hero");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [hero, setHero] = useState(DEFAULT_HERO);
  const [story, setStory] = useState(DEFAULT_STORY);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => {
        const c = data.content ?? {};
        setHero({ ...DEFAULT_HERO, ...(c.homepage_hero ?? {}) });
        setStory({ ...DEFAULT_STORY, ...(c.brand_story ?? {}) });
        setAnnouncement(c.announcement ?? "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "homepage_hero", value: hero }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Content updated and published");
    } catch {
      toast.error("Failed to save content");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveStory() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "brand_story", value: story }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Brand story updated and published");
    } catch {
      toast.error("Failed to save content");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAnnouncement() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "announcement", value: announcement }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Announcement updated and published");
    } catch {
      toast.error("Failed to save content");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <AdminTopbar title="Content Management" />
        <div className="p-8 text-sm text-stone">Loading content...</div>
      </>
    );
  }

  return (
    <>
      <AdminTopbar title="Content Management" />
      <div className="p-8">
        <div className="mb-6 flex gap-1 border-b border-hairline">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm transition ${
                tab === t ? "border-b-2 border-charcoal text-charcoal" : "text-stone hover:text-graphite"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="max-w-xl border border-hairline bg-white p-7">
          {tab === "Homepage Hero" && (
            <div className="space-y-5">
              <Input label="Eyebrow Text" value={hero.eyebrow} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })} />
              <Input label="Main Heading" value={hero.heading} onChange={(e) => setHero({ ...hero, heading: e.target.value })} />
              <Textarea label="Subtext" rows={3} value={hero.subtext} onChange={(e) => setHero({ ...hero, subtext: e.target.value })} />
              <Button variant="primary" size="md" className="mt-2" loading={saving} onClick={handleSave}>
                Publish Changes
              </Button>
            </div>
          )}

          {tab === "Brand Story" && (
            <div className="space-y-5">
              <Input label="Heading" value={story.heading} onChange={(e) => setStory({ ...story, heading: e.target.value })} />
              <Textarea label="Body Copy" rows={6} value={story.body} onChange={(e) => setStory({ ...story, body: e.target.value })} />
              <Button variant="primary" size="md" className="mt-2" loading={saving} onClick={handleSaveStory}>
                Publish Changes
              </Button>
            </div>
          )}

          {tab === "Couture Services" && (
            <p className="text-sm text-stone">
              Couture services content is managed per-service. Select a service card from the
              homepage preview to edit its title and description.
            </p>
          )}

          {tab === "Announcement Bar" && (
            <div className="space-y-5">
              <Input
                label="Announcement Message"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
              />
              <p className="text-xs text-stone">This message appears as a thin bar above the navigation on all pages.</p>
              <Button variant="primary" size="md" className="mt-2" loading={saving} onClick={handleSaveAnnouncement}>
                Publish Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
