import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {authService} from "../../services/api.services";

type AuthState = {
    user: any | null;
    loading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};
export const login = createAsyncThunk(
    "authSlice/login",
    async (data: { email: string; password: string }, { rejectWithValue } ) => {
        try {
            const response = await authService.getAuth(data)
            localStorage.setItem('access', response.data.access)
            localStorage.setItem('refresh', response.data.refresh)
            return response.data
        }
        catch (err: any){
            return rejectWithValue(err.response?.data);
        }


    }
)

export const refresh = createAsyncThunk(
    "authSlice/refresh",
    async (data: { refresh: string }, { rejectWithValue } ) => {
        try {
            const response = await authService.getRefresh(data)
            localStorage.setItem('access', response.data.access)
            return response.data
        }
        catch (err: any){
            return rejectWithValue(err.response?.data);
        }


    }
)

const authSlice = createSlice({
        name: 'authSlice',
        initialState: initialState,
        reducers: {},
        extraReducers:
        builder =>
            builder
                .addCase(login.fulfilled, (state)=>{
                    state.loading = false;
                    state.error = null
                })
                .addCase(login.pending, (state) => {
                    state.loading = true;
                })
                .addCase(refresh.fulfilled, (state)=>{
                    state.loading = false;
                    state.error = null
                })
                .addCase(refresh.rejected, (state) => {
                    state.loading = false;
                })
                .addCase(login.rejected, (state, action) => {
                    state.loading = false;
                    const detail = action.payload;

                    if (detail === 'No active account found with the given credentials') {
                        state.error = 'Your account is not activated yet. Please activate it first.';
                    } else {
                        state.error = 'Invalid email or password.';
                    }
                })

})

const {reducer: authReducer, actions} = authSlice

const authActions = {
    ...actions,
    login,
    refresh
}

export {
    authActions,
    authReducer
}