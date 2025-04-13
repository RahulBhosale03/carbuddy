import { io } from "socket.io-client";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const socket = io(backendUrl, {
    transports: ["polling"], // Force long polling instead of WebSockets
    withCredentials: true, // Ensures cookies and authentication headers are sent
    allowEIO3: true,
  });
export {socket}