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
 * @param {Buffer|Srting} buffer Contains PDU packet.
 *
 * @return {Object} PDU
 * @throws {smpp-error}
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
 * @param {Long} command_id PDU command to create (see commands in pdu-defs.js)
 * @param {Long} command_status Status of command (see command_statuses in pdu-defs.js)
 * @param {Long} sequence_number Sequence number for command.
 * @param {Object} params Mandatory and optional params as a dictionary..
 *
 * @return {Object} PDU
 * @throws {smpp-exception}
 */
exports.fromStruct = function(command_id, command_status, sequence_number, params) {
    var pdu = new PDU();

    return pdu.encode(command_id, command_status, sequence_number, params === undefined ? {} : params);
};

/**
 * Creates response for given PDU command.
 *
 * @param {PDU} pdu PDU, to which response should be generated.
 * @param {long} command_status Expected command status.
 * @param {object} params Mandatory and optional params. {}, if empty.
 *
 * @returns {object} PDU if no error
 * @throws {smpp-exception}
 */
exports.response = function(pdu, command_status, params) {
    var repdu = new PDU();

    return(repdu.encode(pdu.header.command_id | 0x80000000, command_status, pdu.header.sequence_number, params));

};

/**
 * Shorthand for bind_transceiver command
 *
 * @param {Object} params Optional and mandatory params.
 * @param {Long} sequence_number
 *
 * @returns {object} PDU
 * @throws {smpp-exception}
 */
exports.bind_transceiver = function(params, sequence_number) {
    return exports.fromStruct(Constants.commands.bind_transceiver, 0x00, sequence_number, params);
}

/**
 * Shorthand for bind_transmitter command
 *
 * @param {Object} params Optional and mandatory params.
 * @param {Long} sequence_number
 *
 * @returns {object} PDU
 * @throws {smpp-exception}
 */
exports.bind_transmitter = function(params, sequence_number) {
    return exports.fromStruct(Constants.commands.bind_transmitter, 0x00, sequence_number, params);
}

/**
 * Shorthand for bind_receiver command
 *
 * @param {Object} params Optional and mandatory params.
 * @param {Long} sequence_number
 *
 * @returns {object} PDU
 * @throws {smpp-exception}
 */
exports.bind_receiver = function(params, sequence_number) {
    return exports.fromStruct(Constants.commands.bind_receiver, 0x00, sequence_number, params);
}

/**
 * Shorthand for enquire_link command
 *
 * @param {Long} sequence_number
 *
 * @returns {object} PDU
 * @throws {smpp-exception}
 */
exports.enquire_link = function(sequence_number) {
    return exports.fromStruct(Constants.commands.enquire_link, 0x00, sequence_number, {});
}
