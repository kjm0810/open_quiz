import Link from "next/link";
import TapFilter from "./TapFilter";
import db from "@/utils/db";

type PageProps = {
  searchParams: {
    tag?: string;
  };
};

export default async function Home({ searchParams }: PageProps) {
  const selectTag = Number(searchParams.tag ?? 0);

  // 내부 API로 fetch 하지 않고, 직접 DB에서 조회
  let sql = "SELECT * FROM quiz_list";
  const params: any[] = [];

  if (selectTag !== 0) {
    sql += " WHERE tag_id = $1";
    params.push(selectTag);
  }

  sql += " ORDER BY quiz_id DESC";

  const quizList = await db.query(sql, params);
  const tagList = await db.query("SELECT * FROM quiz_tag");

  return (
    <div className="page">
      <div className="container">
        <div className="filter">
          <div className="left">
            <div className="tags">
              <TapFilter tagList={tagList}></TapFilter>
            </div>
          </div>
          <div className="right"></div>
        </div>
        <div className="quiz-list">
          {quizList.length === 0 ? (
            <div className="empty-quiz">퀴즈가 없습니다!</div>
          ) : null}
          {quizList.map((item: any) => {
            return (
              <Link
                href={`/quiz/${item.quiz_id}`}
                className="item"
                key={item.quiz_id}
              >
                <div
                  className={`thumb-nail ${
                    item.thumbnail_img_url === null ||
                    item.thumbnail_img_url === ""
                      ? "no-image"
                      : ""
                  }`}
                >
                  <div className="img">
                    {item.thumbnail_img_url !== null &&
                    item.thumbnail_img_url !== "" ? (
                      <img
                        src={`${item.thumbnail_img_url}`}
                        alt=""
                        style={{ objectFit: "cover" }}
                      />
                    ) : null}
                    <div className="tags">
                      <div className={`tag tag-${item.tag_id}`}>
                        {
                          tagList.find((tag_item: any) => {
                            return tag_item.tag_id === item.tag_id;
                          }).name
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="title">[{item.title}]</div>
                <div className="content-box">
                  <div className="content">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
