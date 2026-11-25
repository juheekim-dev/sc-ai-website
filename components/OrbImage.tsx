import LiveOrb, { type OrbSpot } from "./LiveOrb";

// 이미지 + (orb가 있으면) 그 위 오브 자리에 움직이는 AI 면접관 오브(LiveOrb). AI 면접 도식(diagram-question)을 쓰는 곳이 함께 쓴다 —
// 홈 제품 카드·AI 면접 진행 방식·두 제품 비교. orb가 있으면 className은 바깥 상자에 붙는다(이미지 칸의 크기·여백·모서리 스타일을 그대로 받게).
export default function OrbImage({ src, alt, orb, className, width, height }: {
  src: string;
  alt: string;
  orb?: OrbSpot | null;
  className?: string;
  width: number;
  height: number;
}) {
  if (!orb) return <img className={className} src={src} alt={alt} width={width} height={height} loading="lazy" />;
  return (
    <span className={className ? `orb-host ${className}` : "orb-host"}>
      <img src={src} alt={alt} width={width} height={height} loading="lazy" />
      <LiveOrb spot={orb} />
    </span>
  );
}
