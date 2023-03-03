import requests
from bs4 import BeautifulSoup as bs
from mysqlclass import mySQL


async def ruliweb() -> list:
    sitename = "ruliweb"
    mysql = mySQL()
    sitename, sitedomain, siteboardpath = mysql.siteinfo(
        sitename=sitename)[0]

    req = requests.get(sitedomain+siteboardpath)
    html = req.text
    soup = bs(html, 'html.parser')
    list1 = soup.select(
        'tbody > tr.table_body.blocktarget')
    result = []

    for i in list1:
        if i.select_one("div.relative > a.deco"):
            itemlist = {}
            itemlist['sitename'] = sitename
            itemlist['sitedomain'] = sitedomain
            itemlist['siteboardpath'] = siteboardpath
            itemlist['boarddetailpath'] = i.select_one(
                "div.relative > a.deco").attrs['href'].replace(sitedomain, '')

            if i.select_one("i.icon-picture"):
                req = requests.get(i.select_one(
                    "div.relative > a.deco").attrs['href'])
                html = req.text
                soup = bs(html, 'html.parser')
                text = soup.select_one('a.img_load > img')
                itemlist['boardthumnail'] = text.attrs['src']
            else:
                itemlist['boardthumnail'] = ""

            itemlist['boardtitle'] = i.select_one("div.relative > a.deco").text
            result.append(itemlist)

    return result
