/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var Assert = require('assert');

// node-smpp
var PDUFactory = require('../lib/pdu-factory.js');
var Constants = require('../lib/pdu-defs.js');
var Defs = Constants.defs;
var SMPPError = require('../lib/smpp-errors.js');

var octets;
var params = {};

function toString(array) {
    return array.map(function(a){return String.fromCharCode(a);}).join('');
}

k = function() {

};

module.exports = {

    /**
     * PDU from binary data
     */
    'Octets: Empty binary data': function() {
        Assert.throws(function(){
            console.log(PDUFactory.fromBuffer(''));
        }, SMPPError);
    },
    'Octets: Length smaller than 16': function() {
        octets = toString([0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        Assert.throws(function(){
            PDUFactory.fromBuffer(octets);
        }, SMPPError);
    },
    'Octets: Invalid command_id': function() {
        octets = toString([0x00, 0x00, 0x00, 0x10, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);
        Assert.throws(function(){
            PDUFactory.fromBuffer(Buffer(octets, 'binary'));
        }, SMPPError);
    },
    'Octets: PDU definition not found': function() {
        Constants.command_ids[0xffffffff] = 'wuff';
        octets = toString([0x00, 0x00, 0x00, 0x10, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);
        Assert.throws(function(){
            PDUFactory.fromBuffer(Buffer(octets, 'binary'));
        }, SMPPError);
        delete Constants.command_ids[0xffffffff];
    },
    'Octets: Invalid command_status': function() {
        octets = toString([0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x01, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x01]);
        Assert.throws(function(){
            PDUFactory.fromBuffer(Buffer(octets, 'binary'));
        }, SMPPError);
    },
    'Octets: Mandatory param missing': function() {
        octets = toString([0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x21, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);
        Assert.throws(function(){
            PDUFactory.fromBuffer(Buffer(octets, 'binary'));
        }, SMPPError);
    },
    'Octets: Actual length should not match command_length': function() {
        octets = toString([0x00, 0x00, 0x00, 0x12, 0x00, 0x00, 0x00, 0x21, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);
        Assert.throws(function(){
            PDUFactory.fromBuffer(Buffer(octets, 'binary'));
        }, SMPPError);
    },
    'Octets: Invalid optional tag': function() {
        octets = toString([0x00, 0x00, 0x00, 0x16, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0x00, 0x02, 0xff, 0xff]);
        Assert.throws(function(){
            PDUFactory.fromBuffer(Buffer(octets, 'binary'));
        }, SMPPError);
    },

    'Octets: Well formed bind_transceiver': function() {
        octets = toString([0x00, 0x00, 0x00, 0x2b, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x19, 0x9b, 0x6, 0x66, 0x66, 0x6f, 0x6f, 0x66, 0x6f, 0x6f, 0x66, 0x6f, 0x00, 0x62, 0x61, 0x72, 0x62, 0x61, 0x72, 0x62, 0x00, 0x45, 0x53, 0x4d, 0x45, 0x00, 0x34, 0x00, 0x00, 0x00]);
        Assert.eql(PDUFactory.fromBuffer(Buffer(octets, 'binary')).mandatory, {
            system_id: 'ffoofoofo',
            password: 'barbarb',
            system_type: 'ESME',
            interface_version: 0x34,
            addr_ton: 0,
            addr_npi: 0,
            address_range: ''
            });
    },
    'Octets: Well formed submit_sm': function() {
        octets = toString([0x00, 0x00, 0x00, 0xa6, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x19, 0xa6, 0xf9, 0x00, 0x05, 0x00, 0x4b, 0x4b, 0x4b, 0x4b, 0x4b, 0x20, 0x4b, 0x4b, 0x4b, 0x4b, 0x00, 0x01, 0x00, 0x33, 0x37, 0x31, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x00, 0x00, 0x00, 0x03, 0x00, 0x30, 0x30, 0x30, 0x30, 0x30, 0x37, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x52, 0x00, 0x01, 0x00, 0x00, 0x00, 0x54, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x15, 0x05, 0x00, 0x02, 0x54, 0x53, 0x15, 0x03, 0x00, 0x02, 0x00, 0xab]);

        var pdu = PDUFactory.fromBuffer(Buffer(octets, 'binary'));

        Assert.eql(pdu.mandatory, {
            service_type: '',
            source_addr_ton: 5,
            source_addr_npi: 0,
            source_addr: 'KKKKK KKKK',
            dest_addr_ton: 1,
            dest_addr_npi: 0,
            destination_addr: '37122222222',
            esm_class: 0,
            protocol_id: 0,
            priority_flag: 3,
            schedule_delivery_time: '',
            validity_period: '000007000000000R',
            registered_delivery: 1,
            replace_if_present: 0,
            data_coding: 0,
            sm_default_msg_id: 0,
            sm_length: 84,
            short_message: 'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS' });

        Assert.eql(pdu.optional, { lmt_service_desc: 'TS', lmt_tariff_class: 171 });
    },

    /**
     * PDU from structure
     */
    'Struct: invalid command_id': function() {
        Assert.throws(function(){
            PDUFactory.fromStruct(-1, 0, 0, {});
        }, SMPPError);
    },

    'Struct: PDU definition not found': function() {
        Constants.command_ids[0xffffffff] = 'wuff';
        Assert.throws(function(){
            PDUFactory.fromStruct(0xffffffff, 0, -1, {});
        }, SMPPError);
        delete Constants.command_ids[0xffffffff];
    },

    'Struct: invalid command_status': function() {
        Assert.throws(function(){
            PDUFactory.fromStruct(4, -1, -1, {});
        }, SMPPError);
    },

    'Struct: missing mandatory params': function() {
        Assert.throws(function(){
            PDUFactory.fromStruct(4, 0, -1, {});
        }, SMPPError);
    },

    'Struct: well formed bind_transceiver': function() {
        Assert.doesNotThrow(function(){
            PDUFactory.fromStruct(0x80000009, 0, -1, {'system_id': 'sys'});
        });
    },
    'Struct: well formet optional params': function() {
        var pdu;
        Assert.doesNotThrow(function(){
            pdu = PDUFactory.fromStruct(0x80000009, 0, -1, {'system_id': 'sys', 'additional_status_info_text' : 'foobar'});
        });
        Assert.ok(pdu.optional.additional_status_info_text === 'foobar');
    },


    /**
     * Test double conversion. First decode, then encode and compare initial and final data.
     */
    'Octets to struct, and struct back to octets': function() {
        var bufs = [
                    toString([0x00, 0x00, 0x00, 0x2b, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x19, 0x9b, 0x6f, 0x66, 0x66, 0x6f, 0x6f, 0x66, 0x66, 0x6f, 0x6f, 0x66, 0x00, 0x62, 0x61, 0x72, 0x62, 0x61, 0x72, 0x61, 0x00, 0x45, 0x53, 0x4d, 0x45, 0x00, 0x34, 0x00, 0x00, 0x00]),
                    toString([0x00, 0x00, 0x00, 0xa6, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x19, 0xa6, 0xf9, 0x00, 0x05, 0x00, 0x4b, 0x4b, 0x4b, 0x4b, 0x4b, 0x20, 0x4b, 0x4b, 0x4b, 0x4b, 0x00, 0x01, 0x00, 0x33, 0x37, 0x31, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x00, 0x00, 0x00, 0x03, 0x00, 0x30, 0x30, 0x30, 0x30, 0x30, 0x37, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x52, 0x00, 0x01, 0x00, 0x00, 0x00, 0x54, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x53, 0x15, 0x05, 0x00, 0x02, 0x54, 0x53, 0x15, 0x03, 0x00, 0x02, 0x00, 0xab])
                   ];

        var buf, pdu, params, pdu2, k;
        for (buf in bufs) {
            octets = bufs[buf];
            Assert.doesNotThrow(function(){
                pdu = PDUFactory.fromBuffer(Buffer(octets, 'binary'));
            });

            params = pdu.mandatory;
            for (k in pdu.optional) {
                params[k] = pdu.optional[k];
            }

            Assert.doesNotThrow(function(){
                pdu2 = PDUFactory.fromStruct(pdu.header.command_id, pdu.header.command_status, pdu.header.sequence_number, params);
                Assert.ok(pdu2.buffer.toString() === pdu.buffer.toString());
                Assert.eql(pdu2.buffer.mandatory, pdu.buffer.mandatory);
                Assert.eql(pdu2.buffer.optional, pdu.buffer.optional);
            });

        }
        // console.log(msg.split('').reduce(function(a, b){ return (a.length == 1 ? '\\x' + a.charCodeAt(0).toString(16) : a) + '\\x' + b.charCodeAt(0).toString(16);}))


    },

    /**
     * Response from factory.
     */
    'Response: invalid' : function() {
        var pdu = PDUFactory.fromStruct(Constants.commands.enquire_link, Constants.command_statuses.esme_rok, 99, {});
        Assert.throws(function(){
            PDUFactory.response(pdu, 0xffffffff, {});
        }, SMPPError);
    },

    'Response: no body; well formed' : function() {

        var pdu = PDUFactory.fromStruct(Constants.commands.enquire_link, Constants.command_statuses.esme_rok, 99, {});
        var resp = PDUFactory.response(pdu, 0, {});

        Assert.ok(resp.header.command_id === ((pdu.header.command_id | 0x80000000)>>>0), 'command_id should be 0x80000015');
        Assert.ok(resp.header.squence_number === pdu.header.squence_number, 'Sequence_numbers should match.');

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

        var pdu = PDUFactory.fromStruct(Constants.commands.data_sm, Constants.command_statuses.esme_rok, 99, params);
        var pdu2 = PDUFactory.response(pdu, 0, {message_id: 'abc'});
        Assert.ok(pdu2.header.command_id === ((pdu.header.command_id | 0x80000000)>>>0), 'Command id is not *_resp');
        Assert.ok(pdu2.header.squence_number === pdu.header.squence_number, 'Sequence_number for both commands should match');
        Assert.eql(pdu2.mandatory, {message_id: 'abc'});
    },

    'PDUFactory commands shortcuts' : function() {
        var params = {bind_transceiver: {
            system_id: 'ffoofoofo',
            password: 'barbarb',
            system_type: 'ESME',
            interface_version: 0x34,
            addr_ton: 0,
            addr_npi: 0,
            address_range: ''
            }
        };
        params['bind_transmitter'] = params['bind_receiver'] = params['bind_transceiver'];
        var command, pdu, pdu2;
        for (command in params) {
            var pdu = PDUFactory[command](params[command]);
            Assert.eql(params[command], pdu.mandatory, 'Failed test on ' + command);
            var pdu2 = PDUFactory.fromBuffer(pdu.buffer);
            Assert.eql(params[command], pdu.mandatory, 'Failed test on ' + command);
            Assert.eql(pdu.buffer, pdu2.buffer, 'Failed test on ' + command);
        }
    },

    'PDU.is_response' : function() {
        var params = {
            system_id: 'ffoofoofo',
            password: 'barbarb',
            system_type: 'ESME',
            interface_version: 0x34,
            addr_ton: 0,
            addr_npi: 0,
            address_range: ''
            };

        var pdu = PDUFactory.bind_transceiver(params);
        Assert.ok(pdu.is_response() === false);
        pdu.header.command_id = Constants.commands.bind_transceiver_resp;
        Assert.ok(pdu.is_response());
        Assert.ok(pdu.is_response() === true, 'Should be response');
    }

};
