
function addComment(b, item) {
  const postId = b.resolvePostBackwards(item.payload.postId)
  if (postId) {
    let replyTo = item.payload.replyTo || 'post'
    if (replyTo != 'post') {
      replyTo = b.resolveComment(postId, replyTo)
    }
    b.prepareCommentsFor(postId, replyTo)
    if (!b._index.comments[postId][replyTo][item.hash]) {
      b._index.comments[postId][replyTo][item.hash] = {
        text: item.payload.comment.text,
        contentType: item.payload.comment.contentType,
        key: item.key
      }
    }
  }
}

module.exports = addComment