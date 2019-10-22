const addComment = require('./addComment')

function updateComment(b, item) {
    const { replyTo, postId, previousVersion } = item.payload
    const oldComment = b.getComment(postId, previousVersion, replyTo)
    if (oldComment && item.identity.publicKey === oldComment.key) {
        addComment(b, item)
        b.updateContent(
            b._index.comments[postId][replyTo],
            previousVersion,
            item.hash
        )
    }
}

module.exports = updateComment
