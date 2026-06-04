import { LoaderCircle } from "lucide-react";

export function RouteLoading({ message = "Loading workspace..." }: { message?: string }) {
  return (
    <main className="route-loading" role="status" aria-live="polite">
      <span className="route-loading-mark"><LoaderCircle className="spin" size={25} /></span>
      <div><strong>{message}</strong><span>Please wait a moment.</span></div>
    </main>
  );
}
