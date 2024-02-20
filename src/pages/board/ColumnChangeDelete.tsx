import Modal from '@/components/modal/Modal';
import { useChangeColumnMutation, useDeleteColumnMutation } from '@/store/api/column.api';
import { IColumn } from '@/types/column.interface';
import * as React from 'react';
import { useRef } from 'react';
import { Toast as bootstrapToast } from 'bootstrap';
import { Modal as bootstrapModal } from 'bootstrap';
import { useActions } from '@/hooks/useActions';


function ColumnChangeDelete({currentColumn}: {currentColumn: IColumn | undefined}) {
    
    const { setToastChildren } = useActions();
    
    const changeColumnRef = useRef<HTMLInputElement>(null)
    const [changeColumn, { isSuccess: isSuccessChange, isError: isErrorChange, isLoading: isLoadingChange }] = useChangeColumnMutation()
    const [deleteColumn, { isSuccess: isSuccessDelete, isError: isErrorDelete, isLoading: isLoadingDelete }] = useDeleteColumnMutation()

    const addColumnClick = () => {
        if (changeColumnRef.current &&
            changeColumnRef.current.value !== '' &&
            currentColumn) {
            changeColumn({
                id: currentColumn.id,
                name: changeColumnRef.current.value,
                order: currentColumn.order
            })
        }
    }
    
    React.useEffect(() => {
        if (isSuccessDelete) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('deleteColumn') || 'deleteColumn');
            myModal.hide();
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Column deleted successfully")
            myToast.show()
        }
        if (isErrorDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Error in column deleting")
            myToast.show()
        }
    }, [isLoadingDelete])

    React.useEffect(() => {
        if (isSuccessChange) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Column changed successfully")
            myToast.show()
        }
        if (isErrorChange) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren("Error in column changing")
            myToast.show()
        }
    }, [isLoadingChange])

    return (
        <>
            <Modal title='Change Column' id='changeColumn' size='sm'>
                <div className="d-flex flex-column">
                    <label htmlFor="inputColumnNameChange">Name</label>
                    <input className="form-control mb-2" id="inputColumnNameChange"
                        placeholder="Enter column name" ref={changeColumnRef} defaultValue={currentColumn?.name} />
                    <button className='btn btn-primary' onClick={addColumnClick}>
                        Change column
                    </button>
                </div>
            </Modal>
            <Modal id='deleteColumn' title='Delete column' size='sm'>
                <div className='d-flex flex-column gap-2'>
                    <div>
                        Are you sure you want delete this column?
                        You will lost all tasks dedicated to this column.
                    </div>
                    <button className='btn btn-danger' onClick={() => deleteColumn(currentColumn?.id || 0)}>
                        Delete column
                    </button>
                </div>
            </Modal>
        </>
    );
}

export default ColumnChangeDelete;