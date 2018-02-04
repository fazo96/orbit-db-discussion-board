# OrbitDB Board Store

This is a work in progress Store for Orbit DB that tries to handle discussion boards
with posts and comments.

Nothing works yet :(

Planned features

- create, rename boards
- ‎anyone can post and comment
- ‎edit and update your posts and comments

Stuff that should get done later

- moderation
- user profiles

Tech

- OrbitDB custom database type, one db per board
- ‎OrbitDB keys are identity
- ‎when opening a board the client syncs the history and checks for validity

Boards are aggregators

- each Post is an indipendent entity
- Boards are just aggregation: they link to posts

Posts

- has its cid and optionally a contentType stored in the board
- anything on IPFS can be a post

Comments

- can be linked to
- has a content
- is written in the board 
- can be a response to another comment