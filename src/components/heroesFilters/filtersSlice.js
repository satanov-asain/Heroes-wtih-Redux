 import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
})

const useJustFetch = () => {
    const {request} = useHttp();
    const result = request('http://localhost:3001/filters');
    return result;
}

export const fetchFilters = createAsyncThunk(
    "filters/fetchFilters",
    async () => {
        return useJustFetch();
        // const {request} = useHttp();
        // return await request('http://localhost:3001/filters');
    }
)

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        activeFilterChanged: (state, action) => {state.activeFilter = action.payload}
    },

    extraReducers: builder => {
        builder
            .addCase(fetchFilters.pending, state => {state.filtersLoadingStatus = 'loading'})
            .addCase(fetchFilters.fulfilled, (state, action) => {state.filtersLoadingStatus = 'idle';
                                                                    filtersAdapter.setAll(state, action.payload)})
            .addCase(fetchFilters.rejected, state => {state.filtersLoadingStatus = 'error'})
            .addDefaultCase( () => {} )
    }
})

const {actions, reducer} = filtersSlice;

export default reducer;

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters);

export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    activeFilterChanged
} = actions;

const str = 'http://gateway.marvel.com/v1/public/comics/58636';
const newStr = str.split('/');
console.log('http://gateway.marvel.com/v1/public/comics/58636'.split('/').splice(-1));