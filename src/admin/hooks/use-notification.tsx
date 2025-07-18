'use client';
import { useEffect, useState } from 'react';

import { Icon } from '@iconify/react';
import { notification } from 'antd';

export function useNotification() {
  const [error, setError] = useState<Error | undefined>();
  const [info, setInfo] = useState<string | undefined>();
  const [warn, setWarn] = useState<string | undefined>();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (error) {
      api.error({
        message: error.message,
        placement: 'topRight',
        icon: <Icon icon={'ix:error'} color="red" />,
      });
      setError(undefined);
    }
    if (info) {
      api.info({
        message: info,
        placement: 'topRight',
        icon: <Icon icon={'grommet-icons:info'} color="blue" />,
      });
      setInfo(undefined);
    }
    if (warn) {
      api.warning({
        message: warn,
        placement: 'topRight',
        icon: <Icon icon={'material-symbols:warning-outline'} color="orange" />,
      });
      setWarn(undefined);
    }
  }, [error, info, warn, api]);

  return {
    contextHolder,
    setError,
    setInfo,
    setWarn,
  };
}
