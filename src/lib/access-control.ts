import type { DocumentAccess } from "@/lib/types";

export function canReadDocument(access: DocumentAccess) {
  return access.exists && (access.isOwner || access.isShared);
}

export function canEditDocument(access: DocumentAccess) {
  return canReadDocument(access);
}

export function canManageDocument(access: DocumentAccess) {
  return access.exists && access.isOwner;
}
