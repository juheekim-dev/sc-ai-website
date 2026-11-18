import type { Metadata } from "next";
import "./blog.css";
import { supabase, publishAtVisibleOr, POST_LIST_COLUMNS, type PostListItem } from "@/lib/supabase";
import BlogClient from "./BlogClient";
import { buildPageMetadata } from "@/lib/pageSeo";

export const revalidate = 3600; // ISR 1시간 — 어드민 저장 시 /api/revalidate 가 즉시 갱신. 주기가 짧으면 봇 요청마다 재생성돼 Vercel ISR Writes 무료 한도(월 20만)를 넘긴다(2026-11-18). force-dynamic 금지(CPU 한도, 2026-10-19)

const FALLBACK_METADATA: Metadata = {
  title: "블로그 · AI 면접 채용 인사이트",
  description: "AI면접 블로그 — AI 면접·채용 검증·HR 트렌드에 대한 인사이트를 전합니다.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
  openGraph: {
    title: "블로그 · AI면접 | AI 면접 채용 인사이트",
    description: "AI 면접·채용 검증·HR 트렌드에 대한 인사이트를 전합니다.",
    url: "/blog",
    images: [{ url: "/og-image.png?v=3", width: 1200, height: 630 }],
  },
};
export function generateMetadata() {
  return buildPageMetadata("/blog", FALLBACK_METADATA);
}

export default async function BlogPage() {
  let posts: PostListItem[] = [];
  let error = false;
  try {
    const res = await supabase
      .from("posts")
      .select(POST_LIST_COLUMNS)
      .eq("published", true)
      .or(publishAtVisibleOr())
      .order("created_at", { ascending: false });
    if (res.error) throw res.error;
    posts = (res.data as PostListItem[]) || [];
  } catch (err) {
    console.error("posts load failed:", err);
    error = true;
  }

  return <BlogClient posts={posts} error={error} />;
}
