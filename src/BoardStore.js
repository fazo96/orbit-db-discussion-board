const Store = require('orbit-db-store')
const BoardIndex = require('./BoardIndex')

class Board extends Store {
  constructor(ipfs, id, dbname, options) {
    if (!options) options = {}
    if (!options.Index) Object.assign(options, { Index: BoardIndex })
    super(ipfs, id, dbname, options)
    this._type = 'discussion-board' 
  }

  static get type() {
    return 'discussion-board'
  }

  async updateMetadata(metadata) {
    return await this._addOperation({
      op: 'UPDATE_METADATA',
      metadata
    })
  }

  async addPost(post) {
    const op = {
      op: 'ADD_POST',
      post: preparePost(post)
    }
    return await this._addOperation(op)
  }

  async updatePost(id, post) {
    const op = {
      op: 'UPDATE_POST',
      previousVersion: id,
      post: preparePost(post)
    }
    return await this._addOperation(op)
  }

  get posts() {
    return this._index.posts
  }

  getPost(multihash) {
    return this._index.getPost(multihash)
  }
}

function preparePost(post) {
  const op = {
    title: post.title || 'Untitled Post'
  }
  if (post.multihash) {
    op.multihash = post.multihash
    op.contentType = post.contentType
  } else {
    op.text = post.text || ''
    op.contentType = op.contentType || 'text/plain'
  }
  return op
}

module.exports = Board