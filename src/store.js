import { configureStore, createSlice } from "@reduxjs/toolkit";

const postData = createSlice({
    name: "postData",
    initialState: [],
    reducers: {
        setPostData(state, inputData) {
            return inputData.payload;
        },
        modifyPostData(state, indexAndInputArray) {
            state[indexAndInputArray.payload[0]].title = indexAndInputArray.payload[1];
        },
        plusLike(state, index) {
            state[index.payload].like += 1;
        },
    },
});
export const { setPostData, modifyPostData, plusLike } = postData.actions;

const titleInput = createSlice({
    name: "titleInput",
    initialState: "",
    reducers: {
        setTitleInput(state, input) {
            return input.payload;
        },
    },
});
export const { setTitleInput } = titleInput.actions;

export default configureStore({
    reducer: {
        postData: postData.reducer,
        titleInput: titleInput.reducer,
    },
});
