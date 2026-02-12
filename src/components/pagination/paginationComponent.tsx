import React, {useEffect, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import css from './paginationComponent.module.css'

interface Props {
    currentPage: number
    total_count: number
    onPageChange: (page: number) => void
}

const PaginationComponent: React.FC<Props> = ({currentPage, total_count, onPageChange}) => {

    const [searchParams, setSearchParams] = useSearchParams();

    const pageParam = Number(searchParams.get("page")) || 1;

    const [page, setPage] = useState(pageParam);

    const pageSize = 25
    const totalPages = Math.ceil(total_count / pageSize)

    useEffect(() => {
        setPage(currentPage);
    }, [currentPage]);

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);

        params.set('page', page.toString());
        setSearchParams(params)

    }, [setSearchParams,page]);

    const WINDOW = 7;
    const half = Math.floor(WINDOW / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (end - start + 1 < WINDOW) {
        if (start === 1) {
            end = Math.min(totalPages, start + WINDOW - 1);
        } else if (end === totalPages) {
            start = Math.max(1, end - WINDOW + 1);
        }
    }

    const pages: (number | string)[] = [];

    if (page > 1){
        pages.push('<')
    }

    if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);

    }

    if (end < totalPages) {
        if (end < totalPages - 1){pages.push('...')}
        pages.push(totalPages);

    }

    if (page < totalPages) pages.push('>');

    return (
        <div>
            {<div className={css.pageButtonsMenu}>{pages.map((p, i) => (
                <button
                    key={i}
                    disabled={p === '...'}
                    className={typeof p === 'number' && p === page ? css.activeButton : ''}
                    onClick={() => {
                        if (p === '<') {
                            setPage(page - 1)
                            onPageChange(page - 1)
                        }
                        else if (p === '>') {
                            setPage(page + 1)
                            onPageChange(page + 1)
                        }
                        else if (typeof p === 'number') {
                            setPage(p)
                            onPageChange(p)
                        }
                    }}
                >
                    {p}
                </button>)
            )}
            </div>}
        </div>
    );
};

export default PaginationComponent;