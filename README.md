# IPFS Boards Rebooted

Three years ago IPFS Boards was in development. A lot has changed since then
and now the project should be started from scratch.

These are some notes I'm writing to plan development

Features in initial release

- create, rename boards
- ‎anyone can post and comment
- ‎edit and update your posts and comments
- ‎admin can hide posts and comments and block users
- ‎user can block other users (hides content)
- ‎advertise board and search boards being advertised
- ‎user profile with name and bio

Tech

- OrbitDB custom database type, one db per board
- ‎js lib with tests separate from react-redux-saga UI
- ‎OrbitDB keys are identity
- ‎when opening a board the client syncs the history and checks for validity

UI

- react app, semantic UI, redux + redux saga
- ‎discover boards, advertise boards
- ‎edit profile
- ‎view posts, comments
- ‎create board
- ‎create post
- ‎comment on posts or reply to comments
