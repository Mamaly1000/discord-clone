"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LucideIcon } from "lucide-react";
import UserAvatar from "../common/UserAvatar";
import { MemberRole } from "@prisma/client";
import { roleIcon } from "../common/icons";

interface SelectItemType {
  id: string;
  value: any;
  label: string;
  icon?: LucideIcon;
  imageUrl?: string;
  role?: MemberRole;
}

interface props {
  value?: any;
  onChange?: (val: any) => void;
  placeholder?: string;
  items?: SelectItemType[];
}
export function SelectScrollable({
  placeholder,
  items = [],
  onChange,
  value,
}: props) {
  const [data, setData] = React.useState(value);
  React.useEffect(() => {
    setData(value);
  }, [value]);
  return (
    <Select value={data} defaultValue={data} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue
          className="line-clamp-1"
          placeholder={placeholder}
          inputMode="search"
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.id} value={item.value}>
              <div className="flex items-center justify-start gap-2 line-clamp-1">
                {!!item.imageUrl && (
                  <UserAvatar
                    className="w-[20px] h-[20px] md:h-[20px] md:w-[20px]"
                    src={item.imageUrl}
                  />
                )}
                {!!item.icon && <item.icon className="w-4 h-4" />}
                <p className=" max-w-[70%] line-clamp-1">{item.label}</p>
                {!!item.role && roleIcon[item.role]}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
