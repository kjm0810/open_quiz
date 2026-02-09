import Providers from "../Provider";
import AddQuizPage from "./AddQuizPage";

export default async function AddQuiz() {
    const res2 = await fetch(`http://localhost:3000/api/searchAnalytics/tag_list`);
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