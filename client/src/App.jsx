import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    itemName: '',
    category: '',
    description: '',
    status: 'Lost',
    reporter: '',
    contact: ''
  })

  const fetchItems = async () => {
    const res = await axios.get('http://localhost:5000/items')
    setItems(res.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('http://localhost:5000/items', { ...form, returned: false })
    setForm({ itemName: '', category: '', description: '', status: 'Lost', reporter: '', contact: '' })
    fetchItems()
  }

  const markReturned = async (id) => {
    const name = prompt("Enter the name the item was returned to/from:")
    if (name) {
      await axios.put(`http://localhost:5000/items/${id}/return`, { returnedTo: name })
      fetchItems()
    }
  }

  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/items/${id}`)
    fetchItems()
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#444' }}>📦 Lost & Found Tracker</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
        <input placeholder="Item Name" value={form.itemName} onChange={e => setForm({ ...form, itemName: e.target.value })} />
        <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>
        <input placeholder="Your Name" value={form.reporter} onChange={e => setForm({ ...form, reporter: e.target.value })} />
        <input placeholder="Contact Info" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
        <button type="submit" style={{ padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>Submit</button>
      </form>

      <h2 style={{ marginBottom: '1rem' }}>📋 Reported Items</h2>
      {items.map(item => (
        <div key={item._id} style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: item.status === 'Found' ? '#e0f7fa' : '#fff3e0',
          color: 'black'
        }}>
          <h3>{item.itemName} <span style={{ fontSize: '0.8rem', color: '#555' }}>({item.status})</span></h3>
          <p><b>Description:</b> {item.description}</p>
          <p><b>Reporter:</b> {item.reporter}</p>
          <p><b>Contact:</b> {item.contact}</p>
          <p>
            <b>Returned:</b>{' '}
            {item.returned
              ? item.status === 'Lost'
                ? `Yes, from ${item.returnedTo}`
                : `Yes, to ${item.returnedTo}`
              : 'No'}
          </p>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            {!item.returned && (
              <button onClick={() => markReturned(item._id)} style={{ padding: '5px', backgroundColor: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}>
                Mark as Returned
              </button>
            )}
            <button onClick={() => deleteItem(item._id)} style={{ padding: '5px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
