/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var command_id;
var command_status;
var optional_tag;

/**
 * PDU command IDs (command types)
 */
exports.command_ids = {
    0x80000000: 'generic_nack',
    0x00000001: 'bind_receiver',
    0x80000001: 'bind_receiver_resp',
    0x00000002: 'bind_transmitter',
    0x80000002: 'bind_transmitter_resp',
    0x00000003: 'query_sm',
    0x80000003: 'query_sm_resp',
    0x00000004: 'submit_sm',
    0x80000004: 'submit_sm_resp',
    0x00000005: 'deliver_sm',
    0x80000005: 'deliver_sm_resp',
    0x00000006: 'unbind',
    0x80000006: 'unbind_resp',
    0x00000007: 'replace_sm',
    0x80000007: 'replace_sm_resp',
    0x00000008: 'cancel_sm',
    0x80000008: 'cancel_sm_resp',
    0x00000009: 'bind_transceiver',
    0x80000009: 'bind_transceiver_resp',
    0x0000000B: 'outbind',
    0x00000015: 'enquire_link',
    0x80000015: 'enquire_link_resp',
    0x00000021: 'submit_multi',
    0x80000021: 'submit_multi_resp',
    0x00000102: 'alert_notification',
    0x00000103: 'data_sm',
    0x80000103: 'data_sm_resp',

    0x00010000: 'lmt_report',
    0x80010000: 'lmt_report_resp',
    
    0x00010001: 'lmt_gen_code',
    0x80010001: 'lmt_gen_code_resp',
    0x00010002: 'lmt_verify_code',
    0x80010002: 'lmt_verify_code_resp',
};

exports.commands = {};

for (command_id in exports.command_ids) {
    exports.commands[exports.command_ids[command_id>>>0]] = command_id>>>0;
}

/**
 * Command statuses
 */
exports.command_status_ids = {
    0x00000000: 'esme_rok',
    0x00000001: 'esme_rinvmsglen',
    0x00000002: 'esme_rinvcmdlen',
    0x00000003: 'esme_rinvcmdid',
    0x00000004: 'esme_rinvbndsts',
    0x00000005: 'esme_ralybnd',
    0x00000006: 'esme_rinvprtflg',
    0x00000007: 'esme_rinvregdlvflg',
    0x00000008: 'esme_rsyserr',
    0x0000000a: 'esme_rinvsrcadr',
    0x0000000b: 'esme_rinvdstadr',
    0x0000000c: 'esme_rinvmsgid',
    0x0000000d: 'esme_rbindfail',
    0x0000000e: 'esme_rinvpaswd',
    0x0000000f: 'esme_rinvsysid',
    0x00000011: 'esme_rcancelfail',
    0x00000013: 'esme_rreplacefail',
    0x00000014: 'esme_rmsgqful',
    0x00000015: 'esme_rinvsertyp',
    0x00000033: 'esme_rinvnumdests',
    0x00000034: 'esme_rinvdlname',
    0x00000040: 'esme_rinvdestflag',
    0x00000042: 'esme_rinvsubrep',
    0x00000043: 'esme_rinvesmclass',
    0x00000044: 'esme_rcntsubdl',
    0x00000045: 'esme_rsubmitfail',
    0x00000048: 'esme_rinvsrcton',
    0x00000049: 'esme_rinvsrcnpi',
    0x00000050: 'esme_rinvdstton',
    0x00000051: 'esme_rinvdstnpi',
    0x00000053: 'esme_rinvsystyp',
    0x00000054: 'esme_rinvrepflag',
    0x00000055: 'esme_rinvnummsgs',
    0x00000058: 'esme_rthrottled',
    0x00000061: 'esme_rinvsched',
    0x00000062: 'esme_rinvexpiry',
    0x00000063: 'esme_rinvdftmsgid',
    0x00000064: 'esme_rx_t_appn',
    0x00000065: 'esme_rx_p_appn',
    0x00000066: 'esme_rx_r_appn',
    0x00000067: 'esme_rqueryfail',
    0x000000c0: 'esme_rinvoptparstream',
    0x000000c1: 'esme_roptparnotallwd',
    0x000000c2: 'esme_rinvparlen',
    0x000000c3: 'esme_rmissingoptparam',
    0x000000c4: 'esme_rinvoptparamval',
    0x000000fe: 'esme_rdeliveryfailure',
    0x000000ff: 'esme_runknownerr'
};

exports.command_statuses = {};
for (command_status in exports.command_status_ids) {
    exports.command_statuses[exports.command_status_ids[command_status]] = command_status>>>0;
}

/**
 * Optional field definitions for PDUs
 */
exports.optional_tag_ids = {
// generic tags
    0x0006: 'dest_network_type',
    0x0007: 'dest_bearer_type',
    0x000e: 'source_network_type',
    0x000f: 'source_bearer_type',
    0x0017: 'qos_time_to_live',
    0x0019: 'payload_type',
    0x001d: 'additional_status_info_text',
    0x001e: 'receipted_message_id',
    0x0204: 'user_message_reference',
    0x020a: 'source_port',
    0x020b: 'destination_port',
    0x020c: 'sar_msg_ref_num',
    0x020e: 'sar_total_segments',
    0x020f: 'sar_segment_seqnum',
    0x0210: 'sc_interface_version',
    0x0420: 'dpf_result',
    0x0421: 'set_dpf',
    0x0422: 'ms_availability_status',
    0x0423: 'network_error_code',
    0x0424: 'message_payload',
    0x0425: 'delivery_failure_reason',
    0x0427: 'message_state',

// gsm tags
    0x0005: 'dest_addr_subunit',
    0x0008: 'dest_telematics_id',
    0x000d: 'source_addr_subunit',
    0x0010: 'source_telematics_id',
    0x0030: 'ms_msg_wait_facilities',
    0x0426: 'more_messages_to_send',

// gsm (ussd) tags
    0x0501: 'ussd_service_op',

// cdma tags
    0x0304: 'number_of_messages',
    0x130c: 'alert_on_message_delivery',
    0x1380: 'its_reply_type',
    0x1383: 'its_session_info',

// cdma and tdma tags
    0x0201: 'privacy_indicator',
    0x0202: 'source_subaddress',
    0x0203: 'dest_subaddress',
    0x0205: 'user_response_code',
    0x020d: 'language_indicator',
    0x1201: 'display_time',
    0x1204: 'ms_validity',

// tdma tags
    0x0302: 'callback_num_pres_ind',
    0x0303: 'callback_num_atag',
    0x1203: 'sms_signal',

// cdma, tdma, gsm, and iden tags
    0x0381: 'callback_num',

// latvijas mobilais telefons (LMT) specific tags
    0x1500: 'lmt_created_ts',
    0x1501: 'lmt_subscriber_id',
//    0x1502: 'lmt_response_till',
    0x1503: 'lmt_tariff_class',
    0x1504: 'lmt_more_messages_to_send',
    0x1505: 'lmt_service_desc',
    0x1506: 'lmt_message_id',
    0x1508: 'lmt_report_type',

// latvijas mobilais telefons (LMT) specific tags (as of v4 of their protocol)
    0x1509: 'lmt_transaction_id',
    0x1510: 'lmt_addr',
    0x1511: 'lmt_addr_ton'

};

exports.optional_tags = {};
for (optional_tag in exports.optional_tag_ids) {
    exports.optional_tags[exports.optional_tag_ids[optional_tag]] = optional_tag;
}

/**
 * All definitions go into .defs
 */
exports.defs = {};

/**
 * Definitions for optional tags
 */
exports.defs.optional_tags = {};

// Generic
exports.defs.optional_tags.dest_network_type           = { type: 'int', len: 1 };
exports.defs.optional_tags.dest_bearer_type            = { type: 'int', len: 1 };
exports.defs.optional_tags.source_network_type         = { type: 'int', len: 1 };
exports.defs.optional_tags.source_bearer_type          = { type: 'int', len: 1 };
exports.defs.optional_tags.qos_time_to_live            = { type: 'int', len: 4 };
exports.defs.optional_tags.payload_type                = { type: 'int', len: 1 };
exports.defs.optional_tags.additional_status_info_text = { type: 'cstring', maxlen: 256 };
exports.defs.optional_tags.receipted_message_id        = { type: 'cstring', maxlen: 65 };
exports.defs.optional_tags.user_message_reference      = { type: 'int', len: 2 };
exports.defs.optional_tags.source_port                 = { type: 'int', len: 2 };
exports.defs.optional_tags.destination_port            = { type: 'int', len: 2 };
exports.defs.optional_tags.sar_msg_ref_num             = { type: 'int', len: 2 };
exports.defs.optional_tags.sar_total_segments          = { type: 'int', len: 1 };
exports.defs.optional_tags.sar_segment_seqnum          = { type: 'int', len: 1 };
exports.defs.optional_tags.sc_interface_version        = { type: 'int', len: 1 };
exports.defs.optional_tags.dpf_result                  = { type: 'int', len: 1 };
exports.defs.optional_tags.set_dpf                     = { type: 'int', len: 1 };
exports.defs.optional_tags.ms_availability_status      = { type: 'int', len: 1 };
exports.defs.optional_tags.network_error_code          = { type: 'string', len: 3 };
exports.defs.optional_tags.message_payload             = { type: 'string', len: 0 };
exports.defs.optional_tags.delivery_failure_reason     = { type: 'int', len: 1 };
exports.defs.optional_tags.message_state               = { type: 'int', len: 1 };

// GSM
exports.defs.optional_tags.dest_addr_subunit           = { type: 'int', len: 1 };
exports.defs.optional_tags.dest_telematics_id          = { type: 'int', len: 1 };
exports.defs.optional_tags.source_addr_subunit         = { type: 'int', len: 1 };
exports.defs.optional_tags.source_telematics_id        = { type: 'int', len: 1 };
exports.defs.optional_tags.ms_msg_wait_facilities      = { type: 'int', len: 1 };
exports.defs.optional_tags.more_messages_to_send       = { type: 'int', len: 1 };

// GSM (USSD)
exports.defs.optional_tags.ussd_service_op             = { type: 'string', len: 1 };

// CDMA
exports.defs.optional_tags.number_of_messages          = { type: 'int', len: 1 };
exports.defs.optional_tags.alert_on_message_delivery   = { type: 'int', len: 0 };
exports.defs.optional_tags.its_reply_type              = { type: 'int', len: 1 };
exports.defs.optional_tags.its_session_info            = { type: 'string', len: 2 };

// CDMA, and TDMA
exports.defs.optional_tags.privacy_indicator           = { type: 'int', len: 1 };
exports.defs.optional_tags.source_subaddress           = { type: 'string', len: 23 };
exports.defs.optional_tags.dest_subaddress             = { type: 'string', len: 23 };
exports.defs.optional_tags.user_response_code          = { type: 'int', len: 1 };
exports.defs.optional_tags.language_indicator          = { type: 'int', len: 1 };
exports.defs.optional_tags.display_time                = { type: 'int', len: 1 };
exports.defs.optional_tags.ms_validity                 = { type: 'int', len: 1 };

// TDMA
exports.defs.optional_tags.callback_num_pres_ind       = { type: 'int', len: 1 };
exports.defs.optional_tags.callback_num_atag           = { type: 'string', len: 65 };
exports.defs.optional_tags.sms_signal                  = { type: 'int', len: 2 };

// CDMA, TDMA, GSM, and iDEN
exports.defs.optional_tags.callback_num                = { type: 'string', len: 19 };

// Latvijas Mobilais Telefons (LMT) specific
exports.defs.optional_tags.lmt_created_ts              = { type: 'string', len: 14 };
exports.defs.optional_tags.lmt_subscriber_id           = { type: 'string', len: 20 };
exports.defs.optional_tags.lmt_tariff_class            = { type: 'int', len: 2 };
exports.defs.optional_tags.lmt_more_messages_to_send   = { type: 'int', len: 1 };
exports.defs.optional_tags.lmt_service_desc            = { type: 'string', len: 40 };
exports.defs.optional_tags.lmt_message_id              = { type: 'string', len: 65 };
exports.defs.optional_tags.lmt_report_type             = { type: 'int', len: 1 };
exports.defs.optional_tags.lmt_transaction_id          = { type: 'int', len: 4 };
exports.defs.optional_tags.lmt_addr                    = { type: 'string', len: 20 };
exports.defs.optional_tags.lmt_addr_ton                = { type: 'int', len: 1 };
// Following field is mentioned in spec, but not defined anywhere.
//    exports.defs.optional_tags.lmt_response_till           = { '' };

/**
 * Mandatory field definitions for PDUs
 */
exports.defs.commands = {};


/**
 * This is a generic negative acknowledgement to an SMPP PDU submitted with an invalid
 * message header. 
 */
exports.defs.commands[exports.commands.generic_nack] =
/**
 * This message can be sent by either the ESME or SMSC and is used to provide a confidence-check
 * of the communication path between an ESME and an SMSC. 
 */
exports.defs.commands[exports.commands.enquire_link] =
/**
 * The purpose of the SMPP unbind operation is to deregister an instance of an ESME from the
 * SMSC and inform the SMSC that the ESME no longer wishes to use this network connection
 * for the submission or delivery of messages.
 */
exports.defs.commands[exports.commands.unbind] =
/* Responses with no PDU bodies. */
exports.defs.commands[exports.commands.enquire_link_resp] =
exports.defs.commands[exports.commands.unbind_resp] =
exports.defs.commands[exports.commands.replace_sm_resp] =
exports.defs.commands[exports.commands.cancel_sm_resp] =
{};

/**
 * The purpose of the SMPP bind operation is to register an instance of an ESME with the SMSC
 * system and request an SMPP session over this network connection for the submission or
 * delivery of messages. 
 */
exports.defs.commands[exports.commands.bind_transceiver] =
exports.defs.commands[exports.commands.bind_receiver] =
exports.defs.commands[exports.commands.bind_transmitter] = {
    system_id: { type: 'cstring', maxlen: 16 },
    password: { type: 'cstring', maxlen: 9 },
    system_type: { type: 'cstring', maxlen: 13 },
    interface_version: { type: 'int', len: 1 },
    addr_ton: { type: 'int', len: 1 },
    addr_npi: { type: 'int', len: 1 },
    address_range: { type: 'cstring', maxlen: 41 }
};

/**
 * This operation is used by the SMSC to signal an ESME to originate a bind_receiver request to the SMSC.
 */
exports.defs.commands[exports.commands.outbind] = {
    system_id: { type: 'cstring', maxlen: 16 },
    password: { type: 'cstring', maxlen: 9 }
};

/* Responses to BIND commands. */
exports.defs.commands[exports.commands.bind_transceiver_resp] =
exports.defs.commands[exports.commands.bind_receiver_resp] =
exports.defs.commands[exports.commands.bind_transmitter_resp] = {
    system_id: { type: 'cstring', maxlen: 16 }
};

/**
 * This operation is used by an ESME to submit a short message to the SMSC for onward
 * transmission to a specified short message entity (SME). The submit_sm PDU does not support
 * the transaction message mode.
 */
exports.defs.commands[exports.commands.submit_sm] =
/**
 * The deliver_sm is issued by the SMSC to send a message to an ESME. Using this command,
 * the SMSC may route a short message to the ESME for delivery.
 *
 * In addition the SMSC uses the deliver_sm operation to transfer the following types of short
 * messages to the ESME: SMSC Delivery Receipt, SME Delivery Acknowledgement, SME Manual/User
 * Acknowledgement, and Intermediate Notification.
 */
exports.defs.commands[exports.commands.deliver_sm] = {
    service_type: { type: 'cstring', maxlen: 6},

    source_addr_ton: { type: 'int', len: 1 },
    source_addr_npi: { type: 'int', len: 1 },
    source_addr: { type: 'cstring', maxlen: 21},
    dest_addr_ton: { type: 'int', len: 1 },
    dest_addr_npi: { type: 'int', len: 1 },
    destination_addr: { type: 'cstring', maxlen: 21},

    esm_class: { type: 'int', len: 1 },
    protocol_id: { type: 'int', len: 1 },
    priority_flag: { type: 'int', len: 1 },

    schedule_delivery_time: { type: 'cstring', maxlen: 17 },
    validity_period: { type: 'cstring', maxlen: 17 },

    registered_delivery: { type: 'int', len: 1 },
    replace_if_present: { type: 'int', len: 1 },
    data_coding: { type: 'int', len: 1 },
    sm_default_msg_id: { type: 'int', len: 1 },
    sm_length: { type: 'int', len: 1 },
    short_message: { type: 'string', len: 254 }

};

/**
 * This command is used to transfer data between the SMSC and the ESME. It may be used by
 * both the ESME and SMSC.
 *
 * This command is an alternative to the submit_sm and deliver_sm commands. It is introduced
 * as a new command to be used by interactive applications such as those provided via a WAP
 * framework.
 */
exports.defs.commands[exports.commands.data_sm] = {
    service_type: { type: 'cstring', maxlen: 6},

    source_addr_ton: { type: 'int', len: 1 },
    source_addr_npi: { type: 'int', len: 1 },
    source_addr: { type: 'cstring', maxlen: 21},
    dest_addr_ton: { type: 'int', len: 1 },
    dest_addr_npi: { type: 'int', len: 1 },
    destination_addr: { type: 'cstring', maxlen: 21},

    esm_class: { type: 'int', len: 1 },
    data_coding: { type: 'int', len: 1 }

};

/* Responses to aforementioned SM delivery commands. */
exports.defs.commands[exports.commands.deliver_sm_resp] = 
exports.defs.commands[exports.commands.submit_sm_resp] =
exports.defs.commands[exports.commands.data_sm_resp] = {
    message_id: { type: 'cstring', maxlen: 65 }
};

/**
 * The submit_multi operation may be used to submit an SMPP message for delivery to multiple
 * recipients or to one or more Distribution Lists. The submit_multi PDU does not support the
 * transaction message mode.
 */
exports.defs.commands[exports.commands.submit_multi] = {
    service_type: { type: 'cstring', maxlen: 6},

    source_addr_ton: { type: 'int', len: 1 },
    source_addr_npi: { type: 'int', len: 1 },
    source_addr: { type: 'cstring', maxlen: 21},
    number_of_dests: { type: 'int', len: 1 },
    
    dest_addresses: { type: 'destination_addresses', maxlen: 22}, // TODO: Implement Destination address def and Distribution Lists. See SMPP v3.4 spec, 4.5.1
    
    esm_class: { type: 'int', len: 1 },
    protocol_id: { type: 'int', len: 1 },
    priority_flag: { type: 'int', len: 1 },

    schedule_delivery_time: { type: 'cstring', maxlen: 17 },
    validity_period: { type: 'cstring', maxlen: 17 },

    registered_delivery: { type: 'int', len: 1 },
    replace_if_present: { type: 'int', len: 1 },
    data_coding: { type: 'int', len: 1 },
    sm_default_msg_id: { type: 'int', len: 1 },
    sm_length: { type: 'int', len: 1 },
    short_message: { type: 'string', len: 254 }

};

/* Response to SUBMIT_MULTI. */
exports.defs.commands[exports.commands.submit_multi_resp] = {
    message_id: { type: 'cstring', maxlen: 65 },

    no_unsuccess: { type: 'int', len: 1 },
    unsuccess_smes: { type: 'unsuccessful_deliveries', maxlen: 27 } // TODO: Implement as specified by SMPP v3.4 spec, 4.5.2
};

/**
 * This command is issued by the ESME to query the status of a previously submitted short
 * message.
 */
exports.defs.commands[exports.commands.query_sm] = {
    message_id: { type: 'cstring', maxlen: 65 },
    source_addr_ton: { type: 'int', len: 1 },
    source_addr_npi: { type: 'int', len: 1 },
    source_addr: { type: 'cstring', maxlen: 21 }
};

/* Response to QUERY_SM. */
exports.defs.commands[exports.commands.query_sm_resp] = {
    message_id: { type: 'cstring', maxlen: 65 },
    final_date: { type: 'cstring', maxlen: 17},
    message_state: { type: 'int', len: 1 },
    error_code: { type: 'int', len: 1 }
};

/**
 * This command is issued by the ESME to replace a previously submitted short message that is
 * still pending delivery. The matching mechanism is based on the message_id and source address
 * of the original message.
 */
exports.defs.commands[exports.commands.replace_sm] = {
    message_id: { type: 'cstring', maxlen: 65},

    source_addr_ton: { type: 'int', len: 1 },
    source_addr_npi: { type: 'int', len: 1 },
    source_addr: { type: 'cstring', maxlen: 21},

    schedule_delivery_time: { type: 'cstring', maxlen: 17 },
    validity_period: { type: 'cstring', maxlen: 17 },

    registered_delivery: { type: 'int', len: 1 },
    sm_default_msg_id: { type: 'int', len: 1 },
    sm_length: { type: 'int', len: 1 },
    short_message: { type: 'string', len: 254 }

};

/**
 * This command is issued by the ESME to cancel one or more previously submitted short
 * messages that are still pending delivery. The command may specify a particular message to
 * cancel, or all messages for a particular source, destination and service_type are to be cancelled.
 */
exports.defs.commands[exports.commands.cancel_sm] = {
    service_type: { type: 'cstring', maxlen: 6},

    message_id: { type: 'cstring', maxlen: 65},

    source_addr_ton: { type: 'int', len: 1 },
    source_addr_npi: { type: 'int', len: 1 },
    source_addr: { type: 'cstring', maxlen: 21},
    dest_addr_ton: { type: 'int', len: 1 },
    dest_addr_npi: { type: 'int', len: 1 },
    destination_addr: { type: 'cstring', maxlen: 21}

};

/**
 * This message is sent by the SMSC to the ESME, when the SMSC has detected that a particular
 * mobile subscriber has become available and a delivery pending flag had been set for that
 * subscriber from a previous data_sm operation.
 */
exports.defs.commands[exports.commands.alert_notification] = {
    source_addr_ton: { type: 'int', len: 1 },
    source_addr_npi: { type: 'int', len: 1 },
    source_addr: { type: 'cstring', maxlen: 21},
    esme_addr_ton: { type: 'int', len: 1 },
    esme_addr_npi: { type: 'int', len: 1 },
    esme_addr: { type: 'cstring', maxlen: 21}

};


/**
 * latvijas mobilais telefons specific PDUs (extension of SMPP v3.4). They contain only optional fields.
 */
exports.defs.commands[exports.commands.lmt_report] =
exports.defs.commands[exports.commands.lmt_report_resp] =
exports.defs.commands[exports.commands.lmt_gen_code] =
exports.defs.commands[exports.commands.lmt_gen_code_resp] =
exports.defs.commands[exports.commands.lmt_verify_code] =
exports.defs.commands[exports.commands.lmt_verify_code_resp] = {};
