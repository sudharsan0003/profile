import React, { useState, useEffect } from 'react';
import { storage, db } from '../firebase';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  CollectionReference,
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';

const initialState = {
  name: '',
  mail: '',
  city: '',
  contact: '',
};

const AddEdit = () => {
  const [data, setData] = useState(initialState);
  const { name, mail, city, contact } = data;
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    id && getSingleUser();
  }, [id]);

  const getSingleUser = async () => {
    const docRef = doc(db, 'users', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setData({ ...snapshot.data() });
    }
  };

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case 'paused':
              console.log('upload is pause ');
              break;
            case 'running':
              console.log('upload is running ');
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let error = {};
    if (!name) {
      error.name = 'kjh';
    }
    if (!mail) {
      error.mail = '***khb';
    }
    if (!city) {
      error.city = '********';
    }
    if (!contact) {
      error.contact = '********';
    }

    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = validate();
    if (Object.keys(error).length) return setError(error);
    setIsSubmit(true);
    if (!id) {
      try {
        await addDoc(collection(db, 'users'), {
          ...data,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await updateDoc(doc(db, 'users', id), {
          ...data,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    }
    navigate('/');
  };

  return (
    <div style={{ backgroundColor: 'beige' }}>
      <div className='form'>
        <h2>{id ? 'update User' : 'Add User'}</h2>
        <form className='form'>
          <input
            type='text'
            placeholder='name'
            name='name'
            error={error.name ? { content: error.name } : null}
            value={name}
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='email'
            name='mail'
            error={error.mail ? { content: error.mail } : null}
            value={mail}
            onChange={handleChange}
          />
          <input
            type='text'
            placeholder='city'
            error={error.city ? { content: error.city } : null}
            value={city}
            name='city'
            onChange={handleChange}
          />
          <input
            type='number'
            name='contact'
            placeholder='contact no'
            error={error.contact ? { content: error.contact } : null}
            value={contact}
            onChange={handleChange}
          />
          <input type='file' onChange={(e) => setFile(e.target.files[0])} />
          <button type='submit' onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEdit;
