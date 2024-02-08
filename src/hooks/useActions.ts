import { useDispatch } from "react-redux";
import { useMemo } from "react";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actions as userActions } from "@/store/slices/user.slice";
import { actions as toastActions } from "@/store/slices/toast.slice";
import { actions as optionsActions } from "@/store/slices/pageOptions.slice";

const rootActions = {
    ...userActions,
    ...toastActions,
    ...optionsActions
}

export const useActions = () => {
    const dispatch = useDispatch();
    
    return useMemo(() =>
        bindActionCreators(rootActions, dispatch), [dispatch])
}