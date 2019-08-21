const through = require('through2');
const crypto = require('crypto');
const Vinyl = require('vinyl');

/**
 * @param {Object|null} options
 * @option {Function} 'calcHash' -- optional
 * @option {Function} 'transformPath' -- optional
 * @returns {*}
 */
module.exports = function (options = {}) {
    let revData;
    return through.obj(function (file, encoding, callback) {
        revData = handleFile(file, options);
        callback(null, file);
    }, function (callback) {
        this.push(createRevFile(revData, options));
        callback(null);
    });
};


// FUNCTIONS:

function handleFile(file, options = {}) {
    let hash;
    if (typeof options.calcHash === 'function') {
        hash = options.calcHash(file);
    } else {
        hash = crypto.createHash('md5').update(file.contents).digest('hex');
        hash = hash.substr(0, 8);
    }
    return {
        file: file,
        hash: hash
    };
}

function createRevFile(revData, options = {}) {
    const path = typeof options.transformPath === 'function'
        ? options.transformPath(revData.file.path)
        : `${revData.file.path}.rev.txt`;
    if (path === revData.file.path) {
        throw new Error(`[gulp-assembly-rev-manifest] The RevFile path must be different from the OrigFile path!`);
    }
    let revFile = {
        path: path,
        contents: Buffer.from(revData.hash)
    };
    ['cwd', 'base'].map((key) => revFile[key] = revData.file[key]);
    return new Vinyl(revFile);
}
