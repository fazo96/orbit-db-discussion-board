
class BoardIndex {
  constructor(id) {
    this._index = {}
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