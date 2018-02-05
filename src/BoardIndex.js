
class BoardIndex {
  constructor(id) {
    this._index = {
      posts: {},
      comments: {},
      metadata: {
        title: 'Unnamed Board'
      }
    }
  }

  get metadata() {
    return this._index.metadata
  }

  get posts() {
    return Object.values(this._index.metadata.posts)
  }

  getPost(multihash) {
    return this.posts[multihash]
  }
  
  updateIndex(oplog) {
    oplog.values
      .slice()
      .reverse()
      .forEach(item => {
          if(item.payload.op === 'ADD_POST') {
            this._index.posts[item.payload.multihash] = {
              title: item.payload.title,
              multihash: item.payload.multihash
            }
          } else if(item.payload.op === 'UPDATE_METADATA') {
            this._index.metadata = item.payload.metadata
          }
      })
  }
}

module.exports = BoardIndex