
export function chooseTypeOfTextItem(s: string) {
    let res: string = 'ok';
    if (s.indexOf('<Image') === 0) { res = createImg(s) }
    else if (s.indexOf('<ul>') === 0) { res = createList(s) }
    else if (s.indexOf('<title>') === 0) { res = createTitlte(s) }
    else if (s.indexOf('<highlight>') === 0) { res = createHighlight(s) }
    else { res = jsxInText(s); }

    return res;
}


const jsxInText = (s: string) => {
    let index1: number = 0
    let index2: number = s.indexOf('<')
    let result: string = '';

    while (index2 > -1) {

        if (s.indexOf('<Link', index1) === index2 && index2 > -1) {
            result = createLink(s.slice(index2, s.indexOf('</Link>', index2) + 7));

            if (result.indexOf('Error') > -1) return result
            else {
                index1 = s.indexOf('</Link>', index2) + 7;
                index2 = s.indexOf('<', index1);
            }
        }
        else if (s.indexOf('<anchor', index1) === index2 && index2 > -1) {
            result = createAnchor(s.slice(index2, s.indexOf('</anchor_link>', index2) + 14));
            if (result.indexOf('Error') > -1) return result
            else {
                index1 = s.indexOf('</anchor_link>', index2) + 14;
                index2 = s.indexOf('<', index1);
            }

        }
        else if (s.indexOf('<bold', index1) === index2 && index2 > -1) {
            result = createStrong(s.slice(index2, s.indexOf('</bold>', index2) + 7));
            if (result.indexOf('Error') > -1) return result
            else {
                index1 = s.indexOf('</bold>', index2) + 7;
                index2 = s.indexOf('<', index1);
            }

        }
        else if (s.indexOf('<italic', index1) === index2 && index2 > -1) {
            result = createEm(s.slice(index2, s.indexOf('</italic', index2) + 9));
            if (result.indexOf('Error') > -1) return result
            else {
                index1 = s.indexOf('</italic', index2) + 9;
                index2 = s.indexOf('<', index1);
            }

        }
        else {
            return 'Error in simple text'
        }
    }

    return 'ok'
}


const createLink = (s: string) => {
    const indexHref: number = s.indexOf('(');
    const indexHrefEnd: number = s.indexOf(')');
    const indexTextEnd: number = s.indexOf('</Link', 1);
    const emIndex: number = s.indexOf('<italic');
    const strongIndex: number = s.indexOf('<bold');
    const index: number = s.indexOf('<', 1);
    if (indexHref !== 10 || indexHrefEnd === -1 || indexTextEnd === -1 || (index !== emIndex && index !== strongIndex && index !== indexTextEnd)) {
        return 'Error in link'
    }

    const text = s.slice(indexHrefEnd + 2, indexTextEnd);
    let index1: number = 0
    let index3: number = text.indexOf('<');
    let result: string = '';

    while (index3 > -1) {
        if (text.indexOf('<italic') === index3 && index3 > -1) {
            result = createEm(text.slice(index3, text.indexOf('</italic>', index3) + 9));

            if (result.indexOf('Error') > -1) return result
            else {
                index1 = text.indexOf('</italic>', index3) + 9;
                index3 = text.indexOf('<', index1);
            }
        }
        else if (text.indexOf('<bold') === index3 && index3 > -1) {
            result = createStrong(text.slice(index3, text.indexOf('</bold>', index3) + 7));

            if (result.indexOf('Error') > -1) return result
            else {
                index1 = text.indexOf('</bold>', index3) + 7;
                index3 = text.indexOf('<', index1);
            }
        }
        else {
            return 'Error in link';
        }
    }

    const url = s.slice(indexHref + 1, indexHrefEnd)

    if (!isValidRelativeUrl(url)) { return 'Error in link' }

    return 'ok'

}

const createAnchor = (s: string) => {
    const indexHref: number = s.indexOf('(');
    const indexHrefEnd: number = s.indexOf(')');
    const indexTextEnd: number = s.indexOf('</anchor', 1);
    const emIndex: number = s.indexOf('<italic');
    const strongIndex: number = s.indexOf('<bold');
    const index: number = s.indexOf('<', 1);

    if (indexHref !== 17 || indexHrefEnd === -1 || indexTextEnd === -1 || (index !== emIndex && index !== strongIndex && index !== indexTextEnd)) {
        return 'Error in anchor_link'
    }

    const text = s.slice(indexHrefEnd + 2, indexTextEnd);
    let index1: number = 0
    let index3: number = text.indexOf('<');
    let result: string = '';

    while (index3 > -1) {
        if (text.indexOf('<italic') === index3 && index3 > -1) {

            result = createEm(text.slice(index3, text.indexOf('</italic>', index3) + 9));
            if (result.indexOf('Error') > -1) return result
            else {
                index1 = text.indexOf('</italic', index3) + 9;
                index3 = text.indexOf('<', index1);
            }

        }
        else if (text.indexOf('<bold') === index3 && index3 > -1) {
            result = createStrong(text.slice(index3, text.indexOf('</bold>', index3) + 7));
            if (result.indexOf('Error') > -1) return result
            else {
                index1 = text.indexOf('</bold>', index3) + 7;
                index3 = text.indexOf('<', index1);
            }

        }
        else {
            return 'Error in anchor_link'
        }
    }

    const url = s.slice(indexHref + 1, indexHrefEnd)

    if (!isValidUrl(url)) return 'Error in anchor_link'

    return 'ok'
}


const createStrong = (s: string) => {
    const indexHrefEnd = s.indexOf('>');
    const indexTextEnd = s.indexOf('</bold', 1);
    const index = s.indexOf('<', 1);
    const emIndex = s.indexOf('<italic');

    if (indexHrefEnd !== 5 || indexTextEnd === -1 || (index !== indexTextEnd && index !== emIndex)) {
        return 'Error in bold'
    }

    const text = s.slice(indexHrefEnd + 1, indexTextEnd);
    let index1: number = 0
    let index3: number = text.indexOf('<');
    let result: string = '';

    while (index3 > -1) {
        if (text.indexOf('<italic') === index3 && index3 > -1) {

            result = createEmText(text.slice(index3, text.indexOf('</italic>', index3) + 9));
            if (result === 'Error in italic') {
                return result
            }
            else {
                index1 = text.indexOf('</italic>', index3) + 9;
                index3 = text.indexOf('<', index1);
            }
        }
        else {
            return 'Error in bold';
        }
    }

    return 'ok'
}

const createStrongText = (s: string) => {
    const indexHrefEnd = s.indexOf('>');
    const indexTextEnd = s.indexOf('</bold', 1);
    const index = s.indexOf('<', 1);
    if (indexHrefEnd !== 5 || indexTextEnd === -1 || index !== indexTextEnd) {
        return 'Error in bold'
    }

    return 'ok'
}



const createEm = (s: string) => {
    const indexHrefEnd = s.indexOf('>');
    const indexTextEnd = s.indexOf('</italic');
    const index = s.indexOf('<', 1);
    const strongIndex = s.indexOf('<bold');

    if (indexHrefEnd !== 7 || indexTextEnd === -1 || (index !== indexTextEnd && index !== strongIndex)) {
        return 'Error in italic'
    }
    const text = s.slice(indexHrefEnd + 1, indexTextEnd);

    let index1: number = 0
    let index3: number = text.indexOf('<');
    let result: string = ''

    while (index3 > -1) {
        if (text.indexOf('<bold') === index3 && index3 > -1) {
            result = createStrongText(text.slice(index3, text.indexOf('</bold>', index3) + 7));

            if (result === 'Error in bold') {
                return result
            }
            else {
                index1 = text.indexOf('</bold>', index3) + 7;
                index3 = text.indexOf('<', index1);
            }
        }
        else {
            return 'Error in italic'
        }
    }
    return 'ok'
}


const createEmText = (s: string) => {
    const indexHrefEnd = s.indexOf('>');
    const indexTextEnd = s.indexOf('</italic');
    const index = s.indexOf('<', 1);

    if (indexHrefEnd !== 7 || indexTextEnd === -1 || index !== indexTextEnd) {
        return 'Error in italic'
    }
    return 'ok'
}



const createImg = (s: string) => {
    const index1: number = s.indexOf('(');
    const index2: number = s.indexOf(')');
    const BeginOfText = s.slice(0, index1 + 1);
    const EndOfText = s.slice(index2, s.length);

    if (BeginOfText.length !== 11 || EndOfText.length !== 3) {
        return 'Error in image'
    }

    return 'ok'
}



const createList = (s: string) => {
    const index1 = s.indexOf('<ul>');
    const index2 = s.indexOf('</ul>');
    if (index1 !== 0 || index2 === -1 || s.length !== index2 + 5) {
        return 'Error in list'
    }

    const List = s.slice(index1 + 4, index2);

    const arr = List.split('<list>');

    for (let i = 0; i < arr.length; i++) {
        const res = jsxInText(arr[i]);

        if (res.indexOf('Error') > -1) return res
    }

    return 'ok'
}

const createTitlte = (s: string) => {
    const index1 = s.indexOf('<title>');
    const index2 = s.indexOf('</title>');

    if (index1 !== 0 || index2 === -1 || s.length !== index2 + 8) {
        return 'Error in title'
    }

    return 'ok'
}

const createHighlight = (s: string) => {
    const index1 = s.indexOf('<highlight>');
    const index2 = s.indexOf('</highlight>');

    if (index1 !== 0 || index2 === -1 || s.length !== index2 + 12) {
        return 'Error in highlight'
    }

    return 'ok'
}


const isValidUrl = (urlString: string) => {
    try {
        const url = new URL(urlString);
        if (url.hostname.includes('www.')) {
            return url.hostname.includes('.', 3)
        }
        return url.hostname.includes('.');
    }
    catch (e) {
        return false;
    }
}

const isValidRelativeUrl = (urlString: string) => {
    try {
        return Boolean(new URL(urlString, 'http://localhost:3000'));
    }
    catch (e) {
        return false;
    }
}

