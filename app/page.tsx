import { headers } from 'next/headers';
import TapFilter from "./TapFilter";
import QuizList from "./QuizList";
type PageProps = {
  searchParams: {
    tag?: string;
  };
};


export default async function Home({searchParams}: PageProps) {
  const headersList = await headers(); // ✅ 반드시 await

  const protocol =
      headersList.get('x-forwarded-proto') ?? 'http';
  const host =
      headersList.get('x-forwarded-host') ??
      headersList.get('host');

  const params = await searchParams;

  const selectTag = Number(params.tag ?? 0);

  const res2 = await fetch(`${protocol}://${host}/api/searchAnalytics/tag_list`, {
    cache: 'no-store',
  });
  if (!res2.ok) {
    // throw new Error('Failed to fetch quiz data');
  }
  const tagList = await res2.json();
  const selectedTagName =
    selectTag === 0
      ? "전체"
      : tagList.find((tag: { tag_id: number; name: string }) => tag.tag_id === selectTag)?.name ?? "전체";

  return (
    <div className="page home-page">
      <div className="container">
        <section className="home-hero">
          <div className="hero-copy">
            <p className="hero-kicker">Open Quiz Forum</p>
            <h2>지식이 쌓이는 커뮤니티 퀴즈</h2>
            <p className="hero-description">
              카테고리별로 퀴즈를 탐색하고, 직접 만든 문제를 공유해보세요.
            </p>
          </div>
          <div className="hero-stat">
            <div className="label">현재 카테고리</div>
            <div className="value">{selectedTagName}</div>
          </div>
        </section>

        <div className="filter">
          <div className="left">
            <div className="filter-title">카테고리 선택</div>
            <div className="tags">
              <TapFilter tagList={tagList}></TapFilter>
            </div>
          </div>
        </div>
        <QuizList selectTag={selectTag} tagList={tagList}></QuizList>         
      </div>
    </div>
  );
}
