import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import gambar from "../assets/image/background.jpg";
import { MapContainer, Marker, Popup, TileLayer, useMap, useLeaflet, Polyline, Rectangle } from 'react-leaflet'
import { EsriProvider} from 'leaflet-geosearch'
import {Icon} from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"



function SearchMap({ search, persons }) {
  const [pos, setPos] = useState([0, 0])
  const maps = useMap()
  const prov = new EsriProvider()
  useEffect(() => {
    getPos()
  }, [search])
  
  const [personsMarker, setPersonsMarker] = useState([])
  
  useEffect(() => {
    maps.setView(pos)
  }, [pos])
  async function getPos() {
    const res = await prov.search({ query : search+", Makassar" })
    console.log(res)
    setPos([res[0].y, res[0].x])
  }
  return (
    <>
      
    </>)
}

const Home = () => {
  const [keluraan, setKelurahan] = useState([]);
  const [countUser, setCountUser] = useState([]);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("Buakana")
  const waktuRata = 5
  const maps = useMemo(() => {
    console.log(search)
    return `https://maps.google.com/maps?q=${search}&t=&z=13&ie=UTF8&iwloc=&output=embed`
  }, [search])
  const [lura, setLura] = useState([]);
  // console.log(lura.le);
  const [tipe, setTipe] = useState("mustahik")
  const [count, setCount] = useState({
    mustahik: 0,
    penerima: 0,
    amil: 0
  })
  const fetchKelurahan = async () => {
    try {
      const { data: response } = await axios.get(
        "/api/kelurahan"
      );
      console.log(response)
      setKelurahan(response);
      // console.log(response);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {

    fetchKelurahan();

  }, []);

  useEffect(() => {
    axios.get("/api/countall/" + search).then(res => {
      setCount(res.data)
    })
  }, [search])

  useEffect(() => {
    axios.get(`/api/${tipe}/${search}`)
      .then((res) => {
        // console.log(res.data);
        setLura(res.data)
      })
  }, [search, tipe])
  const listUser = async () => {
    setShow(!show);
    // console.log(lura );
  };

  const handleClick = (e, a) => {
    console.log(e);
    setSearch(e)
  }


  return (
    <div>
      <div
        className="header"
        style={{
          display: "flex",
          backgroundImage: `url(${gambar})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <img
          src={"../assets/image/lazismuh.jpg"}
          style={{ width: "100px", marginRight: "20px" }}
        />
        <div>
          <h1 className="title">Pemetaan Amil Zakat Lazismu</h1>
          <p> Jl. Gn. Lompobattang No.201</p>
          <p> Kecamatan Ujung pandang Kota Makassar</p>
          <p> Kode Pos 90141</p>
        </div>
      </div>

      <div className="box">
        <div className="content" style={{ marginRight: "30px" }}>
          <h1 className="title">Maps</h1>
          <div style={{ marginTop: "20px" }}>
            <MapContainer style={{ width: "100%", height: "100vh" }} center={[0, 0]} zoom={16}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <SearchMap search={search} persons={lura} />
            </MapContainer>
          </div>
        </div>
        <div className="content" style={{ width: "30%" }}>
          <h1 className="title">Kelurahan</h1>
          <table style={{ marginTop: "20px" }}>
            {keluraan.map((item, index) => (
              <tr
                style={{ borderTop: "1px solid black", cursor: "pointer" }}
              >
                <td className="tabel-header">{index + 1}</td>
                <td
                  onClick={(e) => handleClick(item.nama_kelurahan, item.nama_kelurahan)}
                  key={item.index + 1} data-value={item.kelurahan}>
                  {item.nama_kelurahan}  ({item.luas_wilayah} km2)
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>

      {/* {show ? <TableSearch /> : null} */}
      {
        lura.length > 0 ? (
          <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', flexDirection: "column" }}>
              <h2>Jumlah</h2>
              <ol>
                <li>Muzakki : {count.muzakki}</li>
                <li>Mustahik : {count.mustahik}</li>
                <li>Amil : {count.amil}</li>
              </ol>
              <br />
              <br />
              <h2>Perbandingan Amil dengan muzakki dan mustahik</h2>
              <ul>
                <li>Perbandingan amil dan muzakki : 1 amil dapat menerima dana dari {Math.floor(count.muzakki / count.amil)} muzakki</li>
                <li>Perbandingan amil dan mustahik : 1 amil dapat memberikan dana untuk {Math.floor(count.mustahik / count.amil)} mustahik</li>
              </ul>
              <br />
              <h2>Waktu yang diperlukan 1 amil untuk melayani mustahik</h2>
              <ul>
                <li>1 amil memerlukan waktu {waktuRata} untuk melayani 1 mustahik</li>
                <li>1 amil memerlukan waktu {waktuRata * Math.floor(count.mustahik / count.amil)} menit atau {Math.round(((waktuRata * Math.floor(count.mustahik / count.amil))/60) * 100)/100} jam  untuk melayani {Math.floor(count.mustahik / count.amil)} mustahik</li>
                <li>{count.amil} amil memerlukan waktu {(waktuRata * Math.floor(count.mustahik / count.amil)) * count.amil} menit atau {Math.round((((waktuRata * Math.floor(count.mustahik / count.amil))* count.amil)/60) * 100)/100} jam atau {Math.round((((waktuRata * Math.floor(count.mustahik / count.amil))* count.amil)/60/24))} hari untuk melayani {count.mustahik} mustahik</li>
              </ul>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>

              <select name="tipe" id="tipe" onChange={(ev) => {
                setTipe(ev.target.value)
              }}>
                <option value="muzakki">Muzakki</option>
                <option value="mustahik">Mustahik</option>
                <option value="amil">Amil</option>
              </select>
            </div>
            <h2 style={{ fontWeight: "bolder", textAlign: "center", fontSize: "x-large" }}>{tipe}</h2>

            <TableSearch tipe={tipe} lura={lura} />
          </>
        ) : (
          <div><h1>ok</h1></div>
        )
      }
    </div>
  );
};

export default Home;

const TableSearch = (lura) => {
  const dataLuru = lura.lura
  return (
    <div style={{ margin: "50px 100px" }}>
      <table>
        <thead
          style={{
            backgroundColor: "#2EB62C",
            color: "white",
          }}
        >
          <tr>
            <th
              style={{
                padding: "10px 0",
                borderRadius: "10px 0 0 0",
              }}
            >
              Nama
            </th>
            <th
              style={{
                padding: "10px 0",
              }}
            >
              Alamat
            </th>
            <th
              style={{
                padding: "10px 0",
              }}
            >
              Kelurahan
            </th>
            <th
              style={{
                padding: "10px 0",
                borderRadius: "0 10px 0 0",
              }}
            >
              Kota
            </th>
          </tr>
        </thead>
        {
          dataLuru.map((item) => (
            <tbody style={{ textAlign: "center" }}>
              <tr>
                <td>{lura.tipe != "mustahik" ? item.Nama : item.nama}</td>
                <td>{lura.tipe != "amil" ? item.alamat : item.Alamat}</td>
                <td>{lura.tipe != "mustahik" ? item.kelurahan_nama : item.kelurahan}</td>
                <td>Makassar</td>
              </tr>
            </tbody>
          ))
        }
      </table>
    </div>
  )
};