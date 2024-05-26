"use client";

import React from "react";
import { useState } from "react";
import ProfileCard from "../../components/ProfileCard";
import Pagination from "../../components/Pagination";
import styles from "./page.module.css";
import Link from "next/link";

type UserProfileProps = {
  params: {
    id: string;
  };
};

const fetchUserProfiles = async (id: string) => {
  const userProfiles = [
    {
      id: "1",
      username: "User1",
      rank: "Diamond",
      language: ["EN", "KR"],
      server: "Asia",
      style: "Entertain Only",
      rating: "4.9",
      image:
        "https://res.cloudinary.com/dnzy2vddm/image/upload/v1709534551/avatar-guest_2x_nbk1bw.png",
    },
    {
      id: "2",
      username: "User2",
      rank: "Gold",
      language: ["EN", "JP"],
      server: "Asia",
      style: "Entertain Only",
      rating: "4.9",
      image:
        "https://res.cloudinary.com/dnzy2vddm/image/upload/v1709661596/uak9g3ewwdoht8relsxn.jpg",
    },
    {
      id: "3",
      username: "User3",
      rank: "Bronze",
      language: "EN",
      server: "Asia",
      style: "Entertain Only",
      rating: "4.9",
      image:
        "https://res.cloudinary.com/dnzy2vddm/image/upload/v1709534551/avatar-guest_2x_nbk1bw.png",
    },
    {
      id: "4",
      username: "User4",
      rank: "Gold",
      language: "EN",
      server: "Asia",
      style: "Entertain Only",
      rating: "4.9",
      image:
        "https://res.cloudinary.com/dnzy2vddm/image/upload/v1709534551/avatar-guest_2x_nbk1bw.png",
    },
    {
      id: "6",
      username: "User6",
      rank: "Silv",
      language: "EN",
      server: "Asia",
      style: "Entertain Only",
      rating: "4.9",
      image:
        "https://res.cloudinary.com/dnzy2vddm/image/upload/v1709534551/avatar-guest_2x_nbk1bw.png",
    },
    {
      id: "5",
      username: "User5",
      rank: "Challenger",
      language: "EN",
      server: "Asia",
      style: "Entertain Only",
      rating: "4.9",
      image:
        "https://res.cloudinary.com/dnzy2vddm/image/upload/v1709534551/avatar-guest_2x_nbk1bw.png",
    },
    {
      id: "7",
      username: "User7",
      rank: "Master",
      language: "EN",
      server: "Asia",
      style: "Entertain Only",
      rating: "4.9",
      image:
        "https://res.cloudinary.com/dnzy2vddm/image/upload/v1709534551/avatar-guest_2x_nbk1bw.png",
    },
    {
      id: "8",
      username: "User8",
      rank: "Master",
      language: "EN",
      server: "Asia",
      style: "Entertain Only",
      rating: "4.9",
      image:
        "https://res.cloudinary.com/dnzy2vddm/image/upload/v1709534551/avatar-guest_2x_nbk1bw.png",
    },
  ];
  return userProfiles;
};

const UserProfile: React.FC<UserProfileProps> = ({ params }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [userProfiles, setUserProfiles] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const profiles = await fetchUserProfiles(params.id);
      setUserProfiles(profiles);
    };

    fetchData();
  }, [params.id]);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(userProfiles.length / itemsPerPage);
  const currentProfiles = userProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.profilePage}>
      <div className={styles.statsSection}>
        <h1>User stats</h1>
        <p>Online:?</p>
        <p>Online:?</p>
      </div>
      <div className={styles.cardsSection}>
        {currentProfiles.map((profile) => (
          <Link href={`profile/${profile.id}`} key={profile.id}>
            <ProfileCard {...profile} />
          </Link>
        ))}
      </div>
      <Pagination
        total={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default UserProfile;
