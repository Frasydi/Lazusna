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

const listMuzakkiByKecaman = async (kelurahan) => {
    try {
        const result = await prisma.muzakki.findMany({
            where : {
                kelurahan_nama : kelurahan
            }
        })
        return result
    }catch(err) {
        console.log(err)
        throw err.message
    }
}

const listAmilByKecamatan = async (kelurahan) => {
    try {
        const result = await prisma.amil.findMany({where : {
            kelurahan_nama : kelurahan
        }})
        return result
    }catch(err) {
        console.log(err)
        throw err.message
    }
}

const getAllCount = async(kelurahan) => {
    try {
        const result = await prisma.amil.count({where : {kelurahan_nama : kelurahan}})
        const result2 = await prisma.muzakki.count({where : {kelurahan_nama : kelurahan}})
        const result3 = await prisma.penerima.count({where : {kelurahan : kelurahan}})

        return {
            amil : result,
            muzakki : result2,
            mustahik : result3
        }

    }catch(err) {
        console.log(err)
        throw err.message
    }
}

const listPenerimaByKecamatan = async (kelurahan) => {
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

app.get('/api/mustahik/:kelurahan', async (req, res) => {
    const data = await listPenerimaByKecamatan(req.params.kelurahan)
    res.send(data).status(200)
})

app.get('/api/muzakki/:kelurahan', async (req, res) => {
    const data = await listMuzakkiByKecaman(req.params.kelurahan)
    res.send(data).status(200)
})

app.get('/api/amil/:kelurahan', async (req, res) => {
    const data = await listAmilByKecamatan(req.params.kelurahan)
    res.send(data).status(200)
})

app.get("/api/countall/:kelurahan", async(req,res) => {
    const data = await getAllCount(req.params.kelurahan)
    return res.status(200).json(data)
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
