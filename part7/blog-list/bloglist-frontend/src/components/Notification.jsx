import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  if (notification.message === null) {
    return null;
  }
  console.log(`notification.message: ${notification.message}`);
  return (
    <div
      className={`notification ${notification.isError ? "error" : "success"}`}
    >
      {notification.message}
    </div>
  );
};

export default Notification;
