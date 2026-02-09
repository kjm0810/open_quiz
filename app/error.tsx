'use client'

import Link from "next/link"

export default function Error() {
    return (
        <div className="page error-page">
            <div className="container">
                <div className="error-wrap">
                    <div className="title">
                        에러가 발생했습니다.
                    </div>
                    <div className="exp">
                        예기치 못한 에러가 발생했습니다. 다시 시도해주세요.
                    </div>
                    <Link className="home" href={'/'}>메인으로</Link>
                </div>
            </div>
        </div>
    )
}