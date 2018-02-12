
class BoardIndex {
  constructor() {
    this._index = {
      posts: {},
      comments: {},
      metadata: getDefaultMetadata()
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
    return this._index.posts[multihash]
  }
  
  updateIndex(oplog) {
    oplog.values
      .slice()
      .forEach(item => {
          if(item.payload.op === 'ADD_POST') {
            this._index.posts[item.hash] = {
              title: item.payload.title,
              contentType: item.payload.contentType
            }
            if (item.payload.multihash) {
              this._index.posts[item.hash].multihash = item.payload.multihash
            } else if(item.payload.text) {
              this._index.posts[item.hash].text = item.payload.text
            }
          } else if(item.payload.op === 'UPDATE_METADATA') {
            this._index.metadata = item.payload.metadata
          }
      })
  }
}

function getDefaultMetadata() {

}

module.exports = BoardIndex