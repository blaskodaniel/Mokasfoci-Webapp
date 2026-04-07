import { useSocketContext } from "@/context/SocketContext";

export const useSocket = () => {
  const { socket } = useSocketContext();
  return socket;
};
