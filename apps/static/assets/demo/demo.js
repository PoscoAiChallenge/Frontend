type = ['primary', 'info', 'success', 'warning', 'danger'];
sectorA = [];
sectorB = [];
var myLatlng = new google.maps.LatLng(37.402887, 127.100100);
amount = [0, 40, 0, 0, 0, 0];

/*
[ 0.09055595 0.38549864 -0.10001237 0.17136654 0.37429774 -0.00075923]
[ 0.10646203 0.40259898 0.02208492 0.32116342 0.48686996 -0.00439825]
[ 0.09055471 0.3854981 -0.10001568 0.17136341 0.37429392 -0.00075924]
[ 0.09055508 0.38549826 -0.10001469 0.17136434 0.37429506 -0.00075923]
[ 0.09056035 0.3855005 -0.1000007 0.17137758 0.37431115 -0.00075919]
[ 0.09055471 0.3854981 -0.10001568 0.17136341 0.37429392 -0.00075924]
[ 0.09055481 0.38549817 -0.1000154 0.17136367 0.37429425 -0.00075924]

해당 데이터의 근처 값이 반환되면 이상 감지로 판단한다. 그리고 alert(경고)를 출력한다.
*/

demo = {
  getSectorAPredict: function () {
    $.ajax({
      url: `http://127.0.0.1:9002/predict?v=${sectorA[sectorA.length - 1].vibration}&s=${sectorA[sectorA.length - 1].sound}&w=${sectorA[sectorA.length - 1].WaterPressure}`,
      type: "GET",
      success: function (data) {
        data = data.split(" ").filter((value) => value != "");
        // 첫번째 인덱스 삭제
        data.shift();
        // data를 리스트로 변환
        data = data.map((value) => parseFloat(value));

        console.log(`Sector A: ${data}`);
        //만약 data가 [ 0.09055595 0.38549864 -0.10001237 0.17136654 0.37429774 -0.00075923] 값과 근처 값이라면 이상 감지로 판단한다.
        if ((data[0] > 0.09 && data[0] < 0.10) &&
          (data[1] > 0.38 && data[1] < 0.40) &&
          (data[2] > -0.11 && data[2] < -0.01) &&
          (data[3] > 0.16 && data[3] < 0.17) &&
          (data[4] > 0.37 && data[4] < 0.38) &&
          (data[5] > -0.0008 && data[5] < -0.0007)) {
          demo.sectorNoti("A");
        }
      },
    });
  },

  getSectorBPredict: function () {
    $.ajax({
      url: `http://127.0.0.1:9002/predict?v=${sectorB[sectorB.length - 1].vibration}&s=${sectorB[sectorB.length - 1].sound}&w=${sectorB[sectorB.length - 1].WaterPressure}`,
      type: "GET",
      success: function (data) {
        data = data.split(" ").filter((value) => value != "");
        // 첫번째 인덱스 삭제
        data.shift();
        // data를 리스트로 변환
        data = data.map((value) => parseFloat(value));

        console.log(`Sector B: ${data}`);
        //만약 data가 [ 0.09055595 0.38549864 -0.10001237 0.17136654 0.37429774 -0.00075923] 값과 근처 값이라면 이상 감지로 판단한다.
        if ((data[0] >= 0.09 && data[0] <= 0.11) &&
          (data[1] >= 0.38 && data[1] <= 0.41) &&
          (data[2] >= -0.11 && data[2] <= -0.09) &&
          (data[3] >= 0.16 && data[3] <= 0.18) &&
          (data[4] >= 0.37 && data[4] <= 0.39) &&
          (data[5] >= -0.0008 && data[5] <= -0.0007)) {
          demo.sectorNoti("B");
        }
      },
    });
  },

  getSectorData: function () {
    $.ajax({
      //url: "https://gist.githubusercontent.com/GreenScreen410/b458d9c5f1c5933a5a4a6c0e95a5f757/raw/bf4f33ea065d106c5dcb182364e357ec4d1c42e4/gistfile1.txt",
      url: "https://api.ye0ngjae.com/data",
      type: "GET",
      dataType: "json",
      success: function (data) {
        for (var i = data.length - 120; i < data.length; i++) {
          if (data[i].site == "1") {
            for (var j = 0; j < sectorA.length; j++) {
              if (sectorA[j].id == data[i].id) {
                sectorA.splice(j, 1);
              }
            }
            sectorA.push(data[i]);
          } else if (data[i].site == "2") {
            for (var j = 0; j < sectorB.length; j++) {
              if (sectorB[j].id == data[i].id) {
                sectorB.splice(j, 1);
              }
            }
            sectorB.push(data[i]);
          }
        }
      },
    });
  },


  getSectorBData: function () {
    /*
    $.ajax({
      url: "https://api.ye0ngjae.com/data",
      type: "GET",
      dataType: "json",
      success: function (data) {
        for (var i = data.length - 120; i < data.length; i++) {

        }
      },
    });
    */
  },


  initPickColor: function () {
    $('.pick-class-label').click(function () {
      var new_class = $(this).attr('new-class');
      var old_class = $('#display-buttons').attr('data-class');
      var display_div = $('#display-buttons');
      if (display_div.length) {
        var display_buttons = display_div.find('.btn');
        display_buttons.removeClass(old_class);
        display_buttons.addClass(new_class);
        display_div.attr('data-class', new_class);
      }
    });
  },

  initDocChart: function () {
    chartColor = "#FFFFFF";

    // General configuration for the charts with Line gradientStroke
    gradientChartOptionsConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: true,
      scales: {
        yAxes: [{
          display: 0,
          gridLines: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          gridLines: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    };

    ctx = document.getElementById('lineChartExample').getContext("2d");

    gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, '#80b6f4');
    gradientStroke.addColorStop(1, chartColor);

    gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");

    myChart = new Chart(ctx, {
      type: 'line',
      responsive: true,
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "Active Users",
          borderColor: "#f96332",
          pointBorderColor: "#FFF",
          pointBackgroundColor: "#f96332",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 630]
        }]
      },
      options: gradientChartOptionsConfiguration
    });
  },

  initDashboardPageCharts: function () {
    // myChart를 10초마다 업데이트한다.
    setInterval(function () {
      myChart.data.datasets[0].data = amount;
      myChart.update();
    }, 1000);

    gradientChartOptionsConfigurationWithTooltipBlue = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#2380f7"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#2380f7"
          }
        }]
      }
    };

    gradientChartOptionsConfigurationWithTooltipPurple = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(225,78,202,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };

    gradientChartOptionsConfigurationWithTooltipOrange = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 50,
            suggestedMax: 110,
            padding: 20,
            fontColor: "#ff8a76"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(220,53,69,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#ff8a76"
          }
        }]
      }
    };

    gradientChartOptionsConfigurationWithTooltipGreen = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 50,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(0,242,195,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      }
    };

    gradientBarChartConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{

          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 120,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }],

        xAxes: [{

          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      }
    };

    var ctx = document.getElementById("chartLinePurple").getContext("2d");
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
    gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors

    var data = {
      labels: ['7월', '8월', '9월', '10월', '11월', '12월'],
      datasets: [{
        label: "경고 횟수",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#d048b6',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#d048b6',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#d048b6',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: amount,
      }]
    };

    var myChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipPurple
    });



    var ctxGreen = document.getElementById("chartLineGreen").getContext("2d");

    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

    var data = {
      labels: ['7월', '8월', '9월', '10월', '11월', '12월'],
      datasets: [{
        label: "강수량",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#00d6b4',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#00d6b4',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#00d6b4',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: [308.2, 346.7, 0, 0, 0, 0],
      }]
    };

    var myCharttt = new Chart(ctxGreen, {
      type: 'line',
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipGreen
    });


    // -----------------------------------------------------------------------

    // 10분 전 ~ time(현재 시간)까지 10초마다 시간을 chart_labels에 저장한다.
    var chart_labels = [...Array(60).keys()].map((_, i) => {
      let now = new Date();
      now.setHours(now.getHours());
      now.setMinutes(now.getMinutes() - 10);
      now.setSeconds(now.getSeconds() + i * 10);
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      let seconds = now.getSeconds().toString().padStart(2, '0');
      let time = `${hours}:${minutes}:${seconds}`;
      return time;
    });

    /*
    // chart_labels에 저장된 시간에 맞춰서 랜덤한 데이터를 chart_data에 저장한다.
    var chart_data = [...Array(60).keys()].map((_, i) => {
      return Math.floor(Math.random() * 50);
    });
    */

    // chart_data 배열을 생성한다. sectorA에서 sound 추출한다.
    var chart_data = [];
    var sectorA_chart_data = [[], [], []];
    var sectorB_chart_data = [[], [], []];

    var ctx = document.getElementById("chartBig1").getContext('2d');

    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.1)');
    gradientStroke.addColorStop(0.4, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors
    var config = {
      type: 'line',
      data: {
        labels: chart_labels,
        datasets: [{
          label: "진동",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: '#d346b1',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#d346b1',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#d346b1',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: chart_data,
        },
        {
          label: "소음",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: '#ff89b9',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#ff89b9',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#ff89b9',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: chart_data,
        },
        {
          label: "수압",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: '#ffdab2',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#ffdab2',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#ffdab2',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: chart_data,
        }]
      },
      options: gradientChartOptionsConfigurationWithTooltipPurple
    };
    var myChartData = new Chart(ctx, config);

    /*
    그래프 부분 추가 구현
    AI가 예측한 값은 0과 1로 저장한 다음, 만약 데이터가 1일 경우 pointBackgroundColor를 FF0000으로 바꾼다.
    */

    // A 배관
    $("#0").click(function () {
      var sectorA_data = myChartData.config.data;
      sectorA_data.datasets[0].borderColor = "#d346b1";
      sectorA_data.datasets[0].pointBackgroundColor = "#d346b1";
      sectorA_data.datasets[0].pointHoverBackgroundColor = "#d346b1";
      sectorA_data.datasets[1].borderColor = "#ff89b9";
      sectorA_data.datasets[1].pointBackgroundColor = "#ff89b9";
      sectorA_data.datasets[1].pointHoverBackgroundColor = "#ff89b9";
      sectorA_data.datasets[2].borderColor = "#ffdab2";
      sectorA_data.datasets[2].pointBackgroundColor = "#ffdab2";
      sectorA_data.datasets[2].pointHoverBackgroundColor = "#ffdab2";
      sectorA_data.labels = chart_labels;

      /*
      chart_labels = [...Array(60).keys()].map((_, i) => {
        let now = new Date();
        now.setHours(now.getHours());
        now.setMinutes(now.getMinutes() - 10);
        now.setSeconds(now.getSeconds() + i * 10);
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        let seconds = now.getSeconds().toString().padStart(2, '0');
        let time = `${hours}:${minutes}:${seconds}`;
        return time;
      });
      chart_data = [...Array(60).keys()].map((_, i) => {
        return Math.floor(Math.random() * 50);
      });
      */

      sectorA_chart_data = [[], [], []];
      for (var i = 0; i < sectorA.length; i++) {
        sectorA_chart_data[0].push(sectorA[i].vibration);
        sectorA_chart_data[1].push(sectorA[i].sound);
        sectorA_chart_data[2].push(sectorA[i].WaterPressure);
      }

      var sectorA_data = myChartData.config.data;
      sectorA_data.datasets[0].data = sectorA_chart_data[0];
      sectorA_data.datasets[1].data = sectorA_chart_data[1];
      sectorA_data.datasets[2].data = sectorA_chart_data[2];
      sectorA_data.labels = chart_labels;
      myChartData.update();
    });

    $("#1").click(function () {
      var sectorB_data = myChartData.config.data;
      sectorB_data.datasets[0].borderColor = "#5d6dff";
      sectorB_data.datasets[0].pointBackgroundColor = "#5d6dff";
      sectorB_data.datasets[0].pointHoverBackgroundColor = "#5d6dff";
      sectorB_data.datasets[1].borderColor = "#49dbff";
      sectorB_data.datasets[1].pointBackgroundColor = "#49dbff";
      sectorB_data.datasets[1].pointHoverBackgroundColor = "#49dbff";
      sectorB_data.datasets[2].borderColor = "#5cfcfa";
      sectorB_data.datasets[2].pointBackgroundColor = "#5cfcfa";
      sectorB_data.datasets[2].pointHoverBackgroundColor = "#5cfcfa";
      sectorB_data.labels = chart_labels;

      /*
      chart_labels = [...Array(60).keys()].map((_, i) => {
        let now = new Date();
        now.setHours(now.getHours());
        now.setMinutes(now.getMinutes() - 10);
        now.setSeconds(now.getSeconds() + i * 10);
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        let seconds = now.getSeconds().toString().padStart(2, '0');
        let time = `${hours}:${minutes}:${seconds}`;
        return time;
      });
      chart_data = [...Array(60).keys()].map((_, i) => {
        return Math.floor(Math.random() * 50);
      });
      */

      sectorB_chart_data = [[], [], []];
      for (var i = 0; i < sectorB.length; i++) {
        sectorB_chart_data[0].push(sectorB[i].vibration);
        sectorB_chart_data[1].push(sectorB[i].sound);
        sectorB_chart_data[2].push(sectorB[i].WaterPressure);
      }

      var sectorB_data = myChartData.config.data;
      sectorB_data.datasets[0].data = sectorB_chart_data[0];
      sectorB_data.datasets[1].data = sectorB_chart_data[1];
      sectorB_data.datasets[2].data = sectorB_chart_data[2];
      sectorB_data.labels = chart_labels;
      myChartData.update();

      /*
      // 30분 전 ~ time(현재 시간)까지 10초마다 시간을 chart_labels에 저장한다.
      chart_labels = [...Array(180).keys()].map((_, i) => {
        let now = new Date();
        now.setHours(now.getHours());
        now.setMinutes(now.getMinutes() - 30);
        now.setSeconds(now.getSeconds() + i * 10);
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        let seconds = now.getSeconds().toString().padStart(2, '0');
        let time = `${hours}:${minutes}:${seconds}`;
        return time;
      });
      chart_data = [...Array(180).keys()].map((_, i) => {
        return Math.floor(Math.random() * 100);
      });
      var data = myChartData.config.data;
      data.datasets[0].data = chart_data;
      data.labels = chart_labels;
      myChartData.update();
      */
    });

    /*
    // 1시간
    $("#2").click(function () {
      chart_labels = [...Array(360).keys()].map((_, i) => {
        let now = new Date();
        now.setHours(now.getHours() - 1);
        now.setSeconds(now.getSeconds() + i * 10);
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        let seconds = now.getSeconds().toString().padStart(2, '0');
        let time = `${hours}:${minutes}:${seconds}`;
        return time;
      });
   
      chart_data = [...Array(360).keys()].map((_, i) => {
        return Math.floor(Math.random() * 100);
      });
   
      var data = myChartData.config.data;
      data.datasets[0].data = chart_data;
      data.labels = chart_labels;
      myChartData.update();
    });
    */

    setInterval(function () {
      var now = new Date();
      var hours = now.getHours().toString().padStart(2, '0');
      var minutes = now.getMinutes().toString().padStart(2, '0');
      var seconds = now.getSeconds().toString().padStart(2, '0');
      var time = `${hours}:${minutes}:${seconds}`;
      chart_labels.shift();
      chart_labels.push(time);

      sectorA_chart_data[0].shift();
      sectorA_chart_data[0].push(sectorA[sectorA.length - 1].vibration)
      sectorA_chart_data[1].shift();
      sectorA_chart_data[1].push(sectorA[sectorA.length - 1].sound)
      sectorA_chart_data[2].shift();
      sectorA_chart_data[2].push(sectorA[sectorA.length - 1].WaterPressure)
      sectorB_chart_data[0].shift();
      sectorB_chart_data[0].push(sectorB[sectorB.length - 1].vibration)
      sectorB_chart_data[1].shift();
      sectorB_chart_data[1].push(sectorB[sectorB.length - 1].sound)
      sectorB_chart_data[2].shift();
      sectorB_chart_data[2].push(sectorB[sectorB.length - 1].WaterPressure)
      var data = myChartData.config.data;

      data.labels = chart_labels;
      myChartData.update();
    }, 1000);

    // -----------------------------------------------------------------------

    var ctx = document.getElementById("CountryChart").getContext("2d");

    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

    var myChartt = new Chart(ctx, {
      type: 'bar',
      responsive: true,
      legend: {
        display: false
      },
      data: {
        labels: ['A', 'B'],
        datasets: [{
          label: "영역",
          fill: true,
          backgroundColor: gradientStroke,
          hoverBackgroundColor: gradientStroke,
          borderColor: '#1f8ef1',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: [120, 120],
        }]
      },
      options: gradientBarChartConfiguration
    });
  },

  // -----------------------------------------------------------------------

  initGoogleMaps: function () {
    var mapOptions = {
      zoom: 15,
      center: myLatlng,
      scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
      // 이동 금지
      draggable: false,
      /*
      styles: [{
        "elementType": "geometry",
        "stylers": [{
          "color": "#1d2c4d"
        }]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#8ec3b9"
        }]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#1a3646"
        }]
      },
      {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#4b6878"
        }]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#64779e"
        }]
      },
      {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#4b6878"
        }]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#334e87"
        }]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [{
          "color": "#023e58"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
          "color": "#283d6a"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#6f9ba5"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#1d2c4d"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#023e58"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#3C7680"
        }]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
          "color": "#304a7d"
        }]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#98a5be"
        }]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#1d2c4d"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
          "color": "#2c6675"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#9d2a80"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#9d2a80"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#b0d5ce"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#023e58"
        }]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#98a5be"
        }]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#1d2c4d"
        }]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#283d6a"
        }]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [{
          "color": "#3a4762"
        }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
          "color": "#0e1626"
        }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#4e6d70"
        }]
      }
      ]
      */
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    /*
    var marker = new google.maps.Marker({
      position: myLatlng,
      title: "Hello World!"
    });
    marker.setMap(map);
    */

    var sectorABox = new google.maps.Rectangle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.7,
      strokeWeight: 5,
      fillColor: '#FF0000',
      fillOpacity: 0.5,
      map: map,
      bounds: {
        north: 37.4035,
        south: 37.4025,
        east: 127.101,
        west: 127.094
      },
    });
    sectorABox.setMap(map);

    var sectorBBox = new google.maps.Rectangle({
      strokeColor: '#0000FF',
      strokeOpacity: 0.7,
      strokeWeight: 5,
      fillColor: '#0000FF',
      fillOpacity: 0.5,
      map: map,
      bounds: {
        north: 37.4035,
        south: 37.4025,
        east: 127.108,
        west: 127.101
      }
    });
    sectorBBox.setMap(map);

    // sectorBBox 중심에 마커 생성
    var sectorBBoxCenter = new google.maps.LatLng(37.403, 127.0975);
    var marker = new google.maps.Marker({
      position: sectorBBoxCenter,
      animation: google.maps.Animation.BOUNCE,
      icon: 'http://maps.google.com/mapfiles/kml/paddle/red-blank.png'
    });
    marker.setMap(map);
  },

  sectorNoti: function (sector) {
    var audio = new Audio("../static/assets/alarm.mp3");
    audio.play();

    amount[1] += 1;

    $.notify({
      icon: "tim-icons icon-bell-55",
      message: `구역 ${sector} - <b>이상 수치가 감지되었습니다.</b>`

    }, {
      type: type[4],
      timer: 8000,
    });
  }
};