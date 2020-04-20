'use strict';

var _ = require('lodash');
var util = require('util');
var stream = require('stream');

function XmlStream(config) {
    stream.Transform.call(this);
    this._writableState.objectMode = true;
    this._readableState.objectMode = false;
    config = config || { columns: [] };
    this.columns = config.columns;
}

util.inherits(XmlStream, stream.Transform);

XmlStream.prototype._transform = function(record, encoding, done) {
    if (!this.started) {
        this.push('<records>');
        this.started = true;
    }
    var buf = '<record>';
    _.forEach(this.columns, c => {
        buf = buf + util.format('<value name="%s"><![CDATA[%s]]></value>', c.name, record[c.name]);
    });
    buf = buf + '</record>';
    this.push(buf);
    done();
};

XmlStream.prototype._flush = function(done) {
    this.push('</records>');
    done();
};

module.exports.XmlStream = XmlStream;