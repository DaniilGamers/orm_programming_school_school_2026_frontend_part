import {OrdersModel} from "../../models/OrdersModel";
import {createAsyncThunk, createSlice, isFulfilled, PayloadAction} from "@reduxjs/toolkit";
import {ordersService} from "../../services/api.services";
import {GroupsModel} from "../../models/GroupsModel";
import {CommentModel} from "../../models/commentModel";
import {StatusSumModel} from "../../models/StatusSumModel";

export interface StatusByStatus {
    status: string | null;
    total: number;
}

export interface StatusCount {
    total: number;
    by_status: StatusByStatus[];
}

interface GetStatusPayload {
    data: StatusCount;
    manager?: string;
}

interface OrderSliceType {
    orders: OrdersModel[];
    order: OrdersModel | null;
    count: number;
    groups: GroupsModel[];
    group: GroupsModel | null;
    commentsByOrderId: Record<number, CommentModel[]>;
    comments: CommentModel[];
    statusSumCount: StatusSumModel | null,
    managerStatusCount: Record<string, StatusCount>;
    next: string;
    previous: string;
    results: number;
    loading: boolean;
    error: null

}

let orderInitState: OrderSliceType = {
    orders: [],
    order: null,
    count: 0,
    groups: [],
    group: null,
    commentsByOrderId: {},
    comments: [],
    statusSumCount: null,
    managerStatusCount: {},
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
    async (filteredLink: string, thunkAPI) => {
        try {
            const response = await ordersService.getExcel(filteredLink);


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

const sendComment = createAsyncThunk(
    'orderSlice/sendComment',
    async ({ orderId, text }: { orderId: number; text: string }, thunkAPI)=> {
        try {
            const response = await ordersService.sendComment(orderId, text)
            return thunkAPI.fulfillWithValue(response.data)
        }catch (e) {
            return thunkAPI.rejectWithValue("Something went wrong...");
        }
    }
)

const getComments = createAsyncThunk(
    'orderSlice/getComments',
    async (orderId: number, thunkAPI) => {
        try {
            const response = await ordersService.getComments(orderId); // fetch comments for this order
            // return both orderId and results
            return { orderId, results: response.data.results };
        } catch (e) {
            return thunkAPI.rejectWithValue("Something went wrong...");
        }
    }
);

const editOrder = createAsyncThunk(
    'orderSlice/editOrder',
    async ( { id, ...data }: Record<string, any> & { id: number }, thunkAPI) => {
        try {
            const response = await ordersService.editOrder(id,data)
            return thunkAPI.fulfillWithValue(response.data)
        }catch (e) {
            return thunkAPI.rejectWithValue("Something went wrong...");
        }
    }
)

const addGroup = createAsyncThunk(
    'orderSlice/addGroup',
    async ({name}: {name: string}, thunkAPI) => {
        try {
            const response = await ordersService.addGroup(name)
            return thunkAPI.fulfillWithValue(response.data)
        }catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.detail || "Failed to create manager");
        }
    }
)

const getStatusOrdersCount = createAsyncThunk<
    GetStatusPayload,
    string | undefined

>(
    'orderSlice/getStatusOrdersCount',
    async (manager, thunkAPI) => {
        try {
            const response = await ordersService.getStatusOrdersCount(manager)
            return thunkAPI.fulfillWithValue({data: response.data, manager})
        }catch (e) {
            return thunkAPI.rejectWithValue("Something went wrong...");
        }
    }
)


const orderSlice = createSlice({
    name: 'orderSlice',
    initialState: orderInitState,
    reducers: {
        setOrder(state, action: PayloadAction<OrdersModel>) {
            state.order = action.payload;
        },

        clearOrder(state) {
            state.order = null;
        }
    },
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
                state.groups = action.payload

                state.group = action.payload
            })
            .addCase(getGroups.rejected, (state) => {
                state.loading = false
            })
            .addCase(getExcel.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(getExcel.rejected, (state) => {
                state.loading = false
            })
            .addCase(sendComment.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendComment.rejected, (state) => {
                state.loading = false
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.loading = false;

                state.comments = action.payload.results
            })
            .addCase(getComments.rejected, (state) => {
                state.loading = false
            })
            .addCase(getStatusOrdersCount.fulfilled, (state, action) => {
                state.loading = false;

                const normalized: StatusSumModel = {
                    total: action.payload.data.total,
                    by_status: action.payload.data.by_status.map(s => ({
                        status: s.status ?? "null",  // 🔹 convert null → string
                        total: s.total
                    }))
                }

                if (action.payload.manager) {
                    state.managerStatusCount[action.payload.manager] = action.payload.data;
                } else {
                    state.statusSumCount = normalized;
                }


            })
            .addCase(getStatusOrdersCount.rejected, (state) => {
                state.loading = false
            })
            .addCase(editOrder.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(editOrder.rejected, (state) => {
                state.loading = false
            })
            .addCase(addGroup.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addGroup.rejected, (state) => {
                state.loading = false
            })
            .addMatcher(isFulfilled(getOrders, getGroups, getExcel, sendComment, getComments, getStatusOrdersCount, addGroup, editOrder), (state) => {
                state.loading = true;
            })
})
const {reducer: orderReducer, actions} = orderSlice;

const orderActions = {
    ...actions,
    getOrders,
    getGroups,
    getExcel,
    sendComment,
    getComments,
    getStatusOrdersCount,
    addGroup,
    editOrder
}

export {
    orderActions,
    orderReducer
}