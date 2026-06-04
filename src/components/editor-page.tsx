"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { ArrowLeft, Bold, Heading1, Heading2, Italic, List, ListOrdered, LoaderCircle, Redo2, Share2, Trash2, UnderlineIcon, Undo2, UserMinus, X } from "lucide-react";
import { apiFetch, type DocumentResponse } from "@/lib/client-api";
import { DEMO_USERS } from "@/lib/demo-users";
import type { DocumentDetail } from "@/lib/types";
import { useDemoUser } from "@/components/user-provider";
import { useNavigationLoader } from "@/components/navigation-provider";

type SaveState = "idle" | "saving" | "saved" | "error";

export function DocumentEditor({ documentId }: { documentId: string }) {
  const router = useRouter();
  const { userId } = useDemoUser();
  const { startNavigation } = useNavigationLoader();
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [title, setTitle] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUserId, setShareUserId] = useState("");
  const titleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async (changes: { title?: string; contentHtml?: string }) => {
    setSaveState("saving");
    try {
      await apiFetch(`/api/documents/${documentId}`, userId, { method: "PATCH", body: JSON.stringify(changes) });
      setSaveState("saved");
    } catch { setSaveState("error"); }
  }, [documentId, userId]);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "",
    immediatelyRender: false,
    editorProps: { attributes: { class: "editor-content" } },
    onUpdate: ({ editor: current }) => {
      if (contentTimer.current) clearTimeout(contentTimer.current);
      contentTimer.current = setTimeout(() => void save({ contentHtml: current.getHTML() }), 700);
    },
  });

  const loadDocument = useCallback(async () => {
    setError("");
    try {
      const result = await apiFetch<DocumentResponse>(`/api/documents/${documentId}`, userId);
      setDocument(result.document);
      setTitle(result.document.title);
      editor?.commands.setContent(result.document.contentHtml, { emitUpdate: false });
      setSaveState("saved");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not open document."); }
  }, [documentId, editor, userId]);

  // Load only after TipTap is ready, and reload when the reviewer switches identity.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (editor) void loadDocument(); }, [editor, loadDocument]);

  function updateTitle(value: string) {
    setTitle(value);
    if (titleTimer.current) clearTimeout(titleTimer.current);
    titleTimer.current = setTimeout(() => void save({ title: value.trim() || "Untitled document" }), 700);
  }

  async function shareDocument() {
    if (!shareUserId) return;
    try {
      await apiFetch(`/api/documents/${documentId}/shares`, userId, { method: "POST", body: JSON.stringify({ userId: shareUserId }) });
      setShareUserId("");
      await loadDocument();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not share document."); }
  }

  async function revokeShare(sharedUserId: string) {
    try {
      await apiFetch(`/api/documents/${documentId}/shares/${sharedUserId}`, userId, { method: "DELETE" });
      await loadDocument();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not revoke access."); }
  }

  async function deleteDocument() {
    if (!window.confirm("Delete this document? This cannot be undone.")) return;
    await apiFetch(`/api/documents/${documentId}`, userId, { method: "DELETE" });
    startNavigation();
    router.push("/");
  }

  if (error && !document) return <main className="center-state"><div className="alert error">{error}</div><Link href="/" className="button secondary"><ArrowLeft size={16} />Back to dashboard</Link></main>;
  if (!document || !editor) return <main className="center-state"><LoaderCircle className="spin" />Opening document...</main>;

  const shareCandidates = DEMO_USERS.filter((user) => user.id !== document.ownerId && !document.shares.some((shared) => shared.id === user.id));

  return <main className="editor-shell">
    <div className="editor-topbar">
      <Link href="/" className="icon-button" title="Back to dashboard"><ArrowLeft size={18} /></Link>
      <label className="title-field">
        <span>Document title <small>Click to rename</small></span>
        <input
          className="title-input"
          value={title}
          maxLength={120}
          aria-label="Document title"
          title="Rename document title"
          onChange={(event) => updateTitle(event.target.value)}
        />
      </label>
      <span className={`save-state ${saveState}`}>{saveState === "saving" ? "Saving..." : saveState === "error" ? "Save failed" : "Saved"}</span>
      {!document.isOwner && <span className="shared-badge">Shared by {document.ownerName}</span>}
      {document.isOwner && <button className="button secondary compact" onClick={() => setShareOpen(true)}><Share2 size={16} />Share</button>}
      {document.isOwner && <button className="icon-button danger" title="Delete document" onClick={() => void deleteDocument()}><Trash2 size={17} /></button>}
    </div>
    {error && <div className="alert error editor-alert">{error}</div>}
    <div className="toolbar">
      <Tool active={editor.isActive("bold")} label="Bold" onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={17} /></Tool>
      <Tool active={editor.isActive("italic")} label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={17} /></Tool>
      <Tool active={editor.isActive("underline")} label="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={17} /></Tool>
      <span className="toolbar-divider" />
      <Tool active={editor.isActive("heading", { level: 1 })} label="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={18} /></Tool>
      <Tool active={editor.isActive("heading", { level: 2 })} label="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={18} /></Tool>
      <Tool active={editor.isActive("bulletList")} label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={18} /></Tool>
      <Tool active={editor.isActive("orderedList")} label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={18} /></Tool>
      <span className="toolbar-divider" />
      <Tool label="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo2 size={17} /></Tool>
      <Tool label="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo2 size={17} /></Tool>
    </div>
    <div className="page-canvas"><EditorContent editor={editor} /></div>
    {shareOpen && <div className="modal-backdrop" onClick={() => setShareOpen(false)}>
      <section className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-heading"><div><h2>Share document</h2><p>Invite another demo user to edit this document.</p></div><button className="icon-button" onClick={() => setShareOpen(false)}><X size={18} /></button></div>
        <div className="share-form">
          <select value={shareUserId} onChange={(event) => setShareUserId(event.target.value)}><option value="">Select a teammate</option>{shareCandidates.map((user) => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}</select>
          <button className="button primary" disabled={!shareUserId} onClick={() => void shareDocument()}>Grant edit access</button>
        </div>
        <div className="share-list"><h3>People with access</h3>
          <div className="person-row"><div><strong>{document.ownerName}</strong><span>Owner</span></div></div>
          {document.shares.map((user) => <div className="person-row" key={user.id}><div><strong>{user.name}</strong><span>{user.email}</span></div><button className="icon-button danger" title="Revoke access" onClick={() => void revokeShare(user.id)}><UserMinus size={16} /></button></div>)}
        </div>
      </section>
    </div>}
  </main>;
}

function Tool({ children, label, active, onClick }: { children: React.ReactNode; label: string; active?: boolean; onClick: () => void }) {
  return <button className={`tool-button ${active ? "active" : ""}`} title={label} onClick={onClick}>{children}</button>;
}
