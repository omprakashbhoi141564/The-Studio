"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "@heroicons/react/24/outline";
import { SiteContent, StudioCard } from "@/lib/types";

type Props = {
  initialContent: SiteContent;
};

type Message = {
  type: "success" | "error";
  text: string;
} | null;

export default function AdminDashboard({ initialContent }: Props) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    image: "",
    section: "character" as "poster" | "character",
    linkUrl: ""
  });
  const [uploadingNewCardImage, setUploadingNewCardImage] = useState(false);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const sortedCards = useMemo(() => [...content.cards].sort((a, b) => a.order - b.order), [content.cards]);
  const posterCards = useMemo(() => sortedCards.filter((card) => card.section === "poster"), [sortedCards]);
  const characterCards = useMemo(() => sortedCards.filter((card) => card.section === "character"), [sortedCards]);

  async function uploadFile(file: File) {
    const form = new FormData();
    form.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: form
    });

    if (!response.ok) {
      let errorMessage = "Upload failed";
      try {
        const data = await response.json();
        if (data?.error) errorMessage = data.error;
      } catch {
        // ignore parsing errors and keep default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.path as string;
  }

  async function saveContent(next: SiteContent) {
    setLoading(true);
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next)
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      const data = await response.json();
      setContent(data.content);
      setMessage({ type: "success", text: "Saved successfully" });
    } catch (error) {
      setMessage({ type: "error", text: "Could not save changes" });
    } finally {
      setLoading(false);
    }
  }

  async function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const path = await uploadFile(file);
      await saveContent({ ...content, logo: path });
    } catch (error) {
      const text = error instanceof Error ? error.message : "Logo upload failed";
      setMessage({ type: "error", text });
    }
  }

  async function handleHeroImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const path = await uploadFile(file);
      await saveContent({ ...content, hero: { ...content.hero, image: path } });
    } catch (error) {
      const text = error instanceof Error ? error.message : "Hero upload failed";
      setMessage({ type: "error", text });
    }
  }

  async function handleCardImageUpload(card: StudioCard, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const path = await uploadFile(file);
      const cards = sortedCards.map((item) => (item.id === card.id ? { ...item, image: path } : item));
      await saveContent({ ...content, cards });
    } catch (error) {
      const text = error instanceof Error ? error.message : "Card image upload failed";
      setMessage({ type: "error", text });
    }
  }

  async function handleNewCardImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingNewCardImage(true);
    try {
      const path = await uploadFile(file);
      setNewCard((prev) => ({ ...prev, image: path }));
      setMessage({ type: "success", text: "New card image uploaded. Now click Add Card." });
    } catch (error) {
      const text = error instanceof Error ? error.message : "New card image upload failed";
      setMessage({ type: "error", text });
    } finally {
      setUploadingNewCardImage(false);
    }
  }

  async function updateCardField(cardId: string, field: keyof StudioCard, value: string) {
    const cards = sortedCards.map((item) => (item.id === cardId ? { ...item, [field]: value } : item));
    await saveContent({ ...content, cards });
  }

  async function addCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newCard.title || !newCard.description || !newCard.image) {
      setMessage({ type: "error", text: "New card needs title, description, and image URL" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard)
      });

      if (!response.ok) {
        throw new Error("Card add failed");
      }

      const data = await response.json();
      setContent(data.content as SiteContent);
      setNewCard({ title: "", description: "", image: "", section: "character", linkUrl: "" });
      setMessage({ type: "success", text: "Card added" });
    } catch {
      setMessage({ type: "error", text: "Could not add card" });
    } finally {
      setLoading(false);
    }
  }

  async function deleteCard(cardId: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/cards?id=${cardId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      const data = await response.json();
      setContent(data.content as SiteContent);
      setMessage({ type: "success", text: "Card deleted" });
    } catch {
      setMessage({ type: "error", text: "Could not delete card" });
    } finally {
      setLoading(false);
    }
  }

  async function reorderCard(cardId: string, direction: "up" | "down") {
    setLoading(true);
    try {
      const response = await fetch("/api/cards/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, direction })
      });

      if (!response.ok) {
        throw new Error("Reorder failed");
      }

      const data = await response.json();
      setContent(data.content as SiteContent);
    } catch {
      setMessage({ type: "error", text: "Could not reorder card" });
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={logout} className="rounded bg-stone-800 px-4 py-2 text-sm text-white">Logout</button>
      </div>

      {message && (
        <div className={`rounded px-4 py-3 text-sm ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message.text}
        </div>
      )}

      <section className="rounded border border-stone-300 bg-white p-4">
        <h2 className="text-lg font-semibold">Studio Branding</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Studio Name</span>
            <input
              type="text"
              value={content.studioName}
              className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
              onChange={(e) => setContent({ ...content, studioName: e.target.value })}
              onBlur={() => saveContent(content)}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Upload Logo</span>
            <input type="file" accept="image/*" className="mt-1 block w-full" onChange={handleLogoUpload} />
            <p className="mt-1 text-xs text-stone-500">Best results: square JPG/PNG/WebP image.</p>
            <div className="mt-3 h-20 w-20 overflow-hidden rounded-full border border-stone-300">
              <img src={content.logo} alt="Current logo preview" className="h-full w-full object-cover object-center" />
            </div>
          </label>
        </div>
      </section>

      <section className="rounded border border-stone-300 bg-white p-4">
        <h2 className="text-lg font-semibold">Hero Section</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="text-sm font-medium">Upload Hero Background</span>
            <input type="file" accept="image/*" className="mt-1 block w-full" onChange={handleHeroImageUpload} />
            <p className="mt-1 text-xs text-stone-500">Use wide landscape image for best fit.</p>
            <div className="mt-3 h-36 w-full overflow-hidden rounded border border-stone-300 bg-stone-100">
              <img src={content.hero.image} alt="Current hero preview" className="h-full w-full object-cover object-center" />
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Hero Title</span>
            <input
              type="text"
              value={content.hero.title}
              className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
              onBlur={() => saveContent(content)}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Hero Subtitle</span>
            <textarea
              value={content.hero.subtitle}
              className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
              onBlur={() => saveContent(content)}
            />
          </label>
        </div>
      </section>

      <section className="rounded border border-stone-300 bg-white p-4">
        <h2 className="text-lg font-semibold">Characters / Movies</h2>

        <form className="mt-4 grid gap-3 rounded border border-dashed border-stone-300 p-3 md:grid-cols-4" onSubmit={addCard}>
          <input
            type="text"
            placeholder="Title"
            value={newCard.title}
            className="rounded border border-stone-300 px-3 py-2"
            onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newCard.description}
            className="rounded border border-stone-300 px-3 py-2"
            onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
          />
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Image URL (/uploads/.. or https://...)"
              value={newCard.image}
              className="w-full rounded border border-stone-300 px-3 py-2"
              onChange={(e) => setNewCard({ ...newCard, image: e.target.value })}
            />
            <input type="file" accept="image/*" className="block w-full text-sm" onChange={handleNewCardImageUpload} />
            <select
              value={newCard.section}
              className="w-full rounded border border-stone-300 px-3 py-2"
              onChange={(e) =>
                setNewCard({ ...newCard, section: e.target.value === "poster" ? "poster" : "character" })
              }
            >
              <option value="poster">Poster Section</option>
              <option value="character">Character Section</option>
            </select>
            <input
              type="url"
              placeholder="Info Link URL (optional)"
              value={newCard.linkUrl}
              className="w-full rounded border border-stone-300 px-3 py-2"
              onChange={(e) => setNewCard({ ...newCard, linkUrl: e.target.value })}
            />
            {uploadingNewCardImage ? <p className="text-xs text-stone-500">Uploading...</p> : null}
          </div>
          <button className="rounded bg-studio-accent px-3 py-2 text-white" type="submit" disabled={loading}>
            Add Card
          </button>
        </form>
        {newCard.image ? (
          <div className="mt-3 h-40 w-32 overflow-hidden rounded border border-stone-300 bg-stone-100">
            <img src={newCard.image} alt="New card preview" className="h-full w-full object-cover object-center" />
          </div>
        ) : null}

        <div className="mt-5 space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-600">Poster Cards (Auto Slider)</h3>
            <div className="space-y-3">
              {posterCards.map((card, index) => (
                <div key={card.id} className="grid gap-3 rounded border border-stone-300 p-3 md:grid-cols-12">
              <img src={card.image} alt={card.title} className="h-28 w-full rounded object-cover md:col-span-2" />
              <div className="md:col-span-8 space-y-2">
                <input
                  value={card.title}
                  className="w-full rounded border border-stone-300 px-3 py-2"
                  onChange={(e) => {
                    const cards = sortedCards.map((item) =>
                      item.id === card.id ? { ...item, title: e.target.value } : item
                    );
                    setContent({ ...content, cards });
                  }}
                  onBlur={(e) => updateCardField(card.id, "title", e.target.value)}
                />
                <textarea
                  value={card.description}
                  className="w-full rounded border border-stone-300 px-3 py-2"
                  onChange={(e) => {
                    const cards = sortedCards.map((item) =>
                      item.id === card.id ? { ...item, description: e.target.value } : item
                    );
                    setContent({ ...content, cards });
                  }}
                  onBlur={(e) => updateCardField(card.id, "description", e.target.value)}
                />
                <div>
                  <label className="text-xs text-stone-600">Upload card image</label>
                  <input type="file" accept="image/*" className="block w-full" onChange={(e) => handleCardImageUpload(card, e)} />
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <select
                    value={card.section}
                    className="w-full rounded border border-stone-300 px-3 py-2"
                    onChange={(e) => updateCardField(card.id, "section", e.target.value === "poster" ? "poster" : "character")}
                  >
                    <option value="poster">Poster Section</option>
                    <option value="character">Character Section</option>
                  </select>
                  <input
                    type="url"
                    value={card.linkUrl || ""}
                    placeholder="Info Link URL"
                    className="w-full rounded border border-stone-300 px-3 py-2"
                    onChange={(e) => {
                      const cards = sortedCards.map((item) =>
                        item.id === card.id ? { ...item, linkUrl: e.target.value } : item
                      );
                      setContent({ ...content, cards });
                    }}
                    onBlur={(e) => updateCardField(card.id, "linkUrl", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 md:col-span-2 md:flex-col md:items-stretch">
                <button
                  className="flex items-center justify-center rounded border border-stone-300 px-2 py-2 disabled:opacity-50"
                  onClick={() => reorderCard(card.id, "up")}
                  type="button"
                  disabled={index === 0 || loading}
                >
                  <ArrowUpIcon className="h-4 w-4" />
                </button>
                <button
                  className="flex items-center justify-center rounded border border-stone-300 px-2 py-2 disabled:opacity-50"
                  onClick={() => reorderCard(card.id, "down")}
                  type="button"
                  disabled={index === posterCards.length - 1 || loading}
                >
                  <ArrowDownIcon className="h-4 w-4" />
                </button>
                <button
                  className="flex items-center justify-center rounded border border-red-300 px-2 py-2 text-red-700"
                  onClick={() => deleteCard(card.id)}
                  type="button"
                  disabled={loading}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-600">Character Cards (4 Per Row)</h3>
            <div className="space-y-3">
              {characterCards.map((card, index) => (
                <div key={card.id} className="grid gap-3 rounded border border-stone-300 p-3 md:grid-cols-12">
                  <img src={card.image} alt={card.title} className="h-28 w-full rounded object-cover md:col-span-2" />
                  <div className="md:col-span-8 space-y-2">
                    <input
                      value={card.title}
                      className="w-full rounded border border-stone-300 px-3 py-2"
                      onChange={(e) => {
                        const cards = sortedCards.map((item) =>
                          item.id === card.id ? { ...item, title: e.target.value } : item
                        );
                        setContent({ ...content, cards });
                      }}
                      onBlur={(e) => updateCardField(card.id, "title", e.target.value)}
                    />
                    <textarea
                      value={card.description}
                      className="w-full rounded border border-stone-300 px-3 py-2"
                      onChange={(e) => {
                        const cards = sortedCards.map((item) =>
                          item.id === card.id ? { ...item, description: e.target.value } : item
                        );
                        setContent({ ...content, cards });
                      }}
                      onBlur={(e) => updateCardField(card.id, "description", e.target.value)}
                    />
                    <div>
                      <label className="text-xs text-stone-600">Upload card image</label>
                      <input type="file" accept="image/*" className="block w-full" onChange={(e) => handleCardImageUpload(card, e)} />
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <select
                        value={card.section}
                        className="w-full rounded border border-stone-300 px-3 py-2"
                        onChange={(e) => updateCardField(card.id, "section", e.target.value === "poster" ? "poster" : "character")}
                      >
                        <option value="poster">Poster Section</option>
                        <option value="character">Character Section</option>
                      </select>
                      <input
                        type="url"
                        value={card.linkUrl || ""}
                        placeholder="Info Link URL"
                        className="w-full rounded border border-stone-300 px-3 py-2"
                        onChange={(e) => {
                          const cards = sortedCards.map((item) =>
                            item.id === card.id ? { ...item, linkUrl: e.target.value } : item
                          );
                          setContent({ ...content, cards });
                        }}
                        onBlur={(e) => updateCardField(card.id, "linkUrl", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2 md:flex-col md:items-stretch">
                    <button
                      className="flex items-center justify-center rounded border border-stone-300 px-2 py-2 disabled:opacity-50"
                      onClick={() => reorderCard(card.id, "up")}
                      type="button"
                      disabled={index === 0 || loading}
                    >
                      <ArrowUpIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="flex items-center justify-center rounded border border-stone-300 px-2 py-2 disabled:opacity-50"
                      onClick={() => reorderCard(card.id, "down")}
                      type="button"
                      disabled={index === characterCards.length - 1 || loading}
                    >
                      <ArrowDownIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="flex items-center justify-center rounded border border-red-300 px-2 py-2 text-red-700"
                      onClick={() => deleteCard(card.id)}
                      type="button"
                      disabled={loading}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded border border-stone-300 bg-white p-4">
        <h2 className="text-lg font-semibold">Social Links</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {Object.entries(content.socialLinks).map(([name, value]) => (
            <label className="block" key={name}>
              <span className="text-sm font-medium capitalize">{name}</span>
              <input
                type="url"
                value={value}
                className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
                onChange={(e) =>
                  setContent({
                    ...content,
                    socialLinks: { ...content.socialLinks, [name]: e.target.value }
                  })
                }
                onBlur={() => saveContent(content)}
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
