// Labels shared by panel server pages and client components.
import type { SubmissionStatus } from "@/lib/supabase/database.types";

export const statusLabels: Record<SubmissionStatus, string> = { new: "Yeni", seen: "Görüldü", done: "Tamamlandı" };
