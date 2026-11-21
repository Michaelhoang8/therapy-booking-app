# Static UI previews

These documentation-only previews were created at the owner's request without starting the application or database. They are manually transcribed HTML representations of the supplied JSX, using fictional names, dates, appointments, and session types.

- `appointments.html` follows `client/src/Pages/ManageAppointments.js` and loads its original stylesheet through the generator.
- `booking.html` follows `client/src/Pages/BookAppointment.js` and its original stylesheet.
- `therapist.html` follows the dashboard structure and inline styling in `client/src/Pages/TherapistDashboard.js`.

The original VitalCare logo is reused. A documentation banner, fixed capture dimensions, and neutral page framing are added. These images do not establish functioning interactions, actual database contents, or pixel-identical rendering of the running React application. Buttons are inert.

PNG files were captured from these local HTML documents at 1200 × 800 CSS pixels with a 2× pixel ratio. To regenerate only the documentation images, use Python with Playwright and an installed Microsoft Edge browser, then run `python docs/previews/generate.py` from the repository root. This script never imports the React app or contacts its backend.
