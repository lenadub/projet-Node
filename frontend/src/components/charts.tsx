import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Charts: React.FC = () => {
    const options: Highcharts.Options = {
        title: { text: "Sales Overview" },
        xAxis: { categories: ["January", "February", "March", "April"] },
        series: [
            {
                type: "line",
                name: "Sales",
                data: [150, 200, 250, 300],
            },
            {
                type: "line",
                name: "Expenses",
                data: [100, 120, 180, 220],
            },
        ],
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default Charts;
