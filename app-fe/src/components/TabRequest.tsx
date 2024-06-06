import { NextPageProps } from "@/utils/types";
import GroupMemberRequest from "./GroupMemberRequest";

const TabRequest = ({ id }: RequestProps) => {
  return (
    <div>
      {/* <h1>Edit at src/TabRequest.tsx </h1> */}
      <GroupMemberRequest/>
    </div>
  );
};

export interface RequestProps {
  id: string;
}

export default TabRequest;
