module.exports = {
    DBname: process.env.DBname,
    readPreference: "secondary",
    readConcern: "majority",
    writeConcern: {
        w: "majority",
        j: true
    },
    /** transactionOptions */
    trConf: {
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
        readPreference: 'primary'
    }
};