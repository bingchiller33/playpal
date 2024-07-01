"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Header from "@/components/Header";
import Link from "next/link";
import { TiArrowBackOutline } from "react-icons/ti";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import TooltipSlider from "@/components/TooltipSlider";

const EditProfile = ({ params }: { params: { id: string } }) => {
  const [activeTab, setActiveTab] = useState("basicInfo");

  const [formData, setFormData] = useState({
    username: "",
    riot_id: "",
    bio: "",
    avatar: "",
    age: 18,
    gender: "",
    playstyles: [],
    language: [],
  });

  const [options, setOptions] = useState({
    genders: [],
    playstyles: [],
    languages: [],
  });

  const fetchOptions = async () => {
    try {
      const [playstylesResponse, languagesResponse, gendersResponse] =
        await Promise.all([
          fetch("/api/profile/playstyles"),
          fetch("/api/profile/languages"),
          fetch("/api/profile/genders"),
        ]);

      const [playstyles, languages, genders] = await Promise.all([
        playstylesResponse.json(),
        languagesResponse.json(),
        gendersResponse.json(),
      ]);

      setOptions({
        playstyles,
        languages,
        genders,
      });
      console.log(options["playstyles"]);
    } catch (error) {
      console.error("Failed to fetch options:", error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/profile/${params.id}`);
        if (response.ok) {
          const user = await response.json();
          setFormData({
            username: user.username,
            riot_id: user.riot_id,
            bio: user.bio || "",
            avatar: user.avatar,
            age: user.age || 18,
            gender: user.gender || "",
            playstyles: user.playstyles || [],
            language: user.language || [],
          });
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchUserData();
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result,
        });
      };
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSliderChange = (e) => {
    setFormData({
      ...formData,
      age: e.value,
    });
  };

  const handleCheckboxChange = (name, value) => {
    setFormData((prevData) => {
      const newArray = prevData[name].includes(value)
        ? prevData[name].filter((item) => item !== value)
        : [...prevData[name], value];
      return { ...prevData, [name]: newArray };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let avatarUrl = formData.avatar;

    if (formData.avatar && formData.avatar.startsWith("data:image")) {
      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file: formData.avatar }),
        });

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          avatarUrl = url;
          console.log("Uploaded image to Cloudinary", avatarUrl);
        } else {
          console.error("Failed to upload image to Cloudinary");
          return;
        }
      } catch (error) {
        console.error("An error occurred:", error);
        return;
      }
    }

    try {
      const response = await fetch(`/api/profile/${params.id}/updateProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          avatar: avatarUrl,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Profile update result:", result);
        toast.success("Profile updated successfully!");
      } else {
        const error = await response.json();
        toast.error(`Profile update failed: ${error.message}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.editProfile}>
        <div className={styles.titleContainer}>
          <Link href={`/profile/${params.id}`} className={styles.backButton}>
            <TiArrowBackOutline size={40} fill="#ED154C" />
          </Link>
          <h2 className={`${styles.title} font-all-star`}>EDIT PROFILE</h2>{" "}
          <div></div>
        </div>
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <button
              className={`${styles.tabButton} ${
                activeTab === "basicInfo" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("basicInfo")}
            >
              Info
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "avatar" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("avatar")}
            >
              Avatar
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "account" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("account")}
            >
              Security
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {activeTab === "account" && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="password">current password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    // value={formData.password}
                    // onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">new password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    // value={formData.newPassword}
                    // onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="confirmNewPassword">
                    password confirmation
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    // value={formData.confirmNewPassword}
                    // onChange={handleChange}
                  />
                </div>
              </>
            )}

            {activeTab === "basicInfo" && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="riot_id">Riot ID</label>
                  <input
                    type="text"
                    id="riot_id"
                    name="riot_id"
                    value={formData.riot_id}
                    onChange={handleChange}
                    placeholder="Enter Riot ID, ie. player#VN2"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="age">Age</label>
                  <div className={styles.sliderContainer}>
                    <TooltipSlider
                      value={formData.age}
                      min={1}
                      max={100}
                      onChange={handleSliderChange}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    {options.genders.map((gender) => (
                      <option key={gender._id} value={gender._id}>
                        {gender.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Playstyles</label>
                  <div className={styles.checkboxContainer}>
                    {options.playstyles.map((playstyle) => (
                      <label
                        key={playstyle._id}
                        className={
                          formData.playstyles.includes(playstyle._id)
                            ? styles.selected
                            : ""
                        }
                        onClick={() =>
                          handleCheckboxChange("playstyles", playstyle._id)
                        }
                      >
                        {playstyle.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Languages</label>
                  <div className={styles.checkboxContainer}>
                    {options.languages.map((language) => (
                      <label
                        key={language._id}
                        className={
                          formData.language.includes(language._id)
                            ? styles.selected
                            : ""
                        }
                        onClick={() =>
                          handleCheckboxChange("language", language._id)
                        }
                      >
                        {language.label}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "avatar" && (
              <>
                <div className={styles.formGroup}>
                  <div className={styles.avatarContainer}>
                    <Image
                      src={formData.avatar}
                      alt="Avatar"
                      width={200}
                      height={200}
                      className={styles.avatar}
                    />
                    <input
                      type="file"
                      id="avatar"
                      name="avatar"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className={styles.submitButton}>
              save
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
