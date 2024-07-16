"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileDetails from "./ProfileDetails";
import ProfileHeader from "./ProfileHeader";
import Feedback from "./Feedback";
import {
    acceptFriendRequest,
    cancelFriendRequest,
    fetchFeedback,
    fetchFriendRequests,
    fetchFriends,
    fetchProfile,
    sendFriendRequest,
    unfriend,
} from "@/hooks/useProfile";
import { sendFriendRequestNotification } from "./server";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProfilePage({ params }: { params: { id: string } }) {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [friends, setFriends] = useState<any[]>([]);
    const [isFriend, setIsFriend] = useState(false);
    const [isReceiver, setIsReceiver] = useState(false);
    const [friendRequest, setFriendRequest] = useState("");
    const [friendRequestBoth, setFriendRequestBoth] = useState("");
    const [feedback, setFeedback] = useState<any[]>([]);

    // FR: might put this in Header later
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

    const checkFriendRequest = async () => {
        if (!session) {
            return;
        }

        const checkResponse = await fetch("/api/friendRequest/check-request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sender_id: session.user.id,
                receiver_id: params.id,
            }),
        });

        const checkData = await checkResponse.json();

        setRequestSent(checkData.exists);
        setIsFriend(checkData.isFriend);

        if (
            session.user.id === checkData.receiver_id &&
            params.id === checkData.sender_id &&
            checkData.exists === true
        ) {
            setIsReceiver(true);
            setFriendRequest(checkData.request_id);
            setFriendRequestBoth(checkData);
        } else {
            setIsReceiver(false);
        }
    };

    useEffect(() => {
        const fetchAndSetProfile = async () => {
            const fetchedProfile = await fetchProfile(params.id);
            setProfile(fetchedProfile);
        };

        const fetchAndSetFeedback = async () => {
            const fetchedFeedback = await fetchFeedback(params.id);
            setFeedback(fetchedFeedback);
        };

        const fetchAndSetFriends = async () => {
            const fetchedFriends = await fetchFriends(params.id);
            setFriends(fetchedFriends);
        };

        const fetchData = async () => {
            setLoading(true);
            await fetchAndSetFeedback();
            await fetchAndSetProfile();
            await fetchAndSetFriends();
            await checkFriendRequest();
            setLoading(false);
        };

        fetchData();
    }, [params.id, session]);

    const handleAccept = async (requestId: string) => {
        try {
            await acceptFriendRequest(requestId);
            setFriendRequests((prev) =>
                prev.filter((req) => req._id !== requestId)
            );
            const updatedFriends = await fetchFriends(session.user.id);
            setFriends(updatedFriends);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddFriend = async () => {
        if (!session) {
            alert("You need to be logged in to send friend requests");
            return;
        }

        setLoading(true);

        try {
            if (isFriend) {
                await unfriend(session.user.id, params.id);
                setIsFriend(false);
                setFriends((prev) =>
                    prev.filter((friend) => friend.id !== params.id)
                );
            } else if (requestSent) {
                await cancelFriendRequest(session.user.id, params.id);
                setRequestSent(false);
            } else {
                await sendFriendRequest(session.user.id, params.id);
                await sendFriendRequestNotification(params.id);
                setRequestSent(true);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
            checkFriendRequest();
        }
    };

    const handleAcceptProfile = async () => {
        try {
            await acceptFriendRequest(friendRequest);
            setIsReceiver(false);
            setIsFriend(true);
            setRequestSent(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancelProfile = async () => {
        try {
            await cancelFriendRequest(
                friendRequestBoth.sender_id,
                friendRequestBoth.receiver_id
            );
            setIsReceiver(false);
            setIsFriend(false);
            setRequestSent(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchAndSetFriendRequests = async () => {
            try {
                const requests = await fetchFriendRequests();
                setFriendRequests(requests);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAndSetFriendRequests();
    }, []);

    const ProfileHeaderSkeleton = () => (
        <SkeletonTheme baseColor="#2a2a4a" highlightColor="#444">
            <Skeleton circle={true} height={350} width={350} />
            <Skeleton height={15} width={100} />
            <Skeleton height={15} width={150} />
        </SkeletonTheme>
    );

    const ProfileDetailsSkeleton = () => (
        <SkeletonTheme baseColor="#2a2a4a" highlightColor="#444">
            <Skeleton height={20} width={300} />
            <Skeleton height={20} width={250} />
            <Skeleton height={20} width={200} />
        </SkeletonTheme>
    );

    const FeedbackSkeleton = () => (
        <SkeletonTheme baseColor="#2a2a4a" highlightColor="#444">
            <Skeleton height={20} width={100} />
            <Skeleton count={5} height={20} width={250} />
        </SkeletonTheme>
    );

    if (!profile || loading) {
        return (
            <>
                <Header />
                <SkeletonTheme baseColor="#2a2a4a" highlightColor="#444">
                    <div className={styles.profileContainer}>
                        <div className={styles.profileHeader}>
                            <ProfileHeaderSkeleton />
                        </div>
                        <div className={styles.playerDetails}>
                            <ProfileDetailsSkeleton />
                        </div>
                        <div className={styles.feedbacks}>
                            <h2>
                                <Skeleton width={100} />
                            </h2>
                            <FeedbackSkeleton />
                        </div>
                        <div className={styles.highlights}>
                            <h2>
                                <Skeleton width={100} />
                            </h2>
                        </div>
                    </div>
                </SkeletonTheme>
                <Footer />
            </>
        );
    }
    return (
        <>
            <Header />
            <div className={styles.profileContainer}>
                <ProfileHeader
                    profile={profile}
                    friends={friends}
                    session={session}
                    params={params}
                    loading={loading}
                    requestSent={requestSent}
                    isFriend={isFriend}
                    friendRequests={friendRequests}
                    handleAddFriend={handleAddFriend}
                    handleAccept={handleAccept}
                    handleAcceptProfile={handleAcceptProfile}
                    handleCancelProfile={handleCancelProfile}
                    isReceiver={isReceiver}
                    setFriends={setFriends}
                />
                <ProfileDetails
                    profile={profile}
                    isCurrentUser={session?.user.id === params.id}
                />
                <div className={styles.feedbacks}>
                    <h2>Feedbacks</h2>
                    <Feedback
                        profile={profile}
                        isCurrentUser={session?.user.id === params.id}
                        CurrentUser={session?.user.id}
                        feedbacks={feedback}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
}
