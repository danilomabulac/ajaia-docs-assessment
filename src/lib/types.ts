export type DemoUser = {
  id: string;
  name: string;
  email: string;
};

export type DocumentSummary = {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  updatedAt: string;
  isOwner: boolean;
};

export type DocumentDetail = DocumentSummary & {
  contentHtml: string;
  shares: DemoUser[];
};

export type DocumentAccess = {
  exists: boolean;
  isOwner: boolean;
  isShared: boolean;
};
