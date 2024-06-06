export const COLORS = {
    PRIMARY_1: "#ED154C",
};

export const GAME_ID_LOL = "6656b7cc0342bce980eeb7cb";

export const FAKE_DEFAULT_LOL_WEIGHTS = {};

export const FAKE_DEFAULT_ANY_WEIGHTS = {};

function generateTimeFilterOptions() {
    const options = [];
    const intervals = 15 * 60; // 15 minutes in seconds
    const dayInSeconds = 24 * 60 * 60; // Total seconds in a day
    const formatTime = (hours: number, minutes: number) => {
        const period = hours < 12 ? "am" : "pm";
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    for (let seconds = 0; seconds < dayInSeconds; seconds += intervals) {
        const hours = Math.floor(seconds / 3600);
        const minutes = (seconds % 3600) / 60;
        options.push({
            value: seconds.toString(),
            label: formatTime(hours, minutes),
        });
    }

    return options;
}

export const TIME_FILTER_OPTIONS = generateTimeFilterOptions();
