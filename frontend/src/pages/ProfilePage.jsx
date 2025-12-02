import { useState } from 'react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "Student Name",
    grade: "10th",
    school: "Indian Public School"
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>My Profile</h2>
      <div style={{ border: '1px solid #ccc', padding: '20px' }}>
        {isEditing ? (
          <>
            <label>Name: <input name="name" value={user.name} onChange={handleChange} /></label><br/><br/>
            <label>Grade: <input name="grade" value={user.grade} onChange={handleChange} /></label><br/><br/>
            <button onClick={() => setIsEditing(false)}>Save</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Grade:</strong> {user.grade}</p>
            <p><strong>School:</strong> {user.school}</p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};
export default ProfilePage;