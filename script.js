// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  // Initial data
  let data = {
    temperature: 25.5,
    humidity: 65.3,
    waterLevel: 85.0,
    flowRate: 1.8,
    soilMoisture: 70.2
  };
  
  // Chart data
  const chartData = {
    labels: [],
    datasets: [
      {
        label: 'Nhiệt độ (°C)',
        data: [],
        borderColor: '#ff9f55',
        backgroundColor: 'rgba(255, 159, 85, 0.3)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Độ ẩm không khí (%)',
        data: [],
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.3)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Mực nước (cm)',
        data: [],
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.3)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Tốc độ dòng chảy (m/s)',
        data: [],
        borderColor: '#9b59b6',
        backgroundColor: 'rgba(155, 89, 182, 0.3)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Độ ẩm đất (%)',
        data: [],
        borderColor: '#d35400',
        backgroundColor: 'rgba(211, 84, 0, 0.3)',
        tension: 0.4,
        fill: true
      }
    ]
  };
  
  // Initialize Chart
  const ctx = document.getElementById('historyChart').getContext('2d');
  const historyChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#2c3e50',
            font: {
              size: 14,
              weight: 600
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#2c3e50',
            font: {
              size: 12
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          ticks: {
            color: '#2c3e50',
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(44, 62, 80, 0.1)'
          }
        }
      }
    }
  });
  
  // Update data and chart
  function updateData() {
    // Simulate data changes
    data.temperature -= Math.random() * 0.3; // Decrease from 25.5°C to 24.0°C
    data.humidity += (Math.random() - 0.5) * 0.5; // Fluctuate ±0.5%
    data.waterLevel += Math.random() * 0.5; // Increase from 85.0cm to 90.0cm
    data.flowRate += Math.random() * 0.05; // Increase from 1.8 m/s to 2.0 m/s
    data.soilMoisture += (Math.random() - 0.5) * 0.5; // Fluctuate ±0.5%
  
    // Update DOM
    document.getElementById('temperature').textContent = data.temperature.toFixed(1) + '°C';
    document.getElementById('humidity').textContent = data.humidity.toFixed(1) + '%';
    document.getElementById('waterLevel').textContent = data.waterLevel.toFixed(1) + 'cm';
    document.getElementById('flowRate').textContent = data.flowRate.toFixed(1) + ' m/s';
    document.getElementById('soilMoisture').textContent = data.soilMoisture.toFixed(1) + '%';
  
    // Update chart
    const time = new Date().toLocaleTimeString();
    chartData.labels.push(time);
    chartData.datasets[0].data.push(data.temperature);
    chartData.datasets[1].data.push(data.humidity);
    chartData.datasets[2].data.push(data.waterLevel);
    chartData.datasets[3].data.push(data.flowRate);
    chartData.datasets[4].data.push(data.soilMoisture);
  
    // Keep only last 10 data points
    if (chartData.labels.length > 10) {
      chartData.labels.shift();
      chartData.datasets.forEach(dataset => dataset.data.shift());
    }
  
    historyChart.update();
  
    // Update Firebase
    database.ref('iot-data').set(data);
  
    // AI Analysis
    let analysis = [];
    if (data.flowRate > 1.9) {
      analysis.push('Tốc độ dòng chảy đang tăng, cần kiểm tra tại khu vực nguy hiểm.');
    }
    if (data.waterLevel > 88) {
      analysis.push('Mực nước tăng đáng kể, chú ý khu vực dễ ngập.');
    }
    if (data.temperature < 24.5) {
      analysis.push('Nhiệt độ đang giảm nhẹ, theo dõi thêm.');
    }
    if (data.humidity > 66) {
      analysis.push('Độ ẩm không khí tăng, có nguy cơ mưa.');
    }
    document.getElementById('aiAnalysis').textContent = analysis.length > 0 ? analysis.join(' ') : 'Tình hình ổn định.';
  }
  
  // Initial update
  updateData();
  
  // Update every 10 seconds
  setInterval(updateData, 10000);
  
  // Export to Excel
  function exportToExcel() {
    const wsData = [
      ['Thời gian', 'Nhiệt độ (°C)', 'Độ ẩm không khí (%)', 'Mực nước (cm)', 'Tốc độ dòng chảy (m/s)', 'Độ ẩm đất (%)'],
      ...chartData.labels.map((time, i) => [
        time,
        chartData.datasets[0].data[i],
        chartData.datasets[1].data[i],
        chartData.datasets[2].data[i],
        chartData.datasets[3].data[i],
        chartData.datasets[4].data[i]
      ])
    ];
  
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'IoT Data');
    XLSX.write(wb, 'iot_flood_monitoring.xlsx');
  }