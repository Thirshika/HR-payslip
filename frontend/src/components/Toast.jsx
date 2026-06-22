function Toast({ message, type = 'info', visible }) {
  if (!visible) return null;

  return <div className={`toast ${type}`}>{message}</div>;
}

export default Toast;
