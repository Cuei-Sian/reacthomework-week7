import { useSelector } from 'react-redux';
//共用元件，吐司的彈跳視窗，因為每個視窗都會用到，所以建立在App中作連結設定
function MessageToast() {
  const messages = useSelector((state) => state.message); //是陣列

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className="toast show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className={`toast-header text-white bg-${message.type}`}>
            <strong className="me-auto">{message.title}</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">{message.text}</div>
        </div>
      ))}
    </div>
  );
}

export default MessageToast;
