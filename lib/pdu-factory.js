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
var SMPPError = require('./error.js');

/**
 * Function creates PDU from binary string of octets.
 *
 * @param {buffer} or {string} buffer Contains PDU packet.
 * @param {function} callback Callback to be called with (err, pdu).
 *        If undefined, PDU (or err on error) will be returned by this
 *        function.
 *
 * @return {object} PDU if no error
 * @return {object} SMPPError if error
 */
exports.fromBuffer = function(buffer, callback) {
    var buf = buffer;

    if (typeof buffer === 'string') {
        buf = new Buffer(buffer, 'binary');
    }

    var pdu = new PDU();

    try {
        return pdu.decode(buf, callback);
    } catch (e) {
        if (callback === undefined) {
            return e;
        } else {
            return callback(e, pdu);
        }
    }
};

/**
 * Function creates PDU from parameters.
 *
 * @param {long} command_id
 * @param {long} command_status
 * @param {long} sequence_number
 * @param {object} params Mandatory and optional params.
 * @param {function} callback Callback to be called with (err, pdu).
 *        If undefined, PDU (or err on error) will be returned by this
 *        function.
 *
 * @return {object} PDU if no error
 * @return {object} SMPPError if error
 */
exports.fromStruct = function(command_id, command_status, sequence_number, params, callback) {
    var pdu = new PDU();

    try {
        return pdu.encode(command_id, command_status, sequence_number, params, callback);
    } catch (e) {
        if (callback === undefined) {
            return e;
        } else {
            return callback(e, pdu);
        }
    }

};

/**
 * Creates response PDU to supplied PDU.
 *
 * @param {PDU} pdu PDU, to which response should be generated.
 * @param {long} command_status Expected command status.
 * @param {object} params Mandatory and optional params. {}, if empty.
 * @param {function} callback Callback to be called with (err, pdu).
 *        If undefined, PDU (or err on error) will be returned by this
 *        function.
 *
 * @return {object} PDU if no error
 * @return {object} SMPPError if error
 */
exports.response = function(pdu, command_status, params, callback) {
    var repdu = new PDU();

    try {
        q = repdu.encode(pdu.header.command_id | 0x80000000, command_status, pdu.header.sequence_number, {}, callback);
        return(q);
    } catch (e) {
        if (callback === undefined) {
            return e;
        } else {
            return callback(e, pdu);
        }
    }

};
