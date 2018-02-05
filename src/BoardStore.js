const Store = require('orbit-db-store')
const BoardIndex = require('./BoardIndex')

class Board extends Store {
  constructor(ipfs, id, dbname, options) {
    if (!options) options = {}
    if (!options.indexBy) Object.assign(options, { indexBy: '_id' })
    if (!options.Index) Object.assign(options, { Index: BoardIndex })
    super(ipfs, id, dbname, options)
    this._type = 'discussion-board' 
  }

  static get type() {
    return 'discussion-board'
  }

  updateMetadata(metadata) {
    this._addOperation({
      op: 'UPDATE_METADATA',
      metadata
    })
  }

  addPost(title, multihash) {
    this._addOperation({
      op: 'ADD_POST',
      title,
      multihash 
    })
  }

  updatePost() {
    throw new Error('Not implemented yet')
  }

  addComment() {
    throw new Error('Not implemented yet')
  }

  updateComment() {
    throw new Error('Not implemented yet')
  }

  get title() {
    return this._index.title
  }

  get posts() {
    return this._index.posts
  }

  getPost(multihash) {
    return this._index.getPost(multihash)
  }
}

module.exports = Board