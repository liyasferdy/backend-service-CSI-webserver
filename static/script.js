document.addEventListener("DOMContentLoaded", function() {
    const chart = Highcharts.chart('chart-amplitude', {
        chart: {
            type: 'spline' // Change type to 'spline' for smooth line
        },
        title: {
            text: 'Real-time Amplitude Data'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { second: '%H:%M:%S' },
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Amplitude'
            },
            min: 0,
            allowDecimals: false
        },
        series: [{
            name: 'Amplitude',
            data: []
        }],
        credits: {
            enabled: false
        },
        time: {
            timezone: 'Asia/Jakarta'
        },
    });

    async function fetchData() {
        const response = await fetch('/latest');
        const data = await response.json();
        const x = (new Date()).getTime(); // current time
        const y = parseFloat(data.amplitude); // amplitude value

        // Update the chart with new data
        if (chart.series[0].data.length > 40) {
            chart.series[0].addPoint([x, y], true, true, true);
        } else {
            chart.series[0].addPoint([x, y], true, false, true);
        }
    }

    setInterval(fetchData, 1000); // Fetch data every second
});
