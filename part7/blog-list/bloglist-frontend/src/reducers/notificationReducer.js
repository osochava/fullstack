import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  isError: false,
  timer: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNofication: (state, action) => {
      console.log(current(state));
      if (state.timer) clearTimeout(state.timer);
      return action.payload;
    },
    clearNotification: (state) => {
      if (state.timer) clearTimeout(state.timer);
      return initialState;
    },
  },
});

export const setNoficationWithTimeout = (message, isError, delay) => {
  return (dispatch) => {
    const timer = setTimeout(() => dispatch(clearNotification()), delay * 1000);
    dispatch(
      setNofication({ message: message, isError: isError, timer: timer }),
    );
  };
};

export const { setNofication, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
