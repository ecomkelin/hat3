/** Attribute key Attk */
const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "AttkPd";

const CLdoc = {
    Pd: { type: ObjectId, ref: "Pd", required: true, IS_fixed: true },

    code: {
        type: String,
        required: true,
        // unique: true,
        MIN: 2, MAX: 20, REGEXP: '^[a-zA-Z0-9]*$'
    },
    desc: { type: String },
    img: { type: String, ALLOW_upload: true },


}


const Routes = require("./AttkPd.route");

const CLoptions = {
    indexesObj: { "code": 1 },
    Routes,
}

module.exports = DB(CLname, CLdoc, CLoptions);