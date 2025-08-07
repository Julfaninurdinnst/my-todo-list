import React, { useEffect, useState } from "react";
import { getUserName, getLocation, getCurrentTime, getCurrentDate } from "../../lib/userUtils";

const GetUserTimeLocation: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<string>(getCurrentTime());
    const [currentDate, setCurrentDate] = useState<string>(getCurrentDate());
    const [location, setLocation] = useState<string>("");

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getCurrentTime());
            setCurrentDate(getCurrentDate());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        getLocation().then(setLocation);
    }, []);

    return (
        <div className="flex flex-col items-start gap-1">
            <div className="font-semibold text-gray-800">{getUserName()}</div>
            <div className="text-sm text-gray-500">{location}</div>
            <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-mono text-gray-700">{currentTime}</span>
            </div>
            <div className="text-xs text-gray-400">{currentDate}</div>
        </div>
    );
};

export default GetUserTimeLocation;