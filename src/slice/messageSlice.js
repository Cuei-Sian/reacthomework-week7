import { createSlice } from '@reduxjs/toolkit';

// 定義狀態怎麼改（slice）
export const messageSlice = createSlice({
  name: 'message',
  initialState: [],
  reducers: {
    createMessage(state, action) {},
    removeMessage(state, action) {},
  },
});

export default messageSlice.reducer;
