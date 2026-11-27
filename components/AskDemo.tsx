import DemoPanel from "./DemoPanel";
import LiveOrb from "./LiveOrb";

// AI 면접 '면접 진행' 그림(2026-11-26 "히어로의 AI 면접관 이미지로, 질문하면 꼬리질문이 나오게, 오브는 계속 돌아가게").
// 히어로의 AI 면접관 카드와 같은 모양을 HTML로 크게 그린다. 질문(.ad-1) → 꼬리질문(.ad-2)이 차례로 나타나는 모션은 DemoPanel,
// 오브는 말하기 모드로 계속 움직인다(LiveOrb). 스타일은 app/landing.css(.ask-demo·.ad-*).
// 11/26 AI 역량검사 'AI 인터뷰'(과제 제출 뒤 AI 면접)에도 같은 카드를 쓴다 — 글만 props로 바꾸고, chip을 주면 질문 위에 '제출 완료' 표시.
const DEFAULT = {
  head: "AI 면접관",
  ask: "최근 프로젝트에서 가장 어려웠던 결정은 무엇이었나요?",
  followLabel: "꼬리질문",
  follow: "그 결정을 내릴 때 어떤 근거를 확인했나요?",
};

export default function AskDemo({
  head = DEFAULT.head,
  ask = DEFAULT.ask,
  followLabel = DEFAULT.followLabel,
  follow = DEFAULT.follow,
  chip,
  label,
}: {
  head?: string;
  ask?: string;
  followLabel?: string;
  follow?: string;
  chip?: string;
  label?: string;
}) {
  return (
    <DemoPanel label={label ?? `${head}이 '${ask}'라고 묻고, 이어서 ${followLabel} '${follow}'를 하는 화면 예시`}>
      <div className="ad-card">
        <div className="ad-head"><b>{head}</b><span><i></i>질문 중</span></div>
        {chip && <p className="ad-chip"><i className="fa-solid fa-check" aria-hidden="true"></i>{chip}</p>}
        <div className="ad-row">
          <span className="ad-orb"><LiveOrb spot={{ x: 0, y: 0, size: 1, w: 1, h: 1, cover: "#FFFFFF", opacity: 0.62 }} /></span>
          <p className="ad-ask ad-1">{ask}</p>
        </div>
        <p className="ad-follow ad-2"><b>{followLabel}</b><span>{follow}</span></p>
      </div>
    </DemoPanel>
  );
}
