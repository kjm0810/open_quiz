import Link from "next/link";
import Image from 'next/image'
import TapFilter from "./TapFilter";
type PageProps = {
  searchParams: {
    tag?: string;
  };
};


export default async function Home({searchParams}: PageProps) {
  let offset = 0;
  const params = await searchParams;

  const selectTag = Number(params.tag ?? 0);

  const res = await fetch(`http://localhost:3000/api/searchAnalytics/list?offset=${offset}&tag_id=${selectTag}`);
    if (!res.ok) {
    throw new Error('Failed to fetch quiz data');
  }
  const quizList = await res.json();

  const res2 = await fetch(`http://localhost:3000/api/searchAnalytics/tag_list`);
  if (!res2.ok) {
    throw new Error('Failed to fetch quiz data');
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
        <div className="quiz-list">
          {
            quizList.length === 0 ? 
            <div className="empty-quiz">
              퀴즈가 없습니다!
            </div> :null 
          }
          {
            quizList.map( (item: any) => {
              return (
                <Link href={`/quiz/${item.quiz_id}`} className="item" key={item.quiz_id}>
                  <div className={`thumb-nail ${item.thumbnail_img_url === null || item.thumbnail_img_url === '' ? 'no-image' : ''}`}>
                    <div className="img">
                      {
                        item.thumbnail_img_url !== null && item.thumbnail_img_url !== '' ? 
                        <img src={`${item.thumbnail_img_url}`} alt="" style={{ objectFit: "cover" }}/> : null
                      }
                      <div className="tags">
                        <div className={`tag tag-${item.tag_id}`}>{tagList.find((tag_item: any) => {return tag_item.tag_id === item.tag_id}).name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="title">
                    [{item.title}]
                  </div>
                  <div className="content-box">
                    <div className="content">
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })
          }
        </div>
      </div>
    </div>
  );
}
