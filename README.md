# Focus Dungeon

## Description

**Focus Dungeon** is a productivity app designed to help users stay focused and motivated by gamifying their work sessions. Inspired by indie RPG games, the app transforms your focus time into an adventurous quest where you earn experience points (XP), level up, and unlock achievements. The app combines the thrill of gaming with the discipline of productivity, making it easier to stay on task and achieve your goals.

### Purpose
The purpose of Focus Dungeon is to make productivity fun and engaging. By turning work sessions into a game, users are motivated to stay focused, complete tasks, and track their progress over time. The app is perfect for students, professionals, or anyone who wants to improve their focus and productivity.

### Theme and Inspiration
The app is heavily inspired by **indie RPG games** and retro dungeon crawlers. The design, sound effects, and visuals are crafted to give users the feeling of embarking on an epic quest. The leveling system, achievements, and focus streaks are all designed to mimic the progression systems found in RPGs, making productivity feel like an adventure.

---

## Features

### Current Features
1. **Focus Timer**:
   - Set a timer for your focus session.
   - Pause, reset, or finish early.
   - Track your focus time in hours, minutes, and seconds.

2. **XP and Leveling System**:
   - Earn XP for completing focus sessions.
   - Level up as you accumulate XP.
   - Exponential XP growth for higher levels, making progression more challenging.

3. **Achievements**:
   - Unlock achievements for completing milestones (e.g., first focus session, 3-day streak, 1 hour of focus time).
   - Achievement notifications with sound effects and visual feedback.

4. **Focus Streaks**:
   - Track consecutive days of completing focus sessions.
   - Streaks reset if you miss a day.

5. **Daily Goal Tracking**:
   - Set a daily focus goal (e.g., 25 minutes).
   - Track your progress toward the goal with a progress bar.

6. **Stats Panel**:
   - View your total focus time, sessions completed, longest streak, and daily goal progress.
   - Level progress bar to track your progress toward the next level.

7. **Celebration Modal**:
   - Celebrate completing a focus session with a modal that shows XP earned, focus time, and level progress.
   - Custom messages based on completion percentage.

8. **Sound Effects and Music**:
   - Background music and sound effects to enhance the gaming experience.
   - Victory sounds for completing sessions and unlocking achievements.

9. **User Data Persistence**:
   - Save user data (XP, level, streak, achievements) to `localStorage`.
   - Load user data on app initialization.

---

### Usage

1.  **Set a Timer**:

    -   Use the arrows to adjust the timer.

    -   Click "START FOCUS MODE" to begin your focus session.

2.  **Track Progress**:

    -   View your focus time, XP, and level progress in real-time.

    -   Check your stats in the "Adventurer's Log" (stats panel).

3.  **Celebrate**:

    -   After completing a session, a celebration modal will show your XP earned and level progress.

* * * * *

Roadmap (To-Do List)
https://trello.com/b/EEZOQutF/focusdungeon
--------------------

### Current Features to Improve

-  **Responsive Design**:

    - Works on both desktop and mobile devices.

    - Adjusts layout for smaller screens.


-   **User Authentication**:

    -   Integrate the existing user database for login/signup functionality. (DONE)

    -   Sync user data (XP, level, achievements) with the database.

-   **Unlock Achievements**:

    -   Complete focus sessions to unlock achievements. (IN PROGRESS)

    -   View unlocked achievements in the stats panel. 

-   **Leaderboard**:

    -   Add a **world leaderboard** to compare progress with all users.

    -   Add a **friends leaderboard** to compare progress with friends.

-   **Friend System**:

    -   Add **friend requests** and a friends list.

    -   Allow users to send and accept friend requests.

-   **Customizable Themes**:

    -   Allow users to choose different themes (e.g., forest, dungeon, space).

-   **Achievement System**:

    -   Improve the achievement system to include more milestones and rewards.

    -   Add a dedicated achievements page in the stats panel.

-   **Database Integration**:

    - Sync user progress with the database instead of `localStorage`.
    - Odjebkat lvl z db a pridat logiku na pocitani levelu do backendu

### New Features to Add

-   **Quests**:

    -   Add daily or weekly quests with special rewards.

-   **Power-Ups**:

    -   Introduce power-ups that users can unlock to enhance their focus sessions (e.g., double XP for 30 minutes).

-   **Multiplayer Mode**:

    -   Allow users to team up with friends and complete focus sessions together.


* * * * *

Backend Tasks
-------------

### Database Updates

-   **Add New Tables**:

    -   Create a table for `user_stats` to store:

        -   `user_id` (foreign key to users table)

        -   `level`

        -   `xp`

        -   `total_focus_time`

        -   `longest_streak`

        -   `achievements` (store as JSON or separate table)

    -   Create a table for `friends` to store:

        -   `user_id`

        -   `friend_id`

        -   `status` (pending, accepted)

-   **Sync Data**:

    -   Sync user progress (XP, level, achievements) with the database after each session.

    -   Load user data from the database on app initialization.

### API Endpoints

-   **User Stats**:

    -   `GET /api/user/stats` - Fetch user stats (XP, level, achievements).

    -   `POST /api/user/stats` - Update user stats after a session.

-   **Leaderboard**:

    -   `GET /api/leaderboard/world` - Fetch world leaderboard.

    -   `GET /api/leaderboard/friends` - Fetch friends leaderboard.

-   **Friend System**:

    -   `POST /api/friends/request` - Send a friend request.

    -   `POST /api/friends/accept` - Accept a friend request.

    -   `GET /api/friends/list` - Fetch the user's friends list.

* * * * *

Frontend Tasks
--------------

### Files to Update

-   **`celebrationModal.js`**:

    -   Add logic to sync user data with the database after each session.

    -   Update the celebration modal to show leaderboard rankings.

-   **`userStats.js`**:

    -   Add a new section for achievements in the stats panel.

    -   Add a friends list and leaderboard UI.

-   **`setTime.js`**:

    -   Add logic to fetch and display leaderboard data.

    -   Add logic to handle friend requests and friends list.

-   **`setTime.html`**:

    -   Add new UI elements for leaderboards, friends list, and achievements.


--------------

## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/FIS-VSE/4IT115/2025LS/ut1430/phat28/focus-dungeon.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/FIS-VSE/4IT115/2025LS/ut1430/phat28/focus-dungeon/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
