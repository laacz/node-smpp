/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var smpperror = require('./error.js');
var unpack = require('./packunpack.js').unpack;
var pack = require('./packunpack.js').pack;
var constants = require('./constants.js');
var defs = constants.defs;

module.exports = function() {
    var self = this;

    self.buffer = Buffer(0);
    self.header = {};
    self.mandatory = {};
    self.optional = {};

    /**
     * Decodes PDU from octet packet (as a Buffer)
     *
     * @param {Buffer} buffer Instance of Buffer containing PDU octets
     * @param {function} callback Callback(err, pdu). Err cotains error, if any, pdu cotains self.
     *
     * @returns Nothing usable
     */
    self.decode = function(buffer, callback) {
        var tmp;
        self.buffer = buffer;
        if (buffer.length < 16) {
            return callback(new smpperror('Invalid packet length (less than 16b)'), null);
        }
        var tmp = unpack('NNNN', self.buffer);

        self.header.command_length  = tmp[0];
        self.header.command_id      = tmp[1];
        self.header.command_status  = tmp[2];
        self.header.sequence_number = tmp[3];

        /**
         * Handle bad headers
         */
        if (self.header.command_length < 16) {
            return callback(new smpperror('Invalid packet length (less than 16b)'), self);
        } else if (self.buffer.length != self.header.command_length) {
            return callback(new smpperror('Invalid packet length (expected ' + self.header.command_length + 'b, got ' + self.buffer.length + 'b)'), self);
        }

        if (!(self.header.command_id in constants.command_ids)) {
            return callback(new smpperror('PDU command not implemented (command_id: 0x' + self.header.command_id.toString(16) + ')'), self);
        }

        self.command_name = constants.command_ids[self.header.command_id];

        if (!(self.header.command_status in constants.command_status_ids)) {
            return callback(new smpperror('PDU command status not implemented (command_status: 0x' + self.header.command_status.toString(16) + ')'), self);
        }

        self.command_status_name = constants.command_status_ids[self.header.command_status];

        if (!(self.header.command_id in defs.commands)) {
            return callback(new smpperror(self.command_name + ' PDU definition for not found. Probably not implented yet.'), self);
        }

        /**
         * Decode mandatory params
         */
        var pos = 16;
        for (field in defs.commands[self.header.command_id]) {
            def = defs.commands[self.header.command_id][field];
            if (!(pos in buffer)) return callback(new smpperror('PDU finished early. Position: ' + pos + ', field: ' + field + '.'), self);
            switch (def.type) {
                case 'cstring':
                    self.mandatory[field] = '';
                    while (buffer[pos] != 0) {
                        if (!(pos in buffer)) return callback(new smpperror('PDU finished early. Position: ' + pos + ', field: ' + field + '.'), self);

                        self.mandatory[field] += String.fromCharCode(buffer[pos]);
                        pos++;
                    }
                    pos++;
                    break;
                case 'string':
                    if (field == 'short_message') {
                        self.mandatory[field] = buffer.slice(pos, pos + self.mandatory.sm_length).toString('binary');
                    }
                    pos += self.mandatory.sm_length;
                    break;
                case 'int':
                    switch (def.len) {
                        case 1:
                            self.mandatory[field] = unpack('c', String.fromCharCode(buffer[pos]));
                            break;
                        case 4:
                            self.mandatory[field] = unpack('N', buffer.slice(pos, pos+4).toString('binary'));
                            break;
                    }
                    pos += def.len;
                    break;
            }

        }

        /**
         * Decode optional params
         */
        while (pos < buffer.length) {
            if (pos + 4 > buffer.length) return callback(new smpperror('PDU finished early. Error within optional part.'), self);
            tmp = unpack('nn', buffer.slice(pos, pos+4));
            tag_id = tmp[0];
            tag_len = tmp[1];
            pos += 4;

            if ((pos + tag_len) > buffer.length) return callback(new smpperror('PDU finished early. Error within optional part. Invalid TLV length.'), self);

            if (!(tag_id in constants.optional_tag_ids)) {
                return callback(new smpperror('Invalid TLV tag 0x' + tag_id.toString(16) + '. Not implemented.'), self);
            }

            def = defs.optional_tags[constants.optional_tag_ids[tag_id]];

            switch (def.type) {
                case 'cstring':
                    // I've never seen TLV of type C-Octet string, so, let's assuma that's a typo in SMPP 3.4 spec, and treat it as common string.
                case 'string':
                    self.optional[constants.optional_tag_ids[tag_id]] = buffer.slice(pos, pos + tag_len).toString('binary');
                    break;
                case 'int':
                    self.optional[constants.optional_tag_ids[tag_id]] = 0;
                    for (var i = 0; i < tag_len; i++) {
                        self.optional[constants.optional_tag_ids[tag_id]] += buffer[pos+i] * Math.pow(2, (tag_len - i - 1)*8)
                    }
                    break;
            }
            pos += tag_len;
        }

        return callback(null, self);
    }

}
