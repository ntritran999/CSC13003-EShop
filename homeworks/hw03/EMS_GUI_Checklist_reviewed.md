# EMS GUI Checklist — Nielsen / Norman / Shneiderman Coverage

| Item ID | Item Description | IA-0x Mapping | Heuristic/Principle Mapping | Result | Notes |
|---|---|---|---|---|---|
| GUI-001 | The Dashboard KPI cards (Total Events, Total Check-ins, Attendance Rate, Total Users) are horizontally aligned in a single row at desktop width ≥1280px. | IA-01 | Nielsen #8 Aesthetic & minimalist design | | |
| GUI-002 | Primary-intent buttons on Events, Users, and Support Requests list pages use the same fill colour. | IA-01 | Nielsen #4 Consistency & standards; Shneiderman #1 Strive for consistency | | |
| GUI-003 | Body text font family is identical across the Dashboard, Events, and Support Requests pages. | IA-01 | Nielsen #4 Consistency & standards; Norman Consistency | | |
| GUI-004 | Each list page (Events, Users, Support Requests) shows a defined empty-state message when it has zero records, instead of a blank area. | IA-01 | Nielsen #1 Visibility of system status | | |
| GUI-005 | Each list/table view (Events, Users, Participants) shows a loading indicator while data is being fetched. | IA-01 | Nielsen #1 Visibility of system status | | |
| GUI-006 | Toggling the EN/VI language switch translates all static labels on the current page, with none left in the other language. | IA-01 | Nielsen #2 Match between system and real world | | |
| GUI-007 | Toggling the EN/VI language switch does not change the current page/route (URL). | IA-01 | Shneiderman #7 Support internal locus of control | | |
| GUI-008 | Date/time values use one consistent format across the Events list, Event Detail, and Check-in pages. | IA-01 | Nielsen #4 Consistency & standards | | |
| GUI-009 | Clickable buttons/links display a distinct hover or focus state that differs from static text. | IA-01 | Norman Affordance | | |
| GUI-010 | Table column headers stay visible (sticky/repeated) when scrolling long lists (Events, Users, Participants). | IA-01 | Nielsen #6 Recognition rather than recall | | |
| GUI-011 | All admin pages use one consistent heading hierarchy, with a single H1 as the page title. | IA-01 | Nielsen #4 Consistency & standards; Norman Consistency | | |
| GUI-012 | Every required field on the Add/Edit Event form displays a visible required indicator (e.g., asterisk). | IA-02 | Nielsen #5 Error prevention | | |
| GUI-013 | Submitting the Add/Edit Event form with Event Name empty shows an inline validation error next to that field. | IA-02 | Nielsen #9 Help users recognize, diagnose, recover from errors | | |
| GUI-014 | Validation error messages appear directly beside/beneath the field they refer to, not only in a summary banner. | IA-02 | Nielsen #9; Shneiderman #5 Offer simple error handling | | |
| GUI-015 | Setting an End Date/Time earlier than the Start Date/Time on the Add/Edit Event form is blocked with a clear error before submission succeeds. | IA-02 | Nielsen #5 Error prevention | | |
| GUI-016 | The thumbnail uploader rejects an image that is not 4:3 ratio and shows an explicit on-screen message. | IA-02 | Nielsen #5 Error prevention | | |
| GUI-017 | The banner uploader rejects an image that is not 24:9 ratio and shows an explicit on-screen message. | IA-02 | Nielsen #5 Error prevention | | |
| GUI-018 | Uploading an oversized image on the Support Request attachment shows a specific file-size error message, not a generic failure. | IA-02 | Nielsen #9 Help users recognize, diagnose, recover from errors | | |
| GUI-019 | The Rich-Text editor toolbar (bold/italic/list/link) visibly reflects the active formatting at the current cursor position. | IA-02 | Nielsen #1 Visibility of system status | | |
| GUI-020 | The Max Slots numeric field rejects a zero or negative value with an inline error. | IA-02 | Nielsen #5 Error prevention | | |
| GUI-021 | The registration form blocks submission when no role (student/lecturer/guest) is selected and shows an inline error. | IA-02 | Nielsen #5 Error prevention | | |
| GUI-022 | Password fields on the sign-up form include a visible show/hide toggle control. | IA-02 | Shneiderman #8 Reduce short-term memory load; Norman Affordance | | |
| GUI-023 | Leaving a required Support Request field empty and moving focus away triggers on-blur validation feedback without a full submit. | IA-02 | Nielsen #1 Visibility of system status | | |
| GUI-024 | The admin sidebar visibly highlights the menu item matching the current page. | IA-03 | Nielsen #1 Visibility of system status | | |
| GUI-025 | A breadcrumb trail is present on the Event Detail/Edit page showing the path back to the Events list. | IA-03 | Nielsen #3 User control and freedom; Shneiderman #6 Permit easy reversal | | |
| GUI-026 | Clicking the parent breadcrumb link (e.g., "Events") navigates correctly to the Events list page. | IA-03 | Shneiderman #6 Permit easy reversal | | |
| GUI-027 | The Participants & Reviews and Check-in sections open as tabs within the same Event Detail page without a full page reload. | IA-03 | Nielsen #7 Flexibility and efficiency of use | | |
| GUI-028 | Reordering an item via drag-and-drop persists the new order after a page refresh. | IA-03 | Nielsen #1 Visibility of system status; Shneiderman #4 Design dialogs to yield closure | | |
| GUI-029 | Pressing the browser Back button after opening an Event Detail page returns to the Events list with the prior filter/search still applied. | IA-03 | Shneiderman #6 Permit easy reversal | | |
| GUI-030 | Pasting a direct deep link to a specific event detail page in a new tab loads that event directly, without redirecting to the home page. | IA-03 | Nielsen #2 Match between system and real world; Norman Mapping | | |
| GUI-031 | The "Back"/"Return" action on the Support Request detail page navigates to the correct originating list (My Requests or admin Support Requests). | IA-03 | Shneiderman #6 Permit easy reversal | | |
| GUI-032 | All top-level public navigation items (Home, Events/Categories, My Registrations) remain visible without horizontal scroll at 1366×768. | IA-03 | Nielsen #8 Aesthetic and minimalist design | | |
| GUI-033 | The Pending/Resolved tabs on the Support Requests admin page show a visible active-tab indicator distinguishing the selected tab. | IA-03 | Nielsen #1 Visibility of system status | | |
| GUI-034 | Successfully publishing an event displays a success toast/notification confirming the action. | IA-04 | Nielsen #1 Visibility of system status; Shneiderman #3 Offer informative feedback | | |
| GUI-035 | The success toast auto-dismisses or can be manually dismissed within a defined time without blocking further interaction. | IA-04 | Shneiderman #8 Reduce short-term memory load | | |
| GUI-036 | Clicking Delete on an event triggers a confirmation dialog before the event is permanently removed. | IA-04 | Nielsen #5 Error prevention; Shneiderman #6 Permit easy reversal | | |
| GUI-037 | The Delete confirmation dialog offers an explicit Cancel action that leaves the event unchanged. | IA-04 | Shneiderman #6 Permit easy reversal | | |
| GUI-038 | A user's Active/Blocked status in the Users list is shown with a distinct colour-coded badge. | IA-04 | Nielsen #1 Visibility of system status; Norman Mapping | | |
| GUI-039 | Blocking a user from the Users list updates that user's status badge immediately, without a manual page refresh. | IA-04 | Nielsen #1 Visibility of system status | | |
| GUI-040 | A progress indicator is shown during image upload (thumbnail/banner/support attachment) reflecting upload completion. | IA-04 | Nielsen #1 Visibility of system status | | |
| GUI-041 | A Support Request item moves from the Pending tab to the Resolved tab immediately after an admin submits an official response, without manual refresh. | IA-04 | Nielsen #1 Visibility of system status | | |
| GUI-042 | An invalid Reset Password action shows an error toast that is visually distinct from the success toast styling. | IA-04 | Nielsen #9 Help users recognize, diagnose, recover from errors; Shneiderman #5 Offer simple error handling | | |
| GUI-043 | Checking in a participant produces an immediate visible status change distinguishing checked-in from not-checked-in participants. | IA-04 | Nielsen #1 Visibility of system status | | |
| GUI-044 | Waitlist status on My Registrations is visually distinguished (badge/label) from a confirmed registration status. | IA-04 | Nielsen #1 Visibility of system status; Norman Mapping | | |
| GUI-045 | Body text on the same page with the same hierarchy have the same color | IA-01 | Nielsen #4 Consistency & standards; Norman Consistency; Shneiderman #1 Strive for consistency
| GUI-046 | Date/time input fields display an accessible interactive calendar pop-up, allowing direct date/time selection, highlighting weekend, current/selected dates | IA-02 | Nielsen #6 Recognition rather than recall, Nielsen #5 — Error Prevention. | | |
| GUI-047 | Users can use the Tab key to sequentially move the focus through the items on the navigation bar (menu/sidebar) and use the Enter key to access them without being trapped (keyboard trap). | IA-03 | Nielsen #7 Flexibility and efficiency of use | | |