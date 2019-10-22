const Store = require('orbit-db-store')
const BoardIndex = require('./BoardIndex')

class Board extends Store {
  constructor(ipfs, identity, dbname, options) {
    if (!options) options = {}
    if (!options.Index) Object.assign(options, { Index: BoardIndex })
    super(ipfs, identity, dbname, options)
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

  async commentPost(postId, comment, replyTo = 'post') {
    const op = {
      op: 'ADD_COMMENT',
      postId,
      comment: prepareComment(comment),
      replyTo
    }
    return await this._addOperation(op)
  }

  async updateComment(postId, commentId, replyTo = 'post', comment) {
    const op = {
      op: 'UPDATE_COMMENT',
      postId,
      replyTo,
      previousVersion: commentId,
      comment: prepareComment(comment)
    }
    return await this._addOperation(op)
  }

  async hidePost(postId) {
    const op = {
      op: 'HIDE_POST',
      postId
    }
    return await this._addOperation(op);
  }

  async hideComment(postId, commentId, replyTo = 'post') {
    const op = {
      op: 'HIDE_COMMENT',
      postId,
      commentId,
      replyTo
    }
    return await this._addOperation(op);
  }

  get posts() {
    return this._index.posts
  }
  
  get metadata() {
    return this._index.metadata
  }

  getPost(multihash) {
    return this._index.getPost(multihash)
  }

  getComment(postMultihash, commentId, replyTo = 'post') {
    return this._index.getComment(postMultihash, commentId, replyTo);
  }

  getComments(postMultihash, replyTo = 'post') {
    return this._index.getComments(postMultihash, replyTo)
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

function prepareComment(comment) {
  return {
    text: comment.text,
    contentType: comment.contentType || 'text/plain'
  }
}

module.exports = Board
