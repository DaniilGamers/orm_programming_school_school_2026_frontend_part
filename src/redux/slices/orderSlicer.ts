import {OrdersModel} from "../../models/OrdersModel";
import {createAsyncThunk, createSlice, isFulfilled} from "@reduxjs/toolkit";
import {ordersService} from "../../services/api.services";
import {GroupsModel} from "../../models/GroupsModel";

interface OrderSliceType {
    orders: OrdersModel[];
    count: number;
    groups: GroupsModel[]
    next: string;
    previous: string;
    results: number;
    loading: boolean;
    error: null

}

let orderInitState: OrderSliceType = {
    orders: [],
    count: 0,
    groups: [],
    next: '',
    previous: '',
    results: 0,
    loading: false,
    error: null
}

const getOrders = createAsyncThunk(
    'orderSlice/loadOrders',
    async (filterLink: string, thunkAPI) => {
        try {
            const response = await ordersService.getOrders(filterLink);
            return thunkAPI.fulfillWithValue(response.data)
        }
        catch (e) {
            return thunkAPI.rejectWithValue('Something went wrong...')
        }
    }
)
const getGroups = createAsyncThunk(
    'orderSlice/loadGroups',
    async (_, thunkAPI) => {
        try {
            const response = await ordersService.getGroups();
            return thunkAPI.fulfillWithValue(response.data)
        }
        catch (e) {
            return thunkAPI.rejectWithValue('Something went wrong...')
        }
    }
)

const getExcel = createAsyncThunk(
    "orderSlice/getExcel",
    async (_, thunkAPI) => {
        try {
            const response = await ordersService.getExcel();


            const url = window.URL.createObjectURL(response.data);
            const a = document.createElement("a");

            const today = new Date();
            const day = String(today.getDate()).padStart(2, "0");
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const year = today.getFullYear();

            a.href = url;
            a.download = `${month}.${day}.${year}.xls`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            return true;
        } catch (e) {
            return thunkAPI.rejectWithValue("Something went wrong...");
        }
    }
);

const orderSlice = createSlice({
    name: 'orderSlice',
    initialState: orderInitState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(getOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.results

                state.count = action.payload.count
            })
            .addCase(getOrders.rejected, (state) => {
                state.loading = false
            })
            .addCase(getGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = action.payload.results
            })
            .addCase(getGroups.rejected, (state) => {
                state.loading = false
            })
            .addCase(getExcel.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(getExcel.rejected, (state) => {
                state.loading = false
            })
            .addMatcher(isFulfilled(getOrders, getGroups, getExcel), (state) => {
                state.loading = true;
            })
})
const {reducer: orderReducer, actions} = orderSlice;

const orderActions = {
    ...actions,
    getOrders,
    getGroups,
    getExcel
}

export {
    orderActions,
    orderReducer
}