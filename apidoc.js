'use strict'
const aglio = require('aglio');
const co = require('co');
const fs = require('fs');
const http = require('http');
const https = require('https');
const rootPath = `${__dirname}`;

let models = {};

class MdFile{

    constructor(){
        this._content = [];
    }

    push(data) {
        this._content.push(new Buffer(data));
        return this;
    }

    content() {
        return Buffer.concat(this._content);
    }

    saveTofile(fname) {
      return new Promise((resolve, reject) => {
        if (this._content.length > 1) {
            fs.writeFile(fname, this.content(), (err) => {
              if (err) {
                  console.log(err.stack);
                  reject(err);
              }
              resolve(true);
            });
        }
      });
    }

};

function* entries(obj) {
    if (!obj){
        return [];
    }

    for (let key of Object.keys(obj)) {
        yield[key, obj[key]];
    }
}

function className(name) {
    return name;
    return name.split('::').pop();
}

function primitive(name) {

    let type = {
        integer: 'number',
        float: 'number',
        bigdecimal: 'number',
        boolean: 'boolean',
        datetime: 'string',
        time: 'string',
        date: 'string',
        hash: 'object',
        'virtus::attribute::boolean': 'boolean'
    }[name.toLowerCase()];

    if (type) {
        return type;
    }

    if (!type && name.indexOf('::') < 0) {
        return name.toLowerCase();
    }

    return name;
}

function buildEndpointIndex(apiData) {
    let result = {};
    //console.log(apiData);
    for (let api of apiData.apis) {
        for (let op of api.operations) {
            if (op.via) {
                result[`${op.httpMethod}${op.via}`] = op;
            }
        }
    }
    return result;
}

function collectModels(apiData, accumulator) {
    let entry, claz, def;
    for (entry of entries(apiData.models)) {
        claz = entry[0];
        def = entry[1];

        if (!accumulator[claz]) {
            accumulator[claz] = def;
        }
    }
}



function writeModels(md, apiData) {
    let entry, propEntry, claz, def, field, props;

    md.push('\n\n# Data Structures');
    for (entry of entries(apiData.models)) {
      claz = entry[0];
      def = entry[1];
      if (!models[className(claz)]) {
        models[className(claz)] = 1;
        md.push(`\n\n## ${className(claz)}`);
        for(propEntry of entries(def.properties)) {
            let val = '';
            field = propEntry[0];
            props = propEntry[1];

            if (primitive(props.type) === 'string') {
                val = '... ';
            }
            if (props.values && props.values.join) {
                val = props.values.join('|');
            }
            if (primitive(props.type).length > 0 && primitive(props.type) != 'object' && !props.protected) {
                let required = props.required ? 'required' : 'optional';
                let description = `${props.description}`;
                if (props.values && props.values.join) {
                    description = `${description} - Possible values ${props.values.join()}`;
                }
                description = description.replace('(','&#40;').replace(')','&#41;');
                if(props.collection) {
                    md.push(`\n+ ${field}: ${val}(array[${primitive(props.type)}], ${required}) - ${description}`)
                } else {
                    md.push(`\n+ ${field}: ${val}(${primitive(props.type)}, ${required}) - ${description}`);
                }
            }
        }
      }
    }
}

function isProtectedParam(name, params) {
    for (let param of (params || [])) {
        if (param.name === name) {
            return true;
        }
    }
    return false;
}

function writeEndpoint(md, op, modelsCol) {
    let propEntry, field, props;
    md.push(`\n${op.summary}`);

    if (op.scopes) {
        md.push('\n\n::: note');
        let scopes =  op.scopes.join(', ');
        md.push('\n\nRequired scope(s):').push(` ${scopes}`);
        md.push('\n:::');
    }

    if (op.parameters) {
        md.push('\n\n+ Parameters')
        for (let param of (op.parameters || [])) {
            if (!isProtectedParam(param.name, op.protected_params)) {
                md.push(`\n    + \`${param.name}\`: (${primitive(param.type)}, ${param.required?'required':'optional'}) - ${param.description}`);
            }
        }
        if (op.httpMethod === 'GET' && op.requestEntity) {
            for(propEntry of entries(modelsCol.models[op.requestEntity].properties)) {
                field = propEntry[0];
                props = propEntry[1];

                if (!isProtectedParam(field, op.protected_params)) {
                    md.push(`\n    + \`${field}\`: (${primitive(props.type)}, ${props.required?'required':'optional'}) - ${props.description}`);
                }
            }
        }
    }

    if (op.requestEntity && op.httpMethod !== 'GET') {
        md.push('\n\n+ Request with body (application/json)');
        md.push(`\n\n  + Attributes (${className(op.requestEntity)})`);
        // md.push('\n\n+ Request hide (application/json)');
    }

    if (op.type) {
        let statusCode = op.httpMethod === 'POST' ? 201 : 200;
        md.push(`\n\n+ Response ${statusCode}`);
        md.push(`\n\n  + Attributes (${className(op.type)})`);
    }

    for (let res of (op.responseMessages || [])) {
        md.push(`\n\n+ Response ${res.code || 'na'}`);
        if (typeof res.message === 'string') {
            md.push(`\n\n        ${res.message}`);
        } else {
            md.push(`\n\n        ${JSON.stringify(res.message)}`);
        }
    }

}

function* parseData(host, apiData, groupData, modelsCol) {
    let component = host.split('-')[0];

    let md = new MdFile();
    let apiIndex = buildEndpointIndex(apiData);

    md.push(`\n\n# Group ${groupData.name}`);

    for (let res of groupData.resources) {
        if(!res.actions) {
            md.push(`\n\n## ${res.name} [${res.method} ${res.url}]`);
            writeEndpoint(md, apiIndex[`${res.method}${res.url}`], modelsCol);
        } else if(res.actions){
            md.push(`\n\n## ${res.name} [${res.url}]`);
            for (let action of res.actions) {
              let actionUrl=action.url?` ${action.url}`:'';
              md.push(`\n\n### ${action.name} [${action.method}${actionUrl}]`);
              writeEndpoint(md, apiIndex[`${action.method}${action.url||res.url}`], modelsCol);
            }
        }
    }
    let fname = `${groupData.name.replace(' ', '').toLowerCase()}.md`;
    yield md.saveTofile(fname);
    return fname;
}

const hasExposedEndpoints = (apiData) => {
    for (let api of apiData) {
        for (let op of api.operations) {
            if (op.via) {
                return true;
            }
        }
    }
    return false;
}

function* load(host, port, endpoint) {
    const client = (port === 443) ? https : http;

    return new Promise((resolve, reject) => {
        client.request({
            host: host,
            port: port,
            method: 'GET',
            path: endpoint
        }, (response) => {
            let chunks = [];

            response.on('data', function (chunk) {
                chunks.push(chunk);
                //console.log(chunk.toString());
            });

            response.on('end', function(){
                resolve(JSON.parse(Buffer.concat(chunks)));
            });

            response.on("error", function (e) {
                reject(e);
            });
        })
        .end();
    });
}

const saveApiDoc = function *(content, options, meta) {
    return new Promise((resolve, reject) => {
        aglio.render(content, options, function(err, html, warnings) {
            if (err) {
                console.log(`Error: ${err.message}`);
                return reject(err);
            }
            (new MdFile()).push("---").push(`\nlayout: ${meta.layout}`)
                .push(`\npermalink: ${meta.permalink}`)
                .push(`\ndocpath: ${meta.docpath}`)
                .push("\n---\n\n")
                .push(html)
                .saveTofile(`${rootPath}${meta.destination}`);
            resolve(`${rootPath}${meta.destination}`);
        });
    });
}



const generateApiDoc = function() {
    return function *() {
        const options = {
          themeTemplate: `${rootPath}/default.jade`
        };
        for (let metaFile of ['users', 'transactions', 'checkouts']) {
            models = {};
            let indexMd = new MdFile();
            indexMd.push('FORMAT: 1A\nHOST: https://api.sumup.com');
            const meta = require(`${rootPath}/doc_meta/${metaFile}.json`);
            let modelsCol = {
                models: {}
            };
            for (let group of meta.groups) {
                let endpointData = yield load(meta.host, meta.port || 443, group.doc);
                  collectModels(endpointData, modelsCol.models);
                let fname = yield parseData(meta.host, endpointData, group, modelsCol);
                indexMd.push('\n<p>&nbsp;</p>');
                indexMd.push(`\n<!-- include(${fname}) -->`);
            }

            writeModels(indexMd, modelsCol);
            console.log(yield saveApiDoc(indexMd.content().toString(), options, meta));
        }

    }
}

function parseMdToHtml(file, target) {
    let content = fs.readFileSync(file);
    let options = {
      themeTemplate: 'default.jade',
      name: 'neshto drugo'
    };
    aglio.render(content.toString(), options, function (err, html, warnings) {
        if (err) return console.log(err);
        (new MdFile())
        .push("\n")
        .push(html)
        .saveTofile(target);
        console.log(`saving in ${target}`);
    });
}

function scanFiles(path, match) {
    const targetPath = `${rootPath}/src/_includes`;
    fs.readdir(path, (err, files) => {
        if(err) {
            console.log(err.stack);
            return;
        }
        for (let file of files) {
            fs.stat(`${path}/${file}`, (err, stats) => {
                if(!stats) return;
                if (stats.isDirectory()) {
                    scanFiles(`${path}/${file}`, match);
                }else if(match.test(file)) {
                    console.log(`${path}/${file}`);
                    parseMdToHtml(`${path}/${file}`, `${targetPath}/${file.replace('.md','.html')}`);
                }
            })
        }
    });

}

const restApis = function() {
    co(generateApiDoc()).catch((e)=>{console.log(e.stack)});
}

const docs = function() {
    scanFiles(`${rootPath}/src`,/^(.*)[\.md]{1}$/);
}

module.exports = () => {
    return {
        restApis: restApis,
        docs: docs
    };
}

//NOCACHE=1 aglio -i index.md --theme-template triplex.jade -o output.html
