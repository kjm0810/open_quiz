import Providers from "../Provider";
import AddQuizPage from "./AddQuizPage";
import { headers } from 'next/headers';

export default async function AddQuiz() {
    const headersList = await headers(); // ✅ 반드시 await

    const protocol =
        headersList.get('x-forwarded-proto') ?? 'http';
    const host =
        headersList.get('x-forwarded-host') ??
        headersList.get('host');

    const baseUrl = `${protocol}://${host}`;

    const res2 = await fetch(`${process.env.API_URL}/api/quiz/tag_list`);
    if (!res2.ok) {
        throw new Error('Failed to fetch quiz data');
    }
    const tagList = await res2.json();

    return (
        <div className="page">
            <div className="container">
                <Providers>
                    <AddQuizPage tagList={tagList}></AddQuizPage>    
                </Providers>
            </div>
        </div>
    );
}