import { memo } from 'react';

function _XIcon({
  width,
  height,
  fill,
  className = '',
}: {
  width?: number | string;
  height?: number | string;
  fill?: string;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      viewBox="0 0 10 10"
    >
      <path
        fill={fill}
        d="M10 0.97908L9.02092 0L5 4.02092L0.979081 0L0 0.97908L4.02092 5L0 9.02092L0.979081 10L5 5.97908L9.02092 10L10 9.02092L5.97908 5L10 0.97908Z"
      />
    </svg>
  );
}

export const XIcon = memo(_XIcon);
