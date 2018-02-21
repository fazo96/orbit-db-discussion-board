# OrbitDB Board Store

This is a work in progress Store for Orbit DB that tries to handle discussion boards
with posts and comments.

This is being built as part of [IPFS Boards](https://github.com/fazo96/ipfs-boards)

What it does right now

- create a discussion board and change some metadata like the title
- create posts with a title and a multihash pointing to the content, or some text
- update your posts
- comment to a post
- reply to comments

What's planned

- update your comments
- delete your post or comment
- Curation
    - create
    - have multiple members
    - blacklist specific posts or comments
    - blacklist specific users by public key
    - only allow specific users to post
    - lock comments in a specific post
    - disable comments globally
    - sticky posts
    - manual approval mode, where content needs to be manually approved

Ideas

- user profile, per-board. Curators will be able to influence how
they work. Might start with just an alias/username
- address book to assign an alias to public keys you trust
- smart timestamping: curators can be in charge of automatically timestamping
content based on when they receive it, using always-online dedicated nodes
- a system to authenticate using a third party like keybase or uport
- a voting system, but ideas on how to do it right have been lacking

## Notes

### Moderation

I spent a lot of time thinking about this and as a first try I'd like
moderation to be implemented this way:

by default a board operates in anarchy mode where all content is visible
and the last edit to metadata wins.

Users can create a Curation by giving it a name and appointing
themselves as admins. They can then name moderators and keep a version
of the board metadata maintained by them including settings related to
who can post and blacklists/whitelists. They can also individually
hide or approve posts and comments.

The user uses anarchy mode by default and can choose one or more
curations to "follow", effectively agreeing to filter the
content using their rules. The user can change his
mind at any time (since it's client side) and also check out any
hidden content or other curators.

### Posts

can contain text or arbitrary content linked via multihash. They have a content type
field for hinting at what is inside the multihash or which kind of text was posted.

### Comment

can be on a post or a response to another comment. Contains only text