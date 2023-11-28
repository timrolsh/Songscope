// a lit html component that uses the google sign in library to make a button
// that signs the user in with google
import {LitElement, html} from "lit-element";

const rootURL = `${window.location.protocol}//${window.location.host}`;
let googleClientID = "197627608254-101bmkl3g7cr6v780l8vku2t9vsokvfa.apps.googleusercontent.com";
// switch to prod client url if website is running on the prod url
if (rootURL === "https://songscope.org") {
    googleClientID = "197627608254-doe9u2ugvdeg8a0mr1flqq8dvjmcviui.apps.googleusercontent.com";
}

@customElement("google-sign-in-button")
class GoogleSignInButton extends LitElement {
    // Component logic here
    render() {
        return html`<div
                id="g_id_onload"
                data-client_id="${googleClientID}"
                data-context="signin"
                data-ux_mode="redirect"
                data-login_uri="${rootURL}/google-auth"
                data-auto_prompt="false"
            ></div>
            <div
                class="g_id_signin"
                data-type="standard"
                data-shape="pill"
                data-theme="filled_black"
                data-text="continue_with"
                data-size="large"
                data-logo_alignment="left"
            ></div>`;
    }
}
export default GoogleSignInButton;
export {googleClientID};
