import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiBook,
  FiAward,
  FiHeart,
  FiMail,
  FiPhone,
  FiLinkedin,
  FiGithub,
  FiTwitter,
  FiGlobe,
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiCamera,
  FiSave,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiCalendar,
  FiUsers,
  FiGlobe as FiWeb
} from 'react-icons/fi';

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
  const [activeSection, setActiveSection] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/update/profile/details', {
          withCredentials: true
        });

        const data = res.data;

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
        setMessage('Failed to load profile data');
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
    setIsSubmitting(true);

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

      // Contact & Social Links
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

      setMessage('success:Profile updated successfully!');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error(error);
      setMessage('error:Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiUser },
    { id: 'professional', label: 'Professional', icon: FiBriefcase },
    { id: 'contact', label: 'Contact', icon: FiMail },
    { id: 'social', label: 'Social Links', icon: FiUsers }
  ];

  const socialPlatforms = [
    { key: 'linkedin', label: 'LinkedIn', icon: FiLinkedin, prefix: 'linkedin.com/in/', color: 'text-[#0A66C2]' },
    { key: 'github', label: 'GitHub', icon: FiGithub, prefix: 'github.com/', color: 'text-gray-800 dark:text-gray-200' },
    { key: 'twitter', label: 'Twitter', icon: FiTwitter, prefix: 'twitter.com/', color: 'text-[#1DA1F2]' },
    { key: 'website', label: 'Website', icon: FiWeb, color: 'text-brand-primary' },
    { key: 'facebook', label: 'Facebook', icon: FiFacebook, prefix: 'facebook.com/', color: 'text-[#1877F2]' },
    { key: 'instagram', label: 'Instagram', icon: FiInstagram, prefix: 'instagram.com/', color: 'text-[#E4405F]' },
    { key: 'youtube', label: 'YouTube', icon: FiYoutube, prefix: 'youtube.com/', color: 'text-[#FF0000]' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text dark:text-brandDark-text mb-3">
            Update Your Profile
          </h1>
          <p className="text-lg text-brand-muted dark:text-brandDark-muted max-w-2xl mx-auto">
            Complete your profile to showcase your skills, experience, and personality
          </p>
        </div>

        <div className="bg-brand-surface dark:bg-brandDark-surface rounded-2xl shadow-soft overflow-hidden border border-brand-border dark:border-brandDark-border transition-colors duration-300">
          {/* Tabs Navigation */}
          <div className="border-b border-brand-border dark:border-brandDark-border px-6">
            <div className="flex overflow-x-auto space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center px-5 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 border-b-2 ${
                      activeSection === tab.id
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-brand-muted dark:text-brandDark-muted hover:text-brand-text dark:hover:text-brandDark-text'
                    }`}
                  >
                    <Icon className="mr-2.5 text-lg" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Success/Error Message */}
            {message && (
              <div className={`mb-8 rounded-xl p-5 border ${
                message.startsWith('success:') 
                  ? 'bg-state-success/10 border-state-success/30 text-state-success' 
                  : 'bg-state-error/10 border-state-error/30 text-state-error'
              }`}>
                <div className="flex items-center">
                  {message.startsWith('success:') ? (
                    <FiCheck className="mr-3 text-xl" />
                  ) : (
                    <FiAlertCircle className="mr-3 text-xl" />
                  )}
                  <span className="font-medium">
                    {message.split(':')[1]}
                  </span>
                </div>
              </div>
            )}

            {/* Basic Info Section */}
            {activeSection === 'basic' && (
              <div className="space-y-8">
                {/* Profile Photo */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative mb-6">
                    <div className="w-36 h-36 rounded-2xl border-4 border-brand-surface dark:border-brandDark-surface shadow-soft overflow-hidden group">
                      {preview ? (
                        <img 
                          src={preview} 
                          alt="Profile" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-bg to-brand-border dark:from-brandDark-border dark:to-brandDark-bg flex items-center justify-center">
                          <FiUser className="text-5xl text-brand-muted dark:text-brandDark-muted" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl"></div>
                    </div>
                    <label className="absolute bottom-3 right-3 bg-gradient-to-r from-brand-primary to-brand-primaryHover text-white p-3 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                      <FiCamera className="text-xl" />
                    </label>
                  </div>
                  <p className="text-sm text-brand-muted dark:text-brandDark-muted text-center">
                    Click the camera icon to update your profile photo
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="group">
                    <label className="flex items-center text-sm font-medium text-brand-text dark:text-brandDark-text mb-3">
                      <FiUser className="mr-2 text-brand-muted dark:text-brandDark-muted" />
                      Full Name*
                    </label>
                    <input
                      type="text"
                      name="basic_info.name"
                      value={formData.basic_info.name}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Age */}
                  <div className="group">
                    <label className="flex items-center text-sm font-medium text-brand-text dark:text-brandDark-text mb-3">
                      <FiCalendar className="mr-2 text-brand-muted dark:text-brandDark-muted" />
                      Age
                    </label>
                    <input
                      type="number"
                      name="basic_info.age"
                      value={formData.basic_info.age}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none"
                      placeholder="Your age"
                    />
                  </div>

                  {/* Gender */}
                  <div className="group">
                    <label className="flex items-center text-sm font-medium text-brand-text dark:text-brandDark-text mb-3">
                      <FiUser className="mr-2 text-brand-muted dark:text-brandDark-muted" />
                      Gender
                    </label>
                    <select
                      name="basic_info.gender"
                      value={formData.basic_info.gender}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none appearance-none"
                    >
                      <option value="" className="text-brand-muted">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  {/* Profession */}
                  <div className="group">
                    <label className="flex items-center text-sm font-medium text-brand-text dark:text-brandDark-text mb-3">
                      <FiBriefcase className="mr-2 text-brand-muted dark:text-brandDark-muted" />
                      Profession*
                    </label>
                    <input
                      type="text"
                      name="basic_info.profession"
                      value={formData.basic_info.profession}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none"
                      required
                      placeholder="Your profession"
                    />
                  </div>

                  {/* Bio - Full width */}
                  <div className="md:col-span-2 group">
                    <label className="flex items-center text-sm font-medium text-brand-text dark:text-brandDark-text mb-3">
                      <FiInfo className="mr-2 text-brand-muted dark:text-brandDark-muted" />
                      Bio
                    </label>
                    <textarea
                      name="basic_info.bio"
                      value={formData.basic_info.bio}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none resize-none"
                      placeholder="Tell us about yourself, your passions, and what you do..."
                    ></textarea>
                    <p className="mt-2 text-xs text-brand-muted dark:text-brandDark-muted text-right">
                      {formData.basic_info.bio.length}/500 characters
                    </p>
                  </div>

                  {/* Location */}
                  <div className="md:col-span-2 group">
                    <label className="flex items-center text-sm font-medium text-brand-text dark:text-brandDark-text mb-3">
                      <FiMapPin className="mr-2 text-brand-muted dark:text-brandDark-muted" />
                      Location
                    </label>
                    <input
                      type="text"
                      name="basic_info.location"
                      value={formData.basic_info.location}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Professional Section */}
            {activeSection === 'professional' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Education */}
                  <div className="md:col-span-2 group">
                    <label className="flex items-center text-sm font-medium text-brand-text dark:text-brandDark-text mb-3">
                      <FiBook className="mr-2 text-brand-muted dark:text-brandDark-muted" />
                      Education
                    </label>
                    <input
                      type="text"
                      name="professional.education"
                      value={formData.professional.education}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none"
                      placeholder="Degrees, institutions, certifications..."
                    />
                  </div>

                  {/* Key Skills */}
                  <div className="md:col-span-2 group">
                    <label className="flex items-center text-sm font-medium text-brand-text dark:text-brandDark-text mb-3">
                      <FiAward className="mr-2 text-brand-muted dark:text-brandDark-muted" />
                      Key Skills
                    </label>
                    <input
                      type="text"
                      name="professional.keySkills"
                      value={formData.professional.keySkills}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none"
                      placeholder="JavaScript, React, Node.js, Design..."
                    />
                    <p className="mt-2 text-xs text-brand-muted dark:text-brandDark-muted">
                      Separate skills with commas
                    </p>
                  </div>

                  {/* Interests */}
                  <div className="md:col-span-2 group">
                    <label className="flex items-center text-sm font-medium text-brand-text dark:text-brandDark-text mb-3">
                      <FiHeart className="mr-2 text-brand-muted dark:text-brandDark-muted" />
                      Interests
                    </label>
                    <textarea
                      name="professional.interests"
                      value={formData.professional.interests}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none resize-none"
                      placeholder="Your hobbies, passions, and things you enjoy..."
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Section */}
            {activeSection === 'contact' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="group">
                    <label className="flex items-center text-sm font-medium text-brand-text dark:text-brandDark-text mb-3">
                      <FiMail className="mr-2 text-brand-muted dark:text-brandDark-muted" />
                      Email*
                    </label>
                    <input
                      type="email"
                      name="contact.email"
                      value={formData.contact.email}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none"
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div className="group">
                    <label className="flex items-center text-sm font-medium text-brand-text dark:text-brandDark-text mb-3">
                      <FiPhone className="mr-2 text-brand-muted dark:text-brandDark-muted" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="contact.phone"
                      value={formData.contact.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none"
                      placeholder="+1 (234) 567-8900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Links Section */}
            {activeSection === 'social' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {socialPlatforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <div key={platform.key} className="group">
                        <label className="flex items-center text-sm font-medium text-brand-text dark:text-brandDark-text mb-3">
                          <Icon className={`mr-2 ${platform.color}`} />
                          {platform.label}
                        </label>
                        {platform.prefix ? (
                          <div className="flex">
                            <span className="inline-flex items-center px-4 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-r-0 border-brand-border dark:border-brandDark-border rounded-l-xl text-brand-muted dark:text-brandDark-muted text-sm">
                              {platform.prefix}
                            </span>
                            <input
                              type="text"
                              name={`socialLinks.${platform.key}`}
                              value={formData.socialLinks[platform.key]}
                              onChange={handleChange}
                              className="flex-1 px-4 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-r-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none"
                              placeholder={platform.key === 'youtube' ? 'channel' : 'username'}
                            />
                          </div>
                        ) : (
                          <input
                            type="url"
                            name={`socialLinks.${platform.key}`}
                            value={formData.socialLinks[platform.key]}
                            onChange={handleChange}
                            className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none"
                            placeholder="https://example.com"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-10 pt-8 border-t border-brand-border dark:border-brandDark-border">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center mx-auto ${
                  isSubmitting
                    ? 'bg-brand-primary/70 cursor-not-allowed'
                    : 'bg-gradient-to-r from-brand-primary to-brand-primaryHover hover:from-brand-primaryHover hover:to-brand-primary hover:shadow-lg hover:-translate-y-0.5'
                } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-3" />
                    Save Profile Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;