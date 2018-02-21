const assert = require('chai').assert
const rmrf = require('rimraf')
const OrbitDB = require('orbit-db')
const config = require('orbit-db/test/utils/config')
const startIpfs = require('orbit-db/test/utils/start-ipfs')

const dbPath = './orbitdb/tests/'
const ipfsPath = './orbitdb/tests/ipfs'

const BoardStore = require('../src/BoardStore')
OrbitDB.addDatabaseType(BoardStore.type, BoardStore)

describe('OrbitDB Discussion Board', function () {
    this.timeout(config.timeout)

    let ipfs, orbitdb1, db

    before(async () => {
        config.daemon1.repo = ipfsPath
        rmrf.sync(config.daemon1.repo)
        rmrf.sync(dbPath)
        ipfs = await startIpfs(config.daemon1)
        orbitdb1 = new OrbitDB(ipfs, dbPath + '/1')
        orbitdb1.addDatabaseType
    })

    after(async () => {
        if (orbitdb1) await orbitdb1.stop()
        if (ipfs) await ipfs.stop()
    })

    beforeEach(async () => {
        db = await orbitdb1.open(config.dbname, {
            type: BoardStore.type,
            create: true,
            path: dbPath
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
})