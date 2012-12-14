import os
import re
import binascii
import mimetypes

import html5lib

import serve

def _open(fname):
    try:
        return open(fname)
    except IOError:
        return open(os.path.join(serve.cwd, fname))

def _embed_css(cssfile):
    csspath, fname = os.path.split(cssfile)
    with _open(cssfile) as fp:
        css = fp.read()
        cssparse = re.compile(r'(.*?){(.*?)}', re.S)
        urlparse = re.compile(r'url\((.*?)\)')
        cssout = []
        for selector, content in cssparse.findall(css):
            lines = []
            for line in content.split(';'):
                if len(line.strip()) > 0:
                    attr, val = line.strip().split(':')
                    url = urlparse.search(val)
                    if url is not None:
                        imgfile = os.path.join(csspath, url.group(1))
                        if not os.path.exists(imgfile):
                            imgfile = os.path.join(serve.cwd, csspath, url.group(1))
                        imgdat = "url(%s)"%serve.make_base64(imgfile)
                        val = urlparse.sub(imgdat, val)
                    lines.append("%s:%s"%(attr, val))
            cssout.append("%s {\n%s;\n}"%(selector, ';\n'.join(lines)))
        return '\n'.join(cssout)

def _embed_js(dom, script):
    wparse = re.compile(r"new Worker\(\s*(['\"].*?['\"])\s*\)", re.S)
    aparse = re.compile(r"attr\(\s*['\"]src['\"]\s*,\s*(.*?)\)")
    with _open(script.getAttribute("src")) as jsfile:
        jssrc = jsfile.read()
        for worker in wparse.findall(jssrc):
            wid = os.path.splitext(os.path.split(worker.strip('"\''))[1])[0]
            wtext = _embed_worker(worker.strip('"\''))
            wscript = dom.createElement("script")
            wscript.setAttribute("type", "text/js-worker")
            wscript.setAttribute("id", wid)
            wscript.appendChild(dom.createTextNode(wtext))
            script.parentNode.insertBefore(wscript, script)
            rplc = "window.URL.createObjectURL(new Blob([document.getElementById('%s').textContent]))"%wid
            jssrc = jssrc.replace(worker, rplc)

        for src in aparse.findall(jssrc):
            if os.path.exists(src.strip('\'"')):
                imgpath = src.strip('\'"')
            else:
                imgpath = os.path.join(serve.cwd, src.strip('\'"'))

            jssrc = jssrc.replace(src, "'%s'"%serve.make_base64(imgpath))

        script.removeAttribute("src")
        script.appendChild(dom.createTextNode(jssrc.decode('utf-8')))

def _embed_worker(worker):
    wparse = re.compile(r"importScripts\((.*)\)")
    wpath = os.path.split(worker)[0]
    with _open(worker) as wfile:
        wdata = wfile.read()
        for simport in wparse.findall(wdata):
            imports = []
            for fname in simport.split(','):
                iname = os.path.join(wpath, fname.strip('\'" '))
                with _open(iname) as fp:
                    imports.append(fp.read())
            wdata = wdata.replace("importScripts(%s)"%simport, '\n'.join(imports))
        return wdata

def embed(rawhtml, outfile):
    parser = html5lib.HTMLParser(tree=html5lib.treebuilders.getTreeBuilder("dom"))
    dom = parser.parse(rawhtml)
    head = dom.getElementsByTagName("head")[0]
    wurl = dom.createElement("script")
    wurl.setAttribute("type", "text/javascript")
    wurl.appendChild(dom.createTextNode('''
if (window.webkitURL)
    window.URL = window.webkitURL;
'''))
    head.insertBefore(wurl, head.childNodes[0])

    for script in dom.getElementsByTagName("script"):
        src = script.getAttribute("src")
        if len(src) > 0:
            try:
                _embed_js(dom, script)
            except:
                print "Unable to embed script %s" %src
    
    for css in dom.getElementsByTagName("link"):
        if (css.getAttribute("type") == "text/css"):
            csstext = _embed_css(css.getAttribute("href"))
            ncss = dom.createElement("style")
            ncss.setAttribute("type", "text/css")
            ncss.appendChild(dom.createTextNode(csstext))
            css.parentNode.insertBefore(ncss, css)
            css.parentNode.removeChild(css)

    for img in dom.getElementsByTagName("img"):
        if os.path.exists(img.getAttribute("src")):
            imgfile = img.getAttribute("src")
        else:
            imgfile = os.path.join(serve.cwd, img.getAttribute("src"))

        img.setAttribute("src", serve.make_base64(imgfile))

    #Save out the new html file
    with open(outfile, "w") as htmlfile:
        serializer = html5lib.serializer.htmlserializer.HTMLSerializer()
        walker = html5lib.treewalkers.getTreeWalker("dom")

        for line in serializer.serialize(walker(dom)):
            htmlfile.write(line.encode("utf-8"))