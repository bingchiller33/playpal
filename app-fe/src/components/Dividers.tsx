import { COLORS } from "@/utils/constants";

const Dividers = () => {
    return (
        <div
            className="my-4"
            style={{
                border: `1px solid ${COLORS.PRIMARY_1}`,
                opacity: 0.5,
            }}
        />
    );
};

export default Dividers;
