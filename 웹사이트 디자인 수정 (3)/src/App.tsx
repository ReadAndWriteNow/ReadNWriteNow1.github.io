import { useState, useEffect, useRef } from "react";
import { client } from "./sanity";

// 이미지 파일 import (src/imports 폴더 내 사진들)
import introduceImg from './imports/introduce.jpg';
import classroomImg from './imports/classroom.jpg';
import classroom2Img from './imports/classroom2.jpg';
import classroom3Img from './imports/classroom3.jpg';
import curriculum1Img from './imports/curriculum1.jpg';
import curriculum2Img from './imports/curriculum2.jpg';
import curriculum3Img from './imports/curriculum3.png';

const NAV_ITEMS = [
  { href: "about", label: "교습소 소개" },
  { href: "curriculum", label: "커리큘럼" },
  { href: "facility", label: "시설 안내" },
  { href: "info", label: "운영 안내" },
  { href: "contact", label: "상담 문의" },
];

/* ─── 기본 사이트 콘텐츠 ─── */
const DEFAULT_VALUES: Record<string, string> = {
  "header.title": "한우리 독서토론논술",
  "header.subtitle": "파주운정 산내푸르지오 독서교실",
  "intro.quote": "아이의 생각이 깊어지고, 읽는 기쁨이 자라나는 따뜻한 공간",
  "intro.sub": "스스로 생각의 씨앗을 틔울 수 있도록 돕습니다.",
  "about.slogan": "생각하는 힘이 아이의 미래를 바꿉니다",
  "about.name": "원장 이해옥",
  "about.career": "독서토론논술 교습소 운영 (10년 경력)\n해법·한우리 독서토론교습소 운영\n독서지도사 자격 보유",
  "about.desc": "단순히 책을 읽고 글을 쓰는 것을 넘어, 아이들이 스스로 생각하고 질문하는 힘을 길러주는 것을 교육 철학으로 삼고 있습니다.",
  "curriculum.elem_title": "저학년 / 고학년",
  "curriculum.elem_body": "그림책과 문학 작품을 통한 흥미 위주의 독서. 주 1회 주제별 글쓰기 및 자유 토론 진행.",
  "curriculum.mid_title": "내신 및 심화 논술",
  "curriculum.mid_body": "비문학 읽기 및 신문 칼럼 분석. 서술형 평가 대비 및 중등 내신 연계형 심화 논술 작성.",
  "info.hours": "평일 14:00 ~ 20:00 (주말 및 공휴일 휴무)",
  "info.address": "경기 파주시 심학산로 385 운정신도시센트럴푸르지오 상가 2동 204호",
  "info.parking": "건물 뒷편 주차장 이용 가능",
  "contact.desc": "우리 아이에게 딱 맞는 독서 논술 교육, 지금 바로 상담받아보세요!",
  "contact.kakao": "http://pf.kakao.com/_xxxxxx",
};

/* ─── 수업 소식 타입 & 초기 데이터 ─── */
type Review = { id: number; title: string; date: string; body: string };
let _reviewId = 100;
function newReview(): Review {
  return { id: ++_reviewId, title: "", date: new Date().toISOString().slice(0, 10), body: "" };
}
const REVIEW_SAMPLES: Review[] = [
  { id: 1, title: "11월 초등부 수업 — 『마당을 나온 암탉』 토론", date: "2024-11-08",
    body: "<p>이번 주 초등부는 황선미 작가의 『마당을 나온 암탉』을 함께 읽고 이야기 나눴습니다.</p><p>\"잎싹이 마당을 나온 건 용감한 걸까요, 무모한 걸까요?\"라는 질문에 아이들마다 다양한 의견이 나와 토론이 풍성하게 이어졌어요. 자유와 안전 중 무엇이 더 중요한지 스스로 생각해보는 시간이 되었습니다.</p><p>다음 주는 이 책을 바탕으로 짧은 주장 글쓰기를 진행할 예정입니다. 기대해주세요! 😊</p>" },
  { id: 2, title: "10월 중등부 — 신문 칼럼으로 논술 연습", date: "2024-10-18",
    body: "<p>중등부 수업에서는 최근 환경 문제를 다룬 신문 칼럼을 함께 읽고 분석했습니다.</p><p>글의 주장과 근거를 찾아 정리하고, 자신의 의견을 덧붙여 짧은 논술문으로 완성하는 과정을 밟았어요. 처음엔 어려워하던 친구들도 마무리쯤엔 꽤 탄탄한 문단을 완성해서 뿌듯했습니다.</p>" },
  { id: 3, title: "9월 수업 — 독서 토론 규칙 익히기", date: "2024-09-06",
    body: "<p>9월 첫 수업에서는 토론의 기본 규칙을 배우는 시간을 가졌습니다. 상대방 의견을 끝까지 듣기, 근거를 들어 반박하기, 감정이 아닌 사실로 이야기하기.</p><p>간단한 주제로 모의 토론을 진행했는데 아이들이 생각보다 훨씬 적극적으로 참여해서 놀랐어요. 앞으로의 수업이 더 기대됩니다!</p>" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ─── 카카오맵 지동 로더 ─── */
function MapLoader() {
  useEffect(() => {
    const renderMap = () => {
      const container = document.getElementById("daumRoughmapContainer1788803690193");
      if (!container || container.children.length > 0) return;

      if ((window as any).daum?.roughmap?.Lander) {
        new (window as any).daum.roughmap.Lander({
          timestamp: "1788803690193",
          key: "2ihvyw7i9ytd",
          mapWidth: "100%",
          mapHeight: "350",
        }).render();
      }
    };

    if ((window as any).daum?.roughmap?.Lander) {
      renderMap();
      return;
    }

    const scriptId = "daum-map-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.charset = "UTF-8";
      script.src = "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js";
      script.onload = () => setTimeout(renderMap, 200);
      document.head.appendChild(script);
    } else {
      setTimeout(renderMap, 200);
    }
  }, []);

  return null;
}

/* ═══════════════════════════════════════
   MOBILE LAYOUT
═══════════════════════════════════════ */
function MobileLayout({ content, onQna, onReview }: { content: Record<string, string>; onQna: () => void; onReview: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const getContent = (k: string) => content[k] || DEFAULT_VALUES[k] || "";

  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", wordBreak: "keep-all" }}
      className="min-h-screen bg-white text-[#1E2B3A]">

      {/* 헤더 */}
      <header className="bg-[#FF7F50] text-white px-5 pt-8 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase text-orange-100 mb-1">
              Hanwoori Reading &amp; Discussion
            </p>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight">
              {getContent("header.title")}
            </h1>
            <p className="text-sm mt-1 text-orange-100">{getContent("header.subtitle")}</p>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mt-1 shrink-0 p-2 rounded-lg bg-white/20 active:bg-white/40"
            aria-label="메뉴"
          >
            {menuOpen ? (
              <span className="block text-white text-lg leading-none">✕</span>
            ) : (
              <div className="space-y-1">
                <span className="block w-5 h-0.5 bg-white" />
                <span className="block w-5 h-0.5 bg-white" />
                <span className="block w-5 h-0.5 bg-white" />
              </div>
            )}
          </button>
        </div>

        {menuOpen && (
          <nav className="mt-4 grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => { scrollTo(item.href); setMenuOpen(false); }}
                className="py-2.5 px-3 rounded-xl text-sm font-semibold bg-white/20 active:bg-white/40 text-left"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onQna(); setMenuOpen(false); }}
              className="py-2.5 px-3 rounded-xl text-sm font-semibold bg-white/35 active:bg-white/50 text-left"
            >
              📋 자주 묻는 질문
            </button>
            <button
              onClick={() => { onReview(); setMenuOpen(false); }}
              className="py-2.5 px-3 rounded-xl text-sm font-semibold bg-white/35 active:bg-white/50 text-left"
            >
              📖 수업 소식
            </button>
          </nav>
        )}
      </header>

      {/* 인트로 띠 */}
      <div className="bg-[#FFF0EA] px-5 py-5 border-b border-orange-100">
        <p className="text-base font-semibold text-[#E8623A] leading-relaxed whitespace-pre-line">
          "{getContent("intro.quote")}"
        </p>
        <p className="mt-1.5 text-xs text-[#6B7280] leading-relaxed">
          {getContent("intro.sub")}
        </p>
      </div>

      {/* 교습소 소개 */}
      <section id="about" className="px-5 py-10">
        <MobileSectionTitle>교습소 및 원장 소개</MobileSectionTitle>

        <div className="mt-5 rounded-2xl overflow-hidden shadow-sm bg-[#FFF0EA] aspect-[3/2]">
          <img src={introduceImg} alt="원장 소개" className="w-full h-full object-cover object-center" />
        </div>

        <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 border-l-4 border-l-[#FF7F50]">
          <p className="text-[10px] font-bold tracking-widest text-[#FF7F50] uppercase mb-2">원장 소개</p>
          <p className="text-base font-bold text-[#1E2B3A] leading-snug mb-3 whitespace-pre-line">
            "{getContent("about.slogan")}"
          </p>
          <p className="font-semibold text-sm text-[#1E2B3A] mb-3">{getContent("about.name")}</p>
          <ul className="space-y-2">
            {getContent("about.career").split("\n").map((t, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-[#6B7280]">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#FF7F50] mt-1.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 bg-[#FDFBF7] border border-[#E6DED0] rounded-2xl p-5">
          <p className="text-sm text-[#6B7280] leading-relaxed mb-3 whitespace-pre-line">
            {getContent("about.desc")}
          </p>
        </div>
      </section>

      <MobileDivider />

      {/* 커리큘럼 */}
      <section id="curriculum" className="px-5 py-10">
        <MobileSectionTitle>커리큘럼 및 수업 방식</MobileSectionTitle>
        <div className="mt-5 space-y-4">
          <MobileCard
            badge="초등부"
            title={getContent("curriculum.elem_title")}
            body={getContent("curriculum.elem_body")}
            detail="소수 정예 최대 6명 그룹 수업"
          />
          <MobileCard
            badge="중등부"
            title={getContent("curriculum.mid_title")}
            body={getContent("curriculum.mid_body")}
            detail="내신 성적 향상 집중 지도"
          />
        </div>
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-[4/3]">
            <img src={curriculum2Img} alt="수업 모습 1" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-[4/3]">
            <img src={curriculum1Img} alt="수업 모습 2" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <MobileDivider />

      {/* 시설 안내 */}
      <section id="facility" className="px-5 py-10">
        <MobileSectionTitle>시설 안내</MobileSectionTitle>
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-[4/3]">
            <img src={classroom3Img} alt="교실 내부 모습" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-[4/3]">
            <img src={classroom2Img} alt="학원 내부 모습" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <MobileDivider />

      {/* 운영 안내 및 지도 */}
      <section id="info" className="px-5 py-10">
        <MobileSectionTitle>운영 안내 및 오시는 길</MobileSectionTitle>
        <div className="mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-[#FF7F50] p-5">
          <ul className="space-y-4">
            <MobileInfoItem icon="🕐" label="운영 시간" value={getContent("info.hours")} />
            <MobileInfoItem icon="📍" label="주소" value={getContent("info.address")} />
            <MobileInfoItem icon="🚗" label="주차" value={getContent("info.parking")} />
          </ul>
        </div>
        <div className="mt-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div id="daumRoughmapContainer1788803690193" className="root_daum_roughmap root_daum_roughmap_landing w-full" />
          <MapLoader />
        </div>
      </section>

      <MobileDivider />

      {/* 상담 문의 */}
      <section id="contact" className="px-5 py-10 text-center">
        <MobileSectionTitle>상담 문의</MobileSectionTitle>
        <p className="mt-3 text-sm text-[#6B7280] leading-relaxed">
          {getContent("contact.desc")}
        </p>
        <a
          href={getContent("contact.kakao")}
          target="_blank"
          rel="noreferrer"
          className="mt-6 flex items-center justify-center gap-2 bg-[#FF7F50] active:bg-[#E8623A] text-white font-bold text-base px-8 py-4 rounded-2xl shadow-lg shadow-orange-200"
        >
          💬 카카오톡 1:1 상담하기
        </a>
      </section>

      <footer className="bg-[#1E2B3A] text-[#8A9AB0] text-xs text-center py-6 px-5 leading-relaxed">
        <p>© 2026 {getContent("header.title")} {getContent("header.subtitle")}</p>
        <p className="mt-1 text-[#4A5A6A]">{getContent("info.address")}</p>
      </footer>
    </div>
  );
}

function MobileSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-[#1E2B3A] tracking-tight">{children}</h2>
      <div className="mt-2 w-8 h-1 rounded-full bg-[#FF7F50]" />
    </div>
  );
}

function MobileDivider() {
  return <div className="mx-5 border-t border-gray-100" />;
}

function MobileCard({ badge, title, body, detail }: { badge: string; title: string; body: string; detail: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 border-l-4 border-l-[#FF7F50]">
      <span className="inline-block text-[10px] font-bold tracking-widest text-[#FF7F50] uppercase bg-[#FFF0EA] px-2.5 py-1 rounded-full mb-3">
        {badge}
      </span>
      <h3 className="text-base font-bold text-[#1E2B3A] mb-2">{title}</h3>
      <p className="text-sm text-[#6B7280] leading-relaxed mb-3">{body}</p>
      <p className="text-xs font-semibold text-[#E8623A]">✦ {detail}</p>
    </div>
  );
}

function MobileInfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="text-lg shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] font-bold text-[#FF7F50] uppercase tracking-wide">{label}</p>
        <p className="text-sm text-[#1E2B3A] mt-0.5 leading-relaxed">{value}</p>
      </div>
    </li>
  );
}

/* ═══════════════════════════════════════
   PC LAYOUT
═══════════════════════════════════════ */
function PCLayout({ content, onQna, onReview }: { content: Record<string, string>; onQna: () => void; onReview: () => void }) {
  const getContent = (k: string) => content[k] || DEFAULT_VALUES[k] || "";

  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", wordBreak: "keep-all" }}
      className="min-h-screen bg-white text-[#1E2B3A]">

      {/* 헤더 */}
      <header className="bg-[#FF7F50] text-white relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-10 py-10">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-orange-100 mb-1">
                Hanwoori Reading &amp; Discussion
              </p>
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight">{getContent("header.title")}</h1>
              <p className="text-xl mt-1 text-orange-100">{getContent("header.subtitle")}</p>
            </div>
          </div>
          <nav className="flex gap-2 flex-wrap">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="px-5 py-2 rounded-full text-sm font-semibold bg-white/15 hover:bg-white/30 transition"
              >
                {item.label}
              </button>
            ))}
            <button onClick={onQna} className="px-5 py-2 rounded-full text-sm font-semibold bg-white/35 hover:bg-white/50 transition">
              📋 자주 묻는 질문
            </button>
            <button onClick={onReview} className="px-5 py-2 rounded-full text-sm font-semibold bg-white/35 hover:bg-white/50 transition">
              📖 수업 소식
            </button>
          </nav>
        </div>
      </header>

      {/* 인트로 띠 */}
      <div className="bg-[#FFF0EA] border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-10 py-8 text-center">
          <p className="text-2xl font-semibold text-[#E8623A] leading-relaxed whitespace-pre-line">
            "{getContent("intro.quote")}"
          </p>
          <p className="mt-2 text-sm text-[#6B7280]">{getContent("intro.sub")}</p>
        </div>
      </div>

      {/* 교습소 소개 */}
      <section id="about" className="max-w-5xl mx-auto px-10 py-20">
        <PCSectionTitle>교습소 및 원장 소개</PCSectionTitle>
        <div className="grid grid-cols-2 gap-8 mt-10 items-stretch">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 border-l-4 border-l-[#FF7F50]">
            <p className="text-xs font-bold tracking-widest text-[#FF7F50] uppercase mb-3">원장 소개</p>
            <h3 className="text-xl font-bold text-[#1E2B3A] mb-4 leading-snug whitespace-pre-line">
              "{getContent("about.slogan")}"
            </h3>
            <p className="font-semibold text-[#1E2B3A] mb-3">{getContent("about.name")}</p>
            <ul className="space-y-2">
              {getContent("about.career").split("\n").map((t, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[#6B7280]">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#FF7F50] mt-1.5" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm bg-[#FFF0EA] self-stretch">
            <img src={introduceImg} alt="원장 소개" className="w-full h-full object-cover object-center block" />
          </div>
        </div>
        <div className="mt-8 bg-[#FDFBF7] border border-[#E6DED0] rounded-2xl p-8 text-center">
          <p className="text-sm text-[#6B7280] leading-relaxed whitespace-pre-line">
            {getContent("about.desc")}
          </p>
        </div>
      </section>

      <PCDivider />

      {/* 커리큘럼 */}
      <section id="curriculum" className="max-w-5xl mx-auto px-10 py-20">
        <PCSectionTitle>커리큘럼 및 수업 방식</PCSectionTitle>
        <div className="grid grid-cols-2 gap-6 mt-10">
          <PCCard badge="초등부" title={getContent("curriculum.elem_title")} body={getContent("curriculum.elem_body")} detail="소수 정예 4명 그룹 수업" />
          <PCCard badge="중등부" title={getContent("curriculum.mid_title")} body={getContent("curriculum.mid_body")} detail="내신 성적 향상 집중 지도" />
        </div>
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-[4/3]">
            <img src={curriculum2Img} alt="수업 모습 1" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-[4/3]">
            <img src={curriculum1Img} alt="수업 모습 2" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <PCDivider />

      {/* 시설 안내 */}
      <section id="facility" className="max-w-5xl mx-auto px-10 py-20">
        <PCSectionTitle>시설 안내</PCSectionTitle>
        <div className="grid grid-cols-2 gap-6 mt-10">
          <div className="rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-[4/3]">
            <img src={classroom3Img} alt="교실 내부 모습" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-[4/3]">
            <img src={classroom2Img} alt="학원 내부 모습" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <PCDivider />

      {/* 운영 안내 및 지도 */}
      <section id="info" className="max-w-5xl mx-auto px-10 py-20">
        <PCSectionTitle>운영 안내 및 오시는 길</PCSectionTitle>
        <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-[#FF7F50] p-8">
          <ul className="space-y-4">
            <PCInfoItem icon="🕐" label="운영 시간" value={getContent("info.hours")} />
            <PCInfoItem icon="📍" label="주소" value={getContent("info.address")} />
            <PCInfoItem icon="🚗" label="주차 정보" value={getContent("info.parking")} />
          </ul>
        </div>
        <div className="mt-6 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div id="daumRoughmapContainer1788803690193" className="root_daum_roughmap root_daum_roughmap_landing w-full" />
          <MapLoader />
        </div>
      </section>

      <PCDivider />

      {/* 상담 문의 */}
      <section id="contact" className="max-w-5xl mx-auto px-10 py-20 text-center">
        <PCSectionTitle>상담 문의</PCSectionTitle>
        <p className="mt-4 text-[#6B7280]">{getContent("contact.desc")}</p>
        <div className="mt-10">
          <a
            href={getContent("contact.kakao")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-[#FF7F50] hover:bg-[#E8623A] text-white font-bold text-lg px-12 py-5 rounded-full shadow-lg shadow-orange-200 transition-all hover:-translate-y-1"
          >
            💬 카카오톡 1:1 상담하기
          </a>
        </div>
      </section>

      <footer className="bg-[#1E2B3A] text-[#8A9AB0] text-sm text-center py-8 px-10">
        <p>© 2026 {getContent("header.title")} {getContent("header.subtitle")}. All rights reserved.</p>
        <p className="mt-1 text-xs text-[#4A5A6A]">{getContent("info.address")}</p>
      </footer>
    </div>
  );
}

function PCSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-[#1E2B3A] tracking-tight">{children}</h2>
      <div className="mx-auto mt-3 w-10 h-1 rounded-full bg-[#FF7F50]" />
    </div>
  );
}

function PCDivider() {
  return <div className="max-w-5xl mx-auto px-10"><div className="border-t border-gray-100" /></div>;
}

function PCCard({ badge, title, body, detail }: { badge: string; title: string; body: string; detail: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 border-l-4 border-l-[#FF7F50]">
      <span className="inline-block text-xs font-bold tracking-widest text-[#FF7F50] uppercase bg-[#FFF0EA] px-3 py-1 rounded-full mb-4">
        {badge}
      </span>
      <h3 className="text-xl font-bold text-[#1E2B3A] mb-3">{title}</h3>
      <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{body}</p>
      <p className="text-xs font-semibold text-[#E8623A]">✦ {detail}</p>
    </div>
  );
}

function PCInfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <li className="flex items-start gap-4">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <p className="text-xs font-bold text-[#FF7F50] uppercase tracking-wide">{label}</p>
        <p className="text-sm text-[#1E2B3A] mt-0.5">{value}</p>
      </div>
    </li>
  );
}

/* ═══════════════════════════════════════
   QnA & Review (생략 없는 전체 유지)
═══════════════════════════════════════ */
const QNA_LIST = [
  {
    q: "어떤 마음가짐으로 운영하시나요?",
    a: `제 아이가 초등학교에 입학하면서 학교 독서 지원단과 책 읽어주기 어머니 봉사활동을 시작하게 되었습니다. 아이들에게 책을 읽어주며 제 이야기에 귀 기울이고 몰입하는 모습을 볼 때마다 큰 행복과 보람을 느꼈고, 자연스럽게 독서 교육에 관심을 갖게 되었습니다.\n\n처음에는 제 아이를 잘 키우고 싶은 마음에서 출발했지만, 아이들과 책을 함께 읽는 시간이 쌓이면서 <strong>우리 지역의 더 많은 아이에게 올바른 독서 방법과 토론의 즐거움을 전하고 싶다</strong>는 생각이 커졌습니다. 그 마음을 바탕으로 지금의 한우리독서토론논술 교습소를 설립하게 되었습니다.<br><br><img src="${classroomImg}" alt="교실 모습" style="width:100%; border-radius:12px; display:block;" />`,
  },
  {
    q: "수업은 어떤 프로그램으로 진행되나요?",
    a: `저희 교습소는 <strong>'한우리독서토론논술'</strong>의 체계적인 프로그램을 바탕으로 유아부터 초등, 중등까지 아이의 발달 단계와 눈높이에 맞는 독서토론논술 수업을 진행하고 있습니다.\n\n한우리독서토론논술 연구원들은 매달 교과 과정에 맞춰 필독서를 선정하고, 책에 맞는 교재를 새롭게 구성합니다. 저희는 선정된 필독서를 깊이 있게 읽고, 교재를 바탕으로 <strong>자신의 생각을 논리적으로 나누는 토론과 글로 표현하는 논술 수업</strong>을 진행하며 아이의 배경지식과 사고력을 자연스럽게 넓혀가고 있습니다.\n\n최근에는 <strong>'몰입독서'</strong> 프로그램도 새롭게 도입했습니다. 한 권의 책을 끝까지 읽어낼 수 있도록 선생님이 전 과정을 밀착해 지도하며, <strong>여러 권을 읽는 것보다 한 권을 제대로 읽는 힘</strong>을 기르는 데 초점을 맞췄습니다.<br><br><img src="${curriculum3Img}" alt="상세 커리큘럼" style="width:100%; border-radius:12px; margin-top:8px; display:block;" />`,
  },
  { q: "수강 대상 연령은 어떻게 되나요?", a: "유아부터 초등, 중등부까지 수강이 가능합니다." },
  { q: "수업료 및 교재비는 어떻게 되나요?", a: "카카오톡 1:1 상담을 통해 안내해 드리고 있습니다." },
];

function ReviewPage({ onBack, reviews }: { onBack: () => void; reviews: Review[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"date" | "title">("date");
  const [detailId, setDetailId] = useState<number | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  const detail = reviews.find(r => r.id === detailId);

  const filtered = reviews
    .filter(r => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return r.title.toLowerCase().includes(q) || r.body.replace(/<[^>]+>/g, "").toLowerCase().includes(q);
    })
    .sort((a, b) => sort === "date" ? b.date.localeCompare(a.date) : a.title.localeCompare(b.title));

  if (detail) return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1E2B3A]">
      <header className="bg-[#FF7F50] text-white px-5 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-extrabold">수업 소식</h1>
          <button onClick={() => setDetailId(null)} className="text-sm bg-white/20 px-4 py-1.5 rounded-full">← 목록으로</button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-xs text-[#FF7F50] font-bold mb-2">📅 {detail.date}</p>
          <h2 className="text-xl font-extrabold mb-4">{detail.title}</h2>
          <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: detail.body }} />
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1E2B3A]">
      <header className="bg-[#FF7F50] text-white px-5 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-extrabold">수업 소식</h1>
          <button onClick={onBack} className="text-sm bg-white/20 px-4 py-1.5 rounded-full">← 홈으로</button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-5 py-8">
        <div className="flex gap-2 mb-6">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="검색어 입력" className="flex-1 border rounded-xl px-4 py-2 text-sm" />
          <button onClick={() => setSort(s => s === "date" ? "title" : "date")} className="border px-4 py-2 rounded-xl text-xs font-bold bg-white">
            {sort === "date" ? "📅 최신순" : "🔤 제목순"}
          </button>
        </div>
        <div className="space-y-3">
          {filtered.map(r => (
            <button key={r.id} onClick={() => setDetailId(r.id)} className="w-full text-left bg-white p-4 rounded-2xl border border-gray-100 shadow-sm block">
              <p className="font-bold text-base">{r.title}</p>
              <p className="text-xs text-[#aaa] mt-1">📅 {r.date}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

function QnaPage({ onBack, items }: { onBack: () => void; items?: typeof QNA_LIST }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const list = items ?? QNA_LIST;

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1E2B3A]">
      <header className="bg-[#FF7F50] text-white px-5 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-extrabold">자주 묻는 질문</h1>
          <button onClick={onBack} className="text-sm bg-white/20 px-4 py-1.5 rounded-full">← 홈으로</button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-5 py-8 space-y-3">
        {list.map((item, idx) => (
          <div key={idx} className="bg-white border rounded-2xl overflow-hidden">
            <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} className="w-full text-left p-4 font-semibold text-sm flex justify-between">
              <span>Q. {item.q}</span>
              <span>{openIdx === idx ? "▲" : "▼"}</span>
            </button>
            {openIdx === idx && (
              <div className="p-4 border-t text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.a }} />
            )}
          </div>
        ))}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════
   관리자 모달
═══════════════════════════════════════ */
const ADMIN_PW = "hanwoori2024";

const SECTIONS = [
  {
    id: "header", label: "헤더",
    fields: [
      { key: "title", label: "메인 제목", type: "text" },
      { key: "subtitle", label: "부제목", type: "text" },
    ],
  },
  {
    id: "intro", label: "인트로 문구",
    fields: [
      { key: "quote", label: "인용 문구", type: "text" },
      { key: "sub", label: "보조 문구", type: "text" },
    ],
  },
  {
    id: "about", label: "원장 소개",
    fields: [
      { key: "slogan", label: "슬로건", type: "text" },
      { key: "name", label: "원장 이름", type: "text" },
      { key: "career", label: "경력 (줄바꿈 구분)", type: "textarea" },
      { key: "desc", label: "교육 철학", type: "textarea" },
    ],
  },
  {
    id: "info", label: "운영 안내",
    fields: [
      { key: "hours", label: "운영 시간", type: "text" },
      { key: "address", label: "주소", type: "text" },
      { key: "parking", label: "주차 안내", type: "text" },
    ],
  },
  {
    id: "contact", label: "상담 문의",
    fields: [
      { key: "desc", label: "안내 문구", type: "text" },
      { key: "kakao", label: "카카오톡 링크", type: "text" },
    ],
  },
];

function AdminModal({ onClose, content, onContentChange, reviews, onReviewsChange }: {
  onClose: () => void;
  content: Record<string, string>;
  onContentChange: (next: Record<string, string>) => void;
  reviews: Review[];
  onReviewsChange: (list: Review[]) => void;
}) {
  const [step, setStep] = useState<"pw" | "edit">("pw");
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [activeSection, setActiveSection] = useState("header");
  const [values, setValues] = useState<Record<string, string>>(content);
  const [saved, setSaved] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PW) { setStep("edit"); setPwError(false); }
    else setPwError(true);
  }

  async function handleSave() {
    onContentChange(values);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    try {
      await client.createOrReplace({
        _id: "site-content",
        _type: "siteContent",
        values,
      });
    } catch (e) {
      console.error("Sanity save error:", e);
    }
  }

  const currentSection = SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-[#FF7F50] px-6 py-4 flex justify-between items-center text-white font-bold">
          <span>관리자 대시보드</span>
          <button onClick={onClose}>✕</button>
        </div>

        {step === "pw" ? (
          <form onSubmit={handleLogin} className="p-8 space-y-4">
            <p className="text-sm text-gray-600">비밀번호를 입력하세요.</p>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="비밀번호" className="w-full border rounded-xl p-3 text-sm" />
            {pwError && <p className="text-xs text-red-500">비밀번호가 틀렸습니다.</p>}
            <button type="submit" className="w-full bg-[#FF7F50] text-white font-bold py-3 rounded-xl">로그인</button>
          </form>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <div className="w-32 bg-gray-50 border-r p-2 space-y-1">
              {SECTIONS.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${activeSection === s.id ? "bg-[#FFF0EA] text-[#E8623A]" : "text-gray-600"}`}>
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {currentSection?.fields.map(f => {
                const k = `${currentSection.id}.${f.key}`;
                return (
                  <div key={f.key}>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea rows={3} value={values[k] || DEFAULT_VALUES[k] || ""} onChange={e => setValues(v => ({ ...v, [k]: e.target.value }))} className="w-full border rounded-xl p-2.5 text-sm" />
                    ) : (
                      <input type="text" value={values[k] || DEFAULT_VALUES[k] || ""} onChange={e => setValues(v => ({ ...v, [k]: e.target.value }))} className="w-full border rounded-xl p-2.5 text-sm" />
                    )}
                  </div>
                );
              })}
              <button onClick={handleSave} className="bg-[#FF7F50] text-white font-bold px-6 py-2.5 rounded-xl text-sm">
                저장하기
              </button>
              {saved && <span className="text-xs text-emerald-600 font-bold ml-2">✓ 바로 반영되었습니다!</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN APP MAIN ENTRY
═══════════════════════════════════════ */
export default function App() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [page, setPage] = useState<"home" | "qna" | "reviews">("home");
  const [adminOpen, setAdminOpen] = useState(false);
  const [siteContent, setSiteContent] = useState<Record<string, string>>(DEFAULT_VALUES);
  const [liveReviews, setLiveReviews] = useState<Review[]>(REVIEW_SAMPLES);
  const footerClickCount = useRef(0);

  useEffect(() => {
    // Sanity에서 동적 수정 값 불러오기
    client.fetch(`*[_id == "site-content"][0]`).then((doc) => {
      if (doc && doc.values) setSiteContent(doc.values);
    }).catch(() => {});

    client.fetch(`*[_type == "review"]`).then((data) => {
      if (data && data.length > 0) setLiveReviews(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  function handleFooterClick() {
    footerClickCount.current += 1;
    if (footerClickCount.current >= 3) {
      footerClickCount.current = 0;
      setAdminOpen(true);
    }
  }

  return (
    <>
      {adminOpen && (
        <AdminModal
          onClose={() => setAdminOpen(false)}
          content={siteContent}
          onContentChange={setSiteContent}
          reviews={liveReviews}
          onReviewsChange={setLiveReviews}
        />
      )}
      <div onClick={e => {
        if ((e.target as HTMLElement).closest("footer")) handleFooterClick();
      }}>
        {page === "qna"
          ? <QnaPage onBack={() => { setPage("home"); window.scrollTo(0, 0); }} />
          : page === "reviews"
            ? <ReviewPage onBack={() => { setPage("home"); window.scrollTo(0, 0); }} reviews={liveReviews} />
            : isMobile
              ? <MobileLayout content={siteContent} onQna={() => setPage("qna")} onReview={() => setPage("reviews")} />
              : <PCLayout content={siteContent} onQna={() => setPage("qna")} onReview={() => setPage("reviews")} />
        }
      </div>
    </>
  );
}
