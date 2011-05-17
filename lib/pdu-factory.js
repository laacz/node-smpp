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
};

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
};

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
};

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
};

/**
 * Shorthand for unbind command
 *
 * @param {Long} sequence_number
 *
 * @returns {object} PDU
 * @throws {smpp-exception}
 */
exports.unbind = function(sequence_number) {
    return exports.fromStruct(Constants.commands.unbind, 0x00, sequence_number, {});
};

/**
 * Shorthand for unbind command
 *
 * @param {Object} params Should at least contain: short_message, source_addr, destination_addr.
 * @param {Long} sequence_number
 * @param {Mixed} concatenate If set to anything (but undefined), provides mechanism for message
 *     cocatenation. If message length should be split into multiple submit_sm packets, they
 *     are being generated recursively, and this method returns not single PDU, but an array of
 *     PDUs.
 *
 * @returns {object} PDU
 * @returns {Array} PDU objects, if concatenating.
 * @throws {smpp-exception}
 */
exports.submit_sm = function(params, sequence_number, concatenate) {
    // Default params for submit_sm. If you need to change one, provide it within
    // params argument.

    // Concatenation (return multiple PDUs, if message is being concatenated)
    if (concatenate && (params.short_message.length > 160)) {
        var frame_size = 132; // 137 - 5 [length of udh]
        var frames = Math.ceil(params.short_message.length / frame_size);
        var pdus = [];
        var udh, short_message, i;
        var new_params = params;

        new_params.esm_class = 64;
        new_params.sar_msg_ref_num = Math.floor(Math.random() * 256);
        new_params.sar_total_segments = frames;

        console.log(frame_size, frames);

        for (i = 0; i < frames; i++) {
            udh = "\x00" + // IEI - concatenated short message, 8-bit reference number
                  "\x03" + // IEDL (3 octets)
                  "\x01" + // IED - reference number
                  String.fromCharCode(frames) + // IED - total number of SM's
                  String.fromCharCode(i + 1) // IED - sequence no.
            ;
            short_message = String.fromCharCode(udh.length) +
                            udh +
                            params.short_message.substring(i * frame_size, (i + 1) * frame_size);

            new_params.sar_segment_seqnum = i + 1;
            new_params.short_message = short_message;
            pdus.push(exports.submit_sm(new_params, undefined, false));
        }
        return pdus;

    }

    var defaults = {
        service_type: 0,
        source_addr_ton: 0,
        source_addr_npi: 0,
        dest_addr_ton: 0,
        dest_addr_npi: 0,
        esm_class: 0,
        protocol_id: 0,
        priority_flag: 3,
        schedule_delivery_time: 0,
        validity_period: '000007000000000R',
        registered_delivery: parseInt('000' + '000' + '001', 2),
        replace_if_present: 0,
        data_coding: 0,
        sm_default_msg_id: 0
    };
    var in_params = params;
    for (key in defaults) {
        if (in_params[key] === undefined) {
            in_params[key] = defaults[key];
        }
    }
    //console.log(in_params);
    return exports.fromStruct(Constants.commands.submit_sm, 0x00, sequence_number, params);
};
