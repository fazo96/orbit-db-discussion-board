const assert = require('chai').assert
const rmrf = require('rimraf')
const OrbitDB = require('orbit-db')
const IPFSFactory = require('ipfsd-ctl')

const dbPath = './orbitdb/tests/'
const dbName = 'dicussion-board-test'
const ipfsPath = './orbitdb/tests/ipfs'
const timeoutMs = 10000

const BoardStore = require('../src/BoardStore')
OrbitDB.addDatabaseType(BoardStore.type, BoardStore)

const ipfsConfig = {
    repo: ipfsPath,
    EXPERIMENTAL: {
      pubsub: true
    },
    config: {
      Addresses: {
        API: '/ip4/127.0.0.1/tcp/0',
        Swarm: ['/ip4/0.0.0.0/tcp/0'],
        Gateway: '/ip4/0.0.0.0/tcp/0'
      },
      Bootstrap: [],
      Discovery: {
        MDNS: {
          Enabled: true,
          Interval: 1
        },
        webRTCStar: {
          Enabled: false
        }
      },
    }
 }

async function startIpfs() {
    const ipfs = await new Promise(resolve => {
      IPFSFactory
        .create({
            type: 'proc',
            exec: require('ipfs')
        })
        .spawn(ipfsConfig, async (err, ipfsd) => {
            if (err) reject(err); else resolve(ipfsd.api)
        })
    })
    return ipfs
}

describe('OrbitDB Discussion Board', function () {
    this.timeout(timeoutMs)

    let ipfs, orbitdb1, db

    before(async () => {
        rmrf.sync(dbPath)
        rmrf.sync(ipfsPath)
        ipfs = await startIpfs()
        orbitdb1 = new OrbitDB(ipfs, dbPath + '/1')
    })

    after(async () => {
        if (orbitdb1) await orbitdb1.stop()
        if (ipfs) await ipfs.stop()
    })

    beforeEach(async () => {
        db = await orbitdb1.open(dbName, {
            type: BoardStore.type,
            create: true,
            directory: dbPath
        })
    })

    afterEach(async () => {
        await db.drop()
    })

    it('creates and opens a database', async () => {
        db = await orbitdb1.open('first database', {
            type: BoardStore.type,
            create: true
        })
    })

    it('add post', async () => {
        const hash = await db.addPost({
            title: 'Post Title',
            text: 'hello world'
        })
        const post = db.getPost(hash)
        assert.equal(post.title, 'Post Title')
        assert.equal(post.text, 'hello world')
        assert.equal(post.contentType, 'text/plain')
        assert.equal(post.key, orbitdb1.key.getPublic('hex'))
    })

    it('update post', async () => {
        const hash = await db.addPost({
            title: 'Post Title',
            text: 'hello world'
        })
        const post = db.getPost(hash)
        const updatedHash = await db.updatePost(hash, {
            title: 'Post Title',
            text: 'actually I changed my mind'
        })
        const updatedPost = db.getPost(hash)
        assert.deepEqual(db.getPost(hash), db.getPost(updatedHash))
        assert.equal(updatedPost.title, 'Post Title')
        assert.equal(updatedPost.text, 'actually I changed my mind')
    })

    it('hide post', async () => {
        const hash = await db.addPost({
            title: 'Post Title',
            text: 'hello world'
        })
        await db.hidePost(hash)
        const post = await db.getPost(hash)
        assert.equal(post.hidden, true)
    })

    it('add comment to post', async () => {
        const hash = await db.addPost({
            title: 'Post Title',
            text: 'hello world'
        })
        const commentHash = await db.commentPost(hash, {
            text: 'I am a comment'
        })
        const comments = db.getComments(hash)
        assert.equal(comments.length, 1)
    })

    it('update comment', async () => {
        const hash = await db.addPost({
            title: 'Post Title',
            text: 'hello world'
        })
        const commentHash = await db.commentPost(hash, {
            text: 'I am a comment'
        })
        const comment = await db.getComment(hash, commentHash);
        const updatedHash = await db.updateComment(hash, commentHash, 'post', {
            text: 'Updated comment'
        })
        const comments = await db.getComments(hash);
        assert.equal(comments.length, 1)
        assert.equal(comments[0].text, 'Updated comment')
        assert.equal(comments[0].previousVersion, commentHash)
    })

    it('hide comment', async () => {
        const hash = await db.addPost({
            title: 'Post Title',
            text: 'hello world'
        })
        const commentHash = await db.commentPost(hash, {
            text: 'I am a comment'
        })
        const comment = await db.getComment(hash, commentHash);
        let comments = await db.getComments(hash);
        assert.equal(comments.length, 1)
        assert.equal(comments[0].text, 'I am a comment')
        const updatedHash = await db.hideComment(hash, commentHash)
        comments = await db.getComments(hash);
        assert.equal(comments[0].hidden, true)
    })

    it('comment to post stays after post update', async () => {
        const hash = await db.addPost({
            title: 'Post Title',
            text: 'hello world'
        })
        const commentHash = await db.commentPost(hash, {
            text: 'I am a comment'
        })
        const comments = db.getComments(hash)
        const updatedHash = await db.updatePost(hash, {
            title: 'Post Title',
            text: 'actually I changed my mind'
        })
        const updatedComments = db.getComments(hash)
        assert.deepEqual(comments, updatedComments)
        assert.deepEqual(db.getComments(hash), db.getComments(updatedHash))
    })

    it('can comment as a reply to another comment', async () => {
        const hash = await db.addPost({
            title: 'Post Title',
            text: 'hello world'
        })
        const commentHash = await db.commentPost(hash, {
            text: 'I am a comment'
        })
        const replyHash = await db.commentPost(hash, {
            text: 'I am a reply'
        }, commentHash)
        const replies = db.getComments(hash, commentHash)
        assert.deepEqual(replies[0].text, 'I am a reply')
    })

    it('replies stay after post is updated', async () => {
        const hash = await db.addPost({
            title: 'Post Title',
            text: 'hello world'
        })
        const commentHash = await db.commentPost(hash, {
            text: 'I am a comment'
        })
        const replyHash = await db.commentPost(hash, {
            text: 'I am a reply'
        }, commentHash)
        const updatedHahs = db.updatePost(hash, {
            title: 'Post Title',
            text: 'updated'
        })
        const replies = db.getComments(hash, commentHash)
        assert.deepEqual(replies[0].text, 'I am a reply')
    })
})