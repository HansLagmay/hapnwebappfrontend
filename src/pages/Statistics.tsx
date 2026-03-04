export default function Statistics(){
  const data = [
    { item:'mini bites', units:100, sale:10000 },
    { item:'jam cookies', units:50, sale:2500 },
    { item:'mini with dip', units:100, sale:11000 },
    { item:'party box', units:100, sale:50000 },
  ]
  const total = data.reduce((s,d)=> s + d.sale, 0)
  return (
    <div className="container">
      <h2>Statistics</h2>
      <div className="card">
        <table style={{width:'100%'}}>
          <thead><tr><th style={{textAlign:'left'}}>Items</th><th>Total Units Sold</th><th>Sale</th></tr></thead>
          <tbody>
            {data.map(d=> <tr key={d.item}><td>{d.item}</td><td>{d.units}</td><td>₱{d.sale}</td></tr>)}
          </tbody>
          <tfoot><tr><td></td><td></td><td>₱{total}</td></tr></tfoot>
        </table>
      </div>
    </div>
  )
}

