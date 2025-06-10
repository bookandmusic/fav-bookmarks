import { Icon } from "@iconify/react";
import { notification } from "antd";
import { useEffect } from "react";

export function useErrorNotification(error: Error | null) {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (error) {
      api.error({
        message: error.message,
        placement: "topRight",
        icon: <Icon icon={"akar-icons:chat-error"} color="red" />,
      });
    }
  }, [error, api]);

  return contextHolder;
}
