'use client'

import Link from "next/link";
import { useEffect, useRef, useState } from "react"

type QuizItem = {
  quiz_id: number,
  title: string,
  description: string,
  user_id: number,
  tag_id: number,
  thumbnail_img_url: string | null
}

export default function QuizList({
  selectTag,
  tagList
}: {
  selectTag: number,
  tagList: { tag_id: number, name: string }[]
}) {
  const [offset, setOffset] = useState(1);
  const [quizList, setQuizList] = useState<QuizItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const hasMoreRef = useRef(hasMore);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    hasMoreRef.current = hasMore;
    isLoadingRef.current = isLoading;
  }, [hasMore, isLoading]);

  // 스크롤 핸들러: 최신 ref 기반
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMoreRef.current) return;
      if (isLoadingRef.current) return;

      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + viewportHeight >= fullHeight - 50) {
        setOffset(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 태그 변경 시 리셋
    useEffect(() => {
        setQuizList([]);
        setHasMore(true);
        setOffset(1);

        // ✅ 태그 바뀌면 스크롤 위치 리셋
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [selectTag]);

  // 데이터 fetch: offset + selectTag 둘 다 의존성에 포함
  useEffect(() => {
    if (!hasMore) return; // 이미 끝이면 요청 안 함 (선택)

    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/searchAnalytics/list?offset=${offset}&tag_id=${selectTag}`,
          { cache: 'no-store', signal: controller.signal }
        );

        if (!res.ok) {
          // 에러여도 로딩은 반드시 종료
          console.error('API error:', res.status, await res.text());
          return;
        }

        const data: QuizItem[] = await res.json();

        if (data.length < 20) setHasMore(false);

        setQuizList(prev => {
          // (선택) 중복 방지
          const seen = new Set(prev.map(v => v.quiz_id));
          const merged = [...prev];
          for (const item of data) {
            if (!seen.has(item.quiz_id)) merged.push(item);
          }
          return merged;
        });
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          console.error('Fetch failed:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // 태그/오프셋 바뀌거나 언마운트 시 이전 요청 취소
    return () => controller.abort();
  }, [offset, selectTag, hasMore]); // ✅ 핵심

  return (
    <div className="quiz-list">
      {!isLoading && quizList.length === 0 ? (
        <div className="end">퀴즈가 없습니다.</div>
      ) : (
        quizList.map((item) => (
          <Link href={`/quiz/${item.quiz_id}`} className="item" key={`quiz_id_${item.quiz_id}`}>
            <div className={`thumb-nail ${!item.thumbnail_img_url ? 'no-image' : ''}`}>
              <div className="img">
                {item.thumbnail_img_url ? (
                  <img src={item.thumbnail_img_url} alt="" style={{ objectFit: "cover" }} />
                ) : null}
                <div className="tags">
                  <div className={`tag tag-${item.tag_id}`}>
                    {tagList.find(t => t.tag_id === item.tag_id)?.name}
                  </div>
                </div>
              </div>
            </div>
            <div className="title">[{item.title}]</div>
            <div className="content-box">
              <div className="content">{item.description}</div>
            </div>
          </Link>
        ))
      )}

      {isLoading ? (
        Array.from({ length: 10 }).map((_, index) => (
          <div className="item" key={`skeleton_${index}`}>
            <div className="thumb-nail no-image">
              <div className="img">
                <div className="tags">
                  <div className={`tag tag-${selectTag}`}>
                    {tagList.find(t => t.tag_id === selectTag)?.name}
                  </div>
                </div>
              </div>
            </div>
            <div className="title">[퀴즈]</div>
            <div className="content-box">
              <div className="content">퀴즈입니다.</div>
            </div>
          </div>
        ))
      ) : null}

      {!hasMore && quizList.length > 0 ? (
        <div className="end">더 이상 퀴즈가 없습니다.</div>
      ) : null}
    </div>
  );
}
