import { configureStore, createSlice } from "@reduxjs/toolkit";

const postData = createSlice({
    name: "postData",
    initialState: [],
    reducers: {
        setPostData(state, inputData) {
            return inputData.payload;
        },
        modifyPostData(state, idAndInputArray) {
            state.find((el) => el.id === idAndInputArray.payload[0]).title = idAndInputArray.payload[1];
        },
        plusLike(state, id) {
            console.log(id.payload);
            state.find((el) => el.id === id.payload).like += 1;
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
