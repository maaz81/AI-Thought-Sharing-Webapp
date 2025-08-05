import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import defaultAvatar from '../../assets/avatar.jpeg';

const Header = () => {
  const [userPhoto, setUserPhoto] = useState(null);

  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/update/profile/userphoto", {
          withCredentials: true,
        });

        const photo = res.data;
        if (photo) {
          setUserPhoto(`http://localhost:5000/uploads/${photo}`);
        }
      } catch (error) {
        console.error("Error fetching user photo:", error);
        setUserPhoto(null); // fallback to default
      }
    };

    fetchUserPhoto();
  }, []);

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        <Link to="/" className="text-2xl font-bold">
          📝 PostShare
        </Link>
        <nav className="space-x-4 flex items-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/profile/post" className="hover:underline">Create Post</Link>
          <Link to="/profile">
            <img
              src={userPhoto || defaultAvatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
