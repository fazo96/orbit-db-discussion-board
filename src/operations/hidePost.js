
function hidePost(b, item) {
    const oldPost = b.getPost(item.payload.postId)
    if (oldPost && item.key === oldPost.key) {
        b.hideContent(
            b._index.posts,
            item.payload.postId
        )
    }
}

module.exports = hidePost 