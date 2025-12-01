// Simulate machine data
const machines = [
    { id: 1, name: 'Machine 1', temperature: 70, vibration: 0.5, speed: 1500 },
    { id: 2, name: 'Machine 2', temperature: 75, vibration: 0.3, speed: 1600 },
    { id: 3, name: 'Machine 3', temperature: 80, vibration: 0.4, speed: 1400 }
];

const charts = {};
const maxDataPoints = 20;
const thresholds = { temperature: 80, vibration: 0.6, speed: 1800 };

// Initialize charts
function initCharts() {
    machines.forEach(machine => {
        const ctx = document.getElementById(`chart${machine.id}`).getContext('2d');
        charts[machine.id] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: [],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        yAxisID: 'y'
                    },
                    {
                        label: 'Vibration (mm/s)',
                        data: [],
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Speed (RPM)',
                        data: [],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        yAxisID: 'y2'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Vibration (mm/s)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                    y2: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Speed (RPM)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    });
}

// Simulate data update
function updateData() {
    machines.forEach(machine => {
        // Simulate slight variations
        machine.temperature += (Math.random() - 0.5) * 5;
        machine.vibration += (Math.random() - 0.5) * 0.1;
        machine.speed += (Math.random() - 0.5) * 100;

        // Keep within reasonable ranges
        machine.temperature = Math.max(50, Math.min(100, machine.temperature));
        machine.vibration = Math.max(0, Math.min(1, machine.vibration));
        machine.speed = Math.max(1000, Math.min(2000, machine.speed));

        const chart = charts[machine.id];
        const now = new Date().toLocaleTimeString();

        // Add new data point
        chart.data.labels.push(now);
        chart.data.datasets[0].data.push(machine.temperature.toFixed(1));
        chart.data.datasets[1].data.push(machine.vibration.toFixed(2));
        chart.data.datasets[2].data.push(Math.round(machine.speed));

        // Remove old data points if exceeding max
        if (chart.data.labels.length > maxDataPoints) {
            chart.data.labels.shift();
            chart.data.datasets.forEach(dataset => dataset.data.shift());
        }

        chart.update();
    });

    checkAlerts();
}

// Check for alerts
function checkAlerts() {
    const alertsDiv = document.getElementById('alerts');
    alertsDiv.innerHTML = '';

    machines.forEach(machine => {
        if (machine.temperature > thresholds.temperature) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert';
            alertDiv.textContent = `Alert: ${machine.name} temperature (${machine.temperature.toFixed(1)}°C) exceeds threshold (${thresholds.temperature}°C)! Predictive maintenance required.`;
            alertsDiv.appendChild(alertDiv);
        }
        if (machine.vibration > thresholds.vibration) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert';
            alertDiv.textContent = `Alert: ${machine.name} vibration (${machine.vibration.toFixed(2)} mm/s) exceeds threshold (${thresholds.vibration} mm/s)! Predictive maintenance required.`;
            alertsDiv.appendChild(alertDiv);
        }
        if (machine.speed > thresholds.speed) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert';
            alertDiv.textContent = `Alert: ${machine.name} speed (${Math.round(machine.speed)} RPM) exceeds threshold (${thresholds.speed} RPM)! Predictive maintenance required.`;
            alertsDiv.appendChild(alertDiv);
        }
    });
}

// Initialize and start updates
initCharts();
setInterval(updateData, 2000); // Update every 2 seconds
