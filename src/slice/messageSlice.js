import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

//第一步先建立MessageSlice
// slice：定義狀態怎麼改，Slice取得redux資料
export const messageSlice = createSlice({
  name: 'message', //給名字
  initialState: [
    //設定初始值
    // {
    //   id: 1,
    //   type: 'success',
    //   title: '成功',
    //   text: 'test',
    // },
  ],
  reducers: {
    //設定做了什麼動作來更新state的值，比較常稱呼他為Action
    createMessage(state, action) {
      state.push({
        id: action.payload.id,
        type: action.payload.success ? 'success' : 'danger',
        title: action.payload.success ? '成功' : '失敗',
        text: action.payload.message,
      });
    },
    removeMessage(state, action) {
      //移除陣列
      const index = state.findIndex((message) => message.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

// 建立Message兩秒之後會自動消失的功能
export const createAsyncMessage = createAsyncThunk(
  'message/createAsyncMessage',
  async (payload, { dispatch, requestId }) => {
    dispatch(
      createMessage({
        ...payload,
        id: requestId,
      }),
    );
    setTimeout(() => {
      dispatch(removeMessage(requestId));
    }, 2000);
  },
);

export const { createMessage, removeMessage } = messageSlice.actions;

export default messageSlice.reducer;
