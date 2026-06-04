import type { DemoUser } from "@/lib/types";

export const DEMO_USERS: DemoUser[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Maya Chen",
    email: "maya@ajaia.demo",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Noah Williams",
    email: "noah@ajaia.demo",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "Priya Shah",
    email: "priya@ajaia.demo",
  },
];

export const DEFAULT_USER_ID = DEMO_USERS[0].id;
