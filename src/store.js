import { configureStore, createSlice } from "@reduxjs/toolkit";

const postData = createSlice({
    name: "postData",
    initialState: [],
    reducers: {
        setPostData(state, inputData) {
            return inputData.payload;
        },
        modifyPostData(state, indexAndInputArray) {
            console.log(state, indexAndInputArray, "dddddddddd");
            state[indexAndInputArray.payload[0]].title = indexAndInputArray.payload[1];
        },
    },
});
export const { setPostData, modifyPostData } = postData.actions;

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

const likeData = createSlice({
    name: "likeData",
    initialState: [],
    reducers: {
        setLikeData(state, inputLikeData) {
            return inputLikeData.payload;
        },
        plusLikeData(state, index) {
            state[index.payload].like += 1;
        },
    },
});
export const { setLikeData, plusLikeData } = likeData.actions;

export default configureStore({
    reducer: {
        postData: postData.reducer,
        titleInput: titleInput.reducer,
        likeData: likeData.reducer,
    },
});
