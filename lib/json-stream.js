'use strict';

var stream = require('stream');
var util = require('util');
var _ = require('lodash');

/**
 * A Stream2 json-ifier. converts a stream of records into a json array
 * @constructor
 */
function JsonStream(config) {
    stream.Transform.call(this);
    this._writableState.objectMode = true;
    this._readableState.objectMode = false;
    config = config || { columns: [], options: {} };
    this.columns = config.columns;
    this.pretty = config.options.pretty;
}

util.inherits(JsonStream, stream.Transform);

JsonStream.prototype._transform = function(chunk, encoding, done) {
    if (!this.started) {
        this.push('[');
        this.started = true;
    } else {
        this.push(',');
    }
    this.push(JSON.stringify(_.pick(chunk, _.map(this.columns, c => c.name)), null, this.pretty && '\t'));
    done();
};

JsonStream.prototype._flush = function(done) {
    if (!this.started) {
        this.push('[');
    }
    this.push(']');
    done();
};

module.exports.JsonStream = JsonStream;