import { IBoard } from '@/types/board.interface';
import * as React from 'react';
import { useMemo } from 'react';
import Tasks from './Tasks';


function Columns({ board }: { board: IBoard }) {

    const columnsSorted = useMemo(() => board.columns && board.columns.slice().sort(c => c.order), [board.columns])

    return (
        <div className='d-flex p-3 border rounded-2 board-columns flex-fill min-w-0 overflow-x-auto'>
            <div className='d-flex gap-2 flex-fill'>
                {
                    columnsSorted && columnsSorted?.map(c =>
                        <div className='border rounded-2 p-2' key={c.id}>
                            <h5 className='m-0'>{c.name}</h5>
                            <hr className='mt-2 mb-2' />
                            <Tasks column={c}/>
                        </div>)
                }
                <button className='btn btn-primary border rounded-2' data-bs-toggle="modal" data-bs-target="#addColumn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Columns;