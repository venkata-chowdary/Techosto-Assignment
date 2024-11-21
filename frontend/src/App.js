import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Importing axios
import { Row, Col } from 'antd';
import ProfileCard from './Components/ProfileCard';
import Loader from './Components/Loader';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios
      .get('https://techosto-task-3.onrender.com/api/get-user-details/')
      .then((response) => {
        setUsers(response.data);
        setLoading(false)
      })
      .catch((err) => console.error('Error fetching user details:', err));
  }, []);

  return (
    <div>
      {loading ? <Loader /> :
        <Row >
          {users.map((user) => (
            <Col key={user._id} xs={24} sm={12} lg={6}>
              <ProfileCard user={user} setUsers={setUsers} />
            </Col>
          ))}
        </Row>}

    </div>
  );
}

export default App;
