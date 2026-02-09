'use client'

import Link from "next/link"

export default function Error() {
    return (
        <div className="page error-page">
            <div className="container">
                <div className="error-wrap">
                    <div className="title">
                        존재하지 않는 페이지
                    </div>
                    <div className="exp">
                        존재하지 않는 페이지입니다.
                    </div>
                    <Link className="home" href={'/'}>메인으로</Link>
                </div>
            </div>
        </div>
    )
}