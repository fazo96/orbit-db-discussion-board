
function hideComment(b, item) {
    const { replyTo, commentId, postId } = item.payload
    const oldComment = b.getComment(postId, commentId, replyTo)
    if (oldComment && item.key === oldComment.key) {
        b.hideContent(
            b._index.comments[postId][replyTo],
            commentId
        )
    }
}

module.exports = hideComment