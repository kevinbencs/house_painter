// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { chooseTypeOfTextItem } from '@/lib/checkTextBSP'

// chooseTypeOfTextItem returns 'ok' for a valid line, or a message that
// starts with 'Error' (the actions test for `indexOf('Error') > -1`).
const OK = 'ok'

describe('plain text', () => {
    it.each([
        ['simple text', 'Hello world'],
        ['an empty line', ''],
        ['text with punctuation and accents', 'Árvíztűrő tükörfúrógép, 100% jó!'],
    ])('accepts %s', (_label, line) => {
        expect(chooseTypeOfTextItem(line)).toBe(OK)
    })

    it.each([
        ['an unknown tag', 'Some <span>text</span>'],
        ['a stray "<"', 'a < b'],
        ['an unknown tag at the start', '<div>text</div>'],
    ])('rejects %s', (_label, line) => {
        expect(chooseTypeOfTextItem(line)).toBe('Error in simple text')
    })
})

describe('<bold>', () => {
    it('accepts bold text inside a line', () => {
        expect(chooseTypeOfTextItem('some <bold>strong</bold> text')).toBe(OK)
    })

    it('accepts several bold parts in a line', () => {
        expect(chooseTypeOfTextItem('<bold>one</bold> and <bold>two</bold>')).toBe(OK)
    })

    it('accepts italic nested in bold', () => {
        expect(chooseTypeOfTextItem('<bold><italic>both</italic></bold>')).toBe(OK)
    })

    it('rejects a bold tag that is not closed', () => {
        expect(chooseTypeOfTextItem('<bold>strong')).toBe('Error in bold')
    })

    it('rejects an unknown tag nested in bold', () => {
        expect(chooseTypeOfTextItem('<bold><span>x</span></bold>')).toBe('Error in bold')
    })

    it('rejects a bold tag with attributes', () => {
        expect(chooseTypeOfTextItem('<bold x>strong</bold>')).toBe('Error in bold')
    })
})

describe('<italic>', () => {
    it('accepts italic text inside a line', () => {
        expect(chooseTypeOfTextItem('some <italic>slanted</italic> text')).toBe(OK)
    })

    it('accepts bold nested in italic', () => {
        expect(chooseTypeOfTextItem('<italic><bold>both</bold></italic>')).toBe(OK)
    })

    it('rejects an italic tag that is not closed', () => {
        expect(chooseTypeOfTextItem('<italic>slanted')).toBe('Error in italic')
    })

    it('rejects an unknown tag nested in italic', () => {
        expect(chooseTypeOfTextItem('<italic><span>x</span></italic>')).toBe('Error in italic')
    })
})

describe('<Link href(...)>', () => {
    it('accepts a relative link', () => {
        expect(chooseTypeOfTextItem('see <Link href(/blog)>the blog</Link> now')).toBe(OK)
    })

    it('accepts an absolute link', () => {
        expect(chooseTypeOfTextItem('<Link href(https://example.com/x)>site</Link>')).toBe(OK)
    })

    it('accepts bold and italic inside the link text', () => {
        expect(chooseTypeOfTextItem('<Link href(/blog)><bold>strong</bold> and <italic>slanted</italic></Link>')).toBe(OK)
    })

    it('rejects a link without a closing tag', () => {
        expect(chooseTypeOfTextItem('<Link href(/blog)>the blog')).toMatch(/^Error/)
    })

    it('rejects a link without a closing bracket in the url', () => {
        expect(chooseTypeOfTextItem('<Link href(/blog>the blog</Link>')).toBe('Error in link')
    })

    it('rejects a link written without "href"', () => {
        expect(chooseTypeOfTextItem('<Link (/blog)>the blog</Link>')).toBe('Error in link')
    })

    it('rejects an unknown tag inside the link text', () => {
        expect(chooseTypeOfTextItem('<Link href(/blog)><span>x</span></Link>')).toBe('Error in link')
    })

    it('rejects an invalid url', () => {
        expect(chooseTypeOfTextItem('<Link href(http://)>x</Link>')).toBe('Error in link')
    })
})

describe('<anchor_link href(...)>', () => {
    it('accepts an absolute url with a dotted host', () => {
        expect(chooseTypeOfTextItem('<anchor_link href(https://example.com)>site</anchor_link>')).toBe(OK)
    })

    it('accepts a www host', () => {
        expect(chooseTypeOfTextItem('<anchor_link href(https://www.example.com)>site</anchor_link>')).toBe(OK)
    })

    it('accepts bold and italic inside the anchor text', () => {
        expect(chooseTypeOfTextItem('<anchor_link href(https://example.com)><bold>strong</bold></anchor_link>')).toBe(OK)
    })

    it('rejects a relative url (an anchor needs an absolute one)', () => {
        expect(chooseTypeOfTextItem('<anchor_link href(/blog)>x</anchor_link>')).toBe('Error in anchor_link')
    })

    it('rejects a host without a dot', () => {
        expect(chooseTypeOfTextItem('<anchor_link href(http://localhost)>x</anchor_link>')).toBe('Error in anchor_link')
    })


    it('rejects a "www.com" host', () => {
        expect(chooseTypeOfTextItem('<anchor_link href(http://www.com)>x</anchor_link>')).toBe('Error in anchor_link')
    })

    it('rejects an unknown tag inside the anchor text', () => {
        expect(chooseTypeOfTextItem('<anchor_link href(https://example.com)><span>x</span></anchor_link>')).toBe('Error in anchor_link')
    })

    it('rejects a malformed opening tag', () => {
        expect(chooseTypeOfTextItem('<anchor_link(https://example.com)>x</anchor_link>')).toBe('Error in anchor_link')
    })
})

describe('<Image src(...)/>', () => {
    it('accepts an image', () => {
        expect(chooseTypeOfTextItem('<Image src(pic-1)/>')).toBe(OK)
    })

    it('rejects an image without the self-closing "/>"', () => {
        expect(chooseTypeOfTextItem('<Image src(pic-1)>')).toBe('Error in image')
    })

    it('rejects an image without "src"', () => {
        expect(chooseTypeOfTextItem('<Image (pic-1)/>')).toBe('Error in image')
    })

    it('rejects text after the image', () => {
        expect(chooseTypeOfTextItem('<Image src(pic-1)/> text')).toBe('Error in image')
    })
})

describe('<ul>', () => {
    it('accepts a list of plain items', () => {
        expect(chooseTypeOfTextItem('<ul><list>one<list>two<list>three</ul>')).toBe(OK)
    })

    it('accepts formatted items', () => {
        expect(chooseTypeOfTextItem('<ul><list><bold>one</bold><list>two <italic>x</italic></ul>')).toBe(OK)
    })

    it('rejects a list that is not closed', () => {
        expect(chooseTypeOfTextItem('<ul><list>one<list>two')).toBe('Error in list')
    })

    it('rejects text after the closing tag', () => {
        expect(chooseTypeOfTextItem('<ul><list>one</ul> extra')).toBe('Error in list')
    })

    it('rejects an invalid item and reports its error', () => {
        expect(chooseTypeOfTextItem('<ul><list>one<list><span>x</span></ul>')).toBe('Error in simple text')
    })
})

describe('<title>', () => {
    it('accepts a title', () => {
        expect(chooseTypeOfTextItem('<title>My title</title>')).toBe(OK)
    })

    it('rejects a title that is not closed', () => {
        expect(chooseTypeOfTextItem('<title>My title')).toBe('Error in title')
    })

    it('rejects text after the closing tag', () => {
        expect(chooseTypeOfTextItem('<title>My title</title> more')).toBe('Error in title')
    })
})

describe('<highlight>', () => {
    it('accepts a highlight', () => {
        expect(chooseTypeOfTextItem('<highlight>Important</highlight>')).toBe(OK)
    })

    it('rejects a highlight that is not closed', () => {
        expect(chooseTypeOfTextItem('<highlight>Important')).toBe('Error in highlight')
    })

    it('rejects text after the closing tag', () => {
        expect(chooseTypeOfTextItem('<highlight>Important</highlight> more')).toBe('Error in highlight')
    })
})

describe('mixed lines', () => {
    it('accepts links, bold and italic in one line', () => {
        const line = 'A <bold>b</bold>, <italic>i</italic> and <Link href(/x)>l</Link> and <anchor_link href(https://example.com)>a</anchor_link>.'
        expect(chooseTypeOfTextItem(line)).toBe(OK)
    })

    it('reports the first invalid part of a mixed line', () => {
        expect(chooseTypeOfTextItem('ok <bold>b</bold> then <span>x</span>')).toBe('Error in simple text')
    })

    it('returns messages that the actions can detect with indexOf("Error")', () => {
        for (const line of ['<bold>x', '<title>x', '<ul>x', '<Image src(x)>', 'a < b']) {
            expect(chooseTypeOfTextItem(line).indexOf('Error')).toBeGreaterThan(-1)
        }
    })
})
