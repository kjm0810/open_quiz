'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from 'next/image'
import Link from "next/link";

export default function QuizProgress({quizData, quizContent}: {quizData: any, quizContent: any}) {
    const { data: session, status } = useSession();

    
    const quizLength = quizContent.length;
    const [adjustCount, setAdjustCount] = useState(0); // 맞춘 정답 수
    const [progress, setProgress] = useState(0); // 현재 진행중인 문제 
    const [selectAnser, setSelectAnser] = useState(0); // 객관식 타입 선택한 정답
    const [currentView, setCurrentView] = useState(1); // 1: 문제푸는 화면, 2: 문제 풀이 화면, 3: 결과 화면
    const [lastQuizCorrect, setLastQuizCorrect] = useState(false);

    const answerSend = async () => {
        const quizContentData = quizContent[progress];
        if (quizContentData.type === 1) {
            if (selectAnser === 0) {
                alert('정답을 선택해주세요.');
                return;
            }

            if (Number(quizContentData.answer_number) === selectAnser) {
                setLastQuizCorrect(true);
                setAdjustCount(adjustCount + 1);
            }
            else {
                setLastQuizCorrect(false);
            }

            setCurrentView(2);
        }
    }

    const answerNext = async () => {
        if (progress + 1 >= quizLength) {
            const form = {
                adjust_percent: (adjustCount / quizLength) * 100,
                quiz_id: quizData[0].quiz_id,
                isLogin: status === 'authenticated' && session?.user?.user_id !== null ? true : false,
                login_user_id: session?.user?.user_id || 0
            };

            await fetch(`/api/searchAnalytics/quizSend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
                cache: "no-store",
            }).then(() => {
                setCurrentView(3);
            });
            
            return;
        }
        else {
            setSelectAnser(0);
            setCurrentView(1);
            setProgress(progress + 1);
        }
    }

    return (
        <div className="quiz-wrap">
            <div className="now-progress">
                {progress + 1}번째 문제 (총 {quizLength} 문제) ({adjustCount})
            </div>
            <div className="quiz-content">
                <div className="title">
                    {
                        currentView === 1 ? 
                        <div className="quiz-box">
                            {
                                quizContent[progress].content_img_url !== null && quizContent[progress].content_img_url !== '' ?
                                <img
                                    src={quizContent[progress].content_img_url}
                                    alt={quizContent[progress]?.content}
                                />:  null
                            }
                            <div>
                                {`${quizContent[progress]?.content}`}
                            </div>
                        </div>
                            : null
                    }
                    {
                        currentView === 2 ? 
                        <div className={`answer-explain ${lastQuizCorrect ? 'correct' : 'wrong'}`}>
                            <div className="title">
                                {lastQuizCorrect ? '정답!' : '오답!'}
                            </div>
                            <div className="exp">
                                <div className="no">
                                    {quizContent[progress]?.answer_number}
                                </div>
                                <div className="text">
                                    {quizContent[progress]['answer'+quizContent[progress]?.answer_number]}
                                </div>
                            </div>
                        </div>: null
                    }
                    {
                        currentView === 3 ? 
                        <div className="result-wrap">
                            <div className="progress"
                            style={{
                                ['--percent' as any]: (adjustCount / quizLength) * 100,
                                background:
                                (adjustCount / quizLength) * 100 < 50
                                    ? `conic-gradient(#ef4444 ${(adjustCount / quizLength) * 100}%, #e5e7eb 0)`
                                    : `conic-gradient(#3b82f6 ${(adjustCount / quizLength) * 100}%, #cccccc 0)`
                            }}

                            >
                                <div className="text">
                                    {Math.trunc((adjustCount / quizLength) * 100)}%
                                </div>
                            </div>
                            총 <span className="count">{quizLength}</span>문제 중에서 <span className="count">{adjustCount}</span>문제 맞추셨습니다.<br/>
                        </div>
                        : null
                    }
                </div>
            </div>
            <div className="quiz-answer">
                {quizContent[progress]?.type === 1 ? 
                    <div className="answer-type1">
                        {
                            currentView === 1 ? 
                            <div className="answer-select-wrap">
                            {
                                quizContent[progress]?.answer1 !== '' && quizContent[progress]?.answer1 !== null ? 
                                <div className={`select_number ${selectAnser === 1 ? 'selected' : ''}`} onClick={() => {setSelectAnser(1)}}>
                                    <div className="no">1</div>
                                    {quizContent[progress]?.answer1}
                                </div>
                                : null
                            }
                            {
                                quizContent[progress]?.answer2 !== '' && quizContent[progress]?.answer2 !== null ? 
                                <div className={`select_number ${selectAnser === 2 ? 'selected' : ''}`} onClick={() => {setSelectAnser(2)}}>
                                    <div className="no">2</div>
                                    {quizContent[progress]?.answer2}
                                </div>
                                : null
                            }
                            {
                                quizContent[progress]?.answer3 !== '' && quizContent[progress]?.answer3 !== null ? 
                                <div className={`select_number ${selectAnser === 3 ? 'selected' : ''}`} onClick={() => {setSelectAnser(3)}}>
                                    <div className="no">3</div>
                                    {quizContent[progress]?.answer3}
                                </div>
                                : null
                            }
                            {
                                quizContent[progress]?.answer4 !== '' && quizContent[progress]?.answer4 !== null ? 
                                <div className={`select_number ${selectAnser === 4 ? 'selected' : ''}`} onClick={() => {setSelectAnser(4)}}>
                                    <div className="no">4</div>
                                    {quizContent[progress]?.answer4}
                                </div>
                                : null
                            }
                            {
                                quizContent[progress]?.answer5 !== '' && quizContent[progress]?.answer5 !== null ? 
                                <div className={`select_number ${selectAnser === 5 ? 'selected' : ''}`} onClick={() => {setSelectAnser(5)}}>
                                    <div className="no">5</div>
                                    {quizContent[progress]?.answer5}
                                </div>                        
                                : null
                            }
                        </div> : null
                        }
                        
                        {
                            currentView === 1 ? 
                            <div className="answer-send" onClick={() => {answerSend()}}>
                                제출
                            </div>: null
                        }
                        {
                            currentView === 2 ?
                            <div className="answer-next" onClick={() => {answerNext()}}>
                                다음
                            </div>: null
                        }
                        {
                            currentView === 3 ?
                            <div className="result-wrap">
                                <div className="answer-replay" onClick={() => {window.location.reload();}}>
                                    다시하기
                                </div>
                                <Link href='/' className="answer-main" onClick={() => {answerNext()}}>
                                    메인
                                </Link>
                            </div>: null
                        }
                    </div>
                    :
                    null
                }
                {quizContent[progress]?.type === 2 ? 
                    <div className="answer-type2">
                        2
                    </div>
                    :
                    null
                }
            </div>
        </div>
    )
}