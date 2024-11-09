// DataFetching hakee käyttäjän History-n data Firebase-tietokannasta.
// Custom hook (useHistoryData) on luotu, jotta datan hakulogiikka on erillään käyttöliittymästä 

import { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import app from '../services/firebaseConfig';

export const useHistoryData = () => {
    const [history, setHistory] = useState([]); // datan talletusta varten
    const [loading, setLoading] = useState(true); //loading tila
    const [error, setError] = useState(null); //virheen käsittely

    useEffect(() => {
        const fetchData = async () => {
            try {
                //tarkistetaan käyttäjää authentication avulla
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    setError('User not authenticated.');
                    setLoading(false);
                    return;
                }
                //yhtistys tietokantaan ja datan haku
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
                setLoading(false); //lopetetaan loading
            }
        };

        fetchData();
    }, []);

    return { history, loading, error };
};


//https://stackoverflow.com/questions/70195149/react-custom-hook-to-set-user-with-firebase
//https://firebase.google.com/docs/database/admin/retrieve-data