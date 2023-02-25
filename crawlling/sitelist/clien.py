import requests
from bs4 import BeautifulSoup as bs
from mysqlclass import mySQL


async def clien() -> list:
    sitename = "clien"

    mysql = mySQL()
    sitename, sitedomain, siteboardpath = mysql.siteinfo(
        sitename=sitename.upper())[0]

    req = requests.get(sitedomain+siteboardpath)
    html = req.text
    soup = bs(html, 'html.parser')
    list1 = soup.select('div.list_item.symph_row.jirum')
    result = []
    for i in list1:
        itemlist = {}
        for j in i.select('div.list_title > span'):
            itemlist['sitename'] = sitename
            itemlist['sitedomain'] = sitedomain
            itemlist['siteboardpath'] = siteboardpath
            itemlist['boardtitle'] = j['title']
            itemlist['boarddetailpath'] = j.a['href']

        if i.select("div.list_img > div "):
            for j in i.select("div.list_img > div "):
                itemlist['boardthumnail'] = j.img['src'].replace(
                    "?w=350&h=500", "")
        else:
            itemlist['boardthumnail'] = ""
        result.append(itemlist)

    return result
