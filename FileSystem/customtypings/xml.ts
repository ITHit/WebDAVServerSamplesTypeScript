export function xmlToJson(xml: any): any {
    // Create the return object
    let obj = {};
    if (xml.nodeType == 1) { // element
        // do attributes
        /*if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }*/
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;

            if (typeof (obj[nodeName]) == "undefined") {
                if (nodeName === '#text') {
                    obj = xmlToJson(item);
                } else {
                    obj[nodeName] = xmlToJson(item);
                }
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    const old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }

                obj[nodeName].push(xmlToJson(item));
            }
        }
    }

    return obj;
};

export function objectToXml(obj: any): any {
    var xml = '';

    for (var prop in obj) {
        if (!obj.hasOwnProperty(prop)) {
            continue;
        }

        if (obj[prop] == undefined)
            continue;

        xml += "<" + prop + ">";
        if (typeof obj[prop] == "object")
            xml += objectToXml(new Object(obj[prop]));
        else
            xml += obj[prop];

        xml += "</" + prop + ">";
    }

    return xml;
};
