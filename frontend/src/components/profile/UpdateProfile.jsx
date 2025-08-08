import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    basic_info: {
      name: '',
      age: '',
      gender: '',
      profession: '',
      bio: '',
      location: ''
    },
    professional: {
      education: '',
      keySkills: '',
      interests: ''
    },
    contact: {
      email: '',
      phone: ''
    },
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: '',
      facebook: '',
      instagram: '',
      youtube: ''
    },
    photo: null
  });



  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('basic'); // For tab navigation

  // Inside the component
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/update/profile/details', {
          withCredentials: true
        });

        const data = res.data;

        // Set form data based on response structure
        setFormData({
          basic_info: {
            name: data?.basic_info?.username || '',
            age: data?.basic_info?.age || '',
            gender: data?.basic_info?.gender || '',
            profession: data?.basic_info?.profession || '',
            bio: data?.basic_info?.bio || '',
            location: data?.basic_info?.location || ''
          },
          professional: {
            education: data?.professional?.education || '',
            keySkills: data?.professional?.keySkills || '',
            interests: data?.professional?.interests || ''
          },
          contact: {
            email: data?.contact?.email || '',
            phone: data?.contact?.phone || ''
          },
          socialLinks: {
            linkedin: data?.socialLinks?.linkedin || '',
            github: data?.socialLinks?.github || '',
            twitter: data?.socialLinks?.twitter || '',
            website: data?.socialLinks?.website || '',
            facebook: data?.socialLinks?.facebook || '',
            instagram: data?.socialLinks?.instagram || '',
            youtube: data?.socialLinks?.youtube || ''
          },
          photo: null
        });

        if (data?.basic_info?.photo) {
          setPreview(`http://localhost:5000/uploads/${data.basic_info.photo}`);
        }

      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    const keys = name.split(".");
    if (keys.length === 2) {
      const [parentKey, childKey] = keys;
      setFormData((prevData) => ({
        ...prevData,
        [parentKey]: {
          ...prevData[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };


  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Basic Info
      for (const key in formData.basic_info) {
        formDataToSend.append(key, formData.basic_info[key]);
      }

      // Professional
      for (const key in formData.professional) {
        formDataToSend.append(key, formData.professional[key]);
      }

      // Contact & Social Links (as JSON)
      formDataToSend.append('contact', JSON.stringify(formData.contact));
      formDataToSend.append('socialLinks', JSON.stringify(formData.socialLinks));

      // Photo
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      const response = await axios.post('http://localhost:5000/api/update/profile/update', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage('Error updating profile. Please try again.');
    }
  };


  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32 mb-4">
          {preview ? (
            <img src={preview} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-white shadow" />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No photo</span>
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
          <input
            type="text"
            name="basic_info.name"
            value={formData.basic_info.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input
            type="number"
            name="basic_info.age"
            value={formData.basic_info.age}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="basic_info.gender"
            value={formData.basic_info.gender}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profession*</label>
          <input
            type="text"
            name="basic_info.profession"
            value={formData.basic_info.profession}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            name="basic_info.bio"
            value={formData.basic_info.bio}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="basic_info.location"
            value={formData.basic_info.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
            placeholder="City, Country"
          />
        </div>
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
          <input
            type="text"
            name="professional.education"
            value={formData.professional.education}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
            placeholder="Degrees, institutions, etc."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills</label>
          <input
            type="text"
            name="professional.keySkills"
            value={formData.professional.keySkills}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
            placeholder="Separate skills with commas"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
          <input
            type="text"
            name="professional.interests"
            value={formData.professional.interests}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
            placeholder="Your hobbies and interests"
          />
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
          <input
            type="email"
            name="contact.email"
            value={formData.contact.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="contact.phone"
            value={formData.contact.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
          />
        </div>
      </div>
    </div>
  );

  const renderSocialInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              linkedin.com/in/
            </span>
            <input
              type="text"
              name="socialLinks.linkedin"
              value={formData.socialLinks.linkedin}
              onChange={handleChange}
              className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
              placeholder="username"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              github.com/
            </span>
            <input
              type="text"
              name="socialLinks.github"
              value={formData.socialLinks.github}
              onChange={handleChange}
              className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
              placeholder="username"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              twitter.com/
            </span>
            <input
              type="text"
              name="socialLinks.twitter"
              value={formData.socialLinks.twitter}
              onChange={handleChange}
              className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
              placeholder="username"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website</label>
          <input
            type="url"
            name="socialLinks.website"
            value={formData.socialLinks.website}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              facebook.com/
            </span>
            <input
              type="text"
              name="socialLinks.facebook"
              value={formData.socialLinks.facebook}
              onChange={handleChange}
              className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
              placeholder="username"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              instagram.com/
            </span>
            <input
              type="text"
              name="socialLinks.instagram"
              value={formData.socialLinks.instagram}
              onChange={handleChange}
              className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
              placeholder="username"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              youtube.com/
            </span>
            <input
              type="text"
              name="socialLinks.youtube"
              value={formData.socialLinks.youtube}
              onChange={handleChange}
              className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
              placeholder="channel"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Update Your Profile</h2>
          <p className="text-gray-600">Complete your profile to help others know more about you</p>
        </div>

        <div className="p-6">
          <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveSection('basic')}
              className={`px-4 py-2 font-medium text-sm ${activeSection === 'basic' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveSection('professional')}
              className={`px-4 py-2 font-medium text-sm ${activeSection === 'professional' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Professional
            </button>
            <button
              onClick={() => setActiveSection('contact')}
              className={`px-4 py-2 font-medium text-sm ${activeSection === 'contact' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Contact
            </button>
            <button
              onClick={() => setActiveSection('social')}
              className={`px-4 py-2 font-medium text-sm ${activeSection === 'social' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Social Links
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {activeSection === 'basic' && renderBasicInfo()}
            {activeSection === 'professional' && renderProfessionalInfo()}
            {activeSection === 'contact' && renderContactInfo()}
            {activeSection === 'social' && renderSocialInfo()}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;