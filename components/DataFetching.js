import { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import app from '../services/firebaseConfig';

export const useHistoryData = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const calculateMedian = (numbers) => {
        if (!numbers || numbers.length === 0) return null;
        const sorted = numbers.filter(n => n !== null && !isNaN(n)).sort((a, b) => a - b);
        if (sorted.length === 0) return null;
        const middle = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2;
        }
        return sorted[middle];
    };

    const processDataForLastSevenDays = (rawData) => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));

        // Group all records by date
        const groupedByDate = rawData.reduce((acc, record) => {
            const dateKey = new Date(record.date).toISOString().split('T')[0];
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(record);
            return acc;
        }, {});

        // Calculate daily medians for each vital
        const dailyMedians = Object.entries(groupedByDate)
            .map(([date, records]) => {
                const vitalsMedians = {
                    temperature: calculateMedian(records.map(r => r.vitals.temperature)),
                    systolic: calculateMedian(records.map(r => r.vitals.systolic)),
                    diastolic: calculateMedian(records.map(r => r.vitals.diastolic)),
                    heartRate: calculateMedian(records.map(r => r.vitals.heartRate)),
                    oxygenSaturation: calculateMedian(records.map(r => r.vitals.oxygenSaturation)),
                    weight: calculateMedian(records.map(r => r.vitals.weight))
                };

                return {
                    date,
                    vitals: vitalsMedians,
                    records: records.map(r => ({
                        ...r,
                        formattedTime: new Date(r.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    }))
                };
            })
            .filter(day => new Date(day.date) >= sevenDaysAgo)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-7);

        return dailyMedians;
    };

    // New function to get vitals by date
    const getVitalsByDate = (dateString) => {
        const dayData = history.find(day => day.date === dateString);
        if (dayData) {
            return dayData.records;
        }
        return null;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    setError('User not authenticated.');
                    setLoading(false);
                    return;
                }

                const database = getDatabase(app);
                const userRecordsRef = ref(database, `dailyRecords/${user.uid}`);
                const snapshot = await get(userRecordsRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const historyArray = Object.entries(data)
                        .map(([key, value]) => ({
                            id: key,
                            date: value.date || new Date().toISOString(),
                            vitals: {
                                temperature: parseFloat(value.vitals?.temperature) || null,
                                systolic: parseFloat(value.vitals?.systolic) || null,
                                diastolic: parseFloat(value.vitals?.diastolic) || null,
                                heartRate: parseFloat(value.vitals?.heartRate) || null,
                                oxygenSaturation: parseFloat(value.vitals?.oxygenSaturation) || null,
                                weight: parseFloat(value.vitals?.weight) || null,
                            },
                            symptoms: value.symptoms || {}
                        }))
                        .filter(item => !isNaN(new Date(item.date).getTime()));

                    const processedData = processDataForLastSevenDays(historyArray);
                    setHistory(processedData);
                } else {
                    setHistory([]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getAuth().currentUser]);

    return { history, loading, error, getVitalsByDate };
};