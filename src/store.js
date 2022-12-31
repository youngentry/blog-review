import { configureStore, createSlice } from "@reduxjs/toolkit";

const postData = createSlice({
  name: "postData",
  initialState: [
    { id: 5, category: "카테고리 없음", title: "六つ目のポスト", content: "六つ目のポストの内容", like: 0, date: `${new Date()}` },
    { id: 4, category: "카테고리 없음", title: "Fifth Post", content: "Fifth Post Content", like: 0, date: `${new Date()}` },
    { id: 3, category: "카테고리 없음", title: "네번째 글", content: "네번째 글 내용", like: 0, date: `${new Date()}` },
    { id: 2, category: "카테고리 없음", title: "三つ目のポスト", content: "三つ目のポストの内容", like: 0, date: `${new Date()}` },
    { id: 1, category: "카테고리 없음", title: "Second Post", content: "Second Post Content", like: 0, date: `${new Date()}` },
    { id: 0, category: "카테고리 없음", title: "첫번째 글", content: "첫번째 글 내용", like: 0, date: `${new Date()}` },
  ],
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

export default configureStore({
  reducer: {
    postData: postData.reducer,
  },
});
