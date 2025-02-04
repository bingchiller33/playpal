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
    const response = await fetch(`/api/userProfiles`);
    const userProfiles = await response.json();
    return userProfiles;
};

const UserProfile: React.FC<UserProfileProps> = ({ params }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [userProfiles, setUserProfiles] = useState<any[]>([]);

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
                    <Link
                        href={`profile/${profile._id}`}
                        key={profile._id}
                        style={{ textDecoration: "none" }}
                    >
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
