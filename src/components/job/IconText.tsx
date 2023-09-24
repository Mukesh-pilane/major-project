import type { IconType } from "react-icons";

const IconText = ({
  prefix,
  suffix,
  icon: Icon,
}: {
  prefix?: string;
  suffix: string | number;
  icon: IconType;
}) => {
  return (
    <li className="  flex  items-center gap-1 text-sm capitalize">
      <Icon size={16} className="text-accent-400" title={prefix ?? ""} />
      <span className="text-sm text-gray-500 line-clamp-1">{suffix}</span>
    </li>
  );
};

export default IconText;
