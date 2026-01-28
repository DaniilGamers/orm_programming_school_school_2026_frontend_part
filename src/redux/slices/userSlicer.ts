import {UserModel} from "../../models/UserModel";
import {createAsyncThunk, createSlice, isFulfilled} from "@reduxjs/toolkit";
import {usersService} from "../../services/api.services";

interface UserSliceType {
    users: UserModel[];
    user: UserModel | null;
    link: string | null;
    count: number;
    next: string;
    previous: string;
    results: number;
    loading: boolean;
    error: null
}

let userInitState: UserSliceType = {
    users: [],
    user: null,
    link: null,
    count: 0,
    next: '',
    previous: '',
    results: 0,
    loading: false,
    error: null
}

const getManagers = createAsyncThunk(
    'userSlice/loadManagers',
    async (filterLink: string, thunkAPI) => {
        try {
            const response = await usersService.getManagers(filterLink)
            return thunkAPI.fulfillWithValue(response.data)
        }
        catch (e) {
            return thunkAPI.rejectWithValue('Something went wrong...')
        }
    }
)
const getManagerName = createAsyncThunk(
    'userSlice/loadManagerName',
    async (_, thunkAPI) => {
        try {
            const response = await usersService.getManagerName()
            return thunkAPI.fulfillWithValue(response.data)
        }
        catch (e) {
            return thunkAPI.rejectWithValue('Something went wrong...')
        }
    }
)

const setPassword = createAsyncThunk(
    'userSlice/setPassword',
    async ({token,password,confirm_password}: {token: string ,password: string, confirm_password: string}, thunkAPI)=> {
        try {
            const response = await usersService.SetPassword(token,password,confirm_password)
            return thunkAPI.fulfillWithValue(response)
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.detail || "Failed to set password");
        }
    }
)

const banManager = createAsyncThunk(
    'userSlice/banManager',
    async (id: number, thunkAPI) => {
        try {
            const response = await usersService.banManager(id)
            return thunkAPI.fulfillWithValue(response)
        }
        catch (e) {
            return thunkAPI.rejectWithValue(e)
        }
    }
)
const unbanManager = createAsyncThunk(
    'userSlice/unbanManager',
    async (id: number, thunkAPI) => {
        try {
            const response = await usersService.unbanManager(id)
            return thunkAPI.fulfillWithValue(response)
        }
        catch (e) {
            return thunkAPI.rejectWithValue(e)
        }
    }
)
const activateManager = createAsyncThunk(
    'userSlice/activateManager',
    async (id: number, thunkAPI) => {
        try {
            const {data} = await usersService.activateManager(id)
            return thunkAPI.fulfillWithValue(data.link)
        }
        catch (e) {
            return thunkAPI.rejectWithValue(e)
        }
    }
)

const userSlice = createSlice({
    name: 'userSlice',
    initialState: userInitState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(getManagers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.results;

                state.count = action.payload.count
            })
            .addCase(getManagers.rejected, (state) => {
                state.loading = false
            })
            .addCase(getManagerName.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload
            })
            .addCase(getManagerName.rejected, (state) => {
                state.loading = false;
            })
            .addCase(setPassword.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(setPassword.rejected, (state) => {
                state.loading = false
            })
            .addCase(banManager.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(banManager.rejected, (state) => {
                state.loading = false
            })
            .addCase(unbanManager.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(unbanManager.rejected, (state) => {
                state.loading = false
            })
            .addCase(activateManager.fulfilled, (state, action) => {
                state.loading = false

                state.link = action.payload
            })
            .addCase(activateManager.rejected, (state) => {
                state.loading = false
            })
            .addMatcher(isFulfilled(getManagers, getManagerName, setPassword, unbanManager, banManager, activateManager), (state) => {
                state.loading = true
            })
})

const {reducer: userReducer, actions} = userSlice

const userActions = {
    ...actions,
    getManagers,
    getManagerName,
    setPassword,
    banManager,
    unbanManager,
    activateManager
}

export {
    userActions,
    userReducer
}