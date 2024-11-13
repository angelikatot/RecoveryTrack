// DataFetching hakee käyttäjän History-n data Firebase-tietokannasta.
// Custom hook (useHistoryData) on luotu, jotta datan hakulogiikka on erillään käyttöliittymästä 
// DataFetching fetches the user's "History" data from the Firebase database.
// A custom hook (useHistoryData) is created to separate data-fetching logic from the UI

import { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import app from '../services/firebaseConfig';

export const useHistoryData = () => {
    const [history, setHistory] = useState([]); // For storing fetched data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error handling

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
                                return !isNaN(parsed) ? parsed : 0;
                            };

                            const vitals = value.vitals || {};
                            const symptoms = value.symptoms || {};

                            return {
                                id: key,
                                date: value.date || new Date().toISOString(),
                                vitals: {
                                    temperature: parseNumericValue(vitals.temperature),
                                    bloodPressure: vitals.bloodPressure || '120/80',
                                    heartRate: parseNumericValue(vitals.heartRate),
                                    oxygenSaturation: parseNumericValue(vitals.oxygenSaturation),
                                    weight: parseNumericValue(vitals.weight),
                                    woundHealing: vitals.woundHealing || ''
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
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchData();
    }, []);

    // New function to retrieve vitals by date
    const getVitalsByDate = (selectedDate) => {
        // Extract the date part (YYYY-MM-DD) from the Firestore timestamp
        const formattedSelectedDate = selectedDate.split('T')[0]; // e.g., '2024-11-11'

        // Find the record that matches the selected date
        const record = history.find(item => item.date.split('T')[0] === formattedSelectedDate);

        return record || null;
    };


    return {
        history,
        loading,
        error,
        getVitalsByDate, // Return this function as part of the hook
        getValidChartData: () => history.filter(item =>
            Object.values(item.vitals).some(val =>
                typeof val === 'number' && !isNaN(val)
            )
        )
    };
};


// Links for additional Firebase resources and references



//https://stackoverflow.com/questions/70195149/react-custom-hook-to-set-user-with-firebase
//https://firebase.google.com/docs/database/admin/retrieve-data
