import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import { CircularProgress } from "@mui/material";
import { timeStampToDateTime } from "../src/utils";
import moment from "moment";
import { Sun, Clouds, CloudLightningRain } from "react-bootstrap-icons";

export default function Dashboard() {
    const [state, setState] = useState({});

    const getType = (value) => {
        if (value.includes("cloud")) return "cloud";
        if (value.includes("rain")) return "rain";
        return "sun";
    };

    const getWeatherReport = useCallback(() => {
        if (window?.navigator?.geolocation) {
            window.navigator.geolocation.getCurrentPosition((position) => {
                console.log(position);
                fetch(
                    `https://fcc-weather-api.glitch.me/api/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
                ).then((response) => {
                    response
                        .json()
                        .then((res) => {
                            console.log(res, "res");
                            setState({
                                city: res.name,
                                temp: res.main.temp.toFixed(0),
                                humidity: res.main.humidity,
                                windspeed: res.wind.speed.toFixed(0),
                                sunRise: timeStampToDateTime(res.sys.sunrise).format("h:mm a"),
                                sunSet: timeStampToDateTime(res.sys.sunset).format("h:mm a"),
                                error: false,
                                description: res.weather[0].description,
                                icon: res.weather[0].icon,
                                type: getType(res.weather[0].main.toLowercase())
                            });
                        })
                        .catch(() => {
                            setState({
                                error: true
                            });
                        });
                });
            });
        }
    }, []);

    useEffect(() => {
        getWeatherReport();
    }, [getWeatherReport]);

    if (_.isEmpty(state)) return <CircularProgress />;

    return (
        <div className={`wrapper ${state.type}`}>
            <div className="container">
                <div>{moment().format("dddd,Do MMMM")}</div>

                <div className="city text margin-bottom-20 font-size-17">
                    {state.city}
                </div>

                <div className="text-center weather-icon">
                    {state.type === "sun" && <Sun />}
                    {state.type === "cloud" && <Clouds />}
                    {state.type === "rain" && <CloudLightningRain />}
                </div>
            </div>
        </div>
    );
}
