module.exports = {
    resolveSnapshotPath: (testPath, snapshotExtension) =>
        testPath.replace('/build/test/', '/test/snapshots/') + snapshotExtension,

    resolveTestPath: (snapshotFilePath, snapshotExtension) =>
        snapshotFilePath.replace('/test/snapshots/', '/build/test/').slice(0, -snapshotExtension.length),

    testPathForConsistencyCheck: 'ghostly-engine/build/test/foobar.test.js',
}
