import DemoPanel from "./DemoPanel";

// AI 역량검사 '과제 화면' 그림(2026-11-26 "히어로 이미지로, AI 면접 참고해") — 히어로의 AI 어시스턴트 카드(어두운 바탕)와 같은 모양을
// HTML로 크게 그린다. 지원자 지시(.ad-1) → AI 답(.ad-2)이 차례로 나타나는 모션은 DemoPanel(AI 면접 AskDemo와 같은 판·주기).
// 글은 히어로와 같은 일반 내용(파일 1, 2, 3). 스타일은 app/landing.css(.ad-card.dark).
export default function AssistDemo() {
  return (
    <DemoPanel label="지원자가 AI 어시스턴트에게 '파일 1, 2, 3을 비교해서 표로 정리해 줘'라고 지시하고, AI가 '세 파일을 읽고 비교표를 만들었어요'라고 답하는 과제 화면 예시">
      <div className="ad-card dark">
        <div className="ad-head"><b>AI 어시스턴트</b><span><i></i>Build</span></div>
        <p className="ad-you ad-1">파일 1, 2, 3을 비교해서 표로 정리해 줘</p>
        <p className="ad-ai ad-2"><span className="ad-spark" aria-hidden="true">✦</span>세 파일을 읽고 비교표를 만들었어요<em>완료</em></p>
      </div>
    </DemoPanel>
  );
}
