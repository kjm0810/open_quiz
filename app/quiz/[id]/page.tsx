import Providers from "@/app/Provider";
import QuizProgress from "./QuizProgress";
import { headers } from 'next/headers';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function QuizDetail({ params }: PageProps) {
  const headersList = await headers(); // ✅ 반드시 await

  const protocol =
      headersList.get('x-forwarded-proto') ?? 'http';
  const host =
      headersList.get('x-forwarded-host') ??
      headersList.get('host');

  const baseUrl = `${protocol}://${host}`;
  const { id } = await params;

  const res = await fetch(
    `${process.env.API_URL}/api/quiz/detail?quiz_id=${id}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch quiz data');
  }

  const quizData = await res.json();

  const res2 = await fetch(
    `${process.env.API_URL}/api/quiz/quiz_content?quiz_id=${id}`,
    { cache: 'no-store' }
  );

  if (!res2.ok) {
    throw new Error('Failed to fetch quiz data');
  }

  const quizContent = await res2.json();

  return (
    <div className="page">
        <div className="container">
          <Providers>
            <QuizProgress quizData={quizData} quizContent={quizContent}></QuizProgress>
          </Providers>
        </div>
    </div>
  );
}
