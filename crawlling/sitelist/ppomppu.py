import requests
from bs4 import BeautifulSoup as bs
from mysqlclass import mySQL


async def ppomppu() -> list:

    sitename = "ppomppu"

    mysql = mySQL()
    sitename, sitedomain, siteboardpath = mysql.siteinfo(
        sitename=sitename.upper())[0]

    req = requests.get(sitedomain+siteboardpath)
    html = req.text
    soup = bs(html, 'html.parser')
    list1 = soup.select('td.list_vspace')
    result = []
    for i in list1:
        itemlist = {}
        for j in i.select("td"):
            for k in j.select("div > a > font"):
                itemlist['sitename'] = sitename
                itemlist['sitedomain'] = sitedomain
                itemlist['siteboardpath'] = siteboardpath
                itemlist['boardtitle'] = k.text
            for k in j.select("div > a"):
                itemlist['boarddetailpath'] = "/zboard/"+k['href']

            for k in j.select("td > a > img"):
                if k:
                    itemlist['boardthumnail'] = k['src'].replace(
                        "//static.ppomppu.co.kr/www/img/noimage/noimage_60x50.jpg", "").replace("//cdn", "https://cdn")
                else:
                    itemlist['boardthumnail'] = ''

        if itemlist:
            result.append(itemlist)
        else:
            pass
    
    return result[0:len(result)-7]
