import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './RevenueManagement.css'; // Import CSS file
import { Bar } from 'react-chartjs-2'; // Import Bar chart component
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import Chart.js components

// Import date-fns functions from the main library, excluding locale
import { format, endOfDay, endOfMonth, eachHourOfInterval, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import vi from 'date-fns/locale/vi';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueManagement = () => {
    const [revenueData, setRevenueData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('month'); // Default period
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRevenue = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login-page');
                return;
            }

            try {
                // Fetch revenue data for the selected period
                const response = await fetch(`/api/orders/revenue?period=${selectedPeriod}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        navigate('/login-page');
                    }
                    throw new Error(`Error fetching revenue: ${response.statusText}`);
                }

                const data = await response.json();
                setRevenueData(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching revenue:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRevenue();
    }, [selectedPeriod, navigate]); // Re-fetch when selectedPeriod or navigate changes

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    // Process fetched data and prepare chart data
    const processedChartData = useMemo(() => {
        if (!revenueData) return { labels: [], data: [] };

        const { period, startDate, endDate } = revenueData;
        const start = new Date(startDate);
        const end = new Date(endDate);

        let timeIntervals = [];
        let labelFormat = '';
        let tooltipFormat = '';

        switch (period) {
            case 'day':
                timeIntervals = eachHourOfInterval({ start, end: endOfDay(end) });
                labelFormat = 'HH:00';
                tooltipFormat = 'HH:00 - dd/MM';
                break;
            case 'week':
                 // Ensure end of interval is inclusive of the last day
                timeIntervals = eachDayOfInterval({ start, end: endOfDay(end) });
                labelFormat = 'dd/MM';
                tooltipFormat = 'dd/MM/yyyy';
                break;
            case 'month':
                 // Ensure end of interval is inclusive of the last day
                timeIntervals = eachDayOfInterval({ start, end: endOfDay(end) });
                labelFormat = 'dd/MM';
                tooltipFormat = 'dd/MM/yyyy';
                break;
            case 'quarter':
                 // Ensure end of interval is inclusive of the last month
                timeIntervals = eachMonthOfInterval({ start, end: endOfMonth(end) });
                labelFormat = 'MM/yyyy';
                 tooltipFormat = 'MM/yyyy';
                break;
            case 'year':
                 // Ensure end of interval is inclusive of the last month
                timeIntervals = eachMonthOfInterval({ start, end: endOfMonth(end) });
                labelFormat = 'MM/yyyy';
                 tooltipFormat = 'MM/yyyy';
                break;
             case 'last3months':
                 timeIntervals = eachMonthOfInterval({ start, end: endOfMonth(end) });
                 labelFormat = 'MM/yyyy';
                 tooltipFormat = 'MM/yyyy';
                 break;
             case 'lastyear':
                 timeIntervals = eachMonthOfInterval({ start, end: endOfMonth(end) });
                 labelFormat = 'MM/yyyy';
                 tooltipFormat = 'MM/yyyy';
                 break;
            default:
                 timeIntervals = eachDayOfInterval({ start, end: endOfDay(end) });
                 labelFormat = 'dd/MM';
                 tooltipFormat = 'dd/MM/yyyy';
        }

        // Create a map for quick lookup of revenue by the aggregated date string (matching backend's group format)
         const revenueMap = new Map();
         revenueData.aggregatedData.forEach(item => {
             // Use the backend's aggregated _id string directly as the key
             revenueMap.set(item._id, item.dailyRevenue);
         });


        // Generate labels and data for the chart
        const labels = timeIntervals.map(date => format(date, labelFormat, { locale: vi })); // Format labels with locale
        const data = timeIntervals.map(date => {
             // Format the date to match the backend aggregation's _id format to lookup in the map
             let keyFormat = '';
              switch (period) {
                 case 'day':
                     keyFormat = 'yyyy-MM-dd\'T\'HH:00:00.000\'Z\'';
                     break;
                 case 'week':
                 case 'month':
                     keyFormat = 'yyyy-MM-dd\'T\'00:00:00.000\'Z\'';
                     break;
                 case 'quarter':
                 case 'year':
                 case 'last3months':
                 case 'lastyear':
                     keyFormat = 'yyyy-MM-01\'T\'00:00:00.000\'Z\'';
                     break;
                 default:
                     keyFormat = 'yyyy-MM-dd\'T\'00:00:00.000\'Z\'';
             }
            try {
                 // Format the date using date-fns and the determined keyFormat
                 const formattedKey = format(date, keyFormat);
                 return revenueMap.get(formattedKey) || 0;
            } catch (e) {
                 console.error('Error formatting date for revenue data lookup:', e, date, keyFormat);
                 return 0;
            }

        });

        // Calculate total revenue from the data array for consistent display
        const totalRevenue = data.reduce((sum, current) => sum + current, 0);

        return { labels, data, tooltipFormat, totalRevenue };

    }, [revenueData]); // Remove selectedPeriod from dependencies as it's not used in the calculation

    // Prepare data for the chart using processed data
    const chartData = {
        labels: processedChartData.labels,
        datasets: [
            {
                label: 'Doanh thu',
                data: processedChartData.data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Doanh thu ${selectedPeriod === 'day' ? 'Hôm nay' : `Theo ${selectedPeriod}`}`,
            },
             tooltip: {
                 callbacks: {
                     title: function(context) {
                         // Use the tooltipFormat determined in processedChartData
                         // Use the label directly as it's already formatted for display
                         return context[0].label;
                     },
                      label: function(context) {
                          let label = context.dataset.label || '';
                          if (label) {
                              label += ': ';
                          }
                          if (context.raw !== null) {
                              label += context.raw.toLocaleString('vi-VN') + ' VNĐ';
                          }
                          return label;
                      }
                 }
             }
        },
         scales: {
             x: {
                 title: {
                     display: true,
                     text: selectedPeriod === 'day' ? 'Giờ' : 'Ngày/Tháng'
                 },
                  // Ensure all labels are displayed
                  ticks: {
                     autoSkip: false,
                     maxRotation: 45,
                     minRotation: 0
                  }
             },
             y: {
                 title: {
                     display: true,
                     text: 'Doanh thu (VNĐ)'
                 },
                 beginAtZero: true,
                  ticks: {
                      callback: function(value) {
                          return value.toLocaleString('vi-VN') + ' VNĐ';
                      }
                  }
             }
         }
    };

    if (loading) {
        return <div>Đang tải doanh thu...</div>;
    }

    if (error) {
        return <div>Lỗi khi tải doanh thu: {error}</div>;
    }

    return (
        <div className="revenue-management-container">
            <h2>Quản lý doanh thu</h2>

            <div>
                <label htmlFor="period-select">Chọn thời gian:</label>
                <select id="period-select" value={selectedPeriod} onChange={handlePeriodChange}>
                    {/* <option value="day">Theo ngày</option>
                    <option value="week">Theo tuần</option> */}
                    <option value="month">Theo tháng</option>
                    <option value="quarter">Theo quý</option>
                    <option value="year">Theo năm</option>
                    {/* Add more options if needed, e.g., 'last3months', 'lastyear' */}
                </select>
            </div>

            {revenueData && (
                <div className="revenue-summary">
                    <h3>Tổng doanh thu ({selectedPeriod === 'day' ? 'Hôm nay' : `Theo ${selectedPeriod}`}):</h3>
                    <p>{processedChartData.totalRevenue?.toLocaleString('vi-VN') || '0'} VNĐ</p>
                    
                    <div className="chart-container">
                         {/* Check if there's data to display before rendering chart */}
                         {processedChartData.labels.length > 0 ? (
                             <Bar data={chartData} options={chartOptions} />
                         ) : (
                             <p>Không có dữ liệu doanh thu cho khoảng thời gian này.</p>
                         )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevenueManagement;
