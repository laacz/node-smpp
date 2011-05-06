/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var Constants = require('./constants.js');
var PDU = require('./pdu.js');
var Defs = Constants.defs;
var SMPPError = require('./error.js');

exports.fromBuffer = function(buffer, callback) {
    var buf = buffer;
    var pdu;

    if (typeof buffer === 'string') {
        buf = new Buffer(buffer, 'binary');
    }

    pdu = new PDU();
    pdu.decode(buf, callback);
};

exports.fromStruct = function(command_id, command_status, sequence_id, params, callback) {

    var pdu;
    
    pdu = new PDU();
    pdu.encode(command_id, command_status, sequence_id, params, callback);

};
