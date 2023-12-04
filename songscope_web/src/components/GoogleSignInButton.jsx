import {useEffect, useState} from "react";

export default () => {
    const [rootURL, setRootURL] = useState("");
    useEffect(() => {
        setRootURL(`${window.location.protocol}//${window.location.host}`);
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    let googleClientID = "197627608254-101bmkl3g7cr6v780l8vku2t9vsokvfa.apps.googleusercontent.com";
    // switch to prod client url if website is running on the prod url
    if (rootURL === "https://songscope.org") {
        googleClientID = "197627608254-doe9u2ugvdeg8a0mr1flqq8dvjmcviui.apps.googleusercontent.com";
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
