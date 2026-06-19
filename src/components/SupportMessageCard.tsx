import { Heart } from "lucide-react";

export const SupportMessageCard = ({ message }: { message: string }) => (
  <section className="support-card">
    <Heart size={22} />
    <p>{message}</p>
  </section>
);
