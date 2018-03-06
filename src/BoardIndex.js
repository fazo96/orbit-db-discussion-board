const addPost = require('./operations/addPost')
const updatePost = require('./operations/updatePost')
const addComment = require('./operations/addComment')
const updateComment = require('./operations/updateComment')
const _ = require('lodash')

class BoardIndex {
  constructor() {
    this._index = {
      posts: {},
      comments: {},
      administrations: {
        anarchy: getDefaultMetadata()
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
    return this._index.posts[this.resolvePost(multihash)]
  }

  resolvePost(multihash) {
    return this.resolveLink(this._index.posts, multihash)
  }

  resolvePostBackwards(multihash) {
    return this.resolveLinkBackwards(this._index.posts, multihash)
  }

  resolveComment(postId, commentId) {
    this.prepareCommentsFor(postId, commentId)
    return this.resolveLink(this._index.comments[postId], commentId)
  }

  getComments(postMultihash, replyTo = 'post') {
    const multihash = this.resolvePostBackwards(postMultihash)
    const comments = _.get(this._index.comments, [multihash, replyTo], {})
    return Object.keys(comments)
      // Remove fwd pointers
      .filter(c => typeof comments[c] === 'object')
      // write multihash
      .map(c => {
        return Object.assign({ multihash: c }, comments[c])
      })
  }

  getComment(postId, commentId, replyTo = 'post') {
    const multihash = this.resolvePostBackwards(postId)
    return _.get(this._index.comments, [multihash, replyTo, commentId], null) 
  }

  resolveLink(container, key, history = []) {
    if (key && container[key]) {
       if (typeof container[key] === 'object') {
        if (typeof container[key].nextVersion === 'string') {
          const next = container[key].nextVersion
          if (history.indexOf(next) >= 0) {
            // Recursive link
            return undefined
          } else {
            return this.resolveLink(container, next, history.concat(key))
          }
        } else {
          return key
        }
      } else if (typeof container[key] === 'string') {
        if (history.indexOf(container[key]) >= 0) {
          // Recursive link
          return undefined
        } else {
          return this.resolveLink(container, container[key], history.concat(key))
        }
      }
    }
  }

  resolveLinkBackwards(container, key, history = []) {
    if (key && container[key]) {
      if (typeof container[key] === 'object') {
        if (container[key].previousVersion) {
          const oldKey = container[key].previousVersion
          if (history.indexOf(oldKey) >= 0) {
            // Recursive link
            return undefined
          } else {
            return this.resolveLinkBackwards(container, oldKey, history.concat(key))
          }
        } else {
          return key
        }
      } else if (typeof container[key] === 'string') {
        for (const k in container) {
          if (container[k] === key) {
            if (history.indexOf(k) >= 0) {
              // Recursive link
              return undefined
            } else {
              return this.resolveLinkBackwards(container, k, history.concat(key))
            }
          }
        }
        return key
      }
    }
  }

  prepareCommentsFor(postId, replyTo = null) {
    if (!this._index.comments[postId]) {
      this._index.comments[postId] = {}
    }
    if (!this._index.comments[postId].post) {
      this._index.comments[postId].post = {}
    }
    if (replyTo && !this._index.comments[postId][replyTo]) {
      this._index.comments[postId][replyTo] = {}
    }
  }

  updateContent(container, currentKey, newKey) {
    const toUpdate = this.resolveLink(container, currentKey)
    container[toUpdate] = newKey
    container[newKey].previousVersion = toUpdate
  }
  
  updateIndex(oplog) {
    oplog.values
      .slice()
      .forEach(item => {
        if(item.payload.op === 'ADD_POST') {
          addPost(this, item)
        } else if(item.payload.op === 'UPDATE_POST') {
          updatePost(this, item)
        } else if (item.payload.op === 'ADD_COMMENT'){
          addComment(this, item)
        } else if (item.payload.op === 'UPDATE_COMMENT'){
          updateComment(this, item)
        } else if(item.payload.op === 'UPDATE_METADATA') {
          this._index.administrations.anarchy = item.payload.metadata
        }
      })
  }
}

function getDefaultMetadata() {
  return {
    title: 'Unnamed Board'
  }
}

module.exports = BoardIndex