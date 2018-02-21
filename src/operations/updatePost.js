const addPost = require('./addPost')

function updatePost(b, item) {
    const oldPost = b.getPost(item.payload.previousVersion)
    if (item.key === oldPost.key) {
        addPost(b, item)
        b.updateContent(
            b._index.posts,
            item.payload.previousVersion,
            item.hash
        )
    }
}

module.exports = updatePost 