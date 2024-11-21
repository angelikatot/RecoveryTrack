import { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import app from '../services/firebaseConfig';

export const useHistoryData = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                        .map(([key, value]) => {
                            const parseNumericValue = (val) => {
                                const parsed = parseFloat(val);
                                return !isNaN(parsed) ? parsed : null;
                            };

                            const vitals = value.vitals || {};
                            const symptoms = value.symptoms || {};

                            return {
                                id: key,
                                date: value.date || new Date().toISOString(),
                                vitals: {
                                    temperature: parseNumericValue(vitals.temperature),
                                    systolic: parseNumericValue(vitals.systolic),
                                    diastolic: parseNumericValue(vitals.diastolic),
                                    heartRate: parseNumericValue(vitals.heartRate),
                                    oxygenSaturation: parseNumericValue(vitals.oxygenSaturation),
                                    weight: parseNumericValue(vitals.weight),
                                    woundHealing: vitals.woundHealing || '',
                                    woundImage: vitals.woundImage || null
                                },
                                symptoms: {
                                    pain: parseNumericValue(symptoms.pain),
                                    fatigue: parseNumericValue(symptoms.fatigue),
                                    mood: parseNumericValue(symptoms.mood)
                                }
                            };
                        })
                        .filter(item => !isNaN(new Date(item.date).getTime()))
                        .sort((a, b) => new Date(b.date) - new Date(a.date));

                    setHistory(historyArray);
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

    const getVitalsByDate = (selectedDate) => {
        // Ensure selectedDate is in the correct format
        const formattedSelectedDate = typeof selectedDate === 'string'
            ? selectedDate.split('T')[0]
            : selectedDate;

        // Filter records for the selected date
        const recordsForDate = history.filter(item =>
            item.date.split('T')[0] === formattedSelectedDate
        );

        // Return all records for the date
        return recordsForDate.length > 0 ? recordsForDate : null;
    };

    return {
        history,
        loading,
        error,
        getVitalsByDate,
        getValidChartData: () => history.filter(item =>
            Object.values(item.vitals).some(val =>
                typeof val === 'number' && !isNaN(val)
            )
        )
    };
};