// Shape of the Teknosem tables (supabase/migrations). Written by hand in the format `supabase gen types` produces;
// keep it in step with the migrations.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Required extends keyof Row> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, Required>;
  Update: Partial<Row>;
  Relationships: [];
};

export type CategoryRow = {
  id: string;
  slug: string;
  title: string;
  sort: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type GroupRow = CategoryRow & { category_id: string };

export type ProductRow = {
  id: string;
  slug: string;
  legacy_slug: string | null;
  name: string;
  short_name: string;
  group_id: string;
  sort: number;
  short_description: string;
  description_html: string;
  /** [{ label, value }]; a row with an empty value is a group heading. */
  specs: Json;
  faq_title: string;
  /** [{ question, answer }] */
  faq: Json;
  videos: string[];
  published: boolean;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
};

export type ProductImageRow = {
  id: string;
  product_id: string;
  storage_path: string;
  width: number;
  height: number;
  alt: string;
  sort: number;
  created_at: string;
};

export type DownloadRow = {
  id: string;
  product_id: string | null;
  title: string;
  model: string;
  version: string;
  release_date: string | null;
  note: string;
  storage_path: string;
  size_bytes: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSettingKey = "hero" | "reasons" | "strengths" | "showcase" | "about" | "services" | "kvkk" | "contact";

export type SiteSettingRow = { key: SiteSettingKey; value: Json; updated_at: string };

export type ReferenceLogoRow = {
  id: string;
  storage_path: string;
  width: number;
  height: number;
  name: string;
  sort: number;
  published: boolean;
  created_at: string;
};

export type SubmissionKind = "quote" | "service" | "contact";
export type SubmissionStatus = "new" | "seen" | "done";

export type SubmissionRow = {
  id: string;
  kind: SubmissionKind;
  name: string;
  company: string;
  phone: string;
  email: string;
  subject: string;
  product_slug: string;
  message: string;
  ip_hash: string;
  status: SubmissionStatus;
  note: string;
  created_at: string;
  updated_at: string;
};

export type AdminUserRow = { user_id: string; email: string; created_at: string };

export type Database = {
  public: {
    Tables: {
      admin_users: Table<AdminUserRow, "user_id" | "email">;
      categories: Table<CategoryRow, "slug" | "title">;
      groups: Table<GroupRow, "slug" | "title" | "category_id">;
      products: Table<ProductRow, "slug" | "name" | "group_id">;
      product_images: Table<ProductImageRow, "product_id" | "storage_path" | "width" | "height">;
      downloads: Table<DownloadRow, "title" | "storage_path" | "size_bytes">;
      site_settings: Table<SiteSettingRow, "key" | "value">;
      reference_logos: Table<ReferenceLogoRow, "storage_path" | "width" | "height">;
      submissions: Table<SubmissionRow, "kind" | "name">;
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
