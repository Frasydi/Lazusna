const express = require('express');
const app = express();
const port = 8000;
const cors = require("cors")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function getAllKelurahan() {
    try {
        const data = await prisma.luasKelurahan.findMany()
        return data
    }catch(err) {
        console.log(err)
        throw err
    }
    return 
}


const countKecamatan = async () => {
    try {
        const count = await prisma.penerima.groupBy({
            by: ['kelurahan' ,'maps'],
            _count: {
                no: true
            }

        })
        console.log(count , 'ini dia');
        const returnData = count.map((item) => {
             return {
                kelurahan: item.kelurahan,
                count: item._count.no,
                linkMaps : item.maps
            }
        })
        return returnData
    } catch (err) {
        throw err.message
    }
}

const listUsersByKecamatan = async (kelurahan) => {
    try {
        const data = await prisma.penerima.findMany({
            where: {
                kelurahan: kelurahan
            }
        })
        return data
    } catch (err) {
        throw err.message
    }
}
app.use(express.json())
app.use(cors({
    origin : "http://localhost:3000"
}))

app.get('/api/kelurahan', async (req, res) => {
    const data = await getAllKelurahan()
    res.status(200).json(data)
})

app.get('/api/list/:kelurahan', async (req, res) => {
    const data = await listUsersByKecamatan(req.params.kelurahan)
    res.send(data).status(200)
})




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
