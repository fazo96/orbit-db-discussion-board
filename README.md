# OrbitDB Board Store

Three years ago I was working on IPFS Boards. A lot has changed since then
and now the project should be started from scratch.

This is a Store for Orbit DB that can handle discussion boards
with posts and comments.

Nothing works yet :(

Here's some notes about what's going on

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

Boards are aggregators

- each Post is an indipendent entity
- Boards are just aggregation: they link to posts
- this means no more wonky crossposting

Post

- has a content and content type
- can be commented on
- can be linked from other posts, boards

Comments

- can be linked to
- has a content
- can be written to the post (public comment)
- can also be written to the board (private comments)
- can be a response to another comment from the same universe (public/private)