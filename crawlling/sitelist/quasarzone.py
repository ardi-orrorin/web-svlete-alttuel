import requests
from bs4 import BeautifulSoup as bs
from mysqlclass import mySQL


async def quasarzone() -> list:
    sitename = "quasarzone"
    mysql = mySQL()
    sitename, sitedomain, siteboardpath = mysql.siteinfo(
        sitename=sitename)[0]

    req = requests.get(sitedomain+siteboardpath)
    html = req.text
    soup = bs(html, 'html.parser')
    list1 = soup.select(
        'div.market-type-list.market-info-type-list.relative > table > tbody > tr> td > div.market-info-list')
    result = []

    for i in list1:
        try:
            itemlist = {}
            itemlist['sitename'] = sitename
            itemlist['sitedomain'] = sitedomain
            itemlist['siteboardpath'] = siteboardpath
            itemlist['boarddetailpath'] = i.div.a.attrs['href']
            itemlist['boardthumnail'] = i.div.a.img.attrs['src']
            itemlist['boardtitle'] = i.select_one(
                'span.ellipsis-with-reply-cnt').text
            result.append(itemlist)
        except AttributeError:
            pass

    return result
