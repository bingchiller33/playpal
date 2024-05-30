import { NextPageProps } from "@/utils/types";

const TabMembers = ({ id }: MembersProps) => {
  return (
    <div>
      <h1>Edit at src/TabMembers.tsx </h1>
      <p>Squad id: {id}</p>
    </div>
  );
};

export interface MembersProps {
  id: string;
}

export default TabMembers;
