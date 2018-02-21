const addPost = require('./operations/addPost')
const updatePost = require('./operations/updatePost')

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
    return this._index.posts[this.resolveLink(this._index.posts, multihash)]
  }

  resolveLink(container, key, history = []) {
    if (container[key]) {
       if (typeof container[key] === 'object') {
        if (typeof container[key].nextVersion === 'string') {
          const next = container[key].nextVersion
          return this.resolveLink(container, next, history.concat(key))
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
        } else if(item.payload.op === 'UPDATE_METADATA') {
          this._index.administrations.anarchy = item.payload.metadata
        }
      })
  }
}

function getDefaultMetadata() {

}

module.exports = BoardIndex