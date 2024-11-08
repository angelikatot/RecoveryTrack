// DataFetching.js
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
                    const historyArray = Object.entries(data).map(([key, value]) => ({
                        id: key,
                        ...value,
                    }))
                        .sort((a, b) => new Date(b.date) - new Date(a.date));

                    setHistory(historyArray);
                } else {
                    setHistory([]);
                    setError('No vitals data available.');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { history, loading, error };
};
