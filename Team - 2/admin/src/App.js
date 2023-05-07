import React, { useState, useEffect } from 'react';
import 'firebase/database';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCxWXomtdjwm8r05a8oshauzqk-AONHN7Q",
  authDomain: "sur veysparrowtechnocrats.firebaseapp.com",
  databaseURL: "https://surveysparrowtechnocrats-default-rtdb.firebaseio.com",
  projectId: "surveysparrowtechnocrats",
  storageBucket: "surveysparrowtechnocrats.appspot.com",
  messagingSenderId: "416179622480",
  appId: "1:416179622480:web:5bd7b381355641e6c67755",
  measurementId: "G-X8EMJP5EMN"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const Admin = () => {
  const [themes, setThemes] = useState([]);
  const [newTheme, setNewTheme] = useState('');
  const [deleteTheme, setDeleteTheme] = useState('');

  // Fetch themes from Firebase on component mount
  useEffect(() => {
    const themesRef = database.ref('themes');
    themesRef.on('value', snapshot => {
      const themesData = snapshot.val();
      if (themesData) {
        const themesArray = Object.values(themesData);
        setThemes(themesArray);
      }
    });
    themesRef.on('child_removed', snapshot => {
      const removedTheme = snapshot.val();
      setThemes(themes => themes.filter(theme => theme.name !== removedTheme.name));
    });
  }, []);
  

  const handleAddTheme = () => {
    const newThemeData = {
      name: newTheme,
      created_at: new Date().toISOString(),
    };
    const themesRef = database.ref('themes');
    themesRef.push(newThemeData);
    setNewTheme('');
  };

  const handleDeleteTheme = () => {
    const themesRef = database.ref('themes');
    themesRef.orderByChild('name').equalTo(deleteTheme).once('value', snapshot => {
      snapshot.forEach(childSnapshot => {
        const key = childSnapshot.key;
        database.ref('themes/' + key).remove();
        database.ref('links/').orderByChild('theme_name').equalTo(deleteTheme).once('value', snapshot => {
          snapshot.forEach(childSnapshot => {
            const key = childSnapshot.key;
            database.ref('links/' + key).remove();
          });
        });
      });
    });
    setDeleteTheme('');
  };
  

  const generateLink = theme => {
    const link = `https://surveysparrowtechnocrats.web.app/form?theme=${theme.name}&created_at=${theme.created_at}`;
    
    // Check if the link is already generated
    const linksRef = database.ref('themes');
    linksRef.orderByChild('theme_name').equalTo(theme.name).once('value', snapshot => {
      const linksData = snapshot.val();
      if (linksData) {
        const linkKeys = Object.keys(linksData);
        const linkAlreadyGenerated = linkKeys.some(linkKey => {
          const linkData = linksData[linkKey];
          return linkData.link === link;
        });
        if (linkAlreadyGenerated) {
          // Link already generated, no need to generate again
          return;
        }
      }
  
      // Link not generated, generate and store in Firebase
      const newLinkData = {
        theme_name: theme.name,
        link: link,
        created_at: new Date().toISOString(),
      };
      const linksRef = database.ref('links');
      linksRef.push(newLinkData);
  
      // Copy link to clipboard
      navigator.clipboard.writeText(link).then(() => {
        console.log('Link copied to clipboard:', link);
      }, error => {
        console.error('Error copying link to clipboard:', error);
      });
    });
  };
  

  return (
    <div>
      <h1>Survey Sparrow<br/><br/></h1>
      <div className="add-theme-row">
        <input 
          type="text"
          placeholder="Add a new goal"
          value={newTheme}
          onChange={e => setNewTheme(e.target.value)}
        />
        <button onClick={handleAddTheme}>Add Goal</button>
      </div>
      <div className="delete-theme-row">
        <input
          type="text"
          placeholder="Enter the goal to delete"
          value={deleteTheme}
          onChange={e => setDeleteTheme(e.target.value)}
        />
        <button onClick={handleDeleteTheme}>Delete Goal</button>
      </div>
      <br/><br/>
      <div className="card-container">
        {themes.map(theme => (
          <div key={theme.name} className="card">
            <h2>{theme.name}</h2>
            <button onClick={() => generateLink(theme)}>Copy Link</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
