"use client";
import { Icon } from "@iconify/react";
import { notification } from "antd";
import { useEffect, useState } from "react";

export function useNotification() {
  const [error, setError] = useState<Error | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [warn, setWarn] = useState<string | null>(null);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (error) {
      api.error({
        message: error.message,
        placement: "topRight",
        icon: <Icon icon={"ix:error"} color="red" />,
      });
      setError(null);
    }
    if (info) {
      api.info({
        message: info,
        placement: "topRight",
        icon: <Icon icon={"grommet-icons:info"} color="blue" />,
      });
      setInfo(null);
    }
    if (warn) {
      api.warning({
        message: warn,
        placement: "topRight",
        icon: <Icon icon={"material-symbols:warning-outline"} color="orange" />,
      });
      setWarn(null);
    }
  }, [error, info, warn, api]);

  return {
    contextHolder,
    setError,
    setInfo,
    setWarn,
  };
}
