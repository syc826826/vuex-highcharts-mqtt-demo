<template>
  <div class="chartElem mid">
    <div class="row">
      <highcharts class="chart" :options="chartOptions" :updateArgs="updateArgs"></highcharts>
      <div class="mid">
        <h3>Flexibly change the value of each point:</h3>
        <h4>Points:</h4>
        <form class="row points">
          <div v-for="(item,index) in points" :key="item.id" class="inline">
            <p>{{index}}</p>
            <input v-model.number="points[index]" type="number" class="numberInput">
          </div>
        </form>
      </div>
    </div>
    <div class="row mid">
      <div id="title">
        <h3>Set chart title dynamically:</h3>
        <input type="text" v-model="title">
      </div>
      <div id="chartType">
        <h3>Select chart type:</h3>
        <select v-model="chartType">
          <option>Spline</option>
          <option>AreaSpline</option>
          <option>Line</option>
          <option>Scatter</option>
          <option>Column</option>
          <option>Area</option>
          <option>Bar</option>
          <option>Pie</option>
          <option>Heatmap</option>
        </select>
      </div>
      <div id="animationDuration" class="mid">
        <h3>Select update animation duration:</h3>
        <select v-model="animationDuration" type="number">
          <option>0</option>
          <option>500</option>
          <option>1000</option>
          <option>2000</option>
        </select>
      </div>
      <div id="seriesColor" class="mid">
        <h3>Select color of the series:</h3>
        <div class="row">
          <input id="colorPicker" v-if="colorInputIsSupported" type="color" value="#6fcd98" v-model="seriesColor">
          <select v-else v-model="seriesColor">
            <option>Red</option>
            <option>Green</option>
            <option>Blue</option>
            <option>Pink</option>
            <option>Orange</option>
            <option>Brown</option>
            <option>Black</option>
            <option>Purple</option>
          </select>
        </div>
        <p>Current color: {{seriesColor}}</p>
        <p>Counter: {{counter}}</p>
        <button @click="inc" class="default-btn">increase</button>
        <button @click="dec" class="default-btn">decrease 2</button>
        <button @click="double" class="default-btn">double</button>
        <button @click="togLoad" class="default-btn">toggle loading</button>
        <button @click="getDataMqtt" class="default-btn">get data from mqtt</button>
      </div>
    </div>
  </div>
</template>

<script>
var MQTT = require("mqtt");

export default {
  data() {
    return {
      client: null,
      minLabel: null,
      maxLabel: null,
      hasBorder: false,
      hasMarkArea: false,
      isLarge: false,
      mouseTipText: null,
      chartTarget: null,
      title: "",
      points: [10, 0, 8, 2, 6, 4, 5, 5],
      chartType: "Spline",
      seriesColor: "#6fcd98",
      colorInputIsSupported: null,
      animationDuration: 1000,
      updateArgs: [true, true, { duration: 1000 }],
      chartOptions: {
        legend: { align: "center" },
        credits: { enabled: false },
        subtitle: { text: "sub title" },
        tooltip: {
          enabled: true,
          borderColor: "red",
          borderWidth: 2
        },
        chart: {
          type: "spline",
          events: {
            load: this.chartOnLoad,
            redraw: this.chartReDraw
          },
          zoomType: "x",
          resetZoomButton: {
            position: {
              align: "left",
              x: 0,
              y: 0
            }
          }
        },
        title: {
          text: "Sin chart"
        },
        legend: {
          itemDistance: 50,
          itemHoverStyle: {
            color: "#FF0000"
          }
        },
        series: [
          {
            data: [10, 0, 8, 2, 6, 4, 5, 5],
            allowPointSelect: true,
            dataLabels: { enabled: true },
            // showCheckbox: true,
            color: "#6fcd98",
            events: {
              afterAnimate: this.afterAnimate,
              mouseOver: this.mouseOver,
              mouseOut: this.mouseOut
            }
          }
        ],
        navigation: {
          buttonOptions: {
            enabled: true
          }
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.y}</b><br/>",
          valueSuffix: " ttt",
          valuePrefix: "bbb ",
          shared: true
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWith: 700,
                callback: function() {
                  // console.log(1);
                }
              }
            }
          ]
        }
      }
    };
  },
  computed: {
    counter: function() {
      return this.$store.state.chart.counter;
    }
  },
  created() {
    let that = this;
    let i = document.createElement("input");
    i.setAttribute("type", "color");
    i.type === "color"
      ? (this.colorInputIsSupported = true)
      : (this.colorInputIsSupported = false);

    that.client = MQTT.connect("mqtt://localhost:3000");
    that.client.on("connect", function() {
      console.log("Mqtt:connected to server");
      // client.publish('test','hello mqtt');
    });
    that.client.subscribe("simulate data", function(err, pl) {
      that.client.on("message", that.mqttMsgHandler);
    });
  },
  methods: {
    mqttMsgHandler: function(topic, message) {
      var that = this;
      if (topic === "simulate data") {
        var simulateData = JSON.parse(message.toString());
        // console.log(simulateData);
        for (let index = 0; index < that.points.length; index++) {
          that.points.splice(index, 1, simulateData[index]);
        }
        that.chartTarget.series[0].setData([
          that.points[0],
          that.points[1],
          that.points[2],
          that.points[3],
          that.points[4],
          that.points[5],
          that.points[6],
          that.points[7]
        ]);
      }
    },
    chartOnLoad: function(chart) {
      // console.log(chart.target);
      var renderer = chart.target.renderer;
      var chartGroup = renderer.g().add();
      var isShowGroup = true;
      var that = this;
      that.chartTarget = chart.target;
      renderer
        //add text
        .text(
          'This text is <span style="color: red">styled</span> and <a href="http://example.com">linked</a>',
          150,
          80
        )
        .css({
          color: "#4572A7",
          fontSize: "16px"
        })
        .add();
      that.mouseTipText = renderer.g().add();
      renderer
        .text('<span style="color: red">鼠标进入</span>', 400, 200)
        .css({
          color: "#ff0000",
          fontSize: "16px"
        })
        .add(that.mouseTipText);
      that.mouseTipText.hide();
      //add rect
      var rect = renderer
        .rect(100, 100, 100, 100, 5)
        .attr({
          "stroke-width": 2,
          stroke: "red",
          fill: "yellow",
          zIndex: 3
        })
        .on("click", function() {
          rect.animate({
            x: 150,
            y: 150,
            width: 150,
            height: 150,
            "stroke-width": 3
          });
        })
        .add(chartGroup);
      //add circle
      var circle = renderer
        .circle(200, 150, 100)
        .attr({
          fill: "#FCFFC5",
          stroke: "black",
          "stroke-width": 1
        })
        .on("click", function() {
          circle.animate({
            x: 300,
            y: 225,
            r: 150,
            "stroke-width": 2
          });
        })
        .add(chartGroup);
      //add group toggle button
      renderer
        .button("显示/隐藏组", 400, 0, function() {
          if (isShowGroup) {
            chartGroup.hide();
          } else {
            chartGroup.show();
          }
          isShowGroup = !isShowGroup;
        })
        .attr({
          zIndex: 5
        })
        .add();
      //add data update button
      renderer
        .button("更新数据", 490, 0, function() {
          for (let index = 0; index < that.points.length; index++) {
            // will not trigger view refresh
            // that.points[index] = parseInt(10 * Math.random());
            // use this one
            that.points.splice(index, 1, parseInt(10 * Math.random()));
          }
          chart.target.series[0].setData([
            that.points[0],
            that.points[1],
            that.points[2],
            that.points[3],
            that.points[4],
            that.points[5],
            that.points[6],
            that.points[7]
          ]);
        })
        .attr({
          zIndex: 5
        })
        .add();
      //add new point button
      renderer
        .button("增加点", 400, 40, function() {
          that.points.push(parseInt(10 * Math.random()));
        })
        .attr({
          zIndex: 5
        })
        .add();
      //delete first point button
      renderer
        .button("删除点", 460, 40, function() {
          that.points.pop();
        })
        .attr({
          zIndex: 5
        })
        .add();
      //add series button
      renderer
        .button("增加数据列", 520, 40, function() {
          // console.log(chart.target.container);
          if (chart.target.series.length === 1) {
            var newPoints = JSON.parse(JSON.stringify(that.points));
            chart.target.showLoading();
            setTimeout(function() {
              chart.target.addSeries({
                data: newPoints.reverse(),
                allowPointSelect: true,
                dataLabels: { enabled: true },
                color: "#19819C"
              });
              chart.target.hideLoading();
            }, 1000);
          }
        })
        .attr({
          zIndex: 5
        })
        .add();
      //add chart border button
      renderer
        .button("增加/删除边框", 400, 80, function() {
          var container = chart.target.container;
          if (that.hasBorder) {
            container.style.border = "none";
            that.hasBorder = false;
          } else {
            container.style.border = "1px solid #000";
            that.hasBorder = true;
          }
        })
        .attr({
          zIndex: 5
        })
        .add();
      //add mark area button
      renderer
        .button("增加/删除标识", 500, 80, function() {
          var target = chart.target;
          var markId = "chartMark1";
          if (that.hasMarkArea) {
            target.xAxis[0].removePlotBand(markId);
            that.hasMarkArea = false;
          } else {
            target.xAxis[0].addPlotBand({
              from: 5.5,
              to: 7.5,
              color: "#FCFFC5",
              id: markId
            });
            that.hasMarkArea = true;
          }
        })
        .attr({
          zIndex: 5
        })
        .add();
      //large button
      renderer
        .button("大啊大", 400, 120, function() {
          if (!that.isLarge) {
            chart.target.setSize(800, 500);
            that.isLarge = true;
          }
        })
        .attr({
          zIndex: 5
        })
        .add();
      //small button
      renderer
        .button("小啊小", 460, 120, function() {
          if (that.isLarge) {
            chart.target.setSize(600, 500);
            that.isLarge = false;
          }
        })
        .attr({
          zIndex: 5
        })
        .add();
      //add max & min label
      this.renderMinMaxLabel(chart.target);
    },
    chartReDraw: function(chart) {
      this.renderMinMaxLabel(chart.target);
    },
    render: function render(chart, point, text) {
      return chart.renderer
        .label(
          text + ": " + point.y,
          point.plotX + chart.plotLeft - 20,
          point.plotY + chart.plotTop - 45,
          "callout",
          point.plotX + chart.plotLeft,
          point.plotY + chart.plotTop
        )
        .css({
          color: "#FFFFFF",
          align: "center"
        })
        .attr({
          fill: "rgba(0, 0, 0, 0.75)",
          padding: 8,
          r: 5,
          zIndex: 6
        })
        .add();
    },
    renderMinMaxLabel: function renderMinMaxLabel(chart) {
      if (this.minLabel) {
        this.minLabel.destroy();
      }
      if (this.maxLabel) {
        this.maxLabel.destroy();
      }
      var min = 1000,
        max = 0,
        pointsToShow = [0, 0],
        points = chart.series[0].points;

      points.forEach(function(item) {
        if (item.y > max) {
          pointsToShow[0] = item.index;
          max = item.y;
        }
        if (item.y < min) {
          pointsToShow[1] = item.index;
          min = item.y;
        }
      });
      this.minLabel = this.render(chart, points[pointsToShow[0]], "Max");
      this.maxLabel = this.render(chart, points[pointsToShow[1]], "Min");
    },
    afterAnimate: function() {
      console.log("Highchart:animate complete");
    },
    mouseOver: function(e) {
      this.mouseTipText.show();
    },
    mouseOut: function(e) {
      this.mouseTipText.hide();
    },

    /* **********************vuex************************* */
    inc() {
      this.$store.dispatch("increment");
    },
    dec() {
      this.$store.dispatch("decrement");
    },
    double() {
      this.$store.dispatch("double");
    },
    togLoad() {
      this.$store.dispatch("toggleLoading", this.chartTarget);
    },
    getDataMqtt() {
      var that = this;
      that.client.publish("chart data", "get chart data");
    }
  },
  watch: {
    title(newValue) {
      this.chartOptions.title.text = newValue;
    },
    points(newValue) {
      this.chartOptions.series[0].data = newValue;
    },
    chartType(newValue) {
      this.chartOptions.chart.type = newValue.toLowerCase();
    },
    seriesColor(newValue) {
      this.chartOptions.series[0].color = newValue.toLowerCase();
    },
    animationDuration(newValue) {
      this.updateArgs[2].duration = Number(newValue);
    }
  }
};
</script>

<style scoped>
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
#colorPicker {
  border: 0;
  padding: 0;
  margin: 0;
  width: 30px;
  height: 30px;
}
.numberInput {
  width: 30px;
}
.inline {
  display: inline-block;
  margin-left: 10px;
}
.mid {
  text-align: center;
}
.default-btn {
  width: auto;
  height: auto;
}
</style>
