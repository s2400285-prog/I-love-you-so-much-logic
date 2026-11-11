# The World I Made for You

A rose-tinted interactive love story for Baby Julie, created by James Traigo. It contains seven chapters, eight memory hearts, 24 optional discoveries, and the Final Heart.

## Open the website

1. Right-click the ZIP and choose **Extract All**. Keep **index.html**, **config.js**, and the **css**, **js**, and **assets** folders together.
2. Open the extracted folder and double-click **index.html** to start the story directly in your browser.
3. Select **Enter the world I made for you.** The demo password is **babyjulie**. Choose **Enter quietly** to begin before adding your song.

### Run in VS Code

Open the extracted **the-world-i-made-for-you** folder in VS Code. Install the **Live Server** extension, then right-click **index.html** and choose **Open with Live Server**. The site works directly from the extracted folder as well as through Live Server. There is no build step.

### Run through XAMPP

If the project is inside **C:/xampp/htdocs/**, start **Apache** in the XAMPP Control Panel and use a **http://localhost/** URL. For example, if there are two nested project folders, open **http://localhost/the-world-i-made-for-you/the-world-i-made-for-you/**. Use one copy of the folder name if you extracted it directly into **htdocs**.

## Make it yours

All personal copy, media paths, and the story password are in **config.js**.

| What to add | Where to edit |
| --- | --- |
| Your photo | Save one JPEG as **assets/images/our-photo.jpg**. Update **photoAlt**, **photoMemory**, and the three **photoNotes**. If you use another image extension, update **photo** to match. |
| Your song | Save the MP3 you want to use as **assets/music/our-song.mp3**. Update **musicTitle** and, if needed, **music**. |
| Your invitation password | Replace **password** and **passwordHint**. The password is case-sensitive. Use a story phrase separate from any real account password. |
| Your original letter | Replace the draft in **letter**. Keep one object per reveal and one quoted string per paragraph. Use straight quotation marks to delimit strings and escape apostrophes inside single-quoted strings. The signature is rendered after the final section. |
| Your own details | Edit **future**, **secretMessage**, **stars**, **envelopes**, **gardenNotes**, and **secrets**. The future scenes are written as hopes you can make more specific. |

The supplied brief contained placeholders for the original letter, photograph, song, and real password. This version uses an editable draft letter and a demo password. It includes no sample personal photo or soundtrack. The photograph frame and quiet mode work while you add those files. The full-screen view opens when the image is available. The browser loads the same source for both views and preserves the full aspect ratio.

## Take the scenic route

These are suggested chapter budgets for a roughly one-hour visit. Read the notes, use the reflection prompts, listen to the song, and explore the journal clues at your own pace.

| Chapter | Suggested time | Things to find |
| --- | --- | --- |
| A Sky Full of Little Things | 8 min | Eight notes, the petal, two constellations, and doors behind the moon and under the stars. |
| A Room Full of Reasons | 10 min | Four envelopes, the drawer, curtain and diary keys, the mirror, and a tiny music box. |
| The Picture I’d Keep | 12 min | Unwrap the photograph, revisit it full screen, read the three notes, and look around the frame. |
| A Little Walk into the Future | 10 min | Explore the café, sunset, and quiet evening in any order. Find the bottle, flower, and staircase. |
| The Letter I Wrote for You | 10 min | Open the envelope and read by section or all at once. |
| The World Behind the Letter | 5–8 min | Use the glass key from the moon room after the letter. Explore the fountain, three notes, butterfly, and smallest light. |
| Stay a Little Longer | 5 min | Revisit the song or photo, watch the sky warm, and find the final message. |

Open the journal for clues and the Room of Eight Hearts. The Final Heart becomes available after all 24 discoveries. The sunrise is available on the main route even when the garden and other secrets are still locked. There are no timed gates. The saved journal and optional reflections stay in the current browser. They are cleared by **Story settings → Reset progress**. **Replay from the beginning** keeps the journal.

## Deploy the static copy

For a public copy containing only material you are comfortable sharing publicly, use [Cloudflare Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/).

1. Open Cloudflare's **Workers & Pages** dashboard and choose **Create application → Pages → Use direct upload**.
2. Upload the extracted project folder so **index.html** is at the site root. Keep **css**, **js**, **assets**, and **config.js** in the same relative locations.
3. Deploy and open the generated HTTPS address. Test with a fresh browser session. Use the story password, then verify the song and full-screen photo on the deployed copy.
4. Redeploy the folder after changing the letter, password, or media.

## Keep a personal copy private

The static invitation password is a story interaction. A visitor who can reach the static site can read **config.js** and request the photo or audio by URL. For real privacy, protect the entire site with host-side authentication before uploading personal material.

A managed deployment option is [Cloudflare Access with a private Tunnel](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/).

1. Serve the project on a private origin and create an Access application for the entire hostname before connecting the public Tunnel route. Allow only the intended accounts.
2. Enable **Protect with Access** in the Tunnel or validate Access tokens at the origin. Keep the origin unreachable through alternate public URLs. Require the same login for HTML, JS, images, and audio.
3. Test while signed out. Open the homepage and both media URLs directly. Each should require authentication. Then sign in as an authorized account and test playback and full-screen viewing.

If you implement your own login, validate passwords server-side against a salted password hash held in server configuration. Use rate limiting, HTTPS, and a short-lived server-side session with Secure, HttpOnly, and SameSite cookies. Check the session before serving each private route or file. The client-side story phrase can remain a separate clue. See the [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet) for session handling.

## Project layout

| Path | Role |
| --- | --- |
| **index.html** | Invitation, story shell, accessible dialogs, and persistent audio element |
| **config.js** | Personal details, media paths, chapter notes, letter, and secrets |
| **css/style.css** | Typography, opening layout, and common controls |
| **css/scenes.css** | Chapter artwork, controls, responsive layouts, and dialogs |
| **css/motion.css** | Motion, transitions, and reduced-motion styling |
| **js/main.js** | Story routing and interaction coordination |
| **js/chapters.js** | Seven scene layouts and visual puzzle templates |
| **js/dialogs.js** | Notes, hidden rooms, memory journal, and photo viewer |
| **js/interactions.js** | Drag tracing and image loading |
| **js/audio.js** | User-initiated play, pause, and volume |
| **js/progress.js** | Browser-local saves, resume, and reset |
| **js/motion.js** | Canvas particles, GSAP transitions, ScrollTrigger, and animation fallbacks |
| **js/vendor/** | Local GSAP and ScrollTrigger |
| **assets/** | Original vector scenery, signature, local fonts, and folders for your photo and song |

GSAP and ScrollTrigger 3.13.0 are included under the [GSAP Standard License](https://gsap.com/standard-license/). Font licenses are included in **assets/fonts/**. The story works without the motion library and honors the device’s reduced-motion preference. The in-story setting can also reduce motion. Browser audio controls and media formats depend on the device and browser.
