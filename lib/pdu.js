/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var smpperror = require('./smpp-errors.js');
var unpack = require('./packunpack.js').unpack;
var pack = require('./packunpack.js').pack;
var constants = require('./pdu-defs.js');
var defs = constants.defs;

module.exports = function() {
    var self = this;

    /**
     * Resets current PDU object to its initial state.
     */
    self.reset = function() {

        self.buffer = Buffer(0);
        self.header = {};
        self.mandatory = {};
        self.optional = {};

        self.command_name = '';
        self.command_status_name = '';

    };

    /**
     * Decodes PDU from octet packet (as a Buffer)
     *
     * @param {Buffer} buffer Stream of octets containing PDU data.
     *
     * @returns {object} Self.
     * @throws {smpp-error}
     */
    self.decode = function(buffer) {

        self.reset();

        var tmp;
        var i;

        self.buffer = buffer;
        if (buffer.length < 16) {
            throw new smpperror('Invalid packet length (less than 16b)');
        }
        tmp = unpack('NNNN', self.buffer);

        self.header.command_length  = tmp[0] >>> 0;
        self.header.command_id      = tmp[1] >>> 0;
        self.header.command_status  = tmp[2] >>> 0;
        self.header.sequence_number = tmp[3] >>> 0;

        /**
         * Handle bad headers
         */
        if (self.header.command_length < 16) {
            throw new smpperror('Invalid packet length (less than 16b)');
        } else if (self.buffer.length !== self.header.command_length) {
            throw new smpperror('Invalid packet length (expected ' + self.header.command_length + 'b, got ' + self.buffer.length + 'b)');
        }

        if (constants.command_ids[self.header.command_id] === undefined) {
            throw new smpperror('PDU command not implemented (command_id: 0x' + self.header.command_id.toString(16) + ')');
        }

        self.command_name = constants.command_ids[self.header.command_id];

        if (constants.command_status_ids[self.header.command_status] === undefined) {
            throw new smpperror('PDU command status not implemented (command_status: 0x' + self.header.command_status.toString(16) + ')');
        }

        self.command_status_name = constants.command_status_ids[self.header.command_status];

        if (defs.commands[self.header.command_id] === undefined) {
            throw new smpperror(self.command_name + ' PDU definition for not found. Probably not implented yet.');
        }

        /**
         * Decode mandatory params
         */
        var pos = 16;
        var field;
        for (field in defs.commands[self.header.command_id]) {
            def = defs.commands[self.header.command_id][field];
            if (buffer[pos] === undefined) { throw new smpperror('PDU finished early. Position: ' + pos + ', field: ' + field + '.'); }
            switch (def.type) {
                case 'cstring':
                    self.mandatory[field] = '';
                    while (buffer[pos] !== 0) {
                        if (buffer[pos] === undefined) { throw smpperror('PDU finished early. Position: ' + pos + ', field: ' + field + '.'); }

                        self.mandatory[field] += String.fromCharCode(buffer[pos]);
                        pos++;
                    }
                    pos++;
                    break;
                case 'string':
                    if (field === 'short_message') {
                        self.mandatory[field] = buffer.slice(pos, pos + self.mandatory.sm_length).toString('binary');
                    }
                    pos += self.mandatory.sm_length;
                    break;
                case 'int':
                    switch (def.len) {
                        case 1:
                            self.mandatory[field] = unpack('c', String.fromCharCode(buffer[pos]));
                            break;
                        /* Mandatory fields do not have integers other than of length 1 */
                        // case 4:
                        //    self.mandatory[field] = unpack('N', buffer.slice(pos, pos+4).toString('binary'));
                        //    break;
                    }
                    pos += def.len;
                    break;
            }

        }

        /**
         * Decode optional params
         */
        while (pos < buffer.length) {
            if (pos + 4 > buffer.length) { throw new smpperror('PDU finished early. Error within optional part.'); }
            tmp = unpack('nn', buffer.slice(pos, pos+4));
            tag_id = tmp[0];
            tag_len = tmp[1];
            pos += 4;

            if ((pos + tag_len) > buffer.length) { throw new smpperror('PDU finished early. Error within optional part. Invalid TLV length.'); }

            if (constants.optional_tag_ids[tag_id] === undefined) {
                throw new smpperror('Invalid TLV tag 0x' + tag_id.toString(16) + '. Not implemented.');
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
                    for (i = 0; i < tag_len; i++) {
                        self.optional[constants.optional_tag_ids[tag_id]] += buffer[pos+i] * Math.pow(2, (tag_len - i - 1)*8);
                    }
                    break;
            }
            pos += tag_len;
        }

        return self;
    };

    /**
     * Encodes PDU from object/struct.
     *
     * @param {Long} command_id
     * @param {Long} command_status
     * @param {Long} sequence_number
     * @param {Object} params Optional and mandatory params.
     *
     * @returns {object} Self.
     * @throws {smpp-error}
     */
    self.encode = function(command_id, command_status, sequence_number, params) {

        self.reset();

        var buffer = '';
        var def;
        var field;

        if (sequence_number === undefined) {
            self.header.sequence_number = 0;
        } else {
            self.header.sequence_number = sequence_number >>> 0;
        }

        self.header.command_id = command_id >>> 0;
        self.header.command_status = command_status >>> 0;

        if (constants.command_ids[self.header.command_id] === undefined) {
            throw new smpperror('PDU command not implemented (command_id: 0x' + self.header.command_id.toString(16) + ')');
        }

        self.command_name = constants.command_ids[self.header.command_id];

        if (constants.command_status_ids[self.header.command_status] === undefined) {
            throw new smpperror('PDU command status not implemented (command_status: 0x' + self.header.command_status.toString(16) + ')');
        }

        self.command_status_name = constants.command_status_ids[self.header.command_status];

        if (defs.commands[self.header.command_id] === undefined) {
            throw new smpperror(self.command_name + ' PDU definition for not found. Probably not implented yet.');
        }

        if (params.short_message !== undefined) {
            params.sm_length = params.short_message.length;
        }

        /**
         * Encode mandatory params
         */
        for (field in defs.commands[self.header.command_id]) {
            def = defs.commands[self.header.command_id][field];
            if (params[field] === undefined) {
                throw new smpperror(self.command_name + ' PDU mandatory parameter missing: ' + field + '.');
            }
            self.mandatory[field] = params[field];
            def = defs.commands[self.header.command_id][field];
            switch (def.type) {
                case 'cstring':
                    buffer += params[field] + "\x00";
                    break;
                case 'string':
                    buffer += params[field];
                    break;
                case 'int':
                    switch (def.len) {
                        case 1:
                            buffer += pack('c', params[field]).toString('binary');
                            break;
                        /* Mandatory fields do not have integers other than of length 1 */
                        // case 4:
                        //    buffer += pack('N', params[field]).toString('binary');
                        //    break;
                    }
                    break;
            }
        }

        /**
         * Encode optional params
         */
        for (field in params) {
            if (defs.optional_tags[field] !== undefined) {
                self.optional[field] = params[field];
                def = defs.optional_tags[field];

                buffer += pack('n', constants.optional_tags[field]).toString('binary');
                if (def.type !== 'int') {
                    def.len = params[field].length;
                }

                switch (def.type) {
                    case 'cstring':
                        // I've never seen TLV of type C-Octet string, so, let's assuma that's a typo in SMPP 3.4 spec, and treat it as common string.
                    case 'string':
                        buffer += pack('n', params[field].length).toString('binary') + params[field];
                        break;
                    case 'int':
                        buffer += pack('n', def.len).toString('binary');
                        for (i = 0; i < def.len; i++) {
                            buffer += pack('c', (params[field] >> ((def.len - i - 1)*8)) % 256).toString('binary');
                        }
                        break;
                }
            }
        }


        /**
         * Compose final PDU octet whatever
         */
        self.header.command_length = 16 + buffer.length;
        self.buffer = new Buffer(pack('N', self.header.command_length).toString('binary') +
                                 pack('N', self.header.command_id).toString('binary') +
                                 pack('N', self.header.command_status).toString('binary') +
                                 pack('N', self.header.sequence_number).toString('binary') +
                                 buffer, 'binary');


        return self;
    };

    /**
     * Returns true, if PDU command is a response. False otherwise.
     *
     * @returns {Boolean}
     */
    self.is_response = function() {
        return ((self.header.command_id & 0x80000000)>>>0) === 0x80000000;
    }

    /**
     * Returns string representation of PDU object.
     *
     * @returns {String}
     */
    self.toString = function() {
        return(self.command_name + ', ' + self.command_status_name + ', ' + self.header.sequence_number);
    }

};
