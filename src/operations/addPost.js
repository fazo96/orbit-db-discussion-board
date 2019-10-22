
function addPost(b, item) {
  if (!b._index.posts[item.hash] && item.payload.post) {
    b._index.posts[item.hash] = {
      title: item.payload.post.title,
      contentType: item.payload.post.contentType,
      key: item.identity.publicKey
    }
    if (item.payload.post.multihash) {
      b._index.posts[item.hash].multihash = item.payload.post.multihash
    } else if(item.payload.post.text) {
      b._index.posts[item.hash].text = item.payload.post.text
    }
  }
}

module.exports = addPost
