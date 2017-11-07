ss = [1]
for s in ss:

    with open('mean_300vx_html/index.html','r') as f:
        html = f.read()

    with open('buttons.html','r') as f:
            buttons = f.read()

    with open('find.html','r') as f:
            find = f.read()

    html = html.replace(find,buttons)

    with open('mean_300vx_html/index_buttons.html','w') as out:
        out.write(html)
