import {configureStore} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {orderReducer} from "../slices/orderSlicer";
import {userReducer} from "../slices/userSlicer";
import {authReducer} from "../slices/authSlicer";

const store = configureStore({
    reducer: {
        order: orderReducer,
        user: userReducer,
        auth: authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>();
export const useAppSelector = useSelector.withTypes<ReturnType<typeof store.getState>>();

export type AppDispatch = typeof store.dispatch;

export {
    store
}