/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var Constants = require('./pdu-defs.js');
var PDU = require('./pdu.js');
var Defs = Constants.defs;
var SMPPError = require('./smpp-errors.js');

/**
 * Function creates PDU from binary string of octets.
 *
 * @param {buffer} or {string} buffer Contains PDU packet.
 *
 * @return {object} PDU if no error
 * @return {object} SMPPError if error
 */
exports.fromBuffer = function(buffer) {
    var buf = buffer;

    if (typeof buffer === 'string') {
        buf = new Buffer(buffer, 'binary');
    }

    var pdu = new PDU();

    return pdu.decode(buf);
};

/**
 * Function creates PDU from parameters.
 *
 * @param {long} command_id
 * @param {long} command_status
 * @param {long} sequence_number
 * @param {object} params Mandatory and optional params.
 *
 * @return {object} PDU if no error
 * @return {object} SMPPError if error
 */
exports.fromStruct = function(command_id, command_status, sequence_number, params) {
    var pdu = new PDU();

    return pdu.encode(command_id, command_status, sequence_number, params);
};

/**
 * Creates response PDU to supplied PDU.
 *
 * @param {PDU} pdu PDU, to which response should be generated.
 * @param {long} command_status Expected command status.
 * @param {object} params Mandatory and optional params. {}, if empty.
 *
 * @return {object} PDU if no error
 * @return {object} SMPPError if error
 */
exports.response = function(pdu, command_status, params) {
    var repdu = new PDU();

    return(repdu.encode(pdu.header.command_id | 0x80000000, command_status, pdu.header.sequence_number, params));

};

exports.bind_transceiver = function(params, sequence_number) {
    return exports.fromStruct(Constants.commands.bind_transceiver, 0x00, sequence_number, params);
}

exports.bind_transmitter = function(params, sequence_number) {
    return exports.fromStruct(Constants.commands.bind_transmitter, 0x00, sequence_number, params);
}

exports.bind_receiver = function(params, sequence_number) {
    return exports.fromStruct(Constants.commands.bind_receiver, 0x00, sequence_number, params);
}

exports.enquire_link = function(sequence_number) {
    return exports.fromStruct(Constants.commands.enquire_link, 0x00, sequence_number, {});
}
