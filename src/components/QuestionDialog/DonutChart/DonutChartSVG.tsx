import { useEffect, useState } from "react";

interface DonutChartInterface {
  sliderValue: number;
}

interface SvgSettingInterface {
  strokeDashArray: string;
  strokeDashOffSet: string;
}

function DonutChartSVG({ sliderValue }: DonutChartInterface) {
  const [riskSettings] = useState<SvgSettingInterface>({
    strokeDashArray: "90 0.4 0 10",
    strokeDashOffSet: "15",
  });

  const [riskAverseSettings] = useState<SvgSettingInterface>({
    strokeDashArray: "10 0.2  0 90",
    //100 − 90 + 15 = 25
    strokeDashOffSet: "25",
  });

  useEffect(() => {
    const risk: number = 100 - sliderValue;
    const riskAverse: number = 100 - risk;

    riskSettings.strokeDashArray = risk + " 0.4 0 " + riskAverse;

    riskAverseSettings.strokeDashArray = riskAverse + " 0.2 0 " + risk;
    const ristAverseStrokeDashOffSet: number =
      100 - risk + parseInt(riskSettings.strokeDashOffSet);

    riskAverseSettings.strokeDashOffSet = ristAverseStrokeDashOffSet.toString();
  }, [sliderValue]);

  return (
    <div>
      <div className="donut-chart">
        <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
          <circle
            className="donut-hole"
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="#fff"></circle>

          <circle
            className="donut-segment"
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#18dbdb"
            strokeWidth="6"
            strokeDasharray={riskSettings.strokeDashArray}
            strokeDashoffset={riskSettings.strokeDashOffSet}></circle>

          <circle
            className="donut-segment"
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#ce4b99"
            strokeWidth="4"
            strokeDasharray={riskAverseSettings.strokeDashArray}
            strokeDashoffset={riskAverseSettings.strokeDashOffSet}></circle>
        </svg>
      </div>
    </div>
  );
}

export default DonutChartSVG;
