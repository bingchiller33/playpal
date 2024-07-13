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
import { ImProfile } from "react-icons/im";
import { FaHeart, FaRegUserCircle, FaSave } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import PremiumTransactionHistory from "@/components/PremiumTransactionHistory";
import { getFutPremiumExpiry } from "@/server/subscriptions.server";

const EditProfile = ({ params }: { params: { id: string } }) => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [loading, setLoading] = useState(true);
  const [premiumExpire, setPremiumExpire] = useState<Date | undefined>();

  useEffect(() => {
    getFutPremiumExpiry(params.id).then((res) => {
      if (res.success) {
        setPremiumExpire(res!.data);
      }
    });
  }, [params.id]);

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

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [options, setOptions] = useState({
    genders: [],
    playstyles: [],
    languages: [],
  });

  useEffect(() => {
    if (!session) {
      redirect("/auth/login");
      return;
    }

    if (session.user.id !== params.id) {
      redirect(`/profile/${session.user.id}/edit`);
    }
  }, [session, status, params.id]);

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
      } finally {
        setLoading(false);
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
        [name]: value === "" ? null : value,
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("New password and confirmation do not match!");
      return;
    }

    try {
      const response = await fetch(`/api/profile/${params.id}/changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Password changed successfully!");
      } else {
        const error = await response.json();
        toast.error(`Password change failed: ${error.message}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let avatarUrl = formData.avatar;

    const gender = formData.gender === "" ? null : formData.gender;

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
          gender: gender,
          avatar: avatarUrl,
        }),
      });
      if (response.ok) {
        const result = await response.json();
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
    <div className="bg-moodboard h-100">
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
              <ImProfile size={32} />
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "avatar" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("avatar")}
            >
              <FaRegUserCircle size={32} />
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "account" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("account")}
            >
              <MdOutlineSecurity size={32} />
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "premium" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("premium")}
            >
              <FaHeart size={32} />
            </button>
          </div>

          {loading ? (
            <SkeletonTheme baseColor="#2a2a4a" highlightColor="#444">
              <div className={styles.form}>
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={100} />
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={40} />
              </div>
            </SkeletonTheme>
          ) : (
            <form
              onSubmit={
                activeTab === "account" ? handlePasswordSubmit : handleSubmit
              }
              className={styles.form}
            >
              {activeTab === "account" && (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="password">current password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="newPassword">new password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
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
                      value={passwordData.confirmNewPassword}
                      onChange={handlePasswordChange}
                      required
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
                        onClick={() =>
                          document.getElementById("avatar").click()
                        }
                      />
                      <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/*"
                        onChange={handleChange}
                        style={{ display: "none" }}
                      />
                      <p className={styles.imageSizeInfo}>
                        Image size should not be larger than 1MB.
                      </p>
                      <p className={styles.imageSizeInfo}>
                        Please ensure your avatar adheres to the Visual content
                        considerations.
                      </p>
                    </div>
                  </div>
                </>
              )}
              <button type="submit" className={styles.submitButton}>
                <FaSave size={32} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
