import React, { useState, useEffect, FormEvent } from "react";
import styles from "./EditUserInfo.module.css";
import { toast } from "react-toastify";

interface UserEditProps {
  userId: string;
}

interface Option {
  _id: string;
  label: string;
}

interface UserFormData {
  email: string;
  username: string;
  age: number;
  avatar: string;
  gender: string;
  playstyles: string[];
  language: string[];
}

const EditUserInfo: React.FC<UserEditProps> = ({ userId }) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    username: "",
    age: 0,
    avatar: "",
    gender: "",
    playstyles: [],
    language: [],
  });

  const [genderOptions, setGenderOptions] = useState<Option[]>([]);
  const [playstyleOptions, setPlaystyleOptions] = useState<Option[]>([]);
  const [languageOptions, setLanguageOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [genderRes, playstyleRes, languageRes] = await Promise.all([
          fetch("/api/profile/genders"),
          fetch("/api/profile/playstyles"),
          fetch("/api/profile/languages"),
        ]);
        setGenderOptions(await genderRes.json());
        setPlaystyleOptions(await playstyleRes.json());
        setLanguageOptions(await languageRes.json());
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`/api/profile/${userId}`);
        const user = await res.json();
        setFormData({
          email: user.email || "",
          username: user.username || "",
          age: user.age || 0,
          avatar: user.avatar || "",
          gender: user.gender || "",
          playstyles: user.playstyles || [],
          language: user.language || [],
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchOptions();
    fetchUserInfo();
  }, [userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleCheckboxChange = (
    field: "playstyles" | "language",
    value: string
  ) => {
    setFormData((prev) => {
      const updatedField = prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value];
      return { ...prev, [field]: updatedField };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const gender = formData.gender === "" ? null : formData.gender;

    try {
      const res = await fetch(`/api/profile/${userId}/updateProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, gender: gender }),
      });

      if (res.ok) {
        const result = await res.json();
        toast.success("Profile updated successfully!");
      } else {
        const error = await res.json();
        toast.error(`Profile update failed: ${error.message}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <form className={styles.editUserForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Avatar URL</label>
        <input
          type="text"
          name="avatar"
          value={formData.avatar}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender || ""}
          onChange={handleInputChange}
        >
          <option value="">Select Gender</option>
          {genderOptions.map((option) => (
            <option key={option._id} value={option._id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label>Playstyles</label>
        <div className={styles.checkboxContainer}>
          {playstyleOptions.map((playstyle) => (
            <label
              key={playstyle._id}
              className={
                formData.playstyles.includes(playstyle._id)
                  ? styles.selected
                  : ""
              }
              onClick={() => handleCheckboxChange("playstyles", playstyle._id)}
            >
              {playstyle.label}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>Languages</label>
        <div className={styles.checkboxContainer}>
          {languageOptions.map((language) => (
            <label
              key={language._id}
              className={
                formData.language.includes(language._id) ? styles.selected : ""
              }
              onClick={() => handleCheckboxChange("language", language._id)}
            >
              {language.label}
            </label>
          ))}
        </div>
      </div>
      <button type="submit" className={styles.submitButton}>
        Save
      </button>
    </form>
  );
};

export default EditUserInfo;
