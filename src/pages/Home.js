import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState([false]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setUsers(list);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);
  return (
    <div className='bg-orange-300 h-full w-full'>
      <container>
        <div className='flex gap-96 grid-col-2 p-5 '>
          {users &&
            users.map((item) => (
              <div key={item.id}>
                <section>
                  <container>
                    <img
                      src={item.img}
                      sizes='medium'
                      alt='profile img'
                      style={{
                        height: '150px',
                        width: '150px',
                        borderRadius: '50%',
                      }}
                    />
                    <h2>{item.name}</h2>
                    <p>{item.mail}</p>
                  </container>
                  <div className='flex gap-24'>
                    <button onClick={() => navigate(`/update/${item.id}`)}>
                      Update
                    </button>
                    <button>view</button>
                  </div>
                </section>
              </div>
            ))}
        </div>
      </container>
    </div>
  );
};

export default Home;
