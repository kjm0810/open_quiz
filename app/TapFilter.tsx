'use client';
import { useRouter, useSearchParams } from 'next/navigation';

type TagItem = {
    tag_id: number;
    name: string;
};

export default function TapFilter({ tagList }: { tagList: TagItem[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTag = Number(searchParams?.get('tag') ?? 0);

    return (
        <div className="tap-wrap">
            <button
                type="button"
                className={`tap tap-${0} ${activeTag === 0 ? 'active' : ''}`}
                onClick={() => router.push(`/`)}
            >
                전체
            </button>
            {
                tagList.map((tag: TagItem, index: number) => {
                    return (
                        <button
                            type="button"
                            className={`tap tap-${tag.tag_id} ${activeTag === tag.tag_id ? 'active' : ''}`}
                            key={index}
                            onClick={() => router.push(`/?tag=${tag.tag_id}`)}
                        >
                            {tag.name}
                        </button>
                    );
                })
            }
        </div>
    )
}
