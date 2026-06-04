"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { marked } from "marked";
import { FilePlus2, LoaderCircle, Upload } from "lucide-react";
import { apiFetch, type DocumentListResponse } from "@/lib/client-api";
import { validateImport } from "@/lib/file-import";
import { useDemoUser } from "@/components/user-provider";
import { useNavigationLoader } from "@/components/navigation-provider";
import { DocumentCard } from "@/components/document-card";

export function Dashboard() {
  const router = useRouter();
  const { userId } = useDemoUser();
  const { startNavigation } = useNavigationLoader();
  const inputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<DocumentListResponse>({ owned: [], shared: [] });
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError("");
    try { setDocuments(await apiFetch<DocumentListResponse>("/api/documents", userId)); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load documents."); }
    finally { setLoading(false); }
  }, [userId]);

  // Reload the workspace whenever the reviewer switches demo identity.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void loadDocuments(); }, [loadDocuments]);

  async function createDocument(title = "Untitled document", contentHtml = "<p></p>") {
    setWorking(true);
    setError("");
    try {
      const result = await apiFetch<{ id: string }>("/api/documents", userId, { method: "POST", body: JSON.stringify({ title, contentHtml }) });
      startNavigation();
      router.push(`/documents/${result.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create document.");
      setWorking(false);
    }
  }

  async function importFile(file?: File) {
    if (!file) return;
    const validationError = validateImport(file);
    if (validationError) return setError(validationError);
    const text = await file.text();
    const escaped = text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\n", "<br>");
    await createDocument(file.name.replace(/\.(txt|md)$/i, ""), file.name.toLowerCase().endsWith(".md") ? await marked.parse(text) : `<p>${escaped}</p>`);
  }

  async function deleteDocument(id: string) {
    if (!window.confirm("Delete this document? This cannot be undone.")) return;
    try { await apiFetch(`/api/documents/${id}`, userId, { method: "DELETE" }); await loadDocuments(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not delete document."); }
  }

  return (
    <main className="dashboard-shell">
      <section className="hero">
        <div><span className="eyebrow">Collaborative workspace</span><h1>Documents that keep work moving.</h1><p>Create, format, import, and share focused documents with your team.</p></div>
        <div className="hero-actions">
          <button className="button primary" disabled={working} onClick={() => void createDocument()}>{working ? <LoaderCircle className="spin" size={18} /> : <FilePlus2 size={18} />}New document</button>
          <button className="button secondary" disabled={working} onClick={() => inputRef.current?.click()}><Upload size={18} />Import .txt or .md</button>
          <input ref={inputRef} type="file" accept=".txt,.md,text/plain,text/markdown" hidden onChange={(event) => void importFile(event.target.files?.[0])} />
        </div>
      </section>
      {error && <div className="alert error">{error}</div>}
      {loading ? <div className="loading"><LoaderCircle className="spin" />Loading workspace...</div> : <>
        <DocumentSection title="Owned by me" description="Documents you created and can manage." documents={documents.owned} empty="Create your first document to get started." onDelete={(id) => void deleteDocument(id)} />
        <DocumentSection title="Shared with me" description="Documents teammates invited you to edit." documents={documents.shared} empty="Shared documents will appear here." />
      </>}
    </main>
  );
}

function DocumentSection({ title, description, documents, empty, onDelete }: { title: string; description: string; documents: DocumentListResponse["owned"]; empty: string; onDelete?: (id: string) => void }) {
  return <section className="document-section">
    <div className="section-heading"><div><h2>{title}</h2><p>{description}</p></div><span>{documents.length}</span></div>
    {documents.length ? <div className="document-grid">{documents.map((document) => <DocumentCard key={document.id} document={document} onDelete={onDelete} />)}</div> : <div className="empty-state"><FilePlus2 size={24} /><p>{empty}</p></div>}
  </section>;
}
