/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var PDUFactory = require('pdu-factory');
var Constants = require('pdu-defs');
var Defs = Constants.defs;
var Assert = require('assert');

var octets;
var params = {};

function toString(array) {
    return array.map(function(a){return String.fromCharCode(a);}).join('');
}

module.exports = {

    /**
     * PDU from binary data
     */
    'Octets: Empty binary data': function() {
        PDUFactory.fromBuffer('', function(err, pdu) { Assert.ok(err.message !== undefined);});
    },
    'Octets: Length smaller than 16': function() {
        octets = toString([0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        PDUFactory.fromBuffer(octets, function(err, pdu) { Assert.ok(err.message !== undefined); });
    },
    'Octets: Invalid command_id': function() {
        octets = toString([0x00, 0x00, 0x00, 0x10, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);
        PDUFactory.fromBuffer(Buffer(octets, 'binary'), function(err, pdu) { Assert.ok(err.message !== undefined); });
    },
    'Octets: PDU definition not found': function() {
        Constants.command_ids[0xffffffff] = 'wuff';
        octets = toString([0x00, 0x00, 0x00, 0x10, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);
        PDUFactory.fromBuffer(Buffer(octets, 'binary'), function(err, pdu) { Assert.ok(err.message !== undefined); });
        Constants.command_ids[0xffffffff] = undefined;
    },
    'Octets: Invalid command_status': function() {
        octets = toString([0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x01, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x01]);
        PDUFactory.fromBuffer(Buffer(octets, 'binary'), function(err, pdu) { Assert.ok(err.message !== undefined); });
    },
    'Octets: Mandatory param missing': function() {
        octets = toString([0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x21, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);
        PDUFactory.fromBuffer(Buffer(octets, 'binary'), function(err, pdu) { Assert.ok(err.message !== undefined); });
    },
    'Octets: Mandatory param missing (no callback)': function() {
        octets = toString([0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x21, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);
        var pdu = PDUFactory.fromBuffer(Buffer(octets, 'binary'));
        Assert.isUndefined(pdu.command_name);
    },
    'Octets: Actual length should not match command_length': function() {
        octets = toString([0x00, 0x00, 0x00, 0x12, 0x00, 0x00, 0x00, 0x21, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);
        PDUFactory.fromBuffer(Buffer(octets, 'binary'), function(err, pdu) { Assert.ok(err.message !== undefined); });
    },
    'Octets: Invalid optional tag': function() {
        octets = toString([0x00, 0x00, 0x00, 0x16, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0x00, 0x02, 0xff, 0xff]);
        PDUFactory.fromBuffer(Buffer(octets, 'binary'), function(err, pdu) { Assert.ok(err.message !== undefined); });
    },

    'Octets: Well formed bind_transceiver': function() {
        octets = toString([0x00, 0x00, 0x00, 0x2b, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x19, 0x9b, 0x6, 0x66, 0x66, 0x6f, 0x6f, 0x66, 0x6f, 0x6f, 0x66, 0x6f, 0x00, 0x62, 0x61, 0x72, 0x62, 0x61, 0x72, 0x62, 0x00, 0x45, 0x53, 0x4d, 0x45, 0x00, 0x34, 0x00, 0x00, 0x00]);
        PDUFactory.fromBuffer(Buffer(octets, 'binary'), function(err, pdu) { Assert.ok(err === null); });
    },
    'Octets: Well formed bind_transceiver (no callback)': function() {
        octets = toString([0x00, 0x00, 0x00, 0x2b, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x19, 0x9b, 0x6, 0x66, 0x66, 0x6f, 0x6f, 0x66, 0x6f, 0x6f, 0x66, 0x6f, 0x00, 0x62, 0x61, 0x72, 0x62, 0x61, 0x72, 0x62, 0x00, 0x45, 0x53, 0x4d, 0x45, 0x00, 0x34, 0x00, 0x00, 0x00]);
        var pdu = PDUFactory.fromBuffer(Buffer(octets, 'binary'));
        Assert.isDefined(pdu.command_name);
    },
    'Octets: Well formed submit_sm': function() {
        octets = toString([0x00, 0x00, 0x00, 0xa6, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x19, 0xa6, 0xf9, 0x00, 0x05, 0x00, 0x4b, 0x4b, 0x4b, 0x4b, 0x4b, 0x20, 0x4b, 0x4b, 0x4b, 0x4b, 0x00, 0x01, 0x00, 0x33, 0x37, 0x31, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x00, 0x00, 0x00, 0x03, 0x00, 0x30, 0x30, 0x30, 0x30, 0x30, 0x37, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x52, 0x00, 0x01, 0x00, 0x00, 0x00, 0x54, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x15, 0x05, 0x00, 0x02, 0x54, 0x53, 0x15, 0x03, 0x00, 0x02, 0x00, 0xab]);

        PDUFactory.fromBuffer(Buffer(octets, 'binary'), function(err, pdu) { Assert.ok(err === null); });
    },

    /**
     * PDU from structure
     */
    'Struct: invalid command_id': function() {
        PDUFactory.fromStruct(-1, 0, 0, {}, function(err, pdu) { Assert.ok(err.message !== undefined); });
    },

    'Struct: PDU definition not found': function() {
        Constants.command_ids[0xffffffff] = 'wuff';
        PDUFactory.fromStruct(0xffffffff, 0, -1, {}, function(err, pdu) { Assert.ok(err.message !== undefined); });
        Constants.command_ids[0xffffffff] = undefined;
    },

    'Struct: invalid command_status': function() {
        PDUFactory.fromStruct(4, -1, -1, {}, function(err, pdu) { Assert.ok(err.message !== undefined); });
    },

    'Struct: missing mandatory params': function() {
        PDUFactory.fromStruct(4, 0, -1, {}, function(err, pdu) { Assert.ok(err.message !== undefined); });
    },

    'Struct: missing mandatory params (no callback)': function() {
        var pdu = PDUFactory.fromStruct(4, 0, -1, {});
        Assert.isUndefined(pdu.command_name);
    },

    'Struct: well formed bind_transceiver': function() {
        PDUFactory.fromStruct(0x80000009, 0, -1, {'system_id': 'sys'}, function(err, pdu) { Assert.ok(err === null); });
    },
    'Struct: well formet optional params': function() {
        PDUFactory.fromStruct(0x80000009, 0, -1, {'system_id': 'sys', 'additional_status_info_text' : 'foobar'}, function(err, pdu) { Assert.ok(pdu.optional.additional_status_info_text === 'foobar'); });
    },


    /**
     * Test double conversion. First decode, then encode and compare initial and final data.
     */
    'Octets to struct, and struct back to octets': function() {
        var bufs = [
                    toString([0x00, 0x00, 0x00, 0x2b, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x19, 0x9b, 0x6f, 0x66, 0x66, 0x6f, 0x6f, 0x66, 0x66, 0x6f, 0x6f, 0x66, 0x00, 0x62, 0x61, 0x72, 0x62, 0x61, 0x72, 0x61, 0x00, 0x45, 0x53, 0x4d, 0x45, 0x00, 0x34, 0x00, 0x00, 0x00]),
                    toString([0x00, 0x00, 0x00, 0xa6, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x19, 0xa6, 0xf9, 0x00, 0x05, 0x00, 0x4b, 0x4b, 0x4b, 0x4b, 0x4b, 0x20, 0x4b, 0x4b, 0x4b, 0x4b, 0x00, 0x01, 0x00, 0x33, 0x37, 0x31, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x00, 0x00, 0x00, 0x03, 0x00, 0x30, 0x30, 0x30, 0x30, 0x30, 0x37, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x52, 0x00, 0x01, 0x00, 0x00, 0x00, 0x54, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x15, 0x05, 0x00, 0x02, 0x54, 0x53, 0x15, 0x03, 0x00, 0x02, 0x00, 0xab])
                   ];

        function encodeAndCheck(err, pdu) {
            var k = '';
            Assert.ok(err === null);
            params = pdu.mandatory;
            for (k in pdu.optional) {
                params[k] = pdu.optional[k];
            }

            PDUFactory.fromStruct(pdu.header.command_id, pdu.header.command_status, pdu.header.sequence_number, params, function(err, pdu2) {
                Assert.ok(pdu2.buffer.toString() === pdu.buffer.toString());
            });
        }

        var buf = '';
        for (buf in bufs) {
            octets = bufs[buf];
            PDUFactory.fromBuffer(Buffer(octets, 'binary'), encodeAndCheck);
        }
        // console.log(msg.split('').reduce(function(a, b){ return (a.length == 1 ? '\\x' + a.charCodeAt(0).toString(16) : a) + '\\x' + b.charCodeAt(0).toString(16);}))


    },

    /**
     * Response from factory.
     */
    'Response: invalid' : function() {
        PDUFactory.fromStruct(Constants.commands.enquire_link, Constants.command_statuses.esme_rok, 99, {}, function(err, pdu) {
            Assert.isNull(err, "Unexpected error: " + (err ? err.message : ''));
            PDUFactory.response(pdu, 0xffffffff, {}, function(err2, pdu2) {
                Assert.isNotNull(err2);
            });
        });
    },

    'Response: invalid (no callback)' : function() {
        var pdu = PDUFactory.fromStruct(Constants.commands.enquire_link, Constants.command_statuses.esme_rok, 99, {});
        Assert.isDefined(pdu.header.command_id, "Unexpected error: " + pdu);

        var pdu2 = PDUFactory.response(pdu, 0xffffffff, {});
        Assert.isUndefined(pdu2.command_name);
    },

    'Response: no body; well formed' : function() {
        PDUFactory.fromStruct(Constants.commands.enquire_link, Constants.command_statuses.esme_rok, 99, {}, function(err, pdu) {
            Assert.isNull(err, "Unexpected error: " + (err ? err.message : ''));
            PDUFactory.response(pdu, 0, {}, function(err2, pdu2) {
                Assert.isNull(err2, "Unexpected error: " + (err2 ? err2.message : ''));
                Assert.ok(pdu2.header.command_id === ((pdu.header.command_id | 0x80000000)>>>0), 'Command id is not *_resp');
                Assert.ok(pdu2.header.squence_number === pdu.header.squence_number, 'Sequence_number for both commands should match');
            });
        });
    },

    'Response: no body; well formed (no callback)' : function() {
        var pdu = PDUFactory.fromStruct(Constants.commands.enquire_link, Constants.command_statuses.esme_rok, 99, {});
        Assert.isDefined(pdu.header.command_id, "Unexpected error: " + pdu);

        var pdu2 = PDUFactory.response(pdu, 0, {});
        Assert.isDefined(pdu2.command_name, "Unexpected error: " + pdu2);

        Assert.ok(pdu2.header.command_id === ((pdu.header.command_id | 0x80000000)>>>0), 'Command id is not *_resp');
        Assert.ok(pdu2.header.squence_number === pdu.header.squence_number, 'Sequence_number for both commands should match');
    },

    'Response: with body; well formed' : function() {
        var params = {
            service_type: 'abc',
            source_addr_ton: 1,
            source_addr_npi: 1,
            source_addr: '37122222222',
            dest_addr_ton: 1,
            dest_addr_npi: 2,
            destination_addr: '37122222222',

            esm_class: 1,
            data_coding: 1
        };

        PDUFactory.fromStruct(Constants.commands.data_sm, Constants.command_statuses.esme_rok, 99, params, function(err, pdu) {
            Assert.isNull(err, "Unexpected error #1: " + (err ? err.message : ''));
            PDUFactory.response(pdu, 0, {message_id: 'abc'}, function(err2, pdu2) {
                Assert.isNull(err2, "Unexpected error #2: " + (err2 ? err2.message : ''));
                Assert.ok(pdu2.header.command_id === ((pdu.header.command_id | 0x80000000)>>>0), 'Command id is not *_resp');
                Assert.ok(pdu2.header.squence_number === pdu.header.squence_number, 'Sequence_number for both commands should match');
            });
        });
    }

};
