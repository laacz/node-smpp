/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var Assert = require('assert');

// node-smpp
var Constants = require('../lib/pdu-defs.js');
var Defs = Constants.defs;

module.exports = {
    'Defs exist': function() {
        var command_id;
        for (command_id in Constants.command_ids) {
            Assert.ok(Defs.commands[command_id] !== undefined);
        }
    }
};
