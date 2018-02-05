
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
    return Object.assign({}, this._index.metadata)
  }

  get posts() {
    return Object.keys(this._index.posts).map(m => {
      return Object.assign({ multihash: m }, this._index.posts[m])
    })
  }

  getPost(multihash) {
    return this.posts[multihash]
  }
  
  updateIndex(oplog) {
    oplog.values
      .slice()
      .forEach(item => {
          if(item.payload.op === 'ADD_POST') {
            this._index.posts[item.payload.multihash] = {
              title: item.payload.title
            }
          } else if(item.payload.op === 'UPDATE_METADATA') {
            this._index.metadata = item.payload.metadata
          }
      })
  }
}

module.exports = BoardIndex