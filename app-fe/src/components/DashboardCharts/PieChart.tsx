import { Pie } from "react-chartjs-2";

const PieChart = (props: PieChartProps) => {
    const labels = props.data.map((d) => d.name);
    const values = props.data.map((d) => d.value);

    return (
        <Pie
            data={{
                labels,
                datasets: [
                    {
                        label: "Value",
                        data: values,
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                        ],
                    },
                ],
            }}
        />
    );
};

export type PieChartData = { name: string; value: number }[];

export interface PieChartProps {
    data: PieChartData;
}

export default PieChart;
