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
    config = config || {};
    this.columns = config.columns;
    this.columnsProvided = this.columns && this.columns.length;
    this.pretty = config.pretty;
}

util.inherits(JsonStream, stream.Transform);

JsonStream.prototype._transform = function(chunk, encoding, done) {
    if (!this.started) {
        this.push('[');
        this.started = true;
    } else {
        this.push(',');
    }
    if (this.columnsProvided) this.push(JSON.stringify(_.pick(chunk, this.columns), null, this.pretty && '\t'));
    else this.push(JSON.stringify(chunk, null, this.pretty && '\t'));
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