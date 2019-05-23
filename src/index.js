const through = require('through2');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const _ = require('underscore');

let _manifest = {};

module.exports = function (options) {
    options || (options = {});
    let revInstance = new Rev(options);
    return through.obj(function (file, encoding, callback) {
        callback(null, revInstance.handle(file));
    });
};

function Rev(options) {
    if (!options.dest) {
        options.dest = process.cwd();
    }
    if (!options.filename) {
        options.filename = 'rev-manifest.json';
    }

    let _containerKey = path.join(options.dest, options.filename);
    if (!_.has(_manifest, _containerKey)) {
        createContainer();
    }

    return {
        handle: handle
    };


    // FUNCTIONS:

    function createContainer() {
        _manifest[_containerKey] = {};
        process.on('exit', () => {
            if (!_.isEmpty(_manifest)) {
                let manifestFilePath = path.join(options.dest, options.filename);
                let out;
                try {
                    let jsonStr = fs.readFileSync(manifestFilePath);
                    out = JSON.parse(jsonStr);
                } catch (e) {
                    out = {};
                }
                out = Object.assign(out, _manifest[_containerKey]);
                fs.writeFileSync(manifestFilePath, JSON.stringify(out));
            }
        });
    }

    function handle(file) {
        let hash = crypto.createHash('md5').update(file.contents).digest('hex');
        hash = hash.substr(0, 8);

        let filename = file.path;
        let slashIdx = filename.lastIndexOf('/');
        if (slashIdx > -1) {
            filename = filename.substr(slashIdx + 1);
        }

        merge(filename, hash);

        return file;
    }

    function merge(filename, hash) {
        _manifest[_containerKey][filename] = hash;
    }
}
