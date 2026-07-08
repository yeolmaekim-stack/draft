"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import Hydrated from "@/components/Hydrated";
import TagEditor from "@/components/TagEditor";
import type { TeamMember } from "@/types";

const EMOJI_CHOICES = ["🦊", "🐰", "🐻", "🐱", "🐶", "🐼", "🐨", "🦁", "🐯", "🐸", "🐵", "🦄"];
const COLOR_CHOICES = ["#eb6834", "#e87ba4", "#4a3aa7", "#1baf7a", "#eda100", "#2a78d6", "#e34948", "#008300"];

function MemberCard({ member }: { member: TeamMember }) {
  const updateMember = useStore((s) => s.updateMember);
  const removeMember = useStore((s) => s.removeMember);

  return (
    <div className="card flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
            style={{ background: `${member.color}33` }}
          >
            {member.emoji}
          </span>
          <input
            className="input !w-auto !border-none !bg-transparent !px-0 text-base font-bold"
            value={member.name}
            onChange={(e) => updateMember(member.id, { name: e.target.value })}
          />
        </div>
        <button
          onClick={() => removeMember(member.id)}
          className="btn btn-ghost !px-2.5 !py-1 text-[12px] hover:!border-red-400 hover:!text-red-300"
        >
          삭제
        </button>
      </div>

      <div>
        <p className="mb-1 text-[12px] font-semibold text-white/50">👍 좋아하는거</p>
        <TagEditor
          tags={member.likes}
          onChange={(tags) => updateMember(member.id, { likes: tags })}
          placeholder="예: 매운거, 국물, 치킨"
          variant="like"
        />
      </div>
      <div>
        <p className="mb-1 text-[12px] font-semibold text-white/50">👎 싫어하는거</p>
        <TagEditor
          tags={member.dislikes}
          onChange={(tags) => updateMember(member.id, { dislikes: tags })}
          placeholder="예: 오이, 마라"
          variant="dislike"
        />
      </div>
      <div>
        <p className="mb-1 text-[12px] font-semibold text-white/50">🚫 못먹는거 (알러지 등)</p>
        <TagEditor
          tags={member.cannotEat}
          onChange={(tags) => updateMember(member.id, { cannotEat: tags })}
          placeholder="예: 갑각류, 고수"
          variant="cannot"
        />
      </div>
    </div>
  );
}

function AddMemberForm() {
  const addMember = useStore((s) => s.addMember);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_CHOICES[0]);

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const color = COLOR_CHOICES[Math.floor(Math.random() * COLOR_CHOICES.length)];
    addMember({ name: trimmed, emoji, color, likes: [], dislikes: [], cannotEat: [] });
    setName("");
  }

  return (
    <div className="card flex flex-col gap-3 p-5">
      <p className="text-sm font-semibold text-white/80">+ 새 팀원 추가</p>
      <div className="flex flex-wrap gap-1.5">
        {EMOJI_CHOICES.map((e) => (
          <button
            key={e}
            onClick={() => setEmoji(e)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-lg ${
              emoji === e ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-white/10 bg-white/5"
            }`}
          >
            {e}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button className="btn btn-primary !px-4" onClick={submit}>
          추가
        </button>
      </div>
    </div>
  );
}

function TeamContent() {
  const members = useStore((s) => s.members);
  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="eyebrow mb-2 w-fit">✦ the crew</span>
        <h1 className="font-display gradient-text text-2xl italic font-black sm:text-3xl">팀원 관리</h1>
        <p className="mt-1 text-sm text-white/55">
          좋아하는거 / 싫어하는거 / 못먹는거는 메뉴명이 아니어도 돼요. &quot;매운거&quot;, &quot;닭고기&quot;, &quot;오이&quot;처럼 자유롭게 태그로 남겨주세요.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((m) => (
          <MemberCard key={m.id} member={m} />
        ))}
        <AddMemberForm />
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <Hydrated>
      <TeamContent />
    </Hydrated>
  );
}
