import { NextPageProps } from "@/utils/types";

const TabRequest = ({ id }: RequestProps) => {
  return (
    <div>
      <h1>Edit at src/TabRequest.tsx </h1>
      <p>Squad id: {id}</p>
    </div>
  );
};

export interface RequestProps {
  id: string;
}

export default TabRequest;
