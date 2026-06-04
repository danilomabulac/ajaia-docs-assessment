"use client";

import Link from "next/link";
import { Clock3, FileText, Trash2, Users } from "lucide-react";
import type { DocumentSummary } from "@/lib/types";

export function DocumentCard({ document, onDelete }: { document: DocumentSummary; onDelete?: (id: string) => void }) {
  return (
    <article className="document-card">
      <Link href={`/documents/${document.id}`} className="document-link">
        <span className="document-icon"><FileText size={24} /></span>
        <div>
          <h3>{document.title}</h3>
          <p><Clock3 size={14} /> Updated {new Date(document.updatedAt).toLocaleString()}</p>
          {!document.isOwner && <p><Users size={14} /> Shared by {document.ownerName}</p>}
        </div>
      </Link>
      {onDelete && <button className="icon-button danger" title="Delete document" onClick={() => onDelete(document.id)}><Trash2 size={16} /></button>}
    </article>
  );
}
