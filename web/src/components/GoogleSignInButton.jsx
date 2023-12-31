import {useEffect, useState} from "react";
require("dotenv").config();

export default () => {
    const [rootURL, setRootURL] = useState("");
    useEffect(() => {
        setRootURL(`${window.location.protocol}//${window.location.host}`);
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        document.body.appendChild(script);
    }, []);
    let googleClientID = process.env.GOOGLE_CLIENT_ID_DEV;
    // switch to prod client url if website is running on the prod url
    if (rootURL === "https://songscope.org") {
        googleClientID = process.env.GOOGLE_CLIENT_ID_PROD;
    }

    return (
        <div className="after:-z-50">
            <div
                className="w-full"
                id="g_id_onload"
                data-client_id={googleClientID}
                data-context="signin"
                data-ux_mode="redirect"
                data-login_uri={`${rootURL}/api/auth/google-callback`}
                data-auto_prompt="false"
            ></div>
            <div
                className="g_id_signin"
                data-type="standard"
                data-shape="pill"
                data-theme="filled_black"
                data-text="continue_with"
                data-size="large"
                data-logo_alignment="left"
            ></div>
        </div>
    );
};
