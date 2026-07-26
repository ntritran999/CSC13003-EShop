<h3 align='center'>UNIVERSITY OF SCIENCE, VNUHCM</h3>
<h3 align='center'>FACULTY OF INFORMATION TECHNOLOGY</h3>
<br>
<p align='center'><img src='./images/logo.png' width=50% height=50%></p>

<h3 align='center'>SOFTWARE TESTING</h3>
<h4 align='center'>HW02 – Domain Testing on EShop</h4>

<br>
<br>
<br>

# 1. Student Information & General Information

- Name: Trần Trí Nhân
- Student ID: 23127097

# Task 1B

- Scenario: Scenario A — Admin creates and manages events.
- Screens: 
  - (A1) Events list with status filters and notification dots; 
  - (A2) Add/Edit Event form — image upload + Rich-Text + date/time validation; 
  - (A3) Registration & Roles configuration panel — Max Slots / Waitlist / additional role;
- Screen choice rationale: I choose these screens because they are the most important features for the event management functionality, usually overlooked, yet are still simple enough because they minimize the interactions between accounts with different roles(admin and user) 

## Checklist execution

| Item ID | Item Description | IA Mapping | Heuristic/Principle Mapping | Result | Notes |
|---|---|---|---|---|---|
| GUI-001 | All text on a page uses a consistent font family (no mixed/inconsistent fonts within one view) | IA-01 | Nielsen: Consistency & Standards; Shneiderman: Strive for Consistency | A1: Passed; A2: Passed; A3: Passed | |
| GUI-002 | Primary action buttons (e.g., Save, Publish, Register) use the same color across the app | IA-01 | Nielsen: Consistency & Standards | A1: Passed; A2: Passed; A3: Passed | |
| GUI-003 | Visible page elements are grid-aligned with no overlapping or clipped components | IA-01 | Nielsen: Aesthetic & Minimalist Design; Norman: Constraints | A1: Passed; A2: Passed; A3: Passed | |
| GUI-004 | Switching the language toggle (EN/VI) translates all visible text on the page with no leftover untranslated strings | IA-01 | Nielsen: Match Between System & Real World | A1: Failed; A2: Failed; A3: Failed | A1, A2, A3: The date picker UI does not translate Vietnamese after toggling to Vietnamese ([A1](./images/bug%20images/Screenshot%202026-07-25%20144816.png), [A2](./images/bug%20images/Screenshot%202026-07-25%20210517.png), [A3](./images/bug%20images/Screenshot%202026-07-25%20144204.png)); A2: The hint of WYSIWYG text box remains in English after switching to Vietnamese ([A2](./images/bug%20images/Screenshot%202026-07-25%20143827.png)) |
| GUI-005 | A screen with zero records shows an explicit empty-state message | IA-01 | Nielsen: Help Users Recognize/Diagnose; Norman: Feedback | A1: Passed; A2: N/A; A3: N/A | |
| GUI-006 | A screen fetching data shows a loading indicator (spinner/skeleton) before content renders | IA-01 | Nielsen: Visibility of System Status; Norman: Feedback | A1: Passed; A2: N/A; A3: Passed | |
| GUI-007 | Foreground text has sufficient contrast against its background to be legible | IA-01 | Nielsen: Aesthetic & Minimalist Design | A1: Passed; A2: Passed; A3: Passed | |
| GUI-008 | Every icon-only control has an accompanying text label or tooltip identifying its function | IA-01 | Nielsen: Recognition Rather Than Recall | A1: Failed; A2: Failed; A3: N/A | A1: The filter (funnel) icon next to the 'EVENT TYPES' header acts as an icon-only control but lacks a descriptive tooltip or text label on hover to indicate its filtering function ([A1](./images/bug%20images/Screenshot%202026-07-25%20161228.png), [A1](./images/bug%20images/Screenshot%202026-07-25%20161245.png)); A2: Other icon controls of the rich text box show, except for the text style(p, h1, h2,...) icon, the color icon, the highlight icon, the aligment icon and the font size icon ([A2](./images/bug%20images/Screenshot%202026-07-25%20161736.png), [A2](./images/bug%20images/Screenshot%202026-07-25%20164311.png), [A2](./images/bug%20images/Screenshot%202026-07-25%20164319.png), [A2](./images/bug%20images/Screenshot%202026-07-25%20164330.png), [A2](./images/bug%20images/Screenshot%202026-07-25%20164351.png)) |
| GUI-009 | Date/time values are displayed in one consistent format throughout a given page | IA-01 | Nielsen: Consistency & Standards | A1: Passed; A2: Passed; A3: Passed | |
| GUI-010 | The same status value (e.g., "Active," "Pending") uses the same badge color everywhere it appears | IA-01 | Nielsen: Consistency & Standards; Norman: Mapping | A1: Passed; A2: N/A; A3: N/A | |
| GUI-011 | Every page displays a title/header identifying its content | IA-01 | Nielsen: Match Between System & Real World | A1: Passed; A2: Passed; A3: Passed | |
| GUI-012 | No placeholder/debug text (e.g., "Lorem ipsum," "TODO") is visible anywhere in the UI | IA-01 | Nielsen: Aesthetic & Minimalist Design | A1: Passed; A2: Passed; A3: Passed | |
| GUI-013 | Every required form field displays a visible required-indicator (e.g., asterisk) | IA-02 | Nielsen: Error Prevention; Shneiderman: Offer Simple Error Handling | A1: N/A; A2: Failed; A3: Failed | A2 & A3: 'Role Name' and 'Max Slots' are required but there are no indicators ([A2](./images/bug%20images/Screenshot%202026-07-25%20220330.png), [A3](./images/bug%20images/Screenshot%202026-07-25%20164900.png), [A2](./images/bug%20images/Screenshot%202026-07-25%20165010.png)) |
| GUI-014 | A field's label stays visible/associated with its input after the user enters a value | IA-02 | Nielsen: Recognition Rather Than Recall | A1: N/A; A2: Passed; A3: Passed | |
| GUI-015 | A validation error message appears directly next to the specific field it concerns | IA-02 | Nielsen: Help Users Recognize/Diagnose/Recover from Errors | A1: N/A; A2: Passed; A3: Passed | |
| GUI-016 | A validation error message states what is wrong and how to correct it (not a generic "Invalid") | IA-02 | Nielsen: Help Users Recognize/Diagnose/Recover from Errors | A1: N/A; A2: Passed; A3: Passed | |
| GUI-017 | Submitting a form with an empty required field is blocked and shows an inline error instead of submitting | IA-02 | Nielsen: Error Prevention | A1: N/A; A2: Passed; A3: Passed | |
| GUI-018 | Selecting an event end date/time earlier than the start date/time is rejected with a clear error | IA-02 | Nielsen: Error Prevention | A1: Failed; A2: Passed; A3: Passed | A1: The 'Time' filter allows an end date earlier than the start date and displays 'No events found matching your filters.' instead of showing an error or preventing the invalid selection. ([A1](./images/bug%20images/Screenshot%202026-07-25%20213411.png), [A1](./images/bug%20images/Screenshot%202026-07-25%20213606.png)) |
| GUI-019 | The accepted file type/size for an image upload is stated before the user selects a file | IA-02 | Nielsen: Help & Documentation; Norman: Signifiers | A1: N/A; A2: Passed; A3: N/A | |
| GUI-020 | Selecting an image for upload shows a visual preview before the form is submitted | IA-02 | Norman: Feedback | A1: N/A; A2: Passed; A3: N/A | |
| GUI-021 | The declared image aspect ratio (4:3 thumbnail / 24:9 banner) is enforced or a mismatch warning is shown | IA-02 | Nielsen: Error Prevention | A1: N/A; A2: Failed; A3: N/A | A2: The form accepts image uploads that deviate from the recommended aspect ratios (4:3/24:9) without displaying any mismatch warning or error. ([A2](./images/bug%20images/Screenshot%202026-07-25%20170602.png)) |
| GUI-022 | The Rich-Text editor toolbar visually reflects the formatting state (e.g., Bold icon highlighted) at the cursor position | IA-02 | Norman: Feedback; Nielsen: Visibility of System Status | A1: N/A; A2: Passed; A3: N/A | |
| GUI-023 | Data entered in a form is retained (not cleared) after a failed submission | IA-02 | Nielsen: User Control & Freedom | A1: N/A; A2: Passed; A3: Passed | |
| GUI-024 | A disabled submit button is visually distinct from an enabled submit button | IA-02 | Norman: Constraints/Signifiers | A1: N/A; A2: N/A; A3: N/A | |
| GUI-025 | The sidebar/menu item for the current section is visually highlighted as active | IA-03 | Nielsen: Visibility of System Status | A1: Passed; A2: Passed; A3: Passed | |
| GUI-026 | The breadcrumb trail (where present) accurately reflects the current page's position in the hierarchy | IA-03 | Nielsen: Match Between System & Real World | A1: N/A; A2: N/A; A3: N/A | |
| GUI-027 | Using the Back/Return action returns the user to the previous screen with no unintended data loss | IA-03 | Nielsen: User Control & Freedom; Shneiderman: Support Internal Locus of Control | A1: Passed; A2: Failed; A3: Failed | A2 & A3: Navigating back to the event list screen resets all previously applied column filters or the rows-per-page pagination selection ([A2/A3](./images/bug%20images/Screenshot%202026-07-25%20221540.png), [A2/A3](./images/bug%20images/Screenshot%202026-07-25%20221550.png), [A2/A3](./images/bug%20images/Screenshot%202026-07-25%20221841.png), [A2/A3](./images/bug%20images/Screenshot%202026-07-25%20221904.png)) |
| GUI-028 | The currently selected tab (e.g., Pending/Resolved) is visually distinguished from unselected tabs | IA-03 | Nielsen: Visibility of System Status | A1: N/A; A2: N/A; A3: N/A | |
| GUI-029 | Switching tabs replaces the content area fully, with no residual content from the previous tab | IA-03 | Nielsen: Consistency & Standards | A1: N/A; A2: N/A; A3: N/A | |
| GUI-030 | Opening a direct URL (deep link) to a detail record loads that exact record's data | IA-03 | Nielsen: Match Between System & Real World | A1: N/A; A2: N/A; A3: Passed | |
| GUI-031 | A drag-and-drop reorder handle is visually distinguishable from non-draggable elements | IA-03 | Norman: Affordance/Signifiers | A1: N/A; A2: N/A; A3: N/A | |
| GUI-032 | A drag-and-drop reorder change persists after the page is refreshed | IA-03 | Nielsen: User Control & Freedom | A1: N/A; A2: N/A; A3: N/A | |
| GUI-033 | The search input is reachable from the listing screen without an extra navigation step | IA-03 | Shneiderman: Enable Frequent Users to Use Shortcuts | A1: Passed; A2: N/A; A3: N/A | |
| GUI-034 | Filter controls are visually separated from and clearly labeled apart from search controls | IA-03 | Nielsen: Recognition Rather Than Recall | A1: Failed; A2: N/A; A3: N/A | A1: Filter icon controls do not have clear labels ([A1](./images/bug%20images/Screenshot%202026-07-25%20161228.png)) |
| GUI-035 | Navigating away from an in-progress unsaved form triggers a confirm-discard prompt | IA-03 | Nielsen: Error Prevention; Shneiderman: Permit Easy Reversal of Actions | A1: N/A; A2: Failed; A3: Failed | A2: If a user restores a draft and navigates away again without manually editing the text, the draft is permanently lost and the input field is empty upon return ([A2](./images/bug%20images/Screenshot%202026-07-25%20181249.png), [A2](./images/bug%20images/Screenshot%202026-07-25%20181300.png)); A3: No discard prompt or draft-restore. Navigating away after making changes results in silent, permanent data loss ([A3](./images/bug%20images/Screenshot%202026-07-25%20181400.png), [A3](./images/bug%20images/Screenshot%202026-07-25%20181513.png)) |
| GUI-036 | Pagination controls display the current page number and total pages/records | IA-03 | Nielsen: Visibility of System Status | A1: Passed; A2: N/A; A3: N/A | |
| GUI-037 | A successful action (e.g., save, publish, register) triggers a confirming toast/notification | IA-04 | Nielsen: Visibility of System Status; Shneiderman: Offer Informative Feedback | A1: N/A; A2: Failed; A3: Failed | A2 & A3: No notifications, navigate back to event list screen immediately after successful action ([A2](./images/bug%20images/Screenshot%202026-07-25%20183917.png), [A2](./images/bug%20images/Screenshot%202026-07-25%20183933.png), [A2](./images/bug%20images/Screenshot%202026-07-25%20183952.png), [A3](./images/bug%20images/Screenshot%202026-07-25%20184151.png), [A3](./images/bug%20images/Screenshot%202026-07-25%20184209.png)) |
| GUI-038 | A failed action triggers a toast/notification clearly stating the failure | IA-04 | Nielsen: Help Users Recognize/Diagnose/Recover from Errors | A1: Failed; A2: Passed; A3: Passed | A1: During connection loss, delete popup shows "Loading..." and reverts to "Confirm" after the request fails, but no error message or toast is displayed to the user ([A1](./images/bug%20images/Screenshot%202026-07-25%20185829.png), [A1](./images/bug%20images/Screenshot%202026-07-25%20185836.png)) |
| GUI-039 | A destructive action (e.g., Delete, Block) requires confirmation via a dialog before executing | IA-04 | Nielsen: Error Prevention; Shneiderman: Permit Easy Reversal of Actions | A1: Passed; A2: N/A; A3: N/A | |
| GUI-040 | The confirmation dialog names the specific action and target it is confirming | IA-04 | Nielsen: Recognition Rather Than Recall | A1: Passed; A2: N/A; A3: N/A | |
| GUI-041 | A notification dot/badge count updates immediately after its triggering event occurs | IA-04 | Nielsen: Visibility of System Status | A1: Passed; A2: Passed; A3: Passed | |
| GUI-042 | A progress bar's displayed percentage matches the actual numeric ratio it represents (e.g., slots filled) | IA-04 | Norman: Feedback | A1: N/A; A2: N/A; A3: N/A | |
| GUI-043 | The same status value uses the same color coding consistently on every screen it appears | IA-04 | Nielsen: Consistency & Standards | A1: Failed; A2: N/A; A3: N/A | A1: The 'Upcoming' status color is inconsistent. It is a blue segment on analytics overview screen, but displays as a purple badge on the event list. ([A1](./images/bug%20images/Screenshot%202026-07-25%20224550.png), [A1](./images/bug%20images/Screenshot%202026-07-25%20224604.png)) |
| GUI-044 | New real-time log entries (e.g., check-in log) appear without requiring a manual page refresh | IA-04 | Nielsen: Visibility of System Status | A1: N/A; A2: N/A; A3: N/A | |
| GUI-045 | The current system state of a record (e.g., Draft/Published) is visibly indicated at all times on its screen | IA-04 | Nielsen: Visibility of System Status | A1: Passed; A2: N/A; A3: N/A | |
| GUI-046 | An administrative action (role change, password reset) produces a visible audit-log entry | IA-04 | Nielsen: Visibility of System Status; Shneiderman: Design Dialogs to Yield Closure | A1: N/A; A2: N/A; A3: N/A | |
| GUI-047 | Triggering an Export action shows visible feedback that the file is being generated/downloaded | IA-04 | Shneiderman: Offer Informative Feedback | A1: N/A; A2: N/A; A3: N/A | |
| GUI-048 | A button shows a temporary disabled/loading state during async processing to prevent duplicate submissions | IA-04 | Nielsen: Error Prevention | A1: Passed; A2: Passed; A3: Passed | |
| GUI-049 | Body text on the same page with the same hierarchy have the same color | IA-01 | Nielsen Consistency & standards; Norman Consistency; Shneiderman Strive for consistency | A1: Passed; A2: Failed; A3: Failed | A2 & A3: The labels for toggle options use bolder color than the labels for other controls, despite being in the same hierarchy ([A2/A3](./images/bug%20images/Screenshot%202026-07-25%20164424.png), [A2/A3](./images/bug%20images/Screenshot%202026-07-25%20164438.png)) |
| GUI-050 | Date/time input fields display an accessible interactive calendar pop-up, allowing direct date/time selection, highlighting weekend, current/selected dates | IA-02 | Nielsen Recognition rather than recall, Nielsen Error Prevention. | A1: Passed; A2: Passed; A3: Passed | |
| GUI-051 | Users can use the Tab key to sequentially move the focus through the items on the navigation bar (menu/sidebar) and use the Enter key to access them without being trapped (keyboard trap). | IA-03 | Nielsen Flexibility and efficiency of use | A1: Passed; A2: Failed; A3: Failed | A2 & A3: When tabbing through fields with Tab key, date picker pop-ups do not close after losing focus. Multiple calendars remain open simultaneously, stacking on top of each other and blocking fields below. ([A3](./images/bug%20images/Screenshot%202026-07-25%20190308.png), [A2](./images/bug%20images/Screenshot%202026-07-25%20190323.png)) |

## Bug report

### Bug: The date picker UI does not translate Vietnamese after toggling to Vietnamese 

- Screens: A1, A2, A3
- Steps:
  - Set language as English and open a date picker popup. Notice the language in the calendar setting and the time setting.
  - Switch language to Vietnamese.
- Expected result: Calendar and time setting change to Vietnamese.
- Actual result: Calendar and time setting stay as English.
- Severity: Low
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20144816.png)
![](./images/bug%20images/Screenshot%202026-07-25%20210517.png)
![](./images/bug%20images/Screenshot%202026-07-25%20144204.png)

### Bug: The hint of WYSIWYG text box remains in English after switching to Vietnamese

- Screens: A2
- Severity: Low
- Steps:
  - Go to the create event page.
  - Set the language as English and notice the hint of WYSIWYG text box.
  - Switch language to Vietnamese.
- Expected result: The hint gets translate to Vietnamese.
- Actual result: The hint remains as English.
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20143827.png)

### Bug: The filter (funnel) icon next to the 'EVENT TYPES' header acts as an icon-only control but lacks a descriptive tooltip or text label on hover to indicate its filtering function

- Screens: A1
- Steps:
  - Go to event list page.
  - Hover the mouse over the filter (funnel) icon.
- Expected result: The filter icon has a tooltip like the 'View detail' icon.
- Actual result: The filter icon has no tooltip, nor a dedicated label (the label next to it is a column header, not its label)
- Severity: Low
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20161228.png)
![](./images/bug%20images/Screenshot%202026-07-25%20161245.png)

### Bug: Other icon controls of the rich text box show, except for the text style(p, h1, h2,...) icon, the color icon, the highlight icon, the aligment icon and the font size icon

- Screens: A2
- Steps:
  - Go to create event page.
  - Scroll down to the rich text box.
  - Hover the text style icon, the color icon, the highlight icon, the aligment icon and the font size icon
- Expected result: These icon show tooltips.
- Actual result: These icon do not show tooltips 
- Severity: Low
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20161736.png)
![](./images/bug%20images/Screenshot%202026-07-25%20164311.png)
![](./images/bug%20images/Screenshot%202026-07-25%20164319.png)
![](./images/bug%20images/Screenshot%202026-07-25%20164330.png)
![](./images/bug%20images/Screenshot%202026-07-25%20164351.png)

### Bug: 'Role Name' and 'Max Slots' are required but there are no indicators

- Screens: A2, A3
- Steps:
  - Go to create event page or edit event page.
  - Scroll down to the 'Registration' section.
  - Enable 'Allow Student Registration'.
- Expected result: 'Role Name' and 'Max Slots' fields of Student Roles panel have indicators that these fields are required.
- Actual result: There are no indicators. The validation error showed up after clicking submit button.
- Severity: Medium
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20220330.png)
![](./images/bug%20images/Screenshot%202026-07-25%20164900.png)
![](./images/bug%20images/Screenshot%202026-07-25%20165010.png)

### Bug: The 'Time' filter allows an end date earlier than the start date and displays 'No events found matching your filters.' instead of showing an error or preventing the invalid selection.

- Screens: A1
- Steps:
  - Go to event list page.
  - Open the 'Time' filter dropdown.
  - Set the end date to be earlier than the start date.
- Expected result: The system prevents selection or rejects the input with a clear validation error.
- Actual result: The selection is accepted, and the list displays "No events found matching your filters." without error.
- Severity: Medium
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20213411.png)
![](./images/bug%20images/Screenshot%202026-07-25%20213606.png)

### Bug: The form accepts image uploads that deviate from the recommended aspect ratios (4:3/24:9) without displaying any mismatch warning or error.

- Screens: A2
- Steps:
  - Go to create event page or edit event page.
  - Upload an image to the event thumbnail input field that does not match the recommended aspect ratio (4:3 / 24:9).
- Expected result: A warning is shown or the mismatched upload is rejected.
- Actual result: The image is uploaded successfully without any aspect ratio warning or error.
- Severity: Low
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20170602.png)

### Bug: Navigating back to the event list screen resets all previously applied column filters or the rows-per-page pagination selection

- Screens: A2, A3
- Steps:
  - Go to event list page.
  - Apply 'Conferences & Seminars' for the 'EVENT TYPE' column filter.
  - Select '100' for 'Rows per page'
  - Go to create event page or edit event page.
  - Use the back button or sidebar menu to return to the event list.
- Expected result: Applied filters and pagination settings are preserved on return.
- Actual result: All applied column filters and pagination configurations are reset to default states.
- Severity: Medium
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20221540.png)
![](./images/bug%20images/Screenshot%202026-07-25%20221550.png)
![](./images/bug%20images/Screenshot%202026-07-25%20221841.png)
![](./images/bug%20images/Screenshot%202026-07-25%20221904.png)

### Bug: Filter icon controls do not have clear labels

- Screens: A1
- Steps:
  - Go to event list page.
  - Observe and hover the filter control for 'EVENT TYPE'.
- Expected result: Filter icon button contains a descriptive hover tooltipa or a visible label.
- Actual result: Only the raw filter icon is shown without any descriptive label or tooltip.
- Severity: Low
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20161228.png)

### Bug: If a user restores a draft and navigates away again without manually editing the text, the draft is permanently lost and the input field is empty upon return

- Screens: A2
- Steps:
  - Go to the create event page and type 'Hello world' to the 'Event title' field.
  - Hit the back button.
  - Go to the create event page again.
  - Click on the "Restore" option in the unfinished draft dialog.
  - Hit the back button to navigate away without manually editing the 'Event title' field.
  - Go to the create event page again.
- Expected result: The restored draft content is preserved.
- Actual result: The draft is permanently cleared and the input field is empty.
- Severity: High
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20181249.png)
![](./images/bug%20images/Screenshot%202026-07-25%20181300.png)

### Bug: No discard prompt or draft-restore. Navigating away after making changes results in silent, permanent data loss

- Screens: A3
- Steps:
  - Go to create edit event page.
  - Scroll down to the Registration and modify role details.
  - Navigate away to another page using the sidebar or navigation menu without saving.
- Expected result: A confirm-discard dialog prompt warns the user of unsaved changes.
- Actual result: The system navigates away silently, resulting in permanent data loss.
- Severity: High
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20181400.png)
![](./images/bug%20images/Screenshot%202026-07-25%20181513.png)

### Bug: No notifications, navigate back to event list screen immediately after successful action

- Screens: A2, A3
- Steps:
  - Go to create event page or edit event page.
  - Modify some fields and click the save/submit button.
- Expected result: A success toast or message notification confirms the change has been saved.
- Actual result: The system navigates back to the event list screen immediately with no success indicator.
- Severity: Medium
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20183917.png)
![](./images/bug%20images/Screenshot%202026-07-25%20183933.png)
![](./images/bug%20images/Screenshot%202026-07-25%20183952.png)
![](./images/bug%20images/Screenshot%202026-07-25%20184151.png)
![](./images/bug%20images/Screenshot%202026-07-25%20184209.png)

### Bug: During connection loss, delete popup shows "Loading..." and reverts to "Confirm" after the request fails, but no error message or toast is displayed to the user

- Screens: A1
- Steps:
  - Go to event list page.
  - Trigger offline mode or simulate connection loss.
  - Click delete on an event.
  - Click the "Confirm" delete button in the confirmation modal.
- Expected result: An error message or toast states that the delete action failed due to connection loss.
- Actual result: The button changes to "Loading...", then reverts to "Confirm" after the request fails, without any error message or toast.
- Severity: Medium
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20185829.png)
![](./images/bug%20images/Screenshot%202026-07-25%20185836.png)

### Bug: The 'Upcoming' status color is inconsistent. It is a blue segment on analytics overview screen, but displays as a purple badge on the event list.

- Screens: A1
- Steps:
  - Go to event list page.
  - Locate the 'Upcoming' status badge.
  - Go to analytics overview screen and observe the 'Upcoming' status segment on the pie chart.
- Expected result: Consistent color theme (same color coding) representing 'Upcoming' status across the app.
- Actual result: The status uses blue on the analytics screen but purple on the event list.
- Severity: Low
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20224550.png)
![](./images/bug%20images/Screenshot%202026-07-25%20224604.png)

### Bug: The labels for toggle options use bolder color than the labels for other controls, despite being in the same hierarchy

- Screens: A2, A3
- Steps:
  - Go to create event page or edit event page.
  - Compare the labels of toggle items (e.g., "Allow Student Registration") with normal field labels.
- Expected result: Labels at the same level of hierarchy have matching font weight and color.
- Actual result: Toggle labels are rendered in a bolder/darker color compared to other field labels.
- Severity: Low
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20164424.png)
![](./images/bug%20images/Screenshot%202026-07-25%20164438.png)

### Bug: When tabbing through fields with Tab key, date picker pop-ups do not close after losing focus. Multiple calendars remain open simultaneously, stacking on top of each other and blocking fields below.

- Screens: A2, A3
- Steps:
  - Go to create event page or edit event page.
  - Focus on a date input field using keyboard tab navigation.
  - Tab to the next input field without selecting a date.
- Expected result: The calendar dropdown closes automatically once focus leaves the input field.
- Actual result: Calendars remain open, stacking on top of each other and covering active form elements.
- Severity: Medium
- Screenshots:

![](./images/bug%20images/Screenshot%202026-07-25%20190308.png)
![](./images/bug%20images/Screenshot%202026-07-25%20190323.png)

# Appendices

## Appendix A

[AI Audit Report](./[AI-02]%20-%20FIT@HCMUS%20-%20AI%20Audit%20Report.md)

[AI Critique](./AI_critique.md)

## Appendix B

[Self-assessment & Test summary report](./README.md)