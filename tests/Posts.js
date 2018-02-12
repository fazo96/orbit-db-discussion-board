const assert = require('chai').assert
const rmrf = require('rimraf')
const OrbitDB = require('orbit-db')
const config = require('orbit-db/test/utils/config')
const startIpfs = require('orbit-db/test/utils/start-ipfs')

const dbPath = './orbitdb/tests/'
const ipfsPath = './orbitdb/tests/ipfs'

const BoardStore = require('../src/BoardStore')
OrbitDB.addDatabaseType(BoardStore.type, BoardStore)

describe('orbit-db - Key-Value Store', function () {
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
        assert.deepEqual(db.getPost(hash), {
            title: 'Post Title',
            text: 'hello world',
            contentType: 'text/plain'
        })
    })
})