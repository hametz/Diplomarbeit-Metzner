import type { FormQuestion } from "../Classes/FormQuestion";
import { DonutChartCalculator } from "./DonutChartCalculator";
import { useEffect, useState } from "react";
import { insertQuestionForm } from "../../DataBaseManager/DataBaseManager";
import { useNavigate } from "react-router-dom";
import DonutChart from "./DonutChart";
import { useMediaQuery } from "react-responsive";

//import DonutChartSVG from "./DonutChartSVG";

import presetData from "../../../data/donutChartPresets.json";
import HoverNote from "../../HoverNote/HoverNote";

interface DonutChartDialogInterface {
  formQuestionList: Array<FormQuestion>;
  userId: string;
  method: string;
}

const isAdmin: boolean =
  import.meta.env.VITE_IS_ADMIN_MODE === "true" ? true : false;

class DonutChartPreset {
  riskValue: number;
  riskAverseValue: number;
  riskLevel: number;
  riskTolerance: string;
  riskState: string;

  constructor(
    riskValue: number,
    riskLevel: number,
    riskTolerance: string,
    riskState: string
  ) {
    this.riskValue = riskValue;
    this.riskAverseValue = 100 - riskValue;
    this.riskLevel = riskLevel;
    this.riskTolerance = riskTolerance;
    this.riskState = riskState;
  }
}

function DonutChartDialog({
  formQuestionList,
  userId,
  method,
}: DonutChartDialogInterface) {
  const [donutChartCalculator] = useState<DonutChartCalculator>(
    new DonutChartCalculator()
  );

  const [donutChartPresets, setDonutChartPresets] = useState<
    Array<DonutChartPreset>
  >([]);

  const [sliderValue, setSliderValue] = useState<number>(25);

  const [calcSliderValue, setCalcSliderValue] = useState<number>(50);

  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  const [activeDonutChartPreset, setActiveDonutChartPreset] =
    useState<number>(1);

  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 50em)" });

  const dialogSettings = {
    maxItems: presetData.length,
    riskValue: donutChartPresets[activeDonutChartPreset - 1]?.riskValue,
    risklessValue:
      donutChartPresets[activeDonutChartPreset - 1]?.riskAverseValue,
  };

  useEffect(() => {
    // eslint-disable-next-line prefer-const
    let _donutChartPresets: Array<DonutChartPreset> = [];

    presetData.forEach((preset) => {
      _donutChartPresets.push(
        new DonutChartPreset(
          preset.riskValue,
          preset.riskLevel,
          preset.riskTolerance,
          preset.riskState
        )
      );
    });

    setDonutChartPresets(_donutChartPresets);
  }, []);

  useEffect(() => {
    if (isCalculated) {
      donutChartCalculator.setFormQuestionList(formQuestionList);
      const calcSliderValue = donutChartCalculator.calcSliderValue();
      setSliderValue(calcSliderValue);
      setCalcSliderValue(calcSliderValue);
    } else {
      setIsCalculated(true);
    }
  }, [isCalculated]);

  useEffect(() => {
    // eslint-disable-next-line prefer-const
    let calculatedPreset: DonutChartPreset | undefined = presetData.find(
      (preset) => preset.riskValue === sliderValue
    ) as DonutChartPreset;

    if (calculatedPreset) {
      setActiveDonutChartPreset(calculatedPreset.riskLevel);
    }
  }, [sliderValue]);

  const handleOnSubmit = () => {
    if (isCalculated) {
      insertQuestionForm(
        formQuestionList,
        userId,
        calcSliderValue,
        sliderValue,
        method
      );
      navigate("/survey-finished");
    }
  };

  const selectDonutChartPreset = (
    presetIndex: number,
    newRiskValue: number
  ) => {
    setActiveDonutChartPreset(presetIndex);
    setSliderValue(newRiskValue);
  };

  const mobilePresetSlider = () => {
    return (
      <>
        <div className="donut-chart-preset-list-item-wrapper">
          {donutChartPresets.map((preset) => {
            return (
              <div
                className="donut-chart-preset-list-item"
                onClick={() =>
                  selectDonutChartPreset(preset.riskLevel, preset.riskValue)
                }
                key={preset.riskState}
                data-type={
                  activeDonutChartPreset === preset.riskLevel ? "selected" : ""
                }>
                <div className="donut-chart-preset-content">
                  <div className="donut-chart-preset-content-info">
                    <h3>{"Auswahl " + preset.riskValue}</h3>
                    <h4>
                      {"Riskostufe " +
                        preset.riskLevel +
                        " von " +
                        dialogSettings.maxItems}
                    </h4>
                  </div>
                  <DonutChart
                    sliderValue={preset.riskValue}
                    dataType={"animate"}
                  />
                </div>
                <div className="donut-chart-preset-footer">
                  {preset.riskTolerance}
                </div>
              </div>
            );
          })}
        </div>
        <div className="donut-chart-preset-slider-dots">
          {presetData.map((preset) => {
            return (
              <div
                className="donut-chart-preset-slider-dot"
                data-type={
                  activeDonutChartPreset === preset.riskLevel ? "active" : ""
                }
                onClick={() =>
                  selectDonutChartPreset(preset.riskLevel, preset.riskValue)
                }></div>
            );
          })}
        </div>
        <p>
          Mit dem Antippen der Quadrate kannst du zwischen den Risikostufen
          wechseln. Sobald du deine passende Risikostufe gefunden hast, kannst
          du auf „Ergebnis abschicken“ klicken.
        </p>
      </>
    );
  };

  const DonutChartListComponent = () => {
    return (
      <>
        {donutChartPresets.map((preset) => {
          return (
            <div
              className="donut-chart-preset-list-item"
              onClick={() =>
                selectDonutChartPreset(preset.riskLevel, preset.riskValue)
              }
              key={preset.riskState}
              data-type={
                activeDonutChartPreset === preset.riskLevel ? "selected" : ""
              }>
              <div className="donut-chart-preset-content">
                <div className="donut-chart-preset-content-info">
                  <h3>{"Auswahl " + preset.riskValue}</h3>
                  <h4>
                    {"Riskostufe " +
                      preset.riskLevel +
                      " von " +
                      dialogSettings.maxItems}
                  </h4>
                </div>
                <DonutChart
                  sliderValue={preset.riskValue}
                  dataType={"animate"}
                />
              </div>
              <div className="donut-chart-preset-footer">
                {preset.riskTolerance}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="donut-chart-dialog">
        <div className="donut-chart-heading">
          <h3 className="donut-chart-header">Auswertung</h3>
          <h4 className="donut-chart-sub-header">
            Hier siehst du das für dich erstellte Portfolio, basierend auf
            deiner ermittelten Risikoneigung. Sollte diese Risikoeinschätzung
            nicht zu dir passen oder du lieber anders investieren wollen, kannst
            du selbstverständlich Anpassungen vornehmen.
          </h4>
        </div>

        <div className="donut-chart-dialog-content">
          <div className="donut-chart-preset-list" id="donut-chart-presets">
            {isMobile ? mobilePresetSlider() : DonutChartListComponent()}
          </div>

          <div className="donut-chart-active-preset">
            <div className="donut-chart-item-list">
              {isAdmin ? (
                <>
                  <div className="donut-chart-item-list-item">
                    <div className="donut-chart-item-list-item-label">
                      {"Calc Riskowert: " + calcSliderValue}
                    </div>
                  </div>
                  <div className="donut-chart-item-list-item">
                    <div className="donut-chart-item-list-item-label">
                      {"Riskowert: " + sliderValue}
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className="donut-chart-item-list-item">
                <div
                  className="donut-chart-item-list-item-color"
                  data-id="1"></div>
                <div className="donut-chart-item-list-item-label">
                  {"Aktienfonds (Risikoteil): " +
                    donutChartPresets[activeDonutChartPreset - 1]?.riskValue +
                    " %"}
                </div>
              </div>
              <div className="donut-chart-item-list-item">
                <div
                  className="donut-chart-item-list-item-color"
                  data-id="2"></div>
                <div className="donut-chart-item-list-item-label">
                  {"Tagesgeld (Risikoloser Teil): " +
                    donutChartPresets[activeDonutChartPreset - 1]
                      ?.riskAverseValue +
                    " %"}
                </div>
              </div>
            </div>

            <div className="donut-chart-container">
              <DonutChart
                sliderValue={
                  donutChartPresets[activeDonutChartPreset - 1]?.riskValue
                }
                dataType={""}
              />
              <div className="dialog-btn-wrapper">
                <div onClick={() => handleOnSubmit()} className="btn">
                  ERGEBNIS ABSCHICKEN
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HoverNote />
    </>
  );
}

export default DonutChartDialog;
