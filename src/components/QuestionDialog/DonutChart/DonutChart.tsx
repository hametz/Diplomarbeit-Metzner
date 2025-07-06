import { useEffect, useRef, type RefObject } from "react";

interface DonutChartInterface {
  sliderValue: number;
  dataType: string;
}

function DonutChart({ sliderValue, dataType }: DonutChartInterface) {
  const donutChartRef: RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);

  const donutRiskChartRef: RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const _donutChartRef: HTMLElement = donutChartRef.current as HTMLElement;
    const _donutRiskChartRef: HTMLElement =
      donutRiskChartRef.current as HTMLElement;

    if (_donutRiskChartRef) {
      _donutRiskChartRef.style.backgroundImage =
        "conic-gradient( blue " +
        sliderValue +
        "%, transparent " +
        sliderValue +
        "%)";
    }

    if (_donutChartRef) {
      _donutChartRef.style.backgroundImage =
        "conic-gradient(orange " +
        sliderValue +
        "%, orange " +
        sliderValue +
        "%)";
    }
  }, [sliderValue]);

  return (
    <>
      <div className="donut-chart-wrapper">
        <div className="donut-chart" ref={donutChartRef}>
          <div className="donut-chart-inner"></div>
          <div
            className="donut-chart-risk"
            data-type={dataType}
            ref={donutRiskChartRef}></div>
        </div>
      </div>
    </>
  );
}

export default DonutChart;
