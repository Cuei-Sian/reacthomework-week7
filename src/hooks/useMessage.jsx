import { useDispatch } from 'react-redux';
import { createAsyncMessage } from '../slice/messageSlice';

function useMessage() {
  const dispatch = useDispatch();
  //封裝成功的訊息方法
  const showSuccess = (message) => {
    dispatch(
      createAsyncMessage({
        success: true,
        message,
      }),
    );
  };

  //封裝失敗的訊息方法
  const showError = (message) => {
    dispatch(
      createAsyncMessage({
        success: false,
        message,
      }),
    );
  };
  return {
    showSuccess,
    showError,
  };
}

export default useMessage;
