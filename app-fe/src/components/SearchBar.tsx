import { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";
import Link from "next/link";
import Avatar from "./Avatar";
import { WithId } from "@/utils/types";

interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
}

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<WithId<User>[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [recentSearches, setRecentSearches] = useState<WithId<User>[]>([]);
    const searchBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedSearches = localStorage.getItem("recentSearches");
        if (storedSearches) {
            setRecentSearches(JSON.parse(storedSearches));
        }
    }, []);

    const fetchResults = async (searchQuery: string) => {
        if (searchQuery.trim() === "") {
            setResults([]);
            return;
        }

        setIsSearching(true);

        try {
            const response = await fetch(`/api/search?q=${searchQuery}`);
            const data = await response.json();
            setResults(data.users);
            setShowResults(true);
        } catch (error) {
            console.error("Error fetching search results: ", error);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchResults(query);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchBarRef.current &&
                !searchBarRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearchSelect = (user: WithId<User>) => {
        const updatedRecentSearches = [
            user,
            ...recentSearches.filter((u) => u.id !== user.id),
        ].slice(0, 5);
        setRecentSearches(updatedRecentSearches);
        localStorage.setItem(
            "recentSearches",
            JSON.stringify(updatedRecentSearches)
        );
        setQuery(user.username);
        setShowResults(false);
    };

    const handleFocus = () => {
        if (query.trim() === "") {
            setShowResults(true);
        }
    };

    return (
        <div className={styles.searchBarContainer} ref={searchBarRef}>
            <input
                type="text"
                placeholder="Search for users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.searchInput}
                onFocus={handleFocus}
            />
            {isSearching && <div className={styles.loader}>Loading...</div>}
            {showResults && (
                <div className={styles.resultsContainer}>
                    {query.trim() === "" && recentSearches.length > 0 ? (
                        <>
                            <div className={styles.recentSearchesHeader}>
                                Recent
                            </div>
                            {recentSearches.map((user) => (
                                <Link
                                    href={`/profile/${user._id}`}
                                    key={user.id}
                                    className={styles.resultItem}
                                    onClick={() => handleSearchSelect(user)}
                                >
                                    <div className={styles.avatar}>
                                        <Avatar
                                            size={50}
                                            src={user.avatar}
                                            initials={user.username[0]}
                                        />
                                    </div>
                                    <div className={styles.userInfo}>
                                        <p
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: 24,
                                            }}
                                        >
                                            {user.username}
                                        </p>
                                        <p className={styles.userEmail}>
                                            {user.email}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </>
                    ) : (
                        results.map((user) => (
                            <Link
                                href={`/profile/${user._id}`}
                                key={user.id}
                                className={styles.resultItem}
                                onClick={() => handleSearchSelect(user)}
                            >
                                <div className={styles.avatar}>
                                    <Avatar
                                        size={50}
                                        src={user.avatar}
                                        initials={user.username[0]}
                                    />
                                </div>
                                <div className={styles.userInfo}>
                                    <p
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: 24,
                                            marginBottom: 0,
                                        }}
                                    >
                                        {user.username}
                                    </p>
                                    <p className={styles.userEmail}>
                                        {user.email}
                                    </p>
                                </div>
                                <div className={styles.userDetails}>
                                    <p>.</p>
                                    <p>.</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
