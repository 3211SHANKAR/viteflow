import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let body = { fullName: name, bio };

    try {
      if (selectedImg) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);
        reader.onloadend = async () => {
          body.profilePic = reader.result;
          await updateProfile(body);
          navigate("/");
        };
      } else {
        await updateProfile(body);
        navigate("/");
      }
    } catch (error) {
      console.error("Profile update failed:", error.message);
    }
  };

  const previewSrc = selectedImg
    ? URL.createObjectURL(selectedImg)
    : authUser?.profilePic || assets.avatar_icon;

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center text-white">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile details</h3>

          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <img src={previewSrc} alt="avatar" className="w-12 h-12 rounded-full" />
            Upload profile image
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>

        <img
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
          src={previewSrc || assets.logo_icon}
          alt="profile"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
