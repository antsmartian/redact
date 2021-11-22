const  { Readable } = require('stream')

const EOF = null;
const convertStringToStream = (document) => {
    const stream = new Readable()
    stream.push(document);
    stream.push(EOF);

    return stream;
}

module.exports = { convertStringToStream }
