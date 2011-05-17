/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var sys = require('sys');
var events = require('events');

// node-smpp
var unpack = require('./packunpack.js').unpack;
var PDUFactory = require('./pdu-factory.js');
var Constants = require('./pdu-defs.js');
var SMPPError = require('./smpp-errors.js');
var PDU = require('./pdu.js');


function mergeObjects(a, b) {
    var obj = {};
    var key;
    for (key in a) {
        obj[key] = a[key];
    }
    for (key in b) {
        obj[key] = b[key];
    }
    return obj;
}

/**
 * SMPP Connection class handles all connection related issues. Given socket, it
 * sends data, parses data, receives data, emits events. It also internally
 * handles SMPP protocol stuff, which it can. For example - keepalives
 * (enquire_link and enquire_link_resp), generic_nack's, incoming unbind
 * requests, keeps track of sequence_number, issued commands and their
 * responses (closing connection, if response is not received in time, for
 * example), etc.
 *
 * @param {Net.Socket} socket Open socket, containing connection either to
 * ESME or SMSC.
 * @param {Struct} config Configuration (see below)
 *
 * @throws {Error}
 */
var SMPPConnection = function(socket, config) {

    var self = this;
    var i;

    self.socket = socket;

    self.STATUS_DISCONNECTED = 1;
    self.STATUS_CONNECTED = 2;
    self.STATUS_BOUND = 3;

    self.statuses = {};
    for (i in self) {
        if ((i.substr(0, 7) === 'STATUS_')) {
            self.statuses[self[i]] = i;
        }
    }

    self.sequence_number = 0;
    self.expect = [];
    self.last_pdu = new Date();

    self.status = self.STATUS_DISCONNECTED;

    self.buffer = '';

    /**
     * config.timeout: Timeout in seconds. Gets enforced onto tcp/ip socket. Also, if no response to issued
     *                 command is received within specified time, assume that connection is not stable. If no
     *                 PDU is sent or received within specified seconds, send an enquire_link command, to
     *                 check if connection is still alive.
     */
    self.config = {
        // Socket and PDU response timeout.
        timeout: (config === undefined || config.timeout === undefined) ? 30 : config.timeout
    };

    self.socket.setTimeout(self.config.timeout * 1000);

    /**
     * Sends given pdus.
     *
     * @param {Object|Array} pdu Single pdu to send, or an array of pdus.
     *
     */
    self.send = function(pdu) {
        var pdus = [];
        if (pdu instanceof PDU) {
            pdus.push(pdu);
        } else if (typeof pdu === 'array') {
            pdus = pdu;
        }

        for (pdu in pdus) {
            // If PDU has no sequence_number, generate it and re-encode PDU.
            if (pdu.header.sequence_number === undefined) {
                pdu = pdu.encode(pdu.header.command_id, pdu.header.command_status, self.nextSeq(), mergeObjects(pdu.mandatory, pdu.optional));
            }

            self.socket.write(pdu.buffer, 'binary');
            if ((pdu.header.command_id & 0x80000000>>>0) === 0) {
                self.expect[pdu.header.sequence_number] = {
                    pdu: pdu,
                    sent: new Date()
                };
            }
            self.last_pdu = new Date();
            self.emit('pdu', pdu, -1);
        }
    }

    /**
     * Keepalive - method checks for connection state, times expected pdus, etc.
     */
    self.keepalive = function() {
        var now = new Date();
        var pdu = undefined;
        var i = undefined;

        if (self.status !== self.STATUS_DISCONNECTED) {
            // If there has been no data for "timeout" secs, send an enquire link.
            if (self.status === self.STATUS_BOUND) {
                if ((now - self.last_pdu) > (self.config.timeout * 1000)) {
                    pdu = PDUFactory.enquire_link(self.nextSeq());
                    self.send(pdu);
                }

                // Checking, if all responses to sent pdus are received.
                for (i in self.expect) {
                    pdu = self.expect[i];
                    if ((typeof pdu === 'object') && (typeof pdu.pdu === 'object')) {
                        if ((now - pdu.sent) > (self.config.timeout * 1000)) {
                            self.end();
                            self.error(new SMPPError({message: 'No reply to ' + pdu.pdu.command_name + ' in timely fashion'}));
                        }
                    }
                }

            }
        }

        setTimeout(self.keepalive, 100);
    };
    setTimeout(self.keepalive, 100);

    /**
     * Callback fires, when any data is received via socket. Act on it.
     *
     * @param {Buffer} data
     *
     */
    self.read = function(data){
        var pdu_len;
        var pdu;
        var pdu_data;

        //console.log('got data. bytes: ', self.buffer.length, '>>', data.length);
        //console.log(data);
        if (data instanceof Buffer) {
            self.buffer += data.toString('binary')
        } else {
            self.buffer += data;
        };

        while (self.buffer.length > 15) {
            // OK, it might be valid (fully received PDU)
            pdu_len = unpack('N', self.buffer.substring(0, 4));
            if (pdu_len <= self.buffer.length) {
                //console.log('new pdu of length', pdu_len, 'b');
                pdu_data = self.buffer.substring(0, pdu_len);
                try {
                    pdu = PDUFactory.fromBuffer(pdu_data);
                    //console.log(Date(), '>>', pdu.toString());
                    self.emit('pdu', pdu, +1);
                    self.last_pdu = new Date();

                    // If expecting this pdu, great success.
                    if ((pdu.header.sequence_number in self.expect) && (self.expect[pdu.header.sequence_number] !== undefined)) {
                        delete self.expect[pdu.header.sequence_number];
                    }

                    switch (pdu.header.command_id) {
                        case Constants.commands.bind_transceiver_resp:
                        case Constants.commands.bind_transmitter_resp:
                        case Constants.commands.bind_receiver_resp:
                            // BIND_RESP - are we bound?
                            if (pdu.header.command_status === Constants.command_statuses.esme_rok) {
                                self.setStatus(self.STATUS_BOUND);
                            } else {
                                console.log('setting conn')
                                self.setStatus(self.STATUS_CONNECTED);
                            }
                            break;
                        case Constants.commands.enquire_link:
                            // Other end is enquiring about our status.
                            self.send(PDUFactory.response(pdu, 0));
                            break;
                    }

                } catch (e) {
                    console.log('Could not unpack pdu:', e.message);
                    // TODO: send generic_nack, close connection
                }

                self.buffer = self.buffer.substring(pdu_len);
                //console.log('processed data. bytes: ', self.buffer.length);
            } else {
                //console.log('no pdu yet');
                break;
            }
        }

    };
    self.socket.on('data', self.read);

    /**
     * Fires, when socket connection has been established.
     */
    self.connect = function() {
        self.setStatus(self.STATUS_CONNECTED);
        self.emit('connect');
    }
    self.socket.on('connect', self.connect);


    /**
     * Gets called, when connection has to be finished. Tries to do it gracefully (tries to unbind,
     * waits for resp, etc).
     */
    self.end = function() {
        // Should reset expect buffer, since connection is closing.
        self.expect = [];

        self.setStatus(self.STATUS_DISCONNECTED);
        self.socket.end();
        self.socket.destroy();

        self.emit('end');
    }

    /**
     * Returns next sequence number, incrementing it by one. Dull.
     *
     * @returns {Long} Generated sequence_number.
     */
    self.nextSeq = function() {
        return (++self.sequence_number)>>>0;
    };

    /**
     * TODO: Implement proper error handling, throwing, and stuff.
     */
    self.socket.on('error', function(err){
        self.error(err);
    });

    self.socket.on('end', function() {
        console.log('socket done (end)');
        self.end();
    })

    self.socket.on('close', function(had_error) {
        console.log('socket done (close)', had_error);
    })

    /**
     * Emits error, if anyone is listening. Tries to handle it, if not.
     */
    self.error = function(err) {
        if (self.listeners('error').length > 0) {
            self.emit('error', err);
        } else {
            console.log('error, name', err.name, ', message', err.message, ', err', err);
            switch (self.status) {
                case self.STATUS_CONNECTED:
                    console.log('stuff happened while being connected');
                    break;
            }
            self.end();
        }
    };

    /**
     * Sets status for SMPP connection
     */
    self.setStatus = function(new_status) {
        self.emit('status', self.status, new_status);
        //console.log('Status charnge:', self.statuses[self.status], '>>', self.statuses[new_status]);
        self.status = new_status;
    };

};

sys.inherits(SMPPConnection, events.EventEmitter);
module.exports = SMPPConnection;
