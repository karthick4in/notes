import React from "react";
import { Chart } from "react-google-charts";
import "./bootstrap.min.css";

export function App() {
  let pageComp = [
    [
      { comp: "H1", col: 2, props: { name: "" } },
      { comp: "H1", col: 6, props: { name: "Welcome Dashboard" } },
      { comp: "H1", col: 3, props: { name: "" } },
    ],
    [
      { comp: "ChartDis", col: 6, props: { msg: "chart 1" } },
      { comp: "ChartDis", col: 6, props: { msg: "chart 2" } },
      { comp: "ChartDis", col: 6, props: { msg: "chart 2" } },
      { comp: "ChartDis", col: 6, props: { msg: "chart 2" } },
    ],
  ];

  const componentMap = {
    H1,
    Button,
    Text,
    ChartDis,
  };

  // Function to render components dynamically
  const RenderComponent = ({ componentName, props }) => {
    const Component = componentMap[componentName];
    // Check if the component exists in the component map
    if (!Component) {
      return <div>Unknown component: {componentName}</div>;
    }
    // Render the component with the passed props
    return <Component {...props} />;
  };
  // return <Component {...props} />;
  return (
    <>
      <div className="container">
        {pageComp.map((rowComp, indexR) => {
          return (
            <div className="row">
              {rowComp.map((colComp, indexC) => {
                return (
                  <>
                    <div className={"col-sm-" + colComp.col}>
                      <RenderComponent
                        key={indexR + "_" + indexC}
                        componentName={colComp.comp}
                        props={colComp.props}
                      />
                    </div>
                  </>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

const Button = ({ label, color }) => (
  <button style={{ backgroundColor: color }}>{label}</button>
);

const Text = ({ content }) => <p>{content}</p>;
const H1 = ({ name }) => {
  return (
    <>
      <h1>{name}</h1>
    </>
  );
};
const ChartDis = (props) => {
  const { msg } = props;
  let data = [
    ["Year", "Sales", "Expenses"],
    ["2013", 1000, 400],
    ["2014", 1170, 460],
    ["2015", 660, 1120],
    ["2016", 1030, 540],
  ];

  let savedOptions =
    '{"legacyScatterChartLabels":true,"legend":"in","series":[{"type":"bars","color":"#6aa84f"},{"color":"#3c78d8","errorBars":{"errorType":"constant"}}],"theme":"maximized","title":"Sample Test","useFirstColumnAsDomain":false,"isStacked":true,"booleanRole":"certainty","vAxes":[{"minValue":null,"maxValue":null,"viewWindow":null,"viewWindowMode":null,"useFormatFromData":true},{"useFormatFromData":true}],"hAxis":{"viewWindow":{"max":null,"min":null},"minValue":null,"maxValue":null,"useFormatFromData":false,"logScale":false,"formatOptions":{"scaleFactor":null,"source":"none","prefix":"","suffix":""},"gridlines":{"color":"#ffff00"},"minorGridlines":{"color":"#cc0000","count":"2"},"textStyle":{"color":"#222","fontSize":12,"bold":false},"titleTextStyle":{"color":"#222","fontSize":12,"italic":false,"bold":false},"title":"Year"},"width":600,"height":371,"chartType":"BarChart","backgroundColor":{"fill":"#cccccc"}}';
  savedOptions = savedOptions
    ? JSON.parse(savedOptions)
    : {
        title: "Company Performance",
        hAxis: { title: "Year" },
        vAxis: { title: "Amount" },
        legend: { position: "bottom" },
      };

  const chartType = savedOptions["chartType"] || "LineChart";

  return (
    <>
      {msg ? <>{msg}</> : " "}
      <Chart
        chartType={chartType}
        width="100%"
        height="400px"
        data={data}
        options={savedOptions}
      />
    </>
  );
};
