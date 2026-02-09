'use client';
import { useRouter, useSearchParams } from 'next/navigation';


export default function TapFilter(props: any) {
    const router = useRouter();

    return (
        <div className="tap-wrap">
            <div className={`tap tap-${0}`} onClick={() => router.push(`/`)}>
                전체
            </div>
            {
                props.tagList.map((tag: {tag_id: number, name: string}, index: number) => {
                    return (
                        <div className={`tap tap-${tag.tag_id}`} key={index} onClick={() => router.push(`/?tag=${tag.tag_id}`)}>
                            {tag.name}
                        </div>
                    );
                })
            }
        </div>
    )
}