import './App.css'
import {Game} from './Game'
import logo from '../public/logo.png'
import {useState, useEffect, useRef} from 'react'
import { QRCodeCanvas } from 'qrcode.react'

import { db } from './firebase'
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'

export default function App() {
  const [games, setGames] = useState([]);
  useEffect(() => {
    fetch('scratch-games.json')
      .then(response => response.json())
      .then(data => setGames(data))
  }, []);

  // Unity games from Firestore
  const [ugames, setUGames] = useState([]);
  useEffect(() => {
    const col = collection(db, 'unity-games')
    const unsub = onSnapshot(col, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      // ensure stable ordering (createdAt may be undefined for old docs)
      docs.sort((a,b) => {
        const ta = a.createdAt ? a.createdAt.toMillis?.() ?? 0 : 0
        const tb = b.createdAt ? b.createdAt.toMillis?.() ?? 0 : 0
        return ta - tb
      })
      setUGames(docs)
    }, (err) => console.error('firestore onSnapshot error', err))
    return () => unsub()
  }, [])

  // UI state
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  
  // form state
  const [mode, setMode] = useState('add') // 'add', 'edit', 'delete'
  const [selectedGameId, setSelectedGameId] = useState('')
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [winCondition, setWinCondition] = useState('')
  const [file, setFile] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const fileInputRef = useRef(null)

  // When a game is selected for edit, populate the form
  useEffect(() => {
    if (mode === 'edit' && selectedGameId) {
      const game = ugames.find(g => g.id === selectedGameId)
      if (game) {
        setName(game.name)
        setLink(game.link)
        setWinCondition(game.winCondition || '')
        setFile(null) // reset file input
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
  }, [mode, selectedGameId, ugames])

  // Reset form when switching modes
  useEffect(() => {
    setSelectedGameId('')
    setName('')
    setLink('')
    setWinCondition('')
    setFile(null)
    setMessage(null)
    setShowDeleteConfirm(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [mode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    // simple credential check against Vite env vars
    const ADMIN = import.meta.env.VITE_ADMIN_USER
    const PASS = import.meta.env.VITE_ADMIN_PASS
    if (!ADMIN || !PASS) {
      setMessage('Server not configured: missing admin credentials (VITE_ADMIN_USER/VITE_ADMIN_PASS)')
      return
    }
    if (username !== ADMIN || password !== PASS) {
      setMessage('Invalid username or password')
      return
    }
    if (!name || !link || !file) {
      setMessage('Please provide name, link and thumbnail image')
      return
    }
    try {
      setLoading(true)
      // upload thumbnail to imgbb (base64) - requires VITE_IMGBB_API_KEY
      const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY
      if (!IMGBB_KEY) {
        setMessage('Server not configured: missing VITE_IMGBB_API_KEY')
        setLoading(false)
        return
      }
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
      const dataUrl = await toBase64(file)
      // strip prefix (data:image/...;base64,)
      const base64 = dataUrl.split(',')[1]
      const form = new FormData()
      form.append('image', base64)

      const resp = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: 'POST',
        body: form
      })
      if (!resp.ok) throw new Error('Image upload failed: ' + resp.status)
      const j = await resp.json()
      const url = j?.data?.url || j?.data?.display_url
      if (!url) throw new Error('Invalid upload response')

      // write document to Firestore
      // write/update document based on mode
      if (mode === 'add') {
        await addDoc(collection(db, 'unity-games'), {
          name,
          link,
          image: url,
          winCondition: winCondition || '',
          createdAt: serverTimestamp()
        })
        setMessage('Game added successfully')
      } else if (mode === 'edit' && selectedGameId) {
        const docRef = doc(db, 'unity-games', selectedGameId)
        await updateDoc(docRef, {
          name,
          link,
          ...(url ? { image: url } : {}), // only update image if new one uploaded
          winCondition: winCondition || '',
          updatedAt: serverTimestamp()
        })
        setMessage('Game updated successfully')
      }

      // clear form
      setName('')
      setLink('')
      setWinCondition('')
      setFile(null)
      setSelectedGameId('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      console.error(err)
      setMessage('Operation failed: ' + (err.message || String(err)))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    if (!selectedGameId) {
      setMessage('Please select a game to delete')
      return
    }
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }
    try {
      setLoading(true)
      const ADMIN = import.meta.env.VITE_ADMIN_USER
      const PASS = import.meta.env.VITE_ADMIN_PASS
      if (!ADMIN || !PASS) {
        setMessage('Server not configured: missing admin credentials')
        return
      }
      if (username !== ADMIN || password !== PASS) {
        setMessage('Invalid username or password')
        return
      }
      const docRef = doc(db, 'unity-games', selectedGameId)
      await deleteDoc(docRef)
      setMessage('Game deleted successfully')
      setSelectedGameId('')
      setShowDeleteConfirm(false)
    } catch (err) {
      console.error(err)
      setMessage('Delete failed: ' + (err.message || String(err)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="top">
        <a href='https://www.facebook.com/hcmutGDC'><img src={logo} className="logo"></img></a>
        <button 
          className="qr-toggle"
          onClick={() => setShowQRCode(prev => !prev)}
          title="Show QR Code"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3z"/>
            <path d="M15 15h2v2h-2z"/>
            <path d="M19 15h2v2h-2z"/>
            <path d="M15 19h2v2h-2z"/>
            <path d="M19 19h2v2h-2z"/>
          </svg>
        </button>
      </div>
      
      <div className="game-list">
        {ugames.map((game) => (
          <Game name={game.name} image={game.image} link={game.link} winCondition={game.winCondition} key={game.id} />
        ))}
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="qr-modal" onClick={() => setShowQRCode(false)}>
          <div className="qr-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowQRCode(false)}>×</button>
            <QRCodeCanvas 
              value={window.location.href} 
              size={256}
              level="H"
              includeMargin={true}
            />
            <p>Scan to visit this page</p>
          </div>
        </div>
      )}
      <p className='middle'>Scratch games</p>
      <div className="game-list">
        {games.map((game) => (
          <Game name={game.name} image={game.image} link={game.link} key={game.id} winCondition={game.winCondition} />
        ))}
      </div>

      {/* Admin panel toggle */}
      <div className="admin-toggle">
        <button onClick={() => setShowAdminPanel(prev => !prev)}>
          {showAdminPanel ? 'Hide Admin Panel ↑' : 'Show Admin Panel ↓'}
        </button>
      </div>

      {/* game management form at bottom */}
      {showAdminPanel && (<div className="add-game-form">
        <div className="mode-selector">
          <button 
            className={mode === 'add' ? 'active' : ''} 
            onClick={() => setMode('add')}
          >Add Game</button>
          <button 
            className={mode === 'edit' ? 'active' : ''} 
            onClick={() => setMode('edit')}
          >Edit Game</button>
          <button 
            className={mode === 'delete' ? 'active' : ''} 
            onClick={() => setMode('delete')}
          >Delete Game</button>
        </div>

        {/* Game selector for edit/delete modes */}
        {(mode === 'edit' || mode === 'delete') && (
          <div className="game-selector">
            <select 
              value={selectedGameId} 
              onChange={e => setSelectedGameId(e.target.value)}
            >
              <option value="">Select a game...</option>
              {ugames.map(game => (
                <option key={game.id} value={game.id}>{game.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Main form (hidden in delete mode unless game selected) */}
        {(mode !== 'delete' || (mode === 'delete' && selectedGameId)) && (
          <form onSubmit={mode === 'delete' ? handleDelete : handleSubmit}>
            {mode !== 'delete' && (
              <>
                <div className="row">
                  <label>Game name</label>
                  <input 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    required={mode !== 'delete'} 
                  />
                </div>
                <div className="row">
                  <label>Link (URL)</label>
                  <input 
                    value={link} 
                    onChange={e => setLink(e.target.value)}
                    required={mode !== 'delete'} 
                  />
                </div>
                <div className="row">
                  <label>Win condition (optional)</label>
                  <input 
                    value={winCondition} 
                    onChange={e => setWinCondition(e.target.value)}
                  />
                </div>
                <div className="row">
                  <label>
                    {mode === 'edit' ? 'New thumbnail image (optional)' : 'Thumbnail image'}
                  </label>
                  <input 
                    ref={fileInputRef} 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setFile(e.target.files?.[0] ?? null)}
                    required={mode === 'add'} 
                  />
                </div>
              </>
            )}

            <div className="auth-row">
              <div>
                <label>Admin username</label>
                <input value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
              <div>
                <label>Admin password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>

            {mode === 'delete' && showDeleteConfirm ? (
              <div className="delete-confirm">
                <p>Are you sure you want to delete "{ugames.find(g => g.id === selectedGameId)?.name}"?</p>
                <div className="buttons">
                  <button type="submit" className="danger" disabled={loading}>
                    {loading ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  <button type="button" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="row">
                <button 
                  type="submit" 
                  disabled={loading || (mode !== 'add' && !selectedGameId)}
                >
                  {loading ? 'Processing...' : mode === 'delete' ? 'Delete Game' : mode === 'edit' ? 'Save Changes' : 'Add Game'}
                </button>
              </div>
            )}
            {message && <p className={`message ${message.includes('failed') ? 'error' : 'success'}`}>{message}</p>}
          </form>
        )}
      </div>)}
    </>
  )
}

