import React from 'react';

import { Icon } from '@iconify/react';

interface FullScreenOverlayProperties {
  icon?: string;
  color?: string;
}

export const FullScreenOverlay: React.FC<FullScreenOverlayProperties> = ({
  icon = 'eos-icons:bubble-loading',
  color = 'text-indigo-600',
}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80">
      <Icon
        icon={icon}
        className={`${color} animate-spin`}
        width={48}
        height={48}
      />
    </div>
  );
};
