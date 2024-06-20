import { COLORS } from "@/utils/constants";
import Image from "next/image";

const Avatar = ({ size, src, initials }: AvatarProps) => {
  if (src) {
    return (
      <Image
        width={size}
        height={size}
        src={src}
        alt="avatar"
        className="rounded-circle"
      />
    );
  }
  if (initials) {
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: COLORS.PRIMARY_1,
        }}
        className="rounded-circle d-flex justify-content-center align-items-center"
      >
        <span className="text-light">{initials}</span>
      </div>
    );
  }

  return <></>;
};

export interface AvatarProps {
  size: number;
  src?: string;
  initials?: string;
}

export default Avatar;
