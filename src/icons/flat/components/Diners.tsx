import * as React from "react";
import type { SVGProps } from "react";
const SvgDiners = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={780}
    height={500}
    {...props}
  >
    <path fill="#0079BE" d="M0 0h780v500H0z" />
    <path
      fill="#fff"
      d="M599.93 251.45c0-99.415-82.98-168.13-173.9-168.1h-78.242c-92.003-.033-167.73 68.705-167.73 168.1 0 90.93 75.727 165.64 167.73 165.2h78.242c90.914.436 173.9-74.294 173.9-165.2"
    />
    <path
      fill="#0079BE"
      d="M348.28 97.43c-84.07.027-152.19 68.308-152.21 152.58.02 84.258 68.144 152.53 152.21 152.56 84.09-.027 152.23-68.303 152.24-152.56-.011-84.272-68.149-152.55-152.24-152.58z"
    />
    <path
      fill="#fff"
      d="M252.07 249.6c.08-41.181 25.746-76.297 61.94-90.25v180.48c-36.194-13.948-61.861-49.045-61.94-90.23zm131 90.274v-180.53c36.207 13.92 61.914 49.057 61.979 90.257-.065 41.212-25.772 76.322-61.979 90.269z"
    />
  </svg>
);
export default SvgDiners;