import asyncio
from site_list import *
from mysqlclass import mySQL


mysql = mySQL()


async def loop():
    def_list = [clien, ppomppu, quasarzone, ruliweb]

    while True:
        result = []
        done, _ = await asyncio.wait(
            [asyncio.create_task(i()) for i in def_list], return_when=asyncio.ALL_COMPLETED)
        for i in done:
            result += i.result()
        mysql.insert(result)
        await asyncio.sleep(60)


if __name__ == "__main__":
    asyncio.run(loop())
