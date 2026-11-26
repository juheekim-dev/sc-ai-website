import DemoPanel from "./DemoPanel";
import LiveOrb from "./LiveOrb";

// AI 면접 '면접 진행' 그림(2026-11-26 "히어로의 AI 면접관 이미지로, 질문하면 꼬리질문이 나오게, 오브는 계속 돌아가게").
// 히어로의 AI 면접관 카드와 같은 모양을 HTML로 크게 그린다. 질문(.ad-1) → 꼬리질문(.ad-2)이 차례로 나타나는 모션은 DemoPanel,
// 오브는 말하기 모드로 계속 움직인다(LiveOrb). 스타일은 app/landing.css(.ask-demo·.ad-*).
export default function AskDemo() {
  return (
    <DemoPanel label="AI 면접관이 '최근 프로젝트에서 가장 어려웠던 결정은 무엇이었나요?'라고 묻고, 이어서 꼬리질문 '그 결정을 내릴 때 어떤 근거를 확인했나요?'를 하는 화면 예시">
      <div className="ad-card">
        <div className="ad-head"><b>AI 면접관</b><span><i></i>질문 중</span></div>
        <div className="ad-row">
          <span className="ad-orb"><LiveOrb spot={{ x: 0, y: 0, size: 1, w: 1, h: 1, cover: "#FFFFFF", opacity: 0.62 }} /></span>
          <p className="ad-ask ad-1">최근 프로젝트에서 가장 어려웠던 결정은 무엇이었나요?</p>
        </div>
        <p className="ad-follow ad-2"><b>꼬리질문</b><span>그 결정을 내릴 때 어떤 근거를 확인했나요?</span></p>
      </div>
    </DemoPanel>
  );
}
