import React, { useState } from 'react';
import axios from 'axios';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    profession: '',
    bio: '',
    education: '',
    keySkills: '',
    location: '',
    interests: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: '',
      facebook: '',
      instagram: '',
      youtube: ''
    },
    contact: {
      email: '',
      phone: ''
    },
    photo: null
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('socialLinks.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value }
      }));
    } else if (name.includes('contact.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: { ...prev.contact, [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, photo: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'object' && key !== 'photo') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          data.append(`${key}.${subKey}`, subValue);
        });
      } else {
        data.append(key, value);
      }
    });

    if (formData.photo) data.append('photo', formData.photo);

    try {
      await axios.post('/api/profile/update', data); // Replace with your endpoint
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Update Your Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Personal Details */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Personal Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="input" />
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="input" />
            <select name="gender" value={formData.gender} onChange={handleChange} className="input">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input type="text" name="profession" placeholder="Profession" value={formData.profession} onChange={handleChange} className="input" />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="input" />
            <textarea name="bio" placeholder="Short Bio" value={formData.bio} onChange={handleChange} className="input h-24" />
          </div>
        </div>

        {/* Education & Skills */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Background</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="education" placeholder="Education" value={formData.education} onChange={handleChange} className="input" />
            <input type="text" name="keySkills" placeholder="Key Skills (comma separated)" value={formData.keySkills} onChange={handleChange} className="input" />
            <input type="text" name="interests" placeholder="Interests" value={formData.interests} onChange={handleChange} className="input" />
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="email" name="contact.email" placeholder="Email" value={formData.contact.email} onChange={handleChange} className="input" />
            <input type="tel" name="contact.phone" placeholder="Phone" value={formData.contact.phone} onChange={handleChange} className="input" />
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["linkedin", "github", "twitter", "website", "facebook", "instagram", "youtube"].map((platform) => (
              <input
                key={platform}
                type="text"
                name={`socialLinks.${platform}`}
                placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                value={formData.socialLinks[platform]}
                onChange={handleChange}
                className="input"
              />
            ))}
          </div>
        </div>

        {/* Profile Picture */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Profile Photo</h3>
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="block mb-2" />
          {preview && <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-full border" />}
        </div>

        {/* Submit */}
        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition duration-200">
            Update Profile
          </button>
        </div>

        {message && <p className="text-center text-green-600 mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default UpdateProfile;
