import { IColumn } from '@/types/column.interface';
import * as React from 'react';

function Tasks({ column }: { column: IColumn }) {

    const tasksSorted = React.useMemo(
        () => column.tasks && column.tasks.slice()
            .sort((t1, t2) => t2.moveDate.getMilliseconds() - t1.moveDate.getMilliseconds())
        , [column.tasks])

    return (
        <div className='rounded-2 d-flex flex-column'>
            {
                tasksSorted && tasksSorted.map(t =>
                    <div>
                        {t.name}
                    </div>
                )
            }
            <button className='btn btn-primary border rounded-2'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
            </button>
        </div>
    );
}

export default Tasks;