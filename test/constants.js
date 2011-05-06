/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var PDUFactory = require('pdu-factory');
var Constants = require('constants');
var Defs = Constants.defs;
var Assert = require('assert');

module.exports = {
    'Defs exist': function() {
        var command_id;
        for (command_id in Constants.command_ids) {
            Assert.ok(Defs.commands[command_id] !== undefined);
        }
    }
};
