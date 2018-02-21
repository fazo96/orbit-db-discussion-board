# OrbitDB Board Store

This is a work in progress Store for Orbit DB that tries to handle discussion boards
with posts and comments.

What can you do

- create a discussion board and change some metadata like the title
- create posts with a title and a multihash pointing to the content, or some text
- update a post, if you were the original creator
- comment to a post

What's planned

- comment on posts or as a reply to other comments

### Moderation

I spent a lot of time thinking about this and as a first try I'd like
moderation to be implemented this way:

by default a board operates in anarchy mode where all content is visible
and the last edit to metadata wins.

Users can create Administrations by giving it a name and appointing
themselves as admins. They can then name moderators and keep a version
of the board metadata maintained by them including settings related to
who can post and blacklists/whitelists. They can also individually
hide or approve posts and comments.

The user uses anarchy mode by default and can choose one or more
administrations to "follow", effectively agreeing to filter the
content using the administration's rules. The user can change his
rule at any time (since it's client side) and also check out any
hidden content or other administrations.

Other planned features

- User profiles. Need to decide between per-board or general. Probably per-board
with the ability to import it from another board or use one profile and have it
written on all the boards visited
- address book to assign an alias to public keys you trust
- smart timestamping: since we can't trust arbitrary timestamps, the administration
you follow will have an always online node that periodically writes a timestamp
into the board. Then you can look at which timestamps were published right after
and right before a post/comment and you can know roughly when it was published

### Posts

can contain text or arbitrary content linked via multihash. They have a content type
field for hinting at what is inside the multihash or which kind of text was posted.

### Comment

can be on a post or a response to another comment. Contain only text