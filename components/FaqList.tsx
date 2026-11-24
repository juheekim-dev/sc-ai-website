import { renderBody } from "@/lib/postRender";

// 자주 묻는 질문 목록 — 홈(어드민 FAQ, DB)·제품 페이지(코드에 고정한 FAQ) 공용. 스타일은 app/landing.css(.faq-list·.faq-item).
export default function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="faq-list">
      {items.map((f, i) => (
        <details className="faq-item" key={i} {...(i === 0 ? { open: true } : {})}>
          <summary>{f.question} <i className="fa-solid fa-plus fq-ic"></i></summary>
          {/* 답변에 박힌 강제 줄바꿈(<br>)은 제거 — 화면폭에 맞춰 자연스럽게 흐르도록(문단 <p>은 유지) */}
          <div className="fa-ans" dangerouslySetInnerHTML={{ __html: renderBody(f.answer).replace(/<br\s*\/?>\s*/gi, " ") }} />
        </details>
      ))}
    </div>
  );
}
