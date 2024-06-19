import { Line } from "react-chartjs-2";
import { enUS } from "date-fns/locale";
import "chartjs-adapter-date-fns";
import { COLORS } from "@/utils/constants";

const LineChart = ({ data, label }: LineChartProps) => {
    return (
        <Line
            data={{
                datasets: [
                    {
                        label,
                        data: data,
                        fill: false,
                        borderColor: COLORS.PRIMARY_1,
                        tension: 0.1,
                    },
                ],
            }}
            options={{
                scales: {
                    x: {
                        type: "time",
                        time: {
                            displayFormats: {
                                quarter: "MMM YYYY",
                            },
                        },
                        adapters: {
                            date: {
                                locale: enUS,
                            },
                        },
                        grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                        },
                    },
                    y: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                        },
                    },
                },
            }}
        />
    );
};

export type LineChartData = { x: number; y: number }[];

export interface LineChartProps {
    data: LineChartData;
    label: string;
}

export default LineChart;
