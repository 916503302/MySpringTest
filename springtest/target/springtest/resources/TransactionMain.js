charset="utf-8";
window.onload = function () {

    getData();
    initChart();

    showData()
};

var myChart;
var orgList;
var Trans  = new Array();


function initChart() { //初始化图表
    var dataGet;


    orgList = ["", "org1", "org2", "org3", ""]
    myChart = echarts.init(document.getElementById('main'));
    options = {

        title: {
            text: '',
            link: 'https://github.com/pissang/echarts-next/graphs/punch-card'
        },
        legend: {
            x: 'center',
            data: ['交易情况'],
            left: 'center',
            textStyle: {
                fontSize: 25 // 让字体变大
            }
        },
        tooltip: {
        },
        grid: {
            left: 2,
            bottom: 10,
            right: 10,
            containLabel: true
        },
        xAxis: {
            axisLabel: {
                margin: 45,
                textStyle: {
                    fontSize: 25 // 让字体变大
                }
            },
            type: 'category',
            data: orgList,
            scale: false,
            boundaryGap: false,
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#e5e5e5',
                    width: 2,
                    type: 'solid'


                }
            },
            axisLine: {
                show: true,
                onZero: false,
                lineStyle: {
                    color: '#48b',
                    width: 2,
                    type: 'solid'

                }
            }
        },
        yAxis: {
            type: 'value',
            scale: false,
            splitLine: {<!-- 去掉网格线 -->
                show: false,
                lineStyle: {
                    color: '#e5e5e5',
                    width: 2,
                    type: 'solid'


                }
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#48b',
                    type: 'dashed'
                }

            }

        },
        series: [
            {
            name: '交易情况',
            type: 'scatter',
            center: [50, 10],
            symbolSize: function (val) {
                return val[2] * 4.2;
            },
           data: [],
            animationDelay: function (idx) {
                return idx * 5;
            }
        }
        ]
    };
    console.log("hhhhuu : ", dataGet);
    myChart.setOption(options);
}


function getJsonLength(jsonData){

    var jsonLength = 0;

    for(var item in jsonData){

        jsonLength++;

    }

    return jsonLength;

}


function getData() {  //获取数据
    search = {};
    search["userid"] = "userid0";

    $.ajax({
        type: "POST",
        contentType: "application/json",
        async: false,            //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行） true：异步，false：同步。
        url: "/blockchain/transaction/getTransactionByUserID",
        data: JSON.stringify(search),//自定义查询字段
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {

            for (var i = 0; i < data.length; i++) {
                Trans[i] = data[i].Record;
                console.log(Trans[i]);
            }
        },
        error: function (e) {

            console.log("ERROR : ", e);

        }
    });
    
}

function showData() {

    var dataGet = [ [Trans[0].transactiondate/100000, 3, 10 ],

        [ Trans[1].transactiondate/100000, 2, 10],

        [Trans[2].transactiondate/10000, 1,10]];
    // X：时间；Y：公司；Z：大小  H :myDate；transactionid；parentorder；suborder；payid；transtype；fromtype；fromid；totype；toid；productid；productinfo；organizationid；amount；price

    var MydataGet = dataGet.map(function (item) {
        return [item[1], item[0], item[2]];
    });


    myChart = echarts.init(document.getElementById('main'));
    var options = {
        tooltip: {
            position: 'top',
            formatter: function (params) {
                var res = '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'

                    + '</div>'
                    + 'transactionid' + ':' + params.data[0] + '<br>'
                    + 'transactiondate' + '：' + params.data[1] + '<br>'
                    + 'parentorder' + ':' + params.data[2] + '<br>';
                return res;
            }
        },
        series: [{
            name: '交易情况',
            type: 'scatter',
            center: [50, 10],
            symbolSize: function (val) {
                return val[2] * 4.2;
            },
            //  data: [],
            data: MydataGet,
            animationDelay: function (idx) {
                return idx * 5;
            }
        }]
    };
    myChart.setOption(options);
}
//将时间类型转换成数字形式
function shitDate(my) {
    //  var date1= '2017/09/01 00:00:00';  //开始时间
    var date1 = myDate[0];   //因为传输来的数据是最新的几条数据是按时间进行排列的
    var date3 = new Date(my).getTime() - new Date(date1).getTime();   //时间差的毫秒数
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    //计算出小时数

    var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var orgList = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000);       //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000);     //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    var ggg = days + orgList / 24 + minutes / 60 + seconds / 3600;
    return ggg;
}