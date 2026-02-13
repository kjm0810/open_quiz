import Link from "next/link";
import { headers } from 'next/headers';
import Image from 'next/image'
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

  return (
    <div className="page">
      <div className="container">
        <div className="filter">
          <div className="left">
            <div className="tags">
              <TapFilter tagList={tagList}></TapFilter>
            </div>
          </div>
          <div className="right">

          </div>
        </div>
        <QuizList selectTag={selectTag} tagList={tagList}></QuizList>         
      </div>
    </div>
  );
}