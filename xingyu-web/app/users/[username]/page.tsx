"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileText, Link2, MoreHorizontal, Send, Share2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FollowButton } from "@/components/community/engagement";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { communityApi, type ProfileDetail, type SpaceWorks } from "@/lib/community-api";

function EmptySection({ children }: { children: React.ReactNode }) {
  return <p className="px-4 py-9 text-center text-sm text-slate-400">{children}</p>;
}

function ProfileAvatar({ avatar, display }: { avatar?: string | null; display: string }) {
  return avatar ? <img src={avatar} alt={display} /> : <span className="xy-profile-avatar-fallback" aria-label={display}>{display.slice(0, 1).toUpperCase()}</span>;
}

function WorkVisual({ index }: { index: number }) {
  return <span aria-hidden="true" className={`xy-profile-visual xy-profile-visual--${index % 3}`}><FileText /></span>;
}

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<ProfileDetail | null>(null);
  const [spaceWorks, setSpaceWorks] = useState<SpaceWorks | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUser(null);
    setSpaceWorks(null);
    setError(null);
    void Promise.all([communityApi.getProfile(username), communityApi.getUserWorks(username)])
      .then(([profile, works]) => {
        setUser(profile);
        setSpaceWorks(works);
      })
      .catch((cause) => {
        setError(cause instanceof ApiError && cause.problem.status === 404 ? "用户不存在或主页未公开" : "加载失败，请稍后重试");
      });
  }, [username]);

  if (error) return <AppShell><main className="xy-profile-loading"><Alert variant="destructive">{error}</Alert></main></AppShell>;
  if (!user) return <AppShell><main className="xy-profile-loading">正在加载个人主页…</main></AppShell>;

  const display = user.displayName || user.username;
  const works = spaceWorks?.works ?? [];
  const featuredWorks = works.slice(0, 3);
  const articleWorks = works.slice(0, 2);
  const profileHref = `/users/${encodeURIComponent(user.username)}`;
  const shareProfile = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <AppShell>
      <main className="xy-profile-page">
        <section className="xy-profile-hero">
          <div className="xy-profile-space"><img src="/prototype-assets/profile/profile-space.png" alt="" /></div>
          <div className="xy-profile-avatar"><ProfileAvatar avatar={user.avatar} display={display} /></div>
          <div className="xy-profile-identity">
            <div><h1>{display}</h1><span>{spaceWorks?.owner ? "创作者" : "社区成员"}</span></div>
            <b>@{user.username}</b>
            <p>{user.bio || "这个创作者暂未填写个人介绍。"}</p>
            {user.websiteUrl && <div><a href={user.websiteUrl} target="_blank" rel="noreferrer"><Link2 />{user.websiteUrl.replace(/^https?:\/\//, "")}</a></div>}
            {spaceWorks?.description && <div className="xy-profile-tags"><small>创作空间</small><span>{spaceWorks.description}</span></div>}
            <small>{spaceWorks?.owner ? "这是你的公开主页" : "在星语社区留下创作轨迹"}</small>
            {spaceWorks?.categories?.length ? <div className="xy-profile-badge"><Sparkles /><span><b>创作领域</b><small>{spaceWorks.categories.map((item) => item.name).join(" · ")}</small></span></div> : null}
          </div>
          <div className="xy-profile-actions">
            {!user.owner ? <FollowButton username={user.username} initialFollowing={user.following} className="rounded-xl px-8" /> : <Button asChild><Link href="/settings/profile">编辑资料</Link></Button>}
            {!user.owner && <Button variant="outline" asChild><Link href={`/messages/users/${encodeURIComponent(user.username)}`}><Send className="mr-2 h-4 w-4" />私信</Link></Button>}
            <Button variant="outline" type="button" onClick={() => void shareProfile()}><Share2 className="mr-2 h-4 w-4" />{copied ? "已复制" : "分享"}</Button>
            <Button variant="outline" size="icon" asChild><Link href={`${profileHref}/works`} aria-label="查看创作空间"><MoreHorizontal /></Link></Button>
          </div>
          <div className="xy-profile-counts">
            <p><b>{user.followingCount ?? "—"}</b><span>关注</span></p>
            <p><b>{user.followerCount ?? "—"}</b><span>粉丝</span></p>
            <p><b>—</b><span>获赞</span></p>
          </div>
        </section>

        <nav className="xy-profile-tabs" aria-label="个人主页导航"><b>首页</b><Link href={`${profileHref}/works`}>文章</Link><Link href={`/series?author=${encodeURIComponent(user.username)}`}>系列</Link><Link href="/collections/public">公开收藏夹</Link><a href="#profile-about">关于</a></nav>
        <div className="xy-profile-grid">
          <div>
            <section className="xy-profile-featured">
              <div className="xy-profile-section-title"><h2>精选作品</h2><Link href={`${profileHref}/works`}>查看全部 ›</Link></div>
              {featuredWorks.length ? <div>{featuredWorks.map((work, index) => <Link href={`/articles/${encodeURIComponent(work.id)}`} key={work.id}><WorkVisual index={index} /><b>{work.title}</b><p>{work.categorySlug ? "分类 · " + work.categorySlug : "社区作品"}</p><span>文章</span></Link>)}</div> : <EmptySection>这位创作者暂未公开精选作品。</EmptySection>}
            </section>
            <div className="xy-profile-lower">
              <section>
                <div className="xy-profile-section-title"><h2>最新文章</h2></div>
                {articleWorks.length ? articleWorks.map((work, index) => <Link href={`/articles/${encodeURIComponent(work.id)}`} className="xy-profile-article" key={work.id}><WorkVisual index={index} /><div><b>{work.title}</b><p>{work.categorySlug ? `收录于 ${work.categorySlug}` : "来自创作空间"}</p></div></Link>) : <EmptySection>还没有可展示的文章。</EmptySection>}
                {articleWorks.length > 0 && <Link href={`${profileHref}/works`} className="xy-profile-more">查看全部文章 ›</Link>}
              </section>
              <section>
                <div className="xy-profile-section-title"><h2>公开收藏夹</h2><Link href="/collections/public">查看全部 ›</Link></div>
                <EmptySection>暂未公开收藏夹。</EmptySection>
              </section>
            </div>
          </div>
          <aside>
            <section>
              <div className="xy-profile-section-title"><h2>最近动态</h2><Link href={`${profileHref}/works`}>查看全部 ›</Link></div>
              {works.length ? works.slice(0, 3).map((work, index) => <Link href={`/articles/${encodeURIComponent(work.id)}`} className="xy-profile-activity" key={work.id}><WorkVisual index={index} /><div><small>发布了文章</small><b>{work.title}</b><span>{work.categorySlug || "创作空间"}</span></div></Link>) : <EmptySection>暂无公开动态。</EmptySection>}
            </section>
            <section id="profile-about">
              <h2>关于我</h2><p>{user.bio || "这位创作者还没有补充更多介绍。"}</p>
              {spaceWorks?.categories?.length ? <div><b>创作类型</b><span>{spaceWorks.categories.map((item) => item.name).join(" · ")}</span></div> : null}
              {user.websiteUrl && <div><b>合作联系</b><a href={user.websiteUrl} target="_blank" rel="noreferrer">{user.websiteUrl}</a></div>}
              <Link href={`${profileHref}/works`}>查看更多 ›</Link>
            </section>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
