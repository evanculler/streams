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
    this.columnsProvided = this.columns && this.columns.length;
}

util.inherits(XmlStream, stream.Transform);

XmlStream.prototype._transform = function(record, encoding, done) {
    if (!this.started) {
        this.push('<records>');
        this.started = true;
    }
    var buf = '<record>';
    if (this.columnsProvided){
        _.forEach(this.columns, id => {
            buf = buf + util.format('<value name="%s"><![CDATA[%s]]></value>', id, record[id]);
        });
    }
    else {
        _.forEach(record, function (value, name) {
            buf = buf + util.format('<value name="%s"><![CDATA[%s]]></value>', name, value);
        });
    }
    buf = buf + '</record>';
    this.push(buf);
    done();
};

XmlStream.prototype._flush = function(done) {
    this.push('</records>');
    done();
};

module.exports.XmlStream = XmlStream;