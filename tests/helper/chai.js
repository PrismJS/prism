const chai = require('chai');
const { jestSnapshotPlugin } = require('mocha-chai-jest-snapshot');

chai.use(jestSnapshotPlugin({
	snapshotSerializers: ['jest-serializer-html']
}));

module.exports = chai;
