'use client';

import { useState } from "react";
type QuizItem = {
    content: string,
    type: number,
    answer1: string,
    answer2: string,
    answer3: string,
    answer4: string,
    answer5: string,
    answer_typying: string,
    content_img: File | null,
    content_img_url: string,
    answer_number: number
}
import { useSession } from "next-auth/react";

export default function AddQuizPage({tagList}: {tagList:{tag_id: number, name: string}}) {
    const { data: session, status } = useSession();

    const [selectTag, setSelectTag] = useState(0);
    const [currentEditQuiz, setCurrentEditQuiz] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [isSend, setIsSend] = useState(false);

    const [quizContent, setQuizContent] = useState<QuizItem[]>([
        {
            content: '',
            type: 1,
            answer1: '',
            answer2: '',
            answer3: '',
            answer4: '',
            answer5: '',
            answer_typying: '',
            content_img: null,
            content_img_url: '',
            answer_number: 0
        }
    ]);

    const addContent = async () => {
        if (quizContent.length >= 20) {
            alert('최대 추가 가능한 문제 수를 초과했습니다.');

            return;
        }
        const copyObject = [
            ...quizContent,
            {
                content: '',
                type: 1,
                answer1: '',
                answer2: '',
                answer3: '',
                answer4: '',
                answer5: '',
                answer_typying: '',
                content_img: null,
                content_img_url: '',
                answer_number: 0
            }
        ]

        setQuizContent(copyObject);
    }

    const answers = [
        { key: 'answer1', label: '정답1' },
        { key: 'answer2', label: '정답2' },
        { key: 'answer3', label: '정답3' },
        { key: 'answer4', label: '정답4' },
        { key: 'answer5', label: '정답5' },
    ] as const;

    const deleteContent = (index: number) => {
        if (quizContent.length === 1) return;

        const next = quizContent.filter((_, i) => i !== index);

        let nextEditIndex = currentEditQuiz;

        if (currentEditQuiz === index) {
            nextEditIndex = Math.max(0, index - 1);
        } else if (currentEditQuiz > index) {
            nextEditIndex = currentEditQuiz - 1;
        }

        setQuizContent(next);
        setCurrentEditQuiz(nextEditIndex);
    };

    const saveQuiz = async () => {
        if (isSend) {
            alert('저장중입니다. 잠시만 기다려 주세요.');
            return;
        }
        if (title === '') {
            alert('제목을 입력해주세요.');
            return;
        }
        if (description === '') {
            alert('설명을 입력해주세요.');
            return;
        }
        if (selectTag === 0) {
            alert('카테고리를 선택해주세요.');
            return;
        }

        quizContent.forEach((item, index: number) => {
            if (item.answer1 === '' && item.answer2 === '' && item.answer3 === '' && item.answer4 === '' && item.answer5 === '' ) {
                alert(`${index + 1}번 문제에 정답 항목이 없습니다.`);
                return;
            }
            if (item.answer_number === 0) {
                alert(`${index + 1}번 문제에 정답이 없습니다.`);
            }
        });


        const quizForm = new FormData();

        quizForm.append('title', title);
        quizForm.append('description', description);
        quizForm.append('user_id', String(session?.user?.user_id ?? 0));
        quizForm.append('tag_id', String(selectTag));

        if (thumbnailFile) {
            quizForm.append('thumbnail_image', thumbnailFile);
        }

        quizForm.append(
            'quiz_content',
            JSON.stringify(
                quizContent.map(({ content_img, ...rest }) => rest)
            )
        );

        quizContent.forEach((item, index) => {
            if (item.content_img) {
                quizForm.append(`content_img_${index}`, item.content_img);
            }
        });

        // setIsSend(true);
        await fetch("/api/searchAnalytics/quiz_add", {
            method: "POST",
            body: quizForm,
            cache: "no-store",
        })
    }
    return (
        <div className="add-page">
            
            <div className="sub-title">
                제목
            </div>

            <input type="text" className="input-field"
                placeholder="제목을 입력해주세요."
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                }}
            />

            <div className="sub-title">
                설명
            </div>

            <input type="text" className="input-field" 
                placeholder="내용을 입력해주세요."
                value={description}
                onChange={(e) => {
                    setDescription(e.target.value);
                }}
            />

            <div className="sub-title">
                카테고리
            </div>
            <div className="tags">
                {tagList.map((tag, index) => {
                    return (
                        <div className={`tag tag-${tag.tag_id} ${selectTag === tag.tag_id ? 'selected' : ''}`} key={index} onClick={() => {setSelectTag(tag.tag_id)}}>
                            {tag.name}
                        </div>
                    )
                })}
            </div>
            <div className="sub-title">
                썸네일 (없는 경우에 기본 이미지로 사용됩니다.)
            </div>
            <div className="thumb-nail">
                <input type="file" 
                    accept="image/*"
                    id="thumb-nail-image"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setThumbnailFile(file);
                    }}
                    style={{display: 'none'}}
                />
                <label htmlFor="thumb-nail-image" className="image-upload">썸네일 업로드</label>
                <div className="prev-image">
                    {thumbnailFile && (
                        <img
                            src={URL.createObjectURL(thumbnailFile)}
                            alt="preview"
                        />
                    )}
                </div>
            </div>
            
            <div className="sub-title">
                문제
            </div>
            <div className="quiz-content">
                <div className="select_index">
                    <div className="add" onClick={() => {addContent()}}>
                        문제 추가 +
                    </div>
                    {quizContent.map((item, index) => {
                        return (
                            <div key={index} className={`index ${index === currentEditQuiz ? 'selected' : ''}`} onClick={() => {setCurrentEditQuiz(index)}}>
                                {index + 1}번 문제 
                                <div className="delete" onClick={(e) => {
                                    e.stopPropagation();
                                    deleteContent(index);
                                }}>
                                    ✕
                                </div>
                            </div>
                        )
                    })}
                </div>

                {
                    // JSON.stringify(quizContent[currentEditQuiz])
                }
                <div className="item">
                    <div className="item-title">
                        문제 이미지
                    </div>
                    <input 
                        type="file" 
                        accept="image/*"                        
                        id={`quiz-image-${currentEditQuiz}`}
                        onChange={(e) => {
                            setQuizContent(prev =>
                            prev.map((item, index) =>
                                index === currentEditQuiz
                                ? { ...item, content_img: (e.target.files?.[0] || null) }
                                : item
                            ));
                        }}
                        style={{display: 'none'}}
                    />
                    <label htmlFor={`quiz-image-${currentEditQuiz}`} className="image-upload">업로드</label>
                        
                    <div className="quiz-prev-image">
                        {quizContent[currentEditQuiz].content_img && (
                            <img
                                src={URL.createObjectURL(quizContent[currentEditQuiz].content_img)}
                                alt="preview"
                            />
                        )}
                    </div>

                    <div className="item-title">
                        문제 설명
                    </div>
                    <textarea
                        id={`content-${currentEditQuiz}`}
                        value={quizContent[currentEditQuiz]?.content ?? ''}
                        placeholder="문제 설명을 입력해주세요."
                        onChange={(e) => {
                            setQuizContent(prev =>
                            prev.map((item, index) =>
                                index === currentEditQuiz
                                ? { ...item, content: e.target.value }
                                : item
                            ));
                        }}
                    />
                    <div className="item-title">
                        정답 항목 
                    </div>
                    <div className="answer-list">

                        {answers.map(({ key, label }, index) => {
                            const value = quizContent[currentEditQuiz]?.[key] ?? '';

                            return (
                                <div className="key-value" key={key}>
                                <div className={`key ${value === '' ? 'unused' : 'used'}`}>
                                    {label}
                                    {value === '' ? 
                                        <div className="use">(미사용)</div> :
                                        <div className="select-answer">
                                            <input type="radio" 
                                                value={index + 1}
                                                id={`answer-number-${currentEditQuiz}-${index}`}
                                                name={`answer-number-${currentEditQuiz}-${index}`}
                                                checked={
                                                    quizContent[currentEditQuiz]?.answer_number === index + 1
                                                }
                                                onChange={() => {
                                                    setQuizContent(prev => {
                                                    const next = [...prev];
                                                    next[currentEditQuiz] = {
                                                        ...next[currentEditQuiz],
                                                        answer_number: index + 1,
                                                    };
                                                    return next;
                                                    });
                                                }}

                                            />
                                            <label htmlFor={`answer-number-${currentEditQuiz}-${index}`} className="use">정답</label>
                                        </div>
                                    }
                                </div>

                                <div className="value">
                                    <input
                                    type="text"
                                    value={value}
                                    placeholder={`${label} 항목`}
                                    onChange={(e) => {
                                        setQuizContent(prev =>
                                        prev.map((item, index) =>
                                            index === currentEditQuiz
                                            ? { ...item, [key]: e.target.value }
                                            : item
                                        )
                                        );
                                    }}
                                    />
                                </div>
                                </div>
                            );
                            })}
                    </div>
                </div>
                
            </div>
            <div className="save-btn" onClick={() => { saveQuiz()}}>
                저장
            </div>
        </div>
    );
}