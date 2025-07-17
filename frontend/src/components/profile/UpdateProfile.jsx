import React, { useState } from 'react';
import axios from 'axios';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    profession: '',
    bio: '',
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const profileData = new FormData();
      for (const key in formData) {
        profileData.append(key, formData[key]);
      }
      if (photo) {
        profileData.append('photo', photo);
      }

      const res = await axios.put('http://localhost:5000/api/user/update-profile', profileData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setMessage(res.data.message || 'Profile updated!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded" />
        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input type="text" name="profession" placeholder="Profession" value={formData.profession} onChange={handleChange} className="w-full p-2 border rounded" />
        <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange} className="w-full p-2 border rounded" />

        <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full" />
        {preview && <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-full" />}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default UpdateProfile;
